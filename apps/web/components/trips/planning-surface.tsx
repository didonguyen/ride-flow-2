"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

import { AiAssistantCard } from "@/components/trip/ai-assistant-card";
import { TripDayRail, type DayRailDay } from "@/components/trip/trip-day-rail";
import { TripRouteOverview } from "@/components/trips/trip-route-overview";
import { TripTimeline } from "@/components/trips/trip-timeline";
import {
  agendaForDay,
  type PlanningTrip
} from "@/src/application/trips/planning-data";

type PlanningSurfaceProps = {
  trip: PlanningTrip;
  onDismissAssistant?: () => void;
};

const NIGHT_ALTERNATIVES = [
  {
    id: "green-hope",
    name: "Green Hope Lodge",
    meta: "Forest cabin · 4.6 ★"
  },
  {
    id: "nam-cat-tien-bay",
    name: "Nam Cát Tiên Bay Stay",
    meta: "Lakeside rooms · 4.4 ★"
  }
];

export function PlanningSurface({ trip, onDismissAssistant }: PlanningSurfaceProps) {
  const [selectedDayId, setSelectedDayId] = useState<string>(
    trip.selectedDayId
  );
  const [extraDays, setExtraDays] = useState<DayRailDay[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const days: DayRailDay[] = useMemo(
    () => [
      ...trip.days.map((day) => ({
        id: day.id,
        label: day.label,
        date: day.date,
        isSelected: day.id === selectedDayId
      })),
      ...extraDays.map((day) => ({
        ...day,
        isSelected: day.id === selectedDayId
      }))
    ],
    [trip.days, extraDays, selectedDayId]
  );

  const dayItems = useMemo(
    () => agendaForDay(trip, selectedDayId),
    [trip, selectedDayId]
  );

  const handleAddDay = () => {
    const next = days.length + 1;
    const id = `day-extra-${next}`;
    setExtraDays((prev) => [
      ...prev,
      {
        id,
        label: `Day ${next}`,
        date: `Day ${next}`
      }
    ]);
    setSelectedDayId(id);
    setSelectedItemId(null);
  };

  return (
    <div
      className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[180px_minmax(0,1fr)_340px] lg:gap-10 lg:px-10 lg:py-10"
      data-testid="planning-surface"
    >
      <TripDayRail
        days={days}
        onAddDay={handleAddDay}
        onSelectDay={(id) => {
          setSelectedDayId(id);
          setSelectedItemId(null);
        }}
      />
      <div className="flex flex-col gap-2">
        <TripTimeline
          items={dayItems}
          onConfirmItem={() => undefined}
          onSelectItem={setSelectedItemId}
          selectedItemId={selectedItemId}
        />
      </div>
      <div className="flex flex-col gap-5">
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
          <ul className="flex flex-col gap-2">
            {NIGHT_ALTERNATIVES.map((alt) => (
              <li
                className="flex items-center gap-3 rounded-2xl bg-paper-100 p-3"
                data-testid={`planning-night-alternative-${alt.id}`}
                key={alt.id}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sage-200 text-forest-800"
                >
                  🌿
                </span>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-semibold text-ink-950">
                    {alt.name}
                  </span>
                  <span className="truncate text-xs text-ink-500">
                    {alt.meta}
                  </span>
                </div>
                <ChevronRight
                  aria-hidden="true"
                  className="h-4 w-4 text-ink-500"
                />
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
