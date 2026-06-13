import Link from "next/link";
import type { Route } from "next";
import { PlusCircle } from "lucide-react";
import type { DashboardTrip } from "@/src/application/trips/dashboard-data";
import { dashboardCreateTripCta } from "@/src/application/trips/dashboard-data";

type TripCardProps = {
  trip: DashboardTrip;
};

export function TripCard({ trip }: TripCardProps) {
  return (
    <Link
      aria-label={`Open ${trip.name}`}
      className="group relative flex min-h-[28rem] overflow-hidden rounded-2xl bg-slate-200 shadow-sm ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004853]/25 sm:min-h-[34rem]"
      href={"/trips" as Route}
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.02) 0%, rgba(15, 23, 42, 0.16) 72%, rgba(15, 23, 42, 0.28) 100%), url(${trip.imageUrl})`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <span className="sr-only">{trip.imageAlt}</span>
      <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white px-5 py-6 shadow-lg shadow-slate-950/10 transition duration-200 group-hover:translate-y-[-2px] sm:inset-x-5 sm:bottom-5 sm:px-6">
        <h3 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-950">
          {trip.name}
        </h3>
        <p className="mt-3 text-base font-medium text-slate-500">
          {trip.destination}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-400">
          {trip.dateRange}
        </p>
      </div>
    </Link>
  );
}

export function NewTripCard() {
  return (
    <Link
      className="flex min-h-[27rem] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center transition hover:border-[#004853]/40 hover:bg-[#f8fbfb] focus:outline-none focus:ring-4 focus:ring-[#004853]/25 sm:min-h-[34rem]"
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
