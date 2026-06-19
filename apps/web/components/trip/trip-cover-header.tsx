import Image from "next/image";
import { ArrowLeft, Bike, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import { cn } from "@/src/lib/utils";

type TripCoverHeaderProps = {
  tripName: string;
  destination: string;
  coverImageUrl: string;
  dateRange: string;
  days: string;
  transport: string;
  backHref?: Route;
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
  backHref = "/trips" as Route,
  className
}: TripCoverHeaderProps) {
  const safeCover = coverImageUrl || FALLBACK_COVER;
  return (
    <section
      aria-label={`${tripName} cover`}
      className={cn(
        "relative h-[260px] overflow-hidden bg-forest-900 sm:h-[300px] lg:h-[340px]",
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
        className="absolute inset-0 bg-gradient-to-t from-forest-900/85 via-forest-900/30 to-transparent"
      />
      <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between sm:inset-x-8 lg:inset-x-12">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white"
          data-testid="trip-cover-back"
          href={backHref}
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only">Back to trips</span>
        </Link>
        <div className="flex items-center gap-2 text-white/70">
          <span aria-hidden="true" className="h-1.5 w-12 rounded-full bg-white/40" />
        </div>
      </div>
      <div className="absolute inset-x-5 bottom-5 z-10 sm:inset-x-8 lg:inset-x-12 lg:bottom-8">
        <h1 className="font-display text-3xl text-white sm:text-4xl lg:text-5xl">
          {tripName}
        </h1>
        <p className="mt-2 text-sm font-medium text-white/80 sm:text-base">
          {destination}
        </p>
        <ul className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/85">
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
            <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
            {dateRange}
          </li>
          <li
            aria-hidden="true"
            className="inline-flex items-center text-white/40"
          >
            •
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {days}
          </li>
          <li
            aria-hidden="true"
            className="inline-flex items-center text-white/40"
          >
            •
          </li>
          <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur">
            <Bike aria-hidden="true" className="h-3.5 w-3.5" />
            {transport}
          </li>
        </ul>
      </div>
    </section>
  );
}
