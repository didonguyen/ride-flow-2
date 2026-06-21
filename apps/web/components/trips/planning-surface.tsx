"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";

import { AiAssistantCard } from "@/components/trip/ai-assistant-card";
import { TripDayRail, type DayRailDay } from "@/components/trip/trip-day-rail";
import { TripRouteOverview } from "@/components/trips/trip-route-overview";
import { TripTimeline } from "@/components/trips/trip-timeline";
import {
  agendaForDay,
  type PlanningAgendaItem,
  type PlanningTrip
} from "@/src/application/trips/planning-data";

type PlanningSurfaceProps = {
  addDayAction?: (formData: FormData) => Promise<void> | void;
  addStopAction?: (formData: FormData) => Promise<void> | void;
  deleteStopAction?: (formData: FormData) => Promise<void> | void;
  onDismissAssistant?: () => void;
  trip: PlanningTrip;
  updateStopAction?: (formData: FormData) => Promise<void> | void;
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

export function PlanningSurface({
  addDayAction,
  addStopAction,
  deleteStopAction,
  onDismissAssistant,
  trip,
  updateStopAction
}: PlanningSurfaceProps) {
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

  const selectedItem = useMemo(
    () => dayItems.find((item) => item.id === selectedItemId) ?? null,
    [dayItems, selectedItemId]
  );

  const selectedDayIndex = Math.max(
    1,
    days.findIndex((day) => day.id === selectedDayId) + 1
  );
  const nextDay = buildNextDay(trip, days.length + 1);

  const handleAddDay = () => {
    const id = `day-extra-${days.length + 1}`;
    setExtraDays((prev) => [
      ...prev,
      {
        id,
        label: `Day ${days.length + 1}`,
        date: nextDay.label
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
      <div className="flex flex-col gap-4">
        <TripDayRail
          days={days}
          onAddDay={handleAddDay}
          onSelectDay={(id) => {
            setSelectedDayId(id);
            setSelectedItemId(null);
          }}
        />
        {addDayAction ? (
          <form action={addDayAction} data-testid="planning-add-day-form">
            <input name="tripId" type="hidden" value={trip.id} />
            <input name="dayIndex" type="hidden" value={days.length + 1} />
            <input name="date" type="hidden" value={nextDay.isoDate} />
            <button
              className="sr-only"
              data-testid="planning-add-day-submit"
              type="submit"
              onClick={handleAddDay}
            >
              Save new day
            </button>
          </form>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        <TripTimeline
          items={dayItems}
          onConfirmItem={() => undefined}
          onSelectItem={setSelectedItemId}
          selectedItemId={selectedItemId}
        />
        <AddStopForm
          action={addStopAction}
          selectedDayId={selectedDayId}
          selectedDayIndex={selectedDayIndex}
          tripId={trip.id}
        />
      </div>

      <div className="flex flex-col gap-5">
        <SelectedStopPanel
          action={updateStopAction}
          deleteAction={deleteStopAction}
          item={selectedItem}
          tripId={trip.id}
        />
        <TripRouteOverview
          distance="142 km"
          duration="3h 15m"
          end={{ label: trip.destination ?? trip.name, sublabel: "Destination" }}
          start={{ label: "Starting point", sublabel: trip.transport ?? "Trip" }}
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

function AddStopForm({
  action,
  selectedDayId,
  selectedDayIndex,
  tripId
}: {
  action?: (formData: FormData) => Promise<void> | void;
  selectedDayId: string;
  selectedDayIndex: number;
  tripId: string;
}) {
  return (
    <form
      action={action}
      className="grid gap-3 rounded-2xl bg-paper-50 p-4 shadow-rideflow-editorial-card ring-1 ring-paper-200 sm:grid-cols-[1fr_120px_auto]"
      data-testid="planning-add-stop-form"
    >
      <input name="tripId" type="hidden" value={tripId} />
      <input name="tripDayId" type="hidden" value={selectedDayId} />
      <input name="durationMinutes" type="hidden" value="60" />
      <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        Stop title
        <input
          className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
          name="title"
          placeholder={`Day ${selectedDayIndex} stop`}
          type="text"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        Time
        <input
          className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
          defaultValue="09:00"
          name="startTime"
          type="time"
        />
      </label>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700 sm:self-end"
        data-testid="planning-add-stop-submit"
        type="submit"
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
        Add stop
      </button>
    </form>
  );
}

function SelectedStopPanel({
  action,
  deleteAction,
  item,
  tripId
}: {
  action?: (formData: FormData) => Promise<void> | void;
  deleteAction?: (formData: FormData) => Promise<void> | void;
  item: PlanningAgendaItem | null;
  tripId: string;
}) {
  if (!item) {
    return (
      <article
        className="rounded-2xl bg-paper-50 p-5 text-sm leading-6 text-ink-500 shadow-rideflow-editorial-card ring-1 ring-paper-200"
        data-testid="planning-selected-stop-empty"
      >
        Select a stop to edit its title, time, and notes.
      </article>
    );
  }

  return (
    <article
      className="flex flex-col gap-4 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
      data-testid="planning-selected-stop-panel"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-800">
          Selected stop
        </p>
        <h2 className="mt-1 font-display text-xl text-ink-950">{item.title}</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <input name="tripId" type="hidden" value={tripId} />
        <input name="itemId" type="hidden" value={item.id} />
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Title
          <input
            className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
            defaultValue={item.title}
            name="title"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Time
          <input
            className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
            defaultValue={toTimeInputValue(item.time)}
            name="startTime"
            type="time"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Notes
          <textarea
            className="min-h-24 rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
            defaultValue={item.description}
            name="notes"
          />
        </label>
        <button
          className="inline-flex items-center justify-center rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700"
          data-testid="planning-update-stop-submit"
          type="submit"
        >
          Save stop
        </button>
      </form>
      <form action={deleteAction}>
        <input name="tripId" type="hidden" value={tripId} />
        <input name="itemId" type="hidden" value={item.id} />
        <button
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
          data-testid="planning-delete-stop-submit"
          type="submit"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
          Delete stop
        </button>
      </form>
    </article>
  );
}

function buildNextDay(trip: PlanningTrip, dayIndex: number) {
  const start = parseDateFromRange(trip.dateRange);
  start.setUTCDate(start.getUTCDate() + dayIndex - 1);
  return {
    isoDate: start.toISOString().slice(0, 10),
    label: start.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
      weekday: "short"
    })
  };
}

function parseDateFromRange(dateRange: string) {
  const match = /^([A-Z][a-z]{2}) (\d{1,2})/.exec(dateRange);
  const yearMatch = /(\d{4})$/.exec(dateRange);
  const year = yearMatch ? Number(yearMatch[1]) : new Date().getUTCFullYear();
  const month = match ? monthIndex(match[1]) : 0;
  const day = match ? Number(match[2]) : 1;
  return new Date(Date.UTC(year, month, day));
}

function monthIndex(month: string) {
  return [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ].indexOf(month);
}

function toTimeInputValue(label: string) {
  if (/^\d{2}:\d{2}$/.test(label)) {
    return label;
  }
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim());
  if (!match) {
    return "09:00";
  }
  const hours = Number(match[1]);
  const minutes = match[2];
  const meridiem = match[3].toUpperCase();
  let hour24 = hours % 12;
  if (meridiem === "PM") {
    hour24 += 12;
  }
  return `${hour24.toString().padStart(2, "0")}:${minutes}`;
}
