import { describe, expect, it } from "vitest";
import {
  buildPlanningWorkspaceState,
  movePlanningAgendaItem
} from "@/src/application/trips/planning-workspace-state";
import type { PlanningTrip } from "@/src/application/trips/planning-data";

function makeTrip(agenda: Array<{ id: string; time: string; title: string }>): PlanningTrip {
  return {
    id: "trip-1",
    name: "Test Trip",
    dateRange: "Jan 1 - Jan 2, 2026",
    selectedDayId: "day-1",
    days: [],
    agenda: agenda.map((item, index) => ({
      id: item.id,
      stop: index + 1,
      time: item.time,
      title: item.title,
      description: "",
      category: "food" as const,
      imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      imageAlt: item.title
    })),
    mapPins: []
  };
}

describe("timeline view", () => {
  it("builds the workspace state in source order from the planning trip", () => {
    const trip = makeTrip([
      { id: "a", time: "10:00 AM", title: "Coffee" },
      { id: "b", time: "12:00 PM", title: "Lunch" },
      { id: "c", time: "3:00 PM", title: "Tour" }
    ]);

    const state = buildPlanningWorkspaceState(trip);

    expect(state.agenda.map((item) => item.id)).toEqual(["a", "b", "c"]);
    expect(state.agenda.map((item) => item.stop)).toEqual([1, 2, 3]);
  });

  it("re-sorts the agenda and renumbers stops after a move", () => {
    const trip = makeTrip([
      { id: "a", time: "10:00 AM", title: "Coffee" },
      { id: "b", time: "12:00 PM", title: "Lunch" },
      { id: "c", time: "3:00 PM", title: "Tour" }
    ]);

    const state = buildPlanningWorkspaceState(trip);
    const moved = movePlanningAgendaItem(state, {
      itemId: "a",
      minutesSinceMidnight: 16 * 60 + 30
    });

    expect(moved.agenda.map((item) => item.id)).toEqual(["b", "c", "a"]);
    expect(moved.agenda.map((item) => item.time)).toEqual([
      "12:00 PM",
      "3:00 PM",
      "4:30 PM"
    ]);
    expect(moved.agenda.map((item) => item.stop)).toEqual([1, 2, 3]);
  });

  it("is a no-op when the item is not in the agenda", () => {
    const trip = makeTrip([
      { id: "a", time: "10:00 AM", title: "Coffee" }
    ]);
    const state = buildPlanningWorkspaceState(trip);

    const result = movePlanningAgendaItem(state, {
      itemId: "missing",
      minutesSinceMidnight: 8 * 60
    });

    expect(result).toBe(state);
  });

  it("is a no-op when the new time matches the current time", () => {
    const trip = makeTrip([
      { id: "a", time: "10:00 AM", title: "Coffee" }
    ]);
    const state = buildPlanningWorkspaceState(trip);

    const result = movePlanningAgendaItem(state, {
      itemId: "a",
      minutesSinceMidnight: 10 * 60
    });

    expect(result).toBe(state);
  });
});
