import { notFound } from "next/navigation";
import type { Route } from "next";
import Link from "next/link";

import { StopPlanningWorkspace } from "@/components/planning/stop-planning-workspace";
import { convertLegacyTripToStops } from "@/components/planning/legacy-to-stops-adapter";
import { TripAppShell } from "@/components/trip/trip-app-shell";
import { TripCoverHeader } from "@/components/trip/trip-cover-header";
import { TripSectionTabs } from "@/components/trip/trip-section-tabs";
import { getPlanningTripById } from "@/src/application/trips/planning-data";
import { mapSupabasePlanningTrip } from "@/src/application/trips/supabase-planning-data";
import type { TripRole } from "@/src/domain/permissions";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseMemberRepository,
  getSupabasePlanningTripRows,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

export const dynamic = "force-dynamic";

type TripPlanningV2PageProps = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function TripPlanningV2Page({
  params
}: TripPlanningV2PageProps) {
  const { tripId } = await params;
  const data = await getTripData(tripId);

  if (!data) {
    notFound();
  }

  const stops = convertLegacyTripToStops(data.trip);

  return (
    <TripAppShell
      activeItem="My Trips"
      backHref={"/trips" as Route}
      pageTitle={data.trip.name}
      showSearch
    >
      <TripCoverHeader
        coverImageUrl={data.trip.coverImageUrl ?? ""}
        dateRange={data.trip.dateRange}
        days={`${data.trip.days.length} Days`}
        transport={data.trip.transport ?? "Motorcycle"}
        tripName={data.trip.name}
      />
      <TripSectionTabs activeTab="Planning" tripId={data.trip.id} />
      <div className="bg-forest-800/5 px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-forest-800 sm:px-8 lg:px-10">
        Planning MVP preview —{" "}
        <Link
          className="underline"
          href={`/trips/${data.trip.id}` as Route}
        >
          back to classic view
        </Link>
      </div>
      <StopPlanningWorkspace
        callbacks={{}}
        trip={stops}
        viewerRole={data.viewerRole}
      />
    </TripAppShell>
  );
}

type TripData = {
  trip: ReturnType<typeof mapSupabasePlanningTrip>;
  viewerRole: TripRole | null;
};

async function getTripData(tripId: string): Promise<TripData | null> {
  const fallback = getPlanningTripById(tripId);
  if (fallback) {
    return { trip: fallback, viewerRole: "owner" };
  }

  const supabase = await createSupabaseServerClient();
  const rideflowSupabase = supabase as unknown as RideFlowSupabaseClient;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!isUuid(tripId)) {
    return null;
  }

  const [rows, viewerRole] = await Promise.all([
    getSupabasePlanningTripRows(rideflowSupabase, tripId),
    user
      ? createSupabaseMemberRepository(rideflowSupabase).getViewerRole(
          tripId,
          user.id
        )
      : Promise.resolve(null)
  ]);

  if (!rows) {
    return null;
  }

  return {
    trip: mapSupabasePlanningTrip(rows),
    viewerRole
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}