import { describe, expect, it } from "vitest";

import {
  addPlanningAgendaItem,
  buildPlanningWorkspaceState,
  deletePlanningAgendaItem,
  updatePlanningAgendaItem
} from "@/src/application/trips/planning-workspace-state";
import { getPlanningTripById } from "@/src/application/trips/planning-data";

const trip = getPlanningTripById("da-nang");

if (!trip) {
  throw new Error("Expected Da Nang planning trip seed data");
}

describe("planning workspace state", () => {
  it("selects the first agenda item by default", () => {
    const state = buildPlanningWorkspaceState(trip);

    expect(state.selectedItemId).toBe("flight-da-nang");
    expect(state.selectedItem?.title).toBe("Flight to Da Nang");
  });

  it("updates the selected agenda item without changing stop order", () => {
    const state = buildPlanningWorkspaceState(trip);
    const nextState = updatePlanningAgendaItem(state, {
      itemId: "flight-da-nang",
      patch: {
        title: "Airport arrival and van pickup",
        time: "11:00 AM"
      }
    });

    expect(nextState.selectedItem?.title).toBe("Airport arrival and van pickup");
    expect(nextState.selectedItem?.time).toBe("11:00 AM");
    expect(nextState.agenda.map((item) => item.stop)).toEqual([1, 2, 3]);
  });

  it("adds a new agenda item and selects it", () => {
    const state = buildPlanningWorkspaceState(trip);
    const nextState = addPlanningAgendaItem(state);

    expect(nextState.selectedItemId).toBe("new-stop-4");
    expect(nextState.selectedItem?.stop).toBe(4);
    expect(nextState.mapPins.at(-1)).toMatchObject({
      stop: 4,
      label: "New pinned stop"
    });
  });

  it("deletes an agenda item and renumbers agenda plus map pins", () => {
    const state = buildPlanningWorkspaceState(trip);
    const nextState = deletePlanningAgendaItem(state, "hotel-riverside");

    expect(nextState.agenda.map((item) => item.stop)).toEqual([1, 2]);
    expect(nextState.mapPins.map((pin) => pin.stop)).toEqual([1, 2]);
    expect(nextState.selectedItemId).toBe("flight-da-nang");
  });
});
