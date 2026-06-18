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

  const result = await createTripFromFormData({
    formData,
    getCurrentUser: async () => user,
    repository: createSupabaseTripRepository(rideflowSupabase)
  });

  if (!result.ok) {
    if (result.error === "auth_required") {
      redirect("/sign-in?next=/trips/new" as Route);
    }

    redirect(`/trips/new?error=${result.error}` as Route);
  }

  redirect(`/trips/${result.value.id}` as Route);
}
