"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { createTripFromFormData } from "@/src/application/trips/create-trip-action";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseTripRepository,
  ensureSupabaseProfile,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

const TRIP_IMAGE_BUCKET = "rideflow-trip-images";

export async function createTripAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const rideflowSupabase = supabase as unknown as RideFlowSupabaseClient;

  if (!user) {
    redirect("/sign-in?next=/trips/new" as Route);
  }

  await ensureSupabaseProfile(rideflowSupabase, {
    userId: user.id,
    email: user.email ?? "",
    displayName: user.user_metadata?.display_name
  });

  const repository = createSupabaseTripRepository(rideflowSupabase);
  const result = await createTripFromFormData({
    formData,
    getCurrentUser: async () => user,
    repository
  });

  if (!result.ok) {
    if (result.error === "auth_required") {
      redirect("/sign-in?next=/trips/new" as Route);
    }

    redirect(`/trips/new?error=${result.error}` as Route);
  }

  const coverImage = getImageFile(formData, "coverImage");
  if (coverImage) {
    const imagePath = buildTripImagePath({
      fileName: coverImage.name,
      tripId: result.value.id,
      userId: user.id
    });
    const { error: uploadError } = await supabase.storage
      .from(TRIP_IMAGE_BUCKET)
      .upload(imagePath, coverImage, {
        contentType: coverImage.type || "image/jpeg",
        upsert: false
      });

    if (uploadError) {
      redirect(`/trips/${result.value.id}?error=trip_cover_upload_failed` as Route);
    }

    const { data } = supabase.storage
      .from(TRIP_IMAGE_BUCKET)
      .getPublicUrl(imagePath);

    await repository.updateTripCover?.({
      coverImagePath: imagePath,
      coverImageUrl: data.publicUrl,
      tripId: result.value.id
    });
  }

  redirect(`/trips/${result.value.id}` as Route);
}

function getImageFile(formData: FormData, key: string) {
  const value = formData.get(key);

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function buildTripImagePath(input: {
  fileName: string;
  tripId: string;
  userId: string;
}) {
  const extension = input.fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExtension = /^[a-z0-9]+$/.test(extension) ? extension : "jpg";

  return `trips/${input.tripId}/${input.userId}/cover-${crypto.randomUUID()}.${safeExtension}`;
}
