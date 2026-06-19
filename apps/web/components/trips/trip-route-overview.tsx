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
      className="flex flex-col gap-4 rounded-2xl bg-forest-800 p-5 text-white shadow-rideflow-editorial-card"
      data-testid="trip-route-overview"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg text-white">Route Overview</h3>
        {onOpenMap ? (
          <button
            aria-label="Open route map"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15"
            data-testid="trip-route-overview-open"
            type="button"
            onClick={onOpenMap}
          >
            <ExternalLink aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <p className="text-sm text-white/70">
        {start.label} to {end.label}
      </p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-forest-800"
          >
            <MapPin aria-hidden="true" className="h-4 w-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              Start
            </span>
            <span className="text-sm font-semibold text-white">{start.label}</span>
            {start.sublabel ? (
              <span className="text-xs text-white/60">{start.sublabel}</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-forest-800"
          >
            <MapPin aria-hidden="true" className="h-4 w-4" />
          </span>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              Destination
            </span>
            <span className="text-sm font-semibold text-white">{end.label}</span>
            {end.sublabel ? (
              <span className="text-xs text-white/60">{end.sublabel}</span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-white/5 p-3 text-xs font-semibold">
        <span className="text-white/70">{distance}</span>
        <span className="text-white">{duration}</span>
      </div>
    </article>
  );
}
