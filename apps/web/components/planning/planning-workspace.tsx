"use client";

import { useMemo, useState } from "react";

import { ItineraryTimeline } from "@/components/planning/itinerary-timeline";
import { RouteMapPanel } from "@/components/planning/route-map-panel";
import { SelectedItemInspector } from "@/components/planning/selected-item-inspector";
import type {
  PlanningAgendaItem,
  PlanningTrip
} from "@/src/application/trips/planning-data";
import {
  addPlanningAgendaItem,
  buildPlanningWorkspaceState,
  deletePlanningAgendaItem,
  selectPlanningAgendaItem,
  updatePlanningAgendaItem
} from "@/src/application/trips/planning-workspace-state";

type PlanningWorkspaceProps = {
  trip: PlanningTrip;
};

export function PlanningWorkspace({ trip }: PlanningWorkspaceProps) {
  const initialState = useMemo(() => buildPlanningWorkspaceState(trip), [trip]);
  const [workspaceState, setWorkspaceState] = useState(initialState);
  const selectedStop = workspaceState.selectedItem?.stop ?? null;

  function handleSelectStop(stop: number) {
    const item = workspaceState.agenda.find((agendaItem) => agendaItem.stop === stop);

    if (item) {
      setWorkspaceState((state) => selectPlanningAgendaItem(state, item.id));
    }
  }

  function handleUpdateItem(
    itemId: string,
    patch: Partial<
      Pick<
        PlanningAgendaItem,
        "category" | "description" | "time" | "title"
      >
    >
  ) {
    setWorkspaceState((state) =>
      updatePlanningAgendaItem(state, {
        itemId,
        patch
      })
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-17rem)] lg:grid-cols-[minmax(34rem,0.52fr)_minmax(34rem,0.48fr)]">
      <div className="px-5 py-8 sm:px-8 lg:px-9">
        <div className="mb-5 flex justify-start pl-14 sm:pl-20 lg:justify-end lg:pl-0">
          <button
            className="rounded-full bg-[#e8f5f4] px-4 py-2 text-sm font-extrabold text-[#00565b] transition hover:bg-[#d9eeee]"
            onClick={() => setWorkspaceState((state) => addPlanningAgendaItem(state))}
            type="button"
          >
            Add stop
          </button>
        </div>

        <ItineraryTimeline
          agenda={workspaceState.agenda}
          onSelectItem={(itemId) =>
            setWorkspaceState((state) => selectPlanningAgendaItem(state, itemId))
          }
          selectedItemId={workspaceState.selectedItemId}
        />
      </div>

      <div className="relative">
        <RouteMapPanel
          onSelectStop={handleSelectStop}
          pins={workspaceState.mapPins}
          selectedStop={selectedStop}
        />
        <div className="relative z-20 mx-5 -mt-16 mb-8 lg:absolute lg:right-6 lg:top-6 lg:m-0 lg:w-[23rem]">
          <SelectedItemInspector
            item={workspaceState.selectedItem}
            onAddItem={() =>
              setWorkspaceState((state) => addPlanningAgendaItem(state))
            }
            onDeleteItem={(itemId) =>
              setWorkspaceState((state) =>
                deletePlanningAgendaItem(state, itemId)
              )
            }
            onUpdateItem={handleUpdateItem}
          />
        </div>
      </div>
    </div>
  );
}
