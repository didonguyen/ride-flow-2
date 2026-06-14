import { notFound } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { DateRail } from "@/components/planning/date-rail";
import { ItineraryTimeline } from "@/components/planning/itinerary-timeline";
import { RouteMapPanel } from "@/components/planning/route-map-panel";
import { TripSectionTabs } from "@/components/planning/trip-section-tabs";
import { getPlanningTripById } from "@/src/application/trips/planning-data";

type TripPlanningPageProps = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function TripPlanningPage({
  params
}: TripPlanningPageProps) {
  const { tripId } = await params;
  const trip = getPlanningTripById(tripId);

  if (!trip) {
    notFound();
  }

  return (
    <AppShell activeItem="Dashboard">
      <div className="-mx-5 -mt-8 bg-white sm:-mx-8 lg:-mx-12 lg:-mt-9">
        <TripSectionTabs activeTab="Planning" tripId={trip.id} />
        <DateRail days={trip.days} />

        <div className="grid min-h-[calc(100vh-17rem)] lg:grid-cols-[minmax(34rem,0.52fr)_minmax(34rem,0.48fr)]">
          <div className="px-5 py-8 sm:px-8 lg:px-9">
            <ItineraryTimeline agenda={trip.agenda} />
          </div>

          <RouteMapPanel pins={trip.mapPins} />
        </div>
      </div>
    </AppShell>
  );
}
