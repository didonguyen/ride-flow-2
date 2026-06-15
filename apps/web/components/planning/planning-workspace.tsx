"use client";

import { useMemo, useState } from "react";
import { MapPin, Sparkles } from "lucide-react";

import { AiDraftPanel } from "@/components/planning/ai-draft-panel";
import { DraggableTimeline } from "@/components/planning/draggable-timeline";
import { PlaceSearchPanel } from "@/components/planning/place-search-panel";
import { RealtimeStatusPill, useTripRealtime } from "@/components/planning/realtime-status";
import { RouteMapPanel } from "@/components/planning/route-map-panel";
import { SelectedItemInspector } from "@/components/planning/selected-item-inspector";
import type {
  PlanningAgendaItem,
  PlanningTrip
} from "@/src/application/trips/planning-data";
import {
  addPlanningAgendaItem,
  applyAiDraftToAgenda,
  buildPlanningWorkspaceState,
  deletePlanningAgendaItem,
  movePlanningAgendaItem,
  pinPlaceToAgendaItem,
  selectPlanningAgendaItem,
  updatePlanningAgendaItem
} from "@/src/application/trips/planning-workspace-state";
import type { ItineraryDraft } from "@/src/domain/ai-draft";
import type { PlaceSearchResult } from "@/src/domain/places";

type PlanningWorkspaceProps = {
  trip: PlanningTrip;
  tripId: string;
  destination: string;
  startDate: string;
  endDate: string;
};

export function PlanningWorkspace({
  trip,
  tripId,
  destination,
  startDate,
  endDate
}: PlanningWorkspaceProps) {
  const initialState = useMemo(() => buildPlanningWorkspaceState(trip), [trip]);
  const [workspaceState, setWorkspaceState] = useState(initialState);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isAiOpen, setAiOpen] = useState(false);
  const { status: realtimeStatus } = useTripRealtime(tripId);
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

  function handlePinPlace(place: PlaceSearchResult) {
    const targetItemId = workspaceState.selectedItemId;
    if (!targetItemId) {
      return;
    }
    setWorkspaceState((state) =>
      pinPlaceToAgendaItem(state, {
        itemId: targetItemId,
        place: {
          id: place.id,
          source: place.source,
          name: place.name,
          address: place.address,
          lat: place.lat,
          lng: place.lng,
          externalUrl: place.externalUrl,
          imageUrl: place.imageUrl
        }
      })
    );
    setSearchOpen(false);
  }

  function handleMoveItem(input: {
    itemId: string;
    minutesSinceMidnight: number;
  }) {
    setWorkspaceState((state) => movePlanningAgendaItem(state, input));
  }

  function handleApplyAiDraft(input: {
    items: ItineraryDraft["days"][number]["items"];
    mode: "append" | "replace";
  }) {
    setWorkspaceState((state) =>
      applyAiDraftToAgenda(state, {
        items: input.items,
        mode: input.mode
      })
    );
  }

  return (
    <div className="grid min-h-[calc(100vh-17rem)] lg:grid-cols-[minmax(34rem,0.52fr)_minmax(34rem,0.48fr)]">
      <div className="px-5 py-8 sm:px-8 lg:px-9">
        <div className="mb-5 flex flex-wrap items-center justify-start gap-3 pl-14 sm:pl-20 lg:justify-end lg:pl-0">
          <RealtimeStatusPill status={realtimeStatus} />
          <button
            className="inline-flex items-center gap-2 rounded-full border border-[#00565b]/30 bg-white px-4 py-2 text-sm font-extrabold text-[#00565b] transition hover:bg-[#00565b]/5"
            onClick={() => setSearchOpen(true)}
            type="button"
          >
            <MapPin aria-hidden="true" className="h-4 w-4" />
            Find places
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-full border border-[#00565b]/30 bg-white px-4 py-2 text-sm font-extrabold text-[#00565b] transition hover:bg-[#00565b]/5"
            onClick={() => setAiOpen(true)}
            type="button"
          >
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            AI draft
          </button>
          <button
            className="rounded-full bg-[#e8f5f4] px-4 py-2 text-sm font-extrabold text-[#00565b] transition hover:bg-[#d9eeee]"
            onClick={() => setWorkspaceState((state) => addPlanningAgendaItem(state))}
            type="button"
          >
            Add stop
          </button>
        </div>

        <DraggableTimeline
          agenda={workspaceState.agenda}
          onMoveItem={handleMoveItem}
          onSelectItem={(itemId) =>
            setWorkspaceState((state) => selectPlanningAgendaItem(state, itemId))
          }
          selectedItemId={workspaceState.selectedItemId}
        />
      </div>

      <div className="relative hidden lg:block">
        <RouteMapPanel
          onSelectStop={handleSelectStop}
          pins={workspaceState.mapPins}
          selectedStop={selectedStop}
        />
        <div className="absolute right-6 top-6 z-20 w-[23rem]">
          <SelectedItemInspector
            item={workspaceState.selectedItem}
            onAddItem={() =>
              setWorkspaceState((state) => addPlanningAgendaItem(state))
            }
            onClose={() =>
              setWorkspaceState((state) => selectPlanningAgendaItem(state, ""))
            }
            onDeleteItem={(itemId) =>
              setWorkspaceState((state) =>
                deletePlanningAgendaItem(state, itemId)
              )
            }
            onOpenSearch={() => setSearchOpen(true)}
            onUpdateItem={handleUpdateItem}
            variant="desktop"
          />
        </div>
      </div>

      <div
        aria-hidden={workspaceState.selectedItemId === null}
        aria-label="Selected stop details"
        className={[
          "fixed inset-x-0 bottom-0 z-30 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl ring-1 ring-slate-200 transition-transform duration-200 lg:hidden",
          workspaceState.selectedItemId ? "translate-y-0" : "translate-y-full"
        ].join(" ")}
        role="dialog"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
        <SelectedItemInspector
          item={workspaceState.selectedItem}
          onAddItem={() =>
            setWorkspaceState((state) => addPlanningAgendaItem(state))
          }
          onClose={() =>
            setWorkspaceState((state) => selectPlanningAgendaItem(state, ""))
          }
          onDeleteItem={(itemId) => {
            setWorkspaceState((state) =>
              deletePlanningAgendaItem(state, itemId)
            );
            setWorkspaceState((state) =>
              selectPlanningAgendaItem(state, "")
            );
          }}
          onOpenSearch={() => setSearchOpen(true)}
          onUpdateItem={handleUpdateItem}
          variant="mobile"
        />
      </div>

      <PlaceSearchPanel
        hasSelectedItem={workspaceState.selectedItemId !== null}
        onClose={() => setSearchOpen(false)}
        onPin={handlePinPlace}
        open={isSearchOpen}
      />

      <AiDraftPanel
        destination={destination}
        endDate={endDate}
        existingItemCount={workspaceState.agenda.length}
        onApply={handleApplyAiDraft}
        onClose={() => setAiOpen(false)}
        open={isAiOpen}
        startDate={startDate}
        tripId={tripId}
      />
    </div>
  );
}
