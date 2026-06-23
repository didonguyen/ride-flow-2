import { describe, expect, it } from "vitest";

import type { Stop, StopOption } from "@/src/domain/stop-options";
import {
  applyPinReducer,
  applyUnpinReducer,
  buildStopWorkspaceState,
  getSelectedStop,
  getStopsForDay,
  listSortedBackups,
  removeStop,
  reorderStops,
  selectStop,
  upsertStop
} from "@/src/application/stop-options/workspace-state";

const option = (overrides: Partial<StopOption>): StopOption => ({
  id: overrides.id ?? "opt",
  stopId: overrides.stopId ?? "stop-1",
  tripId: overrides.tripId ?? "trip-1",
  name: overrides.name ?? "Forest Cafe",
  source: overrides.source ?? "manual",
  status: overrides.status ?? "candidate",
  sortOrder: overrides.sortOrder ?? 0,
  rating: overrides.rating
});

const stop = (overrides: Partial<Stop>): Stop => ({
  id: overrides.id ?? "stop-1",
  tripId: overrides.tripId ?? "trip-1",
  dayId: overrides.dayId ?? "day-1",
  title: overrides.title ?? "Lunch",
  status: overrides.status ?? "action_needed",
  pinnedOptionId: overrides.pinnedOptionId ?? null,
  sortOrder: overrides.sortOrder ?? 0,
  options: overrides.options ?? []
});

describe("buildStopWorkspaceState", () => {
  it("indexes stops by id and by day", () => {
    const stops: Stop[] = [
      stop({ id: "s1", dayId: "d1", sortOrder: 0 }),
      stop({ id: "s2", dayId: "d1", sortOrder: 1 }),
      stop({ id: "s3", dayId: "d2", sortOrder: 0 })
    ];
    const state = buildStopWorkspaceState({ tripId: "trip-1", stops });

    expect(Object.keys(state.stopsById).sort()).toEqual(["s1", "s2", "s3"]);
    expect(state.stopOrderByDay["d1"]).toEqual(["s1", "s2"]);
    expect(state.stopOrderByDay["d2"]).toEqual(["s3"]);
    expect(state.selectedStopId).toBe("s1");
  });
});

describe("selectStop / getSelectedStop", () => {
  it("selects and reads the active stop", () => {
    const state = buildStopWorkspaceState({
      tripId: "trip-1",
      stops: [stop({ id: "s1" }), stop({ id: "s2" })]
    });
    const next = selectStop(state, "s2");
    expect(next.selectedStopId).toBe("s2");
    expect(getSelectedStop(next)?.id).toBe("s2");
  });
});

describe("getStopsForDay", () => {
  it("returns sorted stops for the day", () => {
    const state = buildStopWorkspaceState({
      tripId: "trip-1",
      stops: [
        stop({ id: "s1", dayId: "d1", sortOrder: 1 }),
        stop({ id: "s2", dayId: "d1", sortOrder: 0 })
      ]
    });
    const list = getStopsForDay(state, "d1");
    expect(list.map((s) => s.id)).toEqual(["s2", "s1"]);
  });
});

describe("upsertStop / removeStop", () => {
  it("inserts new stops", () => {
    const initial = buildStopWorkspaceState({ tripId: "trip-1", stops: [] });
    const next = upsertStop(initial, stop({ id: "s1", dayId: "d1" }));
    expect(next.stopsById["s1"]).toBeDefined();
    expect(next.stopOrderByDay["d1"]).toEqual(["s1"]);
  });

  it("removes stops and clears the selection if needed", () => {
    const initial = buildStopWorkspaceState({
      tripId: "trip-1",
      stops: [stop({ id: "s1" })]
    });
    const next = removeStop(initial, "s1");
    expect(next.stopsById["s1"]).toBeUndefined();
    expect(next.selectedStopId).toBeNull();
  });
});

describe("reorderStops", () => {
  it("moves a stop to another day", () => {
    const state = buildStopWorkspaceState({
      tripId: "trip-1",
      stops: [
        stop({ id: "s1", dayId: "d1", sortOrder: 0 }),
        stop({ id: "s2", dayId: "d2", sortOrder: 0 })
      ]
    });
    const next = reorderStops(state, [
      { stopId: "s1", dayId: "d2", sortOrder: 1 }
    ]);
    expect(next.stopOrderByDay["d1"]).toEqual([]);
    expect(next.stopOrderByDay["d2"]).toEqual(["s2", "s1"]);
    expect(next.stopsById["s1"]?.dayId).toBe("d2");
  });

  it("reorders within the same day", () => {
    const state = buildStopWorkspaceState({
      tripId: "trip-1",
      stops: [
        stop({ id: "s1", dayId: "d1", sortOrder: 0 }),
        stop({ id: "s2", dayId: "d1", sortOrder: 1 }),
        stop({ id: "s3", dayId: "d1", sortOrder: 2 })
      ]
    });
    const next = reorderStops(state, [
      { stopId: "s3", dayId: "d1", sortOrder: 0 },
      { stopId: "s1", dayId: "d1", sortOrder: 1 }
    ]);
    expect(next.stopOrderByDay["d1"]).toEqual(["s3", "s1", "s2"]);
    expect(next.stopsById["s3"]?.sortOrder).toBe(0);
    expect(next.stopsById["s1"]?.sortOrder).toBe(1);
  });
});

describe("applyPinReducer / applyUnpinReducer", () => {
  const baseStop = stop({
    id: "s1",
    options: [
      option({ id: "a", status: "candidate" }),
      option({ id: "b", status: "candidate" })
    ]
  });
  const initial = buildStopWorkspaceState({
    tripId: "trip-1",
    stops: [baseStop]
  });

  it("pins an option and updates the stop status", () => {
    const result = applyPinReducer(initial, "s1", "b");
    expect(result).not.toBeNull();
    const stopAfter = result?.state.stopsById["s1"];
    expect(stopAfter?.status).toBe("pinned");
    expect(stopAfter?.pinnedOptionId).toBe("b");
    expect(stopAfter?.options.find((o) => o.id === "a")?.status).toBe("backup");
  });

  it("unpins and resets status", () => {
    const pinned = applyPinReducer(initial, "s1", "b");
    expect(pinned).not.toBeNull();
    const result = applyUnpinReducer(pinned!.state, "s1");
    expect(result?.state.stopsById["s1"]?.status).toBe("action_needed");
    expect(result?.state.stopsById["s1"]?.pinnedOptionId).toBeNull();
  });
});

describe("listSortedBackups", () => {
  it("respects the manual order", () => {
    const stopWithOptions = stop({
      options: [
        option({ id: "x", status: "backup" }),
        option({ id: "y", status: "backup" }),
        option({ id: "z", status: "backup" })
      ]
    });
    const sorted = listSortedBackups(stopWithOptions, ["z", "x", "y"]);
    expect(sorted.map((o) => o.id)).toEqual(["z", "x", "y"]);
  });

  it("falls back to rating and sort order", () => {
    const stopWithOptions = stop({
      status: "pinned",
      pinnedOptionId: "pinned",
      options: [
        option({ id: "pinned", status: "pinned", rating: 5 }),
        option({ id: "x", status: "backup", rating: 3, sortOrder: 0 }),
        option({ id: "y", status: "backup", rating: 4.5, sortOrder: 1 }),
        option({ id: "z", status: "backup", rating: 4.5, sortOrder: 0 })
      ]
    });
    const sorted = listSortedBackups(stopWithOptions);
    expect(sorted.map((o) => o.id)).toEqual(["z", "y", "x"]);
  });
});