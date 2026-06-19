import type { Route } from "next";
import Image from "next/image";
import { Bike, Users } from "lucide-react";

import { ContinuePlanningButton } from "@/components/trip/continue-planning-button";
import type { DashboardUpcomingTrip } from "@/src/application/trips/dashboard-summary-data";

type DashboardUpcomingAdventureProps = {
  trip: DashboardUpcomingTrip;
  href: Route;
};

export function DashboardUpcomingAdventure({
  trip,
  href
}: DashboardUpcomingAdventureProps) {
  return (
    <article
      aria-label={`Upcoming adventure ${trip.name}`}
      className="relative flex flex-col gap-0 rounded-2xl bg-paper-50 p-3 shadow-rideflow-editorial-card ring-1 ring-paper-200"
      data-testid="dashboard-upcoming-adventure"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          alt={`Cover image for ${trip.name}`}
          className="aspect-[16/9] w-full object-cover"
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          src={trip.coverImageUrl}
        />
        <div
          aria-hidden="true"
          className="absolute left-4 top-4 flex items-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-100 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta-500 shadow-rideflow-chip">
            <Bike aria-hidden="true" className="h-3.5 w-3.5" />
            {trip.terrain}
          </span>
          <span className="inline-flex items-center rounded-full bg-paper-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-700 shadow-rideflow-chip">
            {trip.daysLabel}
          </span>
        </div>
      </div>

      <div className="-mt-16 mx-3 mb-3 flex flex-col gap-4 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200 sm:-mt-20 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              Upcoming Adventure
            </span>
            <h2 className="font-display text-2xl text-ink-950 sm:text-3xl">
              {trip.name}
            </h2>
          </div>
          <div className="flex flex-col items-end leading-tight">
            <span className="font-display text-2xl text-ink-950 sm:text-3xl">
              {trip.progress}%
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              Planned
            </span>
          </div>
        </div>
        <div
          aria-label={`Planning progress ${trip.progress}%`}
          className="h-1.5 w-full overflow-hidden rounded-full bg-paper-200"
          data-testid="dashboard-upcoming-progress"
        >
          <div
            className="h-full rounded-full bg-forest-800"
            style={{ width: `${trip.progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {trip.members.map((member) => (
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-paper-50 bg-sage-200 text-xs font-semibold text-forest-800"
                  data-testid={`upcoming-member-${member.id}`}
                  key={member.id}
                >
                  {member.initial}
                </span>
              ))}
            </div>
            {typeof trip.extraMemberCount === "number" ? (
              <span
                className="inline-flex h-9 items-center justify-center rounded-full bg-paper-100 px-2.5 text-xs font-semibold text-ink-700"
                data-testid="upcoming-extra-members"
              >
                <Users aria-hidden="true" className="mr-1 h-3.5 w-3.5" />+
                {trip.extraMemberCount}
              </span>
            ) : null}
          </div>
          <ContinuePlanningButton href={href} />
        </div>
      </div>
    </article>
  );
}
