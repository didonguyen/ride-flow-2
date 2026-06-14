import type { Route } from "next";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { NewTripCard, TripCard } from "@/components/trips/trip-card";
import { mapSupabaseDashboardTrips } from "@/src/application/trips/supabase-dashboard-data";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  listDashboardTrips,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/trips" as Route);
  }

  const rideflowSupabase = supabase as unknown as RideFlowSupabaseClient;
  const rows = await listDashboardTrips(rideflowSupabase);
  const trips = mapSupabaseDashboardTrips(rows);

  return (
    <AppShell activeItem="Dashboard">
      <section className="mx-auto max-w-[1460px]">
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl">
            Trips Dashboard
          </h1>
          <h2 className="mt-8 text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
            Recent Trips
          </h2>
        </div>

        {trips.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-slate-700">
              No trips yet. Create your first trip to start planning.
            </p>
          </div>
        ) : (
          <div
            className="mt-8 grid gap-8 md:grid-cols-2 2xl:grid-cols-3"
            data-testid="dashboard-trip-grid"
          >
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
          <NewTripCard />
        </div>
      </section>
    </AppShell>
  );
}
