import { notFound } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { DateRail } from "@/components/planning/date-rail";
import { PlanningWorkspace } from "@/components/planning/planning-workspace";
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
        <PlanningWorkspace trip={trip} />
      </div>
    </AppShell>
  );
}
