import Image from "next/image";
import { Bike, CalendarDays, Clock } from "lucide-react";

import { cn } from "@/src/lib/utils";

type TripCoverHeaderProps = {
  tripName: string;
  destination?: string;
  coverImageUrl: string;
  dateRange: string;
  days: string;
  transport: string;
  className?: string;
};

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80";

export function TripCoverHeader({
  tripName,
  destination,
  coverImageUrl,
  dateRange,
  days,
  transport,
  className
}: TripCoverHeaderProps) {
  const safeCover = coverImageUrl || FALLBACK_COVER;
  return (
    <section
      aria-label={`${tripName} cover`}
      className={cn(
        "relative h-[260px] overflow-hidden bg-forest-900 sm:h-[300px] lg:h-[320px]",
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
        className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/40 to-transparent"
      />
      <div className="absolute inset-x-5 bottom-5 z-10 sm:inset-x-8 lg:inset-x-10 lg:bottom-7">
        <h1
          className="font-display text-2xl text-white sm:text-3xl"
          data-testid="trip-cover-title"
        >
          {tripName}
        </h1>
        {destination ? (
          <p className="mt-1 text-sm font-medium text-white/75 sm:text-base">
            {destination}
          </p>
        ) : null}
        <ul className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs font-semibold text-white/85">
          <li className="inline-flex items-center gap-1.5">
            <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
            {dateRange}
          </li>
          <li aria-hidden="true" className="text-white/40">•</li>
          <li className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {days}
          </li>
          <li aria-hidden="true" className="text-white/40">•</li>
          <li className="inline-flex items-center gap-1.5">
            <Bike aria-hidden="true" className="h-3.5 w-3.5" />
            {transport}
          </li>
        </ul>
      </div>
    </section>
  );
}
