import type { Route } from "next";
import Image from "next/image";

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
      className="relative overflow-hidden rounded-3xl bg-paper-50 shadow-rideflow-editorial-card ring-1 ring-paper-200"
      data-testid="dashboard-upcoming-adventure"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          alt={`Cover image for ${trip.name}`}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          src={trip.coverImageUrl}
        />
        <div
          aria-hidden="true"
          className="absolute left-4 top-4 flex items-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta-500">
            <span aria-hidden="true">🏍</span>
            {trip.terrain}
          </span>
          <span className="inline-flex items-center rounded-full bg-paper-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-700 shadow-rideflow-chip">
            {trip.daysLabel}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
            Upcoming Adventure
          </span>
          <h2 className="font-display text-2xl text-ink-950 sm:text-3xl">
            {trip.name}
          </h2>
          <div
            aria-label="Planning progress"
            className="flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-ink-500">
              <span className="uppercase tracking-[0.18em]">Planned</span>
              <span className="text-ink-950">{trip.progressLabel}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-200">
              <div
                aria-label={`Progress ${trip.progress}%`}
                className="h-full rounded-full bg-forest-800"
                style={{ width: `${trip.progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {trip.members.map((member) => (
                <span
                  aria-hidden="true"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-paper-50 bg-sage-200 text-xs font-semibold text-forest-800"
                  key={member.id}
                >
                  {member.initial}
                </span>
              ))}
            </div>
            {typeof trip.extraMemberCount === "number" ? (
              <span className="inline-flex h-8 items-center justify-center rounded-full bg-paper-100 px-2 text-xs font-semibold text-ink-700">
                +{trip.extraMemberCount}
              </span>
            ) : null}
          </div>
        </div>
        <ContinuePlanningButton href={href} />
      </div>
    </article>
  );
}
