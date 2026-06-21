"use server";

import { revalidatePath } from "next/cache";

import { validateMemoryDraft } from "@/src/domain/memories";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseMemoryRepository,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

const TRIP_IMAGE_BUCKET = "rideflow-trip-images";

export async function addMemoryAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const tripId = getStringField(formData, "tripId");
  const title = getStringField(formData, "title");
  const content = getStringField(formData, "content");
  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);
  const draft = validateMemoryDraft({
    title,
    content,
    imageCount: files.length
  });

  if (!tripId || !draft.ok) {
    return;
  }

  const assets = [];
  for (const [index, file] of files.entries()) {
    const imagePath = buildTripImagePath({
      fileName: file.name,
      tripId,
      userId: user.id
    });
    const { error } = await supabase.storage
      .from(TRIP_IMAGE_BUCKET)
      .upload(imagePath, file, {
        contentType: file.type || "image/jpeg",
        upsert: false
      });

    if (error) {
      continue;
    }

    const { data } = supabase.storage.from(TRIP_IMAGE_BUCKET).getPublicUrl(imagePath);
    assets.push({
      altText: draft.value.title,
      imagePath,
      imageUrl: data.publicUrl,
      sortOrder: index
    });
  }

  await createSupabaseMemoryRepository(
    supabase as unknown as RideFlowSupabaseClient
  ).createMemory({
    assets,
    content: draft.value.content,
    createdBy: user.id,
    title: draft.value.title,
    tripId
  });
  revalidatePath(`/trips/${tripId}/memories`);
}

export async function deleteMemoryAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const tripId = getStringField(formData, "tripId");
  const memoryId = getStringField(formData, "memoryId");

  if (!tripId || !memoryId) {
    return;
  }

  await createSupabaseMemoryRepository(
    supabase as unknown as RideFlowSupabaseClient
  ).deleteMemory({ memoryId });
  revalidatePath(`/trips/${tripId}/memories`);
}

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

function buildTripImagePath(input: {
  fileName: string;
  tripId: string;
  userId: string;
}) {
  const extension = input.fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExtension = /^[a-z0-9]+$/.test(extension) ? extension : "jpg";

  return `trips/${input.tripId}/${input.userId}/memory-${crypto.randomUUID()}.${safeExtension}`;
}
