import { notFound } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { MobileTripHeader } from "@/components/planning/mobile-trip-header";
import { TripSectionTabs } from "@/components/planning/trip-section-tabs";
import { ExpensesSurface } from "@/components/trips/expenses-surface";
import { getPlanningTripById } from "@/src/application/trips/planning-data";
import { mapSupabasePlanningTrip } from "@/src/application/trips/supabase-planning-data";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  getSupabasePlanningTripRows,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

export const dynamic = "force-dynamic";

type ExpensesPageProps = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function TripExpensesPage({ params }: ExpensesPageProps) {
  const { tripId } = await params;
  const trip = await getTripForSurface(tripId);

  if (!trip) {
    notFound();
  }

  return (
    <AppShell activeItem="Dashboard">
      <MobileTripHeader
        dateRange={trip.dateRange}
        name={trip.name}
        tripId={trip.id}
      />
      <div className="-mx-5 -mt-8 bg-white sm:-mx-8 lg:-mx-12 lg:-mt-9">
        <TripSectionTabs activeTab="Expenses" tripId={trip.id} />
        <ExpensesSurface tripId={trip.id} tripName={trip.name} />
      </div>
    </AppShell>
  );
}

async function getTripForSurface(tripId: string) {
  const supabase = await createSupabaseServerClient();
  const rideflowSupabase = supabase as unknown as RideFlowSupabaseClient;

  if (!isUuid(tripId)) {
    const fallback = getPlanningTripById(tripId);
    return fallback ?? null;
  }

  const rows = await getSupabasePlanningTripRows(rideflowSupabase, tripId);
  return rows ? mapSupabasePlanningTrip(rows) : null;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
