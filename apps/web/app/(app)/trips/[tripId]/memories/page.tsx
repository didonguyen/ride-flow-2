import { notFound } from "next/navigation";

import { MemoriesSurface } from "@/components/trips/memories-surface";
import { TripAppShell } from "@/components/trip/trip-app-shell";
import { TripCoverHeader } from "@/components/trip/trip-cover-header";
import { TripSectionTabs } from "@/components/trip/trip-section-tabs";
import { getPlanningTripById } from "@/src/application/trips/planning-data";
import { mapSupabasePlanningTrip } from "@/src/application/trips/supabase-planning-data";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  getSupabasePlanningTripRows,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

export const dynamic = "force-dynamic";

type MemoriesPageProps = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function TripMemoriesPage({ params }: MemoriesPageProps) {
  const { tripId } = await params;
  const trip = await getTripForSurface(tripId);

  if (!trip) {
    notFound();
  }

  return (
    <TripAppShell activeItem="My Trips">
      <TripCoverHeader
        coverImageUrl={trip.coverImageUrl ?? ""}
        dateRange={trip.dateRange}
        days={`${trip.days.length} Days`}
        destination={trip.destination ?? trip.name}
        transport="Motorcycle"
        tripName={trip.name}
      />
      <TripSectionTabs activeTab="Memories" tripId={trip.id} />
      <MemoriesSurface tripId={trip.id} tripName={trip.name} />
    </TripAppShell>
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
