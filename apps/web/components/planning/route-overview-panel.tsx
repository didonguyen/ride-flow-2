"use client";

import { MapPin, Sparkles, X } from "lucide-react";

import type { Stop } from "@/src/domain/stop-options";

export type RouteSummary = {
  destination: string;
  distanceText: string;
  durationText: string;
  stopsCount: number;
  mapPreviewUrl?: string;
};

type RouteOverviewPanelProps = {
  tripName: string;
  summary: RouteSummary;
  stops: Stop[];
  onSelectStop?: (stopId: string) => void;
  onOpenRoute?: () => void;
  onClose?: () => void;
};

export function RouteOverviewPanel({
  tripName,
  summary,
  stops,
  onSelectStop,
  onOpenRoute,
  onClose
}: RouteOverviewPanelProps) {
  return (
    <aside
      aria-label="Route overview"
      className="flex flex-col gap-4 rounded-3xl border border-paper-200 bg-paper-50 p-5 shadow-rideflow-chip"
      data-testid="route-overview-panel"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-forest-800">
            Route overview
          </span>
          <h2 className="text-base font-extrabold text-ink-950">
            {tripName} · {summary.destination}
          </h2>
        </div>
        {onClose ? (
          <button
            aria-label="Close route overview"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-700 transition hover:bg-paper-200"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : null}
      </header>

      <dl className="grid grid-cols-3 gap-3">
        <Stat label="Distance" value={summary.distanceText} />
        <Stat label="Duration" value={summary.durationText} />
        <Stat label="Stops" value={`${summary.stopsCount}`} />
      </dl>

      <div
        aria-label="Map preview"
        className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-forest-800/10 ring-1 ring-forest-800/20"
        data-testid="route-overview-placeholder"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0_22%,rgba(62,169,214,0.34)_22%_30%,transparent_30%_100%),linear-gradient(150deg,transparent_0_55%,rgba(103,194,120,0.4)_55%_62%,transparent_62%_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:48px_48px]"
        />
        <p className="relative z-10 text-xs font-extrabold uppercase tracking-[0.18em] text-forest-800">
          Map placeholder
        </p>
      </div>

      <ol className="flex max-h-40 flex-col gap-1 overflow-y-auto pr-1">
        {stops.map((stop) => (
          <li key={stop.id}>
            <button
              className="flex w-full items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-left text-xs font-semibold text-ink-700 transition hover:bg-paper-100"
              onClick={() => onSelectStop?.(stop.id)}
              type="button"
            >
              <span className="flex items-center gap-2">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-forest-800" />
                <span className="line-clamp-1">{stop.title}</span>
              </span>
              {stop.time ? (
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-ink-500">
                  {stop.time}
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ol>

      <button
        className="inline-flex items-center justify-center gap-2 rounded-full border border-forest-800/40 bg-paper-50 px-4 py-2 text-xs font-extrabold text-forest-800 transition hover:bg-forest-800/5"
        data-testid="open-route"
        onClick={onOpenRoute}
        type="button"
      >
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
        Open full route
      </button>
    </aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-paper-200 bg-paper-50/80 p-3">
      <dt className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-500">
        {label}
      </dt>
      <dd className="text-base font-extrabold text-ink-950">{value}</dd>
    </div>
  );
}