"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";

import { AiAssistantCard } from "@/components/trip/ai-assistant-card";
import { TripDayRail, type DayRailDay } from "@/components/trip/trip-day-rail";
import { ActionModal } from "@/components/ui/action-modal";
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
    meta: "Forest cabin · 4.6 ?"
  },
  {
    id: "nam-cat-tien-bay",
    name: "Nam Cát Tiên Bay Stay",
    meta: "Lakeside rooms · 4.4 ?"
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
  const [showAddDay, setShowAddDay] = useState(false);
  const [showAddStop, setShowAddStop] = useState(false);
  const [editingStop, setEditingStop] = useState<PlanningAgendaItem | null>(null);
  const [deletingStop, setDeletingStop] = useState<PlanningAgendaItem | null>(null);

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
      <ActionModal
        description={`Add ${nextDay.label} as the next trip day.`}
        onOpenChange={setShowAddDay}
        open={showAddDay}
        title="Add trip day"
      >
        <form
          action={addDayAction}
          className="flex flex-wrap gap-2"
          data-testid="planning-add-day-form"
          onSubmit={handleAddDay}
        >
          <input name="tripId" type="hidden" value={trip.id} />
          <input name="dayIndex" type="hidden" value={days.length + 1} />
          <input name="date" type="hidden" value={nextDay.isoDate} />
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700"
            data-testid="planning-add-day-submit"
            type="submit"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Add day
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-paper-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-paper-100"
            type="button"
            onClick={() => setShowAddDay(false)}
          >
            Cancel
          </button>
        </form>
      </ActionModal>

      <ActionModal
        description={`Create a new activity for Day ${selectedDayIndex}.`}
        onOpenChange={setShowAddStop}
        open={showAddStop}
        title="Add activity"
      >
        <StopForm
          action={addStopAction}
          selectedDayId={selectedDayId}
          selectedDayIndex={selectedDayIndex}
          submitLabel="Add stop"
          tripId={trip.id}
        />
      </ActionModal>

      <ActionModal
        description="Update this activity title, time, and notes."
        onOpenChange={(open) => {
          if (!open) setEditingStop(null);
        }}
        open={Boolean(editingStop)}
        title="Edit activity"
      >
        {editingStop ? (
          <StopForm
            action={updateStopAction}
            item={editingStop}
            selectedDayId={selectedDayId}
            selectedDayIndex={selectedDayIndex}
            submitLabel="Save stop"
            tripId={trip.id}
          />
        ) : null}
      </ActionModal>

      <ActionModal
        description={
          deletingStop
            ? `This removes "${deletingStop.title}" from the selected day.`
            : undefined
        }
        onOpenChange={(open) => {
          if (!open) setDeletingStop(null);
        }}
        open={Boolean(deletingStop)}
        title="Delete activity"
      >
        {deletingStop ? (
          <form action={deleteStopAction} className="flex flex-wrap gap-2">
            <input name="tripId" type="hidden" value={trip.id} />
            <input name="itemId" type="hidden" value={deletingStop.id} />
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              data-testid="planning-delete-stop-submit"
              type="submit"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete stop
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-paper-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-paper-100"
              type="button"
              onClick={() => setDeletingStop(null)}
            >
              Cancel
            </button>
          </form>
        ) : null}
      </ActionModal>

      <div className="flex flex-col gap-4">
        <TripDayRail
          days={days}
          onAddDay={() => setShowAddDay(true)}
          onSelectDay={(id) => {
            setSelectedDayId(id);
            setSelectedItemId(null);
          }}
        />
      </div>

      <div className="flex flex-col gap-4">
        <TripTimeline
          items={dayItems}
          onConfirmItem={() => undefined}
          onSelectItem={setSelectedItemId}
          selectedItemId={selectedItemId}
        />
        <button
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700"
          data-testid="planning-add-stop-open"
          type="button"
          onClick={() => setShowAddStop(true)}
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Add stop
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <SelectedStopPanel
          canDelete={Boolean(deleteStopAction)}
          canEdit={Boolean(updateStopAction)}
          item={selectedItem}
          onDelete={(item) => setDeletingStop(item)}
          onEdit={(item) => setEditingStop(item)}
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
                  ??
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

function StopForm({
  action,
  item,
  selectedDayId,
  selectedDayIndex,
  submitLabel,
  tripId
}: {
  action?: (formData: FormData) => Promise<void> | void;
  item?: PlanningAgendaItem;
  selectedDayId: string;
  selectedDayIndex: number;
  submitLabel: string;
  tripId: string;
}) {
  return (
    <form
      action={action}
      className="grid gap-3 rounded-2xl bg-sage-100 p-4"
      data-testid={item ? "planning-edit-stop-form" : "planning-add-stop-form"}
    >
      <input name="tripId" type="hidden" value={tripId} />
      {item ? <input name="itemId" type="hidden" value={item.id} /> : null}
      {!item ? <input name="tripDayId" type="hidden" value={selectedDayId} /> : null}
      <input name="durationMinutes" type="hidden" value="60" />
      <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
        Stop title
        <input
          className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
          defaultValue={item?.title ?? ""}
          name="title"
          placeholder={`Day ${selectedDayIndex} stop`}
          type="text"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
        Time
        <input
          className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
          defaultValue={item ? toTimeInputValue(item.time) : "09:00"}
          name="startTime"
          type="time"
        />
      </label>
      {item ? (
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
          Notes
          <textarea
            className="min-h-24 rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
            defaultValue={item.description}
            name="notes"
          />
        </label>
      ) : null}
      <button
        className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700"
        data-testid={item ? "planning-update-stop-submit" : "planning-add-stop-submit"}
        type="submit"
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
        {submitLabel}
      </button>
    </form>
  );
}

function SelectedStopPanel({
  canDelete,
  canEdit,
  item,
  onDelete,
  onEdit
}: {
  canDelete: boolean;
  canEdit: boolean;
  item: PlanningAgendaItem | null;
  onDelete: (item: PlanningAgendaItem) => void;
  onEdit: (item: PlanningAgendaItem) => void;
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
        <p className="mt-2 text-sm leading-6 text-ink-600">{item.description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {canEdit ? (
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700"
            data-testid="planning-edit-stop-open"
            type="button"
            onClick={() => onEdit(item)}
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Edit stop
          </button>
        ) : null}
        {canDelete ? (
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            data-testid="planning-delete-stop-open"
            type="button"
            onClick={() => onDelete(item)}
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Delete stop
          </button>
        ) : null}
      </div>
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