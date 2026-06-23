import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bike, Users } from "lucide-react";

import type { DashboardCompletedTrip } from "@/src/application/trips/dashboard-summary-data";

type DashboardRecentJourneysProps = {
  trips: DashboardCompletedTrip[];
};

function metaIcon(label: string) {
  if (label.toLowerCase().includes("mi") || label.toLowerCase().includes("km")) {
    return Bike;
  }
  return Users;
}

export function DashboardRecentJourneys({ trips }: DashboardRecentJourneysProps) {
  if (trips.length === 0) {
    return null;
  }
  return (
    <section
      aria-labelledby="dashboard-recent-journeys-heading"
      className="flex flex-col gap-5"
      data-testid="dashboard-recent-journeys"
    >
      <div className="flex items-center justify-between">
        <h2
          className="font-display text-2xl text-ink-950"
          id="dashboard-recent-journeys-heading"
        >
          Recent Journeys
        </h2>
        <Link
          className="text-sm font-semibold text-forest-800 underline-offset-4 hover:underline"
          data-testid="dashboard-recent-journeys-view-all"
          href={"/trips" as Route}
        >
          View all
        </Link>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2">
        {trips.map((trip) => (
          <li key={trip.id}>
            <Link
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-paper-50 shadow-rideflow-editorial-card ring-1 ring-paper-200 transition hover:-translate-y-0.5 hover:shadow-rideflow-editorial-card-hover"
              data-testid={`dashboard-recent-journey-${trip.id}`}
              href={`/trips/${trip.id}` as Route}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  alt={`Cover image for ${trip.name}`}
                  className="object-cover"
                  fill
                  sizes="(min-width: 640px) 40vw, 100vw"
                  src={trip.imageUrl}
                />
              </div>
              <div className="flex flex-col gap-2 p-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                  {trip.completedLabel}
                </span>
                <h3 className="font-display text-xl text-ink-950">{trip.name}</h3>
                <ul className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-ink-700">
                  {trip.meta.map((line) => {
                    const Icon = metaIcon(line);
                    return (
                      <li
                        className="inline-flex items-center gap-1.5"
                        data-testid={`recent-meta-${trip.id}-${line.toLowerCase().replace(/\s+/g, "-")}`}
                        key={line}
                      >
                        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                        {line}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
