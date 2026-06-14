import { describe, expect, it } from "vitest";

import {
  addPlanningAgendaItem,
  applyAiDraftToAgenda,
  buildPlanningWorkspaceState,
  clearPlaceFromAgendaItem,
  deletePlanningAgendaItem,
  pinPlaceToAgendaItem,
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

  it("pins a place to the selected item and updates the map pin label", () => {
    const state = buildPlanningWorkspaceState(trip);
    const nextState = pinPlaceToAgendaItem(state, {
      itemId: "flight-da-nang",
      place: {
        id: "seed:danang-golden-bridge",
        source: "seed",
        name: "Golden Bridge (Cầu Vàng)",
        address: "Bà Nà Hills, Da Nang, Vietnam"
      }
    });

    expect(nextState.selectedItem?.place).toMatchObject({
      id: "seed:danang-golden-bridge",
      source: "seed",
      name: "Golden Bridge (Cầu Vàng)"
    });
    expect(nextState.selectedItem?.title).toBe("Golden Bridge (Cầu Vàng)");
    expect(nextState.mapPins[0]?.label).toBe("Golden Bridge (Cầu Vàng)");
  });

  it("clears a pinned place from an agenda item", () => {
    const state = buildPlanningWorkspaceState(trip);
    const pinned = pinPlaceToAgendaItem(state, {
      itemId: "flight-da-nang",
      place: {
        id: "seed:danang-golden-bridge",
        source: "seed",
        name: "Golden Bridge"
      }
    });
    const cleared = clearPlaceFromAgendaItem(pinned, "flight-da-nang");

    expect(cleared.selectedItem?.place).toBeUndefined();
  });

  it("appends an AI draft to the existing agenda and renumbers stops", () => {
    const state = buildPlanningWorkspaceState(trip);
    const next = applyAiDraftToAgenda(state, {
      mode: "append",
      items: [
        {
          startTime: "10:00",
          durationMinutes: 60,
          title: "Coffee in Hoi An",
          notes: "Try the egg coffee",
          suggestedPlaceName: "Hoi An Roastery"
        },
        {
          startTime: "13:00",
          durationMinutes: 120,
          title: "Lantern making",
          suggestedPlaceName: "Hoi An Old Town"
        }
      ]
    });

    expect(next.agenda).toHaveLength(5);
    expect(next.agenda.map((item) => item.stop)).toEqual([1, 2, 3, 4, 5]);
    expect(next.agenda.at(-1)?.title).toBe("Lantern making");
    expect(next.agenda.at(-1)?.place?.name).toBe("Hoi An Old Town");
  });

  it("replaces the existing agenda when mode is replace", () => {
    const state = buildPlanningWorkspaceState(trip);
    const next = applyAiDraftToAgenda(state, {
      mode: "replace",
      items: [
        {
          startTime: "11:00",
          durationMinutes: 90,
          title: "Beach afternoon"
        }
      ]
    });

    expect(next.agenda).toHaveLength(1);
    expect(next.agenda[0].title).toBe("Beach afternoon");
  });
});
