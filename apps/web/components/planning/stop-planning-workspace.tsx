"use client";

import { useMemo, useState } from "react";

import { AiSuggestionPanel } from "@/components/planning/ai-suggestion-panel";
import {
  RouteOverviewPanel,
  type RouteSummary
} from "@/components/planning/route-overview-panel";
import { StopCard } from "@/components/planning/stop-card/stop-card";
import type { TripRole } from "@/src/domain/permissions";
import { canMutatePlanning } from "@/src/domain/permissions";
import type { Stop, StopOption } from "@/src/domain/stop-options";
import {
  applyPinReducer,
  applyUnpinReducer,
  buildStopWorkspaceState,
  getSelectedStop,
  getStopsForDay,
  listSortedBackups,
  reorderStops,
  selectStop,
  type StopWorkspaceState
} from "@/src/application/stop-options/workspace-state";
import { cn } from "@/src/lib/utils";

export type DaySummary = {
  id: string;
  label: string;
  date?: string;
  isSelected?: boolean;
};

export type StopPlanningDay = DaySummary & {
  stops: Stop[];
};

export type StopPlanningTrip = {
  id: string;
  name: string;
  destination: string;
  days: StopPlanningDay[];
  selectedDayId: string;
};

export type StopPlanningCallbacks = {
  addDay?: () => void;
  addStop?: (dayId: string) => void;
  editStop?: (stopId: string) => void;
  deleteStop?: (stopId: string) => void;
  pinOption?: (stopId: string, optionId: string) => void;
  removeOption?: (stopId: string, optionId: string) => void;
  generateOptions?: (stopId: string) => void;
  searchGooglePlaces?: (stopId: string) => void;
  addManualOption?: (stopId: string) => void;
  applyAiSuggestion?: (suggestionId: string) => void;
  reorder?: (moves: Array<{ stopId: string; dayId: string; sortOrder: number }>) => void;
  openRoute?: () => void;
};

type StopPlanningWorkspaceProps = {
  trip: StopPlanningTrip;
  viewerRole: TripRole | null;
  callbacks?: StopPlanningCallbacks;
};

