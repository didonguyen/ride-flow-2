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

    expect(state.selectedItemId).toBe("dn-d1-stop-1");
    expect(state.selectedItem?.title).toBe("Depart from HCM");
  });

  it("updates the selected agenda item without changing stop order", () => {
    const state = buildPlanningWorkspaceState(trip);
    const nextState = updatePlanningAgendaItem(state, {
      itemId: "dn-d1-stop-1",
      patch: {
        title: "Group meeting in District 1",
        time: "08:00 AM"
      }
    });

    expect(nextState.selectedItem?.title).toBe("Group meeting in District 1");
    expect(nextState.selectedItem?.time).toBe("08:00 AM");
    expect(nextState.agenda[0]?.stop).toBe(1);
  });

  it("adds a new agenda item and selects it", () => {
    const state = buildPlanningWorkspaceState(trip);
    const nextState = addPlanningAgendaItem(state);

    expect(nextState.selectedItemId).toBe("new-stop-20");
    expect(nextState.selectedItem?.stop).toBe(20);
  });

  it("deletes an agenda item and renumbers the agenda", () => {
    const state = buildPlanningWorkspaceState(trip);
    const before = state.agenda.length;
    const nextState = deletePlanningAgendaItem(state, "dn-d1-stop-2");
    expect(nextState.agenda).toHaveLength(before - 1);
  });

  it("pins a place to the selected item and updates the place data", () => {
    const state = buildPlanningWorkspaceState(trip);
    const nextState = pinPlaceToAgendaItem(state, {
      itemId: "dn-d1-stop-1",
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
  });

  it("clears a pinned place from an agenda item", () => {
    const state = buildPlanningWorkspaceState(trip);
    const pinned = pinPlaceToAgendaItem(state, {
      itemId: "dn-d1-stop-1",
      place: {
        id: "seed:danang-golden-bridge",
        source: "seed",
        name: "Golden Bridge"
      }
    });
    const cleared = clearPlaceFromAgendaItem(pinned, "dn-d1-stop-1");

    expect(cleared.selectedItem?.place).toBeUndefined();
  });

  it("appends an AI draft to the existing agenda and renumbers stops", () => {
    const state = buildPlanningWorkspaceState(trip);
    const before = state.agenda.length;
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

    expect(next.agenda).toHaveLength(before + 2);
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
    expect(next.agenda[0]?.title).toBe("Beach afternoon");
  });
});
