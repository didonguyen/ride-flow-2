import type { Route } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type MobileTripHeaderProps = {
  tripId: string;
  name: string;
  dateRange: string;
};

export function MobileTripHeader({ tripId, name, dateRange }: MobileTripHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <Link
        aria-label="Back to trips"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
        href={`/trips` as Route}
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold tracking-[-0.01em] text-slate-950">
          {name}
        </p>
        <p className="truncate text-xs text-slate-500">{dateRange}</p>
      </div>
      <Link
        aria-label="Open members panel"
        className="inline-flex h-9 items-center justify-center rounded-full bg-[#00565b] px-3 text-xs font-extrabold text-white transition hover:bg-[#004853]"
        href={`/trips/${tripId}#members` as Route}
      >
        Members
      </Link>
    </header>
  );
}
