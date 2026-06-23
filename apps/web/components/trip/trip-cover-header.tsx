import type { ReactNode } from "react";
import Image from "next/image";
import { Bike, CalendarDays, Clock } from "lucide-react";

import { cn } from "@/src/lib/utils";

type TripCoverHeaderProps = {
  tripName: string;
  coverImageUrl: string;
  dateRange: string;
  days: string;
  transport: string;
  topActions?: ReactNode;
  className?: string;
};

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80";

export function TripCoverHeader({
  tripName,
  coverImageUrl,
  dateRange,
  days,
  transport,
  topActions,
  className
}: TripCoverHeaderProps) {
  const safeCover = coverImageUrl || FALLBACK_COVER;
  return (
    <section
      aria-label={`${tripName} cover`}
      className={cn(
        "relative h-[340px] overflow-hidden bg-forest-900 sm:h-[400px] lg:h-[460px]",
        className
      )}
      data-testid="trip-cover-header"
    >
      <Image
        alt={`Cover photo for ${tripName}`}
        className="object-cover"
        fill
        priority
        sizes="100vw"
        src={safeCover}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,53,39,0.22)_38%,rgba(0,28,20,0.88)_100%)]"
      />
      {topActions ? (
        <div
          className="absolute inset-x-5 top-5 z-10 flex items-center justify-end gap-2 sm:inset-x-8 lg:inset-x-10"
          data-testid="trip-cover-top-actions"
        >
          {topActions}
        </div>
      ) : null}
      <div className="absolute inset-x-5 bottom-6 z-10 sm:inset-x-8 lg:inset-x-10 lg:bottom-10">
        <h1
          className="max-w-4xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
          data-testid="trip-cover-title"
        >
          {tripName}
        </h1>
        <ul className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/90">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white/14 px-3 py-1.5 shadow-rideflow-chip ring-1 ring-white/20 backdrop-blur">
            <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
            {dateRange}
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white/14 px-3 py-1.5 shadow-rideflow-chip ring-1 ring-white/20 backdrop-blur">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {days}
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white/14 px-3 py-1.5 shadow-rideflow-chip ring-1 ring-white/20 backdrop-blur">
            <Bike aria-hidden="true" className="h-3.5 w-3.5" />
            {transport}
          </li>
        </ul>
      </div>
    </section>
  );
}
