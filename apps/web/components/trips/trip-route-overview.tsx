import { ExternalLink, MapPin } from "lucide-react";

type TripRouteOverviewProps = {
  start: { label: string; sublabel?: string };
  end: { label: string; sublabel?: string };
  distance: string;
  duration: string;
  onOpenMap?: () => void;
};

export function TripRouteOverview({
  start,
  end,
  distance,
  duration,
  onOpenMap
}: TripRouteOverviewProps) {
  return (
    <article
      aria-label="Route overview"
      className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
      data-testid="trip-route-overview"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-paper-100">
        <svg
          aria-label="Route preview"
          className="h-full w-full"
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="route-bg" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#F2F4F1" />
              <stop offset="100%" stopColor="#E7F2EC" />
            </linearGradient>
          </defs>
          <rect fill="url(#route-bg)" height="100" width="200" />
          <path
            d="M30 70 Q 90 25 170 50"
            fill="none"
            stroke="#003527"
            strokeDasharray="4 4"
            strokeWidth="2"
          />
          <circle cx="30" cy="70" fill="#003527" r="4" />
          <circle cx="170" cy="50" fill="#003527" r="4" />
        </svg>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-paper-50 px-2.5 py-1 text-[11px] font-semibold text-ink-700 shadow-rideflow-chip">
          {distance} • {duration}
        </span>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3
            className="font-display text-lg text-ink-950"
            style={{ letterSpacing: "-0.01em" }}
          >
            Route Overview
          </h3>
          <p className="mt-0.5 text-xs text-ink-500">
            {start.label} to {end.label}
          </p>
        </div>
        {onOpenMap ? (
          <button
            aria-label="Open route map"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition hover:bg-paper-100 hover:text-ink-950"
            data-testid="trip-route-overview-open"
            type="button"
            onClick={onOpenMap}
          >
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 rounded-2xl bg-paper-100 p-3">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sage-200 text-forest-800"
          >
            <MapPin aria-hidden="true" className="h-4 w-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              Start
            </span>
            <span className="text-sm font-semibold text-ink-950">
              {start.label}
            </span>
            {start.sublabel ? (
              <span className="text-xs text-ink-500">{start.sublabel}</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-paper-100 p-3">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sage-200 text-forest-800"
          >
            <MapPin aria-hidden="true" className="h-4 w-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              Destination
            </span>
            <span className="text-sm font-semibold text-ink-950">
              {end.label}
            </span>
            {end.sublabel ? (
              <span className="text-xs text-ink-500">{end.sublabel}</span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
