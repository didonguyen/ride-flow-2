import { notFound } from "next/navigation";

import { MemoriesSurface } from "@/components/trips/memories-surface";
import { TripAppShell } from "@/components/trip/trip-app-shell";
import { TripCoverHeader } from "@/components/trip/trip-cover-header";
import { TripSectionTabs } from "@/components/trip/trip-section-tabs";
import {
  addMemoryAction,
  deleteMemoryAction
} from "@/src/application/trips/memories-actions";
import { getTripMemories } from "@/src/application/trips/memories-data";
import { getPlanningTripById } from "@/src/application/trips/planning-data";
import { mapSupabasePlanningTrip } from "@/src/application/trips/supabase-planning-data";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseMemoryRepository,
  getSupabasePlanningTripRows,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

export const dynamic = "force-dynamic";

const TRIP_IMAGE_BUCKET = "rideflow-trip-images";
const MEMORY_IMAGE_SIGNED_URL_TTL_SECONDS = 60 * 60;

type MemoriesPageProps = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function TripMemoriesPage({ params }: MemoriesPageProps) {
  const { tripId } = await params;
  const data = await getMemoriesPageData(tripId);

  if (!data) {
    notFound();
  }

  return (
    <TripAppShell activeItem="My Trips">
      <TripCoverHeader
        coverImageUrl={data.trip.coverImageUrl ?? ""}
        dateRange={data.trip.dateRange}
        days={`${data.trip.days.length} Days`}
        transport={data.trip.transport ?? "Motorcycle"}
        tripName={data.trip.name}
      />
      <TripSectionTabs activeTab="Memories" tripId={data.trip.id} />
      <MemoriesSurface
        addMemoryAction={addMemoryAction}
        deleteMemoryAction={deleteMemoryAction}
        memories={data.memories}
        tripId={data.trip.id}
        tripName={data.trip.name}
      />
    </TripAppShell>
  );
}

async function getMemoriesPageData(tripId: string) {
  const supabase = await createSupabaseServerClient();
  const rideflowSupabase = supabase as unknown as RideFlowSupabaseClient;

  if (!isUuid(tripId)) {
    const fallback = getPlanningTripById(tripId);
    return fallback
      ? {
          trip: fallback,
          memories: getTripMemories()
        }
      : null;
  }

  const rows = await getSupabasePlanningTripRows(rideflowSupabase, tripId);
  if (!rows) {
    return null;
  }

  const memoryRecords = await createSupabaseMemoryRepository(
    rideflowSupabase
  ).listMemories(tripId);
  const memoryRecordsWithSignedAssets = await Promise.all(
    memoryRecords.map(async (memory) => ({
      ...memory,
      assets: await Promise.all(
        memory.assets.map(async (asset) => {
          const { data, error } = await supabase.storage
            .from(TRIP_IMAGE_BUCKET)
            .createSignedUrl(
              asset.imagePath,
              MEMORY_IMAGE_SIGNED_URL_TTL_SECONDS
            );

          if (error || !data?.signedUrl) {
            return asset;
          }

          return {
            ...asset,
            imageUrl: data.signedUrl
          };
        })
      )
    }))
  );

  return {
    trip: mapSupabasePlanningTrip(rows),
    memories: getTripMemories(memoryRecordsWithSignedAssets)
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
