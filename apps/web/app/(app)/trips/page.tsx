import type { Route } from "next";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { TripAppShell } from "@/components/trip/trip-app-shell";
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
    <TripAppShell activeItem="Dashboard" pageTitle="Dashboard">
      <DashboardShell trips={trips} />
    </TripAppShell>
  );
}
