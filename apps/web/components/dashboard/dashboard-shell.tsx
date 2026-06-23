import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight, Plus } from "lucide-react";

import { CreateTripButton } from "@/components/trips/dashboard-create-trip-button";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { DashboardPlanningActivity } from "@/components/dashboard/dashboard-planning-activity";
import { DashboardUpcomingAdventure } from "@/components/dashboard/dashboard-upcoming-adventure";
import { DashboardRecentJourneys } from "@/components/dashboard/dashboard-recent-journeys";
import { createTripAction } from "@/src/application/trips/create-trip-action-server";
import type { DashboardTrip } from "@/src/application/trips/dashboard-data";
import { dashboardCreateTripCta } from "@/src/application/trips/dashboard-data";
import {
  getDashboardActivity,
  getDashboardRecent,
  getDashboardUpcoming
} from "@/src/application/trips/dashboard-summary-data";

type DashboardShellProps = {
  trips: DashboardTrip[];
  memberName?: string;
  memberTier?: string;
  avatarUrl?: string;
};

export function DashboardShell({
  trips,
  memberName,
  memberTier,
  avatarUrl
}: DashboardShellProps) {
  const activity = getDashboardActivity(trips);
  const upcoming = getDashboardUpcoming(trips);
  const recent = getDashboardRecent(trips);
  const firstTripId = trips[0]?.id ?? upcoming?.id ?? "da-nang";

  return (
    <div
      className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
      data-member-name={memberName ?? "the-modern-explorer"}
      data-member-tier={memberTier ?? "premium-member"}
      data-testid="dashboard-shell"
    >
      <div
        className="hidden"
        data-avatar-url={avatarUrl ?? ""}
      />

      <DashboardGreeting
        greeting="Welcome back."
        subtitle="The road is calling. Let’s get planning."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-10">
          {upcoming ? (
            <DashboardUpcomingAdventure
              href={`/trips/${firstTripId}` as Route}
              trip={{ ...upcoming, id: firstTripId }}
            />
          ) : (
            <article
              className="flex flex-col gap-5 rounded-3xl bg-paper-50 p-8 shadow-rideflow-editorial-card ring-1 ring-paper-200"
              data-testid="dashboard-empty-upcoming"
            >
              <h2 className="font-display text-2xl text-ink-950">
                Plan your first journey
              </h2>
              <p className="text-base text-ink-700">
                {dashboardCreateTripCta.subtitle}
              </p>
              <CreateTripButton action={createTripAction} />
            </article>
          )}
          <DashboardRecentJourneys trips={recent} />
        </div>
        <div className="flex flex-col gap-6">
          <DashboardPlanningActivity entries={activity} />
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-paper-100 p-5 ring-1 ring-paper-200">
          <p className="text-sm font-semibold text-ink-700">
            Need inspiration? Browse your saved trips and create a new plan.
          </p>
          <Link
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest-800 hover:underline"
            href={"/trips" as Route}
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Start from a blank trip
          </Link>
        </div>
      ) : (
        <Link
          className="inline-flex items-center gap-2 self-start text-sm font-semibold text-forest-800 hover:underline"
          data-testid="dashboard-explore-link"
          href={"/trips" as Route}
        >
          Explore all trips <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