export function StopPlanningWorkspace({
  trip,
  viewerRole,
  callbacks
}: StopPlanningWorkspaceProps) {
  const initial = useMemo(() => {
    return buildStopWorkspaceState({
      tripId: trip.id,
      stops: trip.days.flatMap((day) => day.stops)
    });
  }, [trip]);

  const [state, setState] = useState<StopWorkspaceState>(initial);
  const [selectedDayId, setSelectedDayId] = useState<string>(
    trip.selectedDayId || trip.days[0]?.id || ""
  );
  const [dragStopId, setDragStopId] = useState<string | null>(null);

  const canEdit = viewerRole ? canMutatePlanning(viewerRole) : false;
  const selectedDay = trip.days.find((day) => day.id === selectedDayId) ?? trip.days[0];
  const dayStops = selectedDay
    ? getStopsForDay(state, selectedDay.id)
    : [];
  const selectedStop = getSelectedStop(state);

  const summary = useMemo<RouteSummary>(() => {
    return computeRouteSummary(trip, state);
  }, [trip, state]);

  function handleSelectStop(stopId: string) {
    setState((prev) => selectStop(prev, stopId));
  }

  function handlePinOption(stopId: string, optionId: string) {
    setState((prev) => {
      const result = applyPinReducer(prev, stopId, optionId);
      if (!result) return prev;
      callbacks?.pinOption?.(stopId, optionId);
      return result.state;
    });
  }

  function handleRemoveOption(stopId: string, optionId: string) {
    setState((prev) => {
      const stop = prev.stopsById[stopId];
      if (!stop) return prev;
      const target = stop.options.find((o) => o.id === optionId);
      if (!target) return prev;

      if (target.status === "pinned") {
        const result = applyUnpinReducer(prev, stopId);
        callbacks?.removeOption?.(stopId, optionId);
        return result?.state ?? prev;
      }

      const nextStop: Stop = {
        ...stop,
        options: stop.options.map((o) =>
          o.id === optionId ? { ...o, status: "removed" } : o
        )
      };
      callbacks?.removeOption?.(stopId, optionId);
      return { ...prev, stopsById: { ...prev.stopsById, [stopId]: nextStop } };
    });
  }

  function handleReorder(sourceIndex: number, destinationIndex: number) {
    if (!selectedDay || sourceIndex === destinationIndex) return;
    const moves = dayStops.map((stop, index) => {
      let nextIndex = index;
      if (index === sourceIndex) nextIndex = destinationIndex;
      if (sourceIndex < destinationIndex &&
          index > sourceIndex &&
          index <= destinationIndex) {
        nextIndex = index - 1;
      }
      if (sourceIndex > destinationIndex &&
          index >= destinationIndex &&
          index < sourceIndex) {
        nextIndex = index + 1;
      }
      return {
        stopId: stop.id,
        dayId: selectedDay.id,
        sortOrder: nextIndex
      };
    });
    setState((prev) => reorderStops(prev, moves));
    callbacks?.reorder?.(moves);
  }

  return (
    <div className="grid min-h-[calc(100vh-17rem)] grid-cols-1 gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[14rem_minmax(0,1fr)_22rem] lg:px-9">
      <DayNavigator
        canEdit={canEdit}
        days={trip.days.map((day) => ({
          id: day.id,
          label: day.label,
          date: day.date,
          isSelected: day.id === selectedDayId
        }))}
        onAddDay={callbacks?.addDay}
        onSelectDay={setSelectedDayId}
      />

      <section
        aria-label="Timeline"
        className="flex flex-col gap-4"
        data-testid="stop-timeline"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.18em] text-ink-500">
              {selectedDay?.label ?? "Day"}
            </h2>
            <p className="text-xs text-ink-500">
              {dayStops.length === 0
                ? "No stops planned for this day"
                : `${dayStops.length} stop${dayStops.length === 1 ? "" : "s"} planned`}
            </p>
          </div>
          {canEdit ? (
            <button
              className="inline-flex items-center justify-center rounded-full bg-forest-800 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-forest-700"
              data-testid="add-stop-button"
              onClick={() => selectedDay && callbacks?.addStop?.(selectedDay.id)}
              type="button"
            >
              Add stop
            </button>
          ) : null}
        </div>

        {dayStops.length === 0 ? (
          <EmptyDayState
            canEdit={canEdit}
            onAddStop={() => selectedDay && callbacks?.addStop?.(selectedDay.id)}
            onSuggest={() => dayStops[0] && callbacks?.generateOptions?.(dayStops[0].id)}
          />
        ) : (
          <ol className="flex flex-col gap-4" data-testid="stop-timeline-list">
            {dayStops.map((stop, index) => (
              <li key={stop.id}>
                <StopCardWithDrag
                  canEdit={canEdit}
                  dragHandleProps={{
                    onDragStart: () => setDragStopId(stop.id),
                    onDragEnd: () => setDragStopId(null),
                    draggable: true,
                    "aria-grabbed": dragStopId === stop.id
                  }}
                  isDragging={dragStopId === stop.id}
                  onDeleteStop={callbacks?.deleteStop}
                  onEditStop={callbacks?.editStop}
                  onGenerateOptions={callbacks?.generateOptions}
                  onAddManualOption={callbacks?.addManualOption}
                  onSearchGooglePlaces={callbacks?.searchGooglePlaces}
                  onPinOption={(optionId) => handlePinOption(stop.id, optionId)}
                  onRemoveOption={(optionId) => handleRemoveOption(stop.id, optionId)}
                  onDropBefore={() => handleReorder(index, Math.max(0, index - 1))}
                  onDropAfter={() =>
                    handleReorder(index, Math.min(dayStops.length - 1, index + 1))
                  }
                  stop={stop}
                />
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="flex flex-col gap-4">
        <RouteOverviewPanel
          stops={dayStops}
          summary={summary}
          tripName={trip.name}
          onOpenRoute={callbacks?.openRoute}
          onSelectStop={handleSelectStop}
        />
        <AiSuggestionPanel
          stops={trip.days.flatMap((day) => day.stops)}
          tripId={trip.id}
          onApply={(suggestionId) => callbacks?.applyAiSuggestion?.(suggestionId)}
        />
        {selectedStop ? (
          <SelectedStopSummary
            canEdit={canEdit}
            stop={selectedStop}
          />
        ) : null}
      </div>
    </div>
  );
}

function computeRouteSummary(
  trip: StopPlanningTrip,
  state: StopWorkspaceState
): RouteSummary {
  const allStops = trip.days.flatMap((day) => day.stops);
  const stopsCount = allStops.length;
  const distanceKm = allStops.reduce((total, stop) => total + 18, 0);
  const durationMinutes = allStops.reduce((total, stop) => total + 28, 0);

  return {
    destination: trip.destination,
    distanceText: `${Math.max(distanceKm, stopsCount * 12)} km`,
    durationText: `${Math.max(durationMinutes, stopsCount * 22)} min`,
    stopsCount,
    mapPreviewUrl: undefined
  };
}

type DayNavigatorProps = {
  days: DaySummary[];
  canEdit: boolean;
  onSelectDay: (dayId: string) => void;
  onAddDay?: () => void;
};

function DayNavigator({ days, canEdit, onSelectDay, onAddDay }: DayNavigatorProps) {
  return (
    <nav
      aria-label="Trip days"
      className="flex flex-col gap-2"
      data-testid="stop-day-navigator"
    >
      <h2 className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-ink-500">
        Days
      </h2>
      <ol className="flex flex-col gap-2">
        {days.map((day) => (
          <li key={day.id}>
            <button
              aria-pressed={day.isSelected ? "true" : "false"}
              className={cn(
                "flex w-full flex-col gap-0.5 rounded-2xl border px-3 py-2 text-left transition",
                day.isSelected
                  ? "border-forest-800/40 bg-mint-50 shadow-rideflow-chip ring-1 ring-forest-800/30"
                  : "border-paper-200 bg-paper-50 hover:border-forest-800/30"
              )}
              data-testid={`stop-day-${day.id}`}
              onClick={() => onSelectDay(day.id)}
              type="button"
            >
              <span className="text-sm font-extrabold text-ink-950">{day.label}</span>
              {day.date ? (
                <span className="text-[11px] text-ink-500">{day.date}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ol>
      {canEdit && onAddDay ? (
        <button
          className="inline-flex items-center justify-center rounded-2xl border border-dashed border-paper-300 bg-paper-50 px-3 py-2 text-xs font-extrabold text-ink-700 transition hover:border-forest-800/40 hover:text-forest-800"
          data-testid="stop-add-day"
          onClick={onAddDay}
          type="button"
        >
          Add Day
        </button>
      ) : null}
    </nav>
  );
}

type StopCardWithDragProps = {
  stop: Stop;
  canEdit: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  onPinOption?: (optionId: string) => void;
  onEditStop?: (stopId: string) => void;
  onDeleteStop?: (stopId: string) => void;
  onGenerateOptions?: (stopId: string) => void;
  onSearchGooglePlaces?: (stopId: string) => void;
  onAddManualOption?: (stopId: string) => void;
  onRemoveOption?: (optionId: string) => void;
  onDropBefore?: () => void;
  onDropAfter?: () => void;
};

function StopCardWithDrag({
  stop,
  canEdit,
  dragHandleProps,
  onPinOption,
  onEditStop,
  onDeleteStop,
  onGenerateOptions,
  onSearchGooglePlaces,
  onAddManualOption,
  onRemoveOption
}: StopCardWithDragProps) {
  return (
    <StopCard
      canEdit={canEdit}
      dragHandleProps={dragHandleProps}
      onAddManualOption={onAddManualOption}
      onDeleteStop={onDeleteStop}
      onEditStop={onEditStop}
      onGenerateOptions={onGenerateOptions}
      onPinOption={onPinOption}
      onRemoveOption={onRemoveOption}
      onSearchGooglePlaces={onSearchGooglePlaces}
      stop={stop}
    />
  );
}

function EmptyDayState({
  canEdit,
  onAddStop,
  onSuggest
}: {
  canEdit: boolean;
  onAddStop: () => void;
  onSuggest: () => void;
}) {
  return (
    <div
      className="flex flex-col gap-3 rounded-3xl border border-dashed border-paper-300 bg-paper-50/80 p-6 text-center"
      data-testid="empty-day-state"
    >
      <p className="text-sm text-ink-500">
        No stops planned for this day.
        <br />
        Add your first stop or ask AI to suggest a plan.
      </p>
      {canEdit ? (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            className="inline-flex items-center justify-center rounded-full bg-forest-800 px-4 py-2 text-xs font-extrabold text-white transition hover:bg-forest-700"
            onClick={onAddStop}
            type="button"
          >
            Add stop
          </button>
          <button
            className="inline-flex items-center justify-center rounded-full border border-forest-800/40 bg-paper-50 px-4 py-2 text-xs font-extrabold text-forest-800 transition hover:bg-forest-800/5"
            onClick={onSuggest}
            type="button"
          >
            Suggest with AI
          </button>
        </div>
      ) : null}
    </div>
  );
}

function SelectedStopSummary({
  stop,
  canEdit
}: {
  stop: Stop;
  canEdit: boolean;
}) {
  const backups = listSortedBackups(stop);
  const candidateCount = stop.options.filter(
    (option) =>
      option.status === "candidate" && option.id !== stop.pinnedOptionId
  ).length;

  return (
    <aside
      aria-label="Selected stop summary"
      className="flex flex-col gap-3 rounded-3xl border border-paper-200 bg-paper-50 p-5 shadow-rideflow-chip"
      data-testid="selected-stop-summary"
    >
      <header className="flex flex-col gap-1">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-forest-800">
          Selected stop
        </span>
        <h3 className="text-base font-extrabold text-ink-950">{stop.title}</h3>
      </header>
      <dl className="grid grid-cols-2 gap-3 text-xs">
        <SummaryStat label="Status" value={stop.status === "pinned" ? "Pinned" : "Action needed"} />
        <SummaryStat label="Options" value={`${stop.options.length}`} />
        <SummaryStat label="Candidates" value={`${candidateCount}`} />
        <SummaryStat label="Backups" value={`${backups.length}`} />
      </dl>
      {!canEdit ? (
        <p className="rounded-2xl border border-paper-200 bg-paper-100 px-3 py-2 text-[11px] text-ink-500">
          Read-only view. Owners and Planners can edit planning.
        </p>
      ) : null}
    </aside>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-paper-200 bg-paper-50/80 p-3">
      <dt className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-500">
        {label}
      </dt>
      <dd className="text-sm font-extrabold text-ink-950">{value}</dd>
    </div>
  );
}

export function selectOptionForStop(
  state: StopWorkspaceState,
  stopId: string
): StopOption[] {
  const stop = state.stopsById[stopId];
  return stop?.options ?? [];
}