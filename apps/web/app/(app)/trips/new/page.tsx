import Link from "next/link";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { NewTripForm } from "@/components/trips/new-trip-form";
import { createTripFromFormData } from "@/src/application/trips/create-trip-action";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseTripRepository,
  ensureSupabaseProfile,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

async function createTripAction(formData: FormData) {
  "use server";

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

export default function NewTripPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-2xl">
        <Link
          className="text-sm font-medium text-sky-700 hover:text-sky-800"
          href={"/trips" as Route}
        >
          Back to trips
        </Link>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create a trip
            </h1>
            <p className="text-sm text-slate-600">
              Add the trip basics. Saving now creates the trip in Supabase V2.
            </p>
          </div>

          <div className="mt-6">
            <NewTripForm action={createTripAction} />
          </div>
        </div>
      </section>
    </main>
  );
}
