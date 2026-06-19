"use client";

import { useMemo, useState } from "react";

import { AiAssistantCard } from "@/components/trip/ai-assistant-card";
import { TripDayRail, type DayRailDay } from "@/components/trip/trip-day-rail";
import { TripRouteOverview } from "@/components/trips/trip-route-overview";
import { TripTimeline } from "@/components/trips/trip-timeline";
import type { PlanningTrip } from "@/src/application/trips/planning-data";
import { buildPlanningWorkspaceState } from "@/src/application/trips/planning-workspace-state";

type PlanningSurfaceProps = {
  trip: PlanningTrip;
  onDismissAssistant?: () => void;
};

export function PlanningSurface({ trip, onDismissAssistant }: PlanningSurfaceProps) {
  const workspace = useMemo(() => buildPlanningWorkspaceState(trip), [trip]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    workspace.agenda[0]?.id ?? null
  );
  const [days, setDays] = useState<DayRailDay[]>(
    trip.days.map((day, index) => ({
      id: day.id,
      label: day.label,
      date: day.date,
      isSelected: index === 0
    }))
  );

  return (
    <div
      className="grid gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[220px_minmax(0,1fr)_320px] lg:gap-8 lg:px-12 lg:py-10"
      data-testid="planning-surface"
    >
      <TripDayRail
        days={days}
        onAddDay={() => undefined}
        onSelectDay={(id) =>
          setDays((prev) => prev.map((d) => ({ ...d, isSelected: d.id === id })))
        }
      />
      <div className="flex flex-col gap-4">
        <TripTimeline
          items={workspace.agenda}
          onConfirmItem={() => undefined}
          onSelectItem={setSelectedItemId}
          selectedItemId={selectedItemId}
        />
      </div>
      <div className="flex flex-col gap-4">
        <TripRouteOverview
          distance="142 km"
          duration="3h 15m"
          end={{ label: "Nam Cát Tiên", sublabel: "Dong Nai, Vietnam" }}
          start={{ label: "Hồ Chí Minh City", sublabel: "Starting Point" }}
        />
        <AiAssistantCard
          body="Heavy rain is expected for Day 2 afternoon. Should we look for indoor backup activities or adjust riding gear?"
          primaryAction={{ label: "Find Indoor Activities" }}
          secondaryAction={{ label: "Dismiss", onClick: onDismissAssistant }}
        />
        <article
          aria-label="Need alternatives for the night"
          className="flex flex-col gap-3 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
          data-testid="planning-night-alternatives"
        >
          <h3 className="text-base font-semibold text-ink-950">
            Need alternatives for the night?
          </h3>
          <div className="flex items-center gap-3 rounded-2xl bg-paper-100 p-3">
            <span
              aria-hidden="true"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sage-200 text-forest-800"
            >
              🌿
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-ink-950">
                Green Hope Lodge
              </span>
              <span className="text-xs font-medium text-ink-500">
                Forest cabin · 4.6 ★
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
