import {
  applyPin,
  applyUnpin,
  getBackupOptions,
  sortBackupOptions,
  type Stop,
  type StopOption
} from "@/src/domain/stop-options";

export type StopWorkspaceState = {
  tripId: string;
  stopsById: Record<string, Stop>;
  stopOrderByDay: Record<string, string[]>;
  selectedStopId: string | null;
};

export function buildStopWorkspaceState(input: {
  tripId: string;
  stops: Stop[];
}): StopWorkspaceState {
  const stopsById: Record<string, Stop> = {};
  const stopOrderByDay: Record<string, string[]> = {};

  for (const stop of input.stops) {
    stopsById[stop.id] = stop;
    const dayList = stopOrderByDay[stop.dayId] ?? [];
    dayList.push(stop.id);
    stopOrderByDay[stop.dayId] = dayList;
  }

  for (const dayId of Object.keys(stopOrderByDay)) {
    const list = stopOrderByDay[dayId] ?? [];
    list.sort(
      (a, b) =>
        (stopsById[a]?.sortOrder ?? 0) - (stopsById[b]?.sortOrder ?? 0)
    );
  }

  return {
    tripId: input.tripId,
    stopsById,
    stopOrderByDay,
    selectedStopId: input.stops[0]?.id ?? null
  };
}

export function selectStop(
  state: StopWorkspaceState,
  stopId: string | null
): StopWorkspaceState {
  return { ...state, selectedStopId: stopId };
}

export function getSelectedStop(state: StopWorkspaceState): Stop | null {
  if (!state.selectedStopId) return null;
  return state.stopsById[state.selectedStopId] ?? null;
}

export function getStopsForDay(
  state: StopWorkspaceState,
  dayId: string
): Stop[] {
  const ids = state.stopOrderByDay[dayId] ?? [];
  return ids
    .map((id) => state.stopsById[id])
    .filter((stop): stop is Stop => Boolean(stop));
}

export function upsertStop(
  state: StopWorkspaceState,
  stop: Stop
): StopWorkspaceState {
  const dayList = state.stopOrderByDay[stop.dayId] ?? [];
  if (!dayList.includes(stop.id)) {
    dayList.push(stop.id);
  }

  return {
    ...state,
    stopsById: { ...state.stopsById, [stop.id]: stop },
    stopOrderByDay: { ...state.stopOrderByDay, [stop.dayId]: dayList }
  };
}

export function removeStop(
  state: StopWorkspaceState,
  stopId: string
): StopWorkspaceState {
  const stop = state.stopsById[stopId];
  if (!stop) return state;

  const { [stopId]: _removed, ...remainingStops } = state.stopsById;
  const dayList = (state.stopOrderByDay[stop.dayId] ?? []).filter(
    (id) => id !== stopId
  );

  return {
    ...state,
    stopsById: remainingStops,
    stopOrderByDay: { ...state.stopOrderByDay, [stop.dayId]: dayList },
    selectedStopId:
      state.selectedStopId === stopId ? null : state.selectedStopId
  };
}

export type ReorderMoves = Array<{
  stopId: string;
  dayId: string;
  sortOrder: number;
}>;

export function reorderStops(
  state: StopWorkspaceState,
  moves: ReorderMoves
): StopWorkspaceState {
  const nextStopsById = { ...state.stopsById };
  const nextOrderByDay = { ...state.stopOrderByDay };
  const affectedDays = new Set<string>();

  for (const move of moves) {
    const stop = nextStopsById[move.stopId];
    if (!stop) continue;

    if (stop.dayId !== move.dayId) {
      const oldList = (nextOrderByDay[stop.dayId] ?? []).filter(
        (id) => id !== move.stopId
      );
      nextOrderByDay[stop.dayId] = oldList;
      const newList = [...(nextOrderByDay[move.dayId] ?? []), move.stopId];
      nextOrderByDay[move.dayId] = newList;
      affectedDays.add(stop.dayId);
    }

    nextStopsById[move.stopId] = {
      ...stop,
      dayId: move.dayId,
      sortOrder: move.sortOrder
    };
    affectedDays.add(move.dayId);
  }

  for (const dayId of affectedDays) {
    const list = nextOrderByDay[dayId] ?? [];
    list.sort(
      (a, b) =>
        (nextStopsById[a]?.sortOrder ?? 0) -
        (nextStopsById[b]?.sortOrder ?? 0)
    );
    nextOrderByDay[dayId] = list;
    list.forEach((id, index) => {
      const stop = nextStopsById[id];
      if (stop && stop.sortOrder !== index) {
        nextStopsById[id] = { ...stop, sortOrder: index };
      }
    });
  }

  return {
    ...state,
    stopsById: nextStopsById,
    stopOrderByDay: nextOrderByDay
  };
}

export type PinReducerResult = {
  state: StopWorkspaceState;
  pinnedOptionId: string | null;
  options: StopOption[];
};

export function applyPinReducer(
  state: StopWorkspaceState,
  stopId: string,
  optionId: string
): PinReducerResult | null {
  const stop = state.stopsById[stopId];
  if (!stop) return null;

  const updated = applyPin(stop.options, optionId);
  const nextStop: Stop = {
    ...stop,
    status: "pinned",
    pinnedOptionId: optionId,
    options: updated
  };

  return {
    state: upsertStop(state, nextStop),
    pinnedOptionId: optionId,
    options: updated
  };
}

export function applyUnpinReducer(
  state: StopWorkspaceState,
  stopId: string
): PinReducerResult | null {
  const stop = state.stopsById[stopId];
  if (!stop) return null;

  const updated = applyUnpin(stop.options);
  const nextStop: Stop = {
    ...stop,
    status: "action_needed",
    pinnedOptionId: null,
    options: updated
  };

  return {
    state: upsertStop(state, nextStop),
    pinnedOptionId: null,
    options: updated
  };
}

export function listSortedBackups(
  stop: Stop,
  manualOrder?: string[]
): StopOption[] {
  const backups = getBackupOptions(stop);

  if (manualOrder && manualOrder.length > 0) {
    const index = new Map(manualOrder.map((id, idx) => [id, idx]));
    return [...backups].sort((left, right) => {
      const leftIdx = index.has(left.id) ? (index.get(left.id) as number) : Number.MAX_SAFE_INTEGER;
      const rightIdx = index.has(right.id) ? (index.get(right.id) as number) : Number.MAX_SAFE_INTEGER;
      if (leftIdx !== rightIdx) {
        return leftIdx - rightIdx;
      }
      return 0;
    });
  }

  return sortBackupOptions(backups);
}