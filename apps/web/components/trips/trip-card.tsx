import Link from "next/link";
import type { Route } from "next";
import { PlusCircle, Star } from "lucide-react";
import type { DashboardTrip } from "@/src/application/trips/dashboard-data";
import { dashboardCreateTripCta } from "@/src/application/trips/dashboard-data";

type TripCardProps = {
  trip: DashboardTrip;
};

export function TripCard({ trip }: TripCardProps) {
  const hasImage = Boolean(trip.imageUrl);
  const ratingLabel = trip.rating !== undefined ? trip.rating.toFixed(1) : "—";
  return (
    <Link
      aria-label={`Open ${trip.name}`}
      className="group relative flex min-h-[28rem] overflow-hidden rounded-3xl shadow-rideflow-card ring-1 ring-black/5 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-rideflow-card-hover focus:outline-none focus:ring-4 focus:ring-mint-400/40 sm:min-h-[34rem]"
      href={`/trips/${trip.id}` as Route}
      style={
        hasImage
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(11, 42, 30, 0) 55%, rgba(11, 42, 30, 0.35) 100%), url(${trip.imageUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover"
            }
          : undefined
      }
    >
      <span className="sr-only">{trip.imageAlt}</span>
      {!hasImage ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-forest-700 to-forest-900"
        />
      ) : null}
      <div className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-mint-400 px-3 py-1.5 text-xs font-extrabold text-forest-900 shadow-md">
        <Star
          aria-hidden="true"
          className="h-3.5 w-3.5 text-amber-400"
          fill="currentColor"
        />
        <span aria-label={`Rated ${ratingLabel} out of 5`}>{ratingLabel}</span>
      </div>
      <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white px-5 py-5 shadow-lg shadow-slate-950/10 sm:inset-x-5 sm:bottom-5 sm:px-6">
        <h3 className="text-xl font-extrabold tracking-[-0.02em] text-slate-950">
          {trip.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-500">
          {trip.destination}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-400">
          {trip.dateRange}
        </p>
      </div>
    </Link>
  );
}

export function NewTripCard() {
  return (
    <Link
      className="flex min-h-[27rem] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-forest-500/40 bg-white text-center transition hover:border-forest-500 hover:bg-cream-50 focus:outline-none focus:ring-4 focus:ring-mint-400/40 sm:min-h-[34rem]"
      href={"/trips/new" as Route}
    >
      <PlusCircle
        aria-hidden="true"
        className="h-16 w-16 text-slate-400"
        strokeWidth={1.8}
      />
      <h3 className="mt-8 text-2xl font-extrabold tracking-[-0.02em] text-slate-500">
        {dashboardCreateTripCta.title}
      </h3>
      <p className="mt-5 text-lg font-medium text-slate-400">
        {dashboardCreateTripCta.subtitle}
      </p>
    </Link>
  );
}
