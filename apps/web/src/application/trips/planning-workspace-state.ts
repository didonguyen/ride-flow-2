import type {
  PlanningAgendaItem,
  PlanningMapPin,
  PlanningTrip
} from "@/src/application/trips/planning-data";

export type PlanningWorkspaceState = {
  tripId: string;
  selectedItemId: string | null;
  selectedItem: PlanningAgendaItem | null;
  agenda: PlanningAgendaItem[];
  mapPins: PlanningMapPin[];
};

type UpdatePlanningAgendaItemInput = {
  itemId: string;
  patch: Partial<
    Pick<
      PlanningAgendaItem,
      "category" | "description" | "imageAlt" | "imageUrl" | "time" | "title"
    >
  >;
};

export function buildPlanningWorkspaceState(
  trip: PlanningTrip
): PlanningWorkspaceState {
  return withSelectedItem({
    tripId: trip.id,
    selectedItemId: trip.agenda[0]?.id ?? null,
    agenda: trip.agenda,
    mapPins: trip.mapPins
  });
}

export function getSelectedPlanningAgendaItem(
  state: Pick<PlanningWorkspaceState, "agenda" | "selectedItemId">
) {
  return (
    state.agenda.find((item) => item.id === state.selectedItemId) ?? null
  );
}

export function updatePlanningAgendaItem(
  state: PlanningWorkspaceState,
  input: UpdatePlanningAgendaItemInput
): PlanningWorkspaceState {
  const agenda = state.agenda.map((item) =>
    item.id === input.itemId
      ? {
          ...item,
          ...input.patch
        }
      : item
  );

  const updatedItem = agenda.find((item) => item.id === input.itemId);
  const mapPins = updatedItem
    ? state.mapPins.map((pin) =>
        pin.stop === updatedItem.stop ? { ...pin, label: updatedItem.title } : pin
      )
    : state.mapPins;

  return withSelectedItem({
    ...state,
    agenda,
    mapPins
  });
}

export function selectPlanningAgendaItem(
  state: PlanningWorkspaceState,
  itemId: string
): PlanningWorkspaceState {
  return withSelectedItem({
    ...state,
    selectedItemId: state.agenda.some((item) => item.id === itemId)
      ? itemId
      : state.selectedItemId
  });
}

export function addPlanningAgendaItem(
  state: PlanningWorkspaceState
): PlanningWorkspaceState {
  const nextStop = state.agenda.length + 1;
  const newItem: PlanningAgendaItem = {
    id: `new-stop-${nextStop}`,
    stop: nextStop,
    time: "8:30 PM",
    title: "New pinned stop",
    description: "Add notes, meeting details, and the place context here.",
    category: "food",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=520&q=85",
    imageAlt: "Warm travel dinner table prepared for a group"
  };

  const newPin: PlanningMapPin = {
    stop: nextStop,
    label: newItem.title,
    x: Math.min(82, 34 + nextStop * 11),
    y: Math.min(82, 28 + nextStop * 12)
  };

  return withSelectedItem({
    ...state,
    selectedItemId: newItem.id,
    agenda: [...state.agenda, newItem],
    mapPins: [...state.mapPins, newPin]
  });
}

export function deletePlanningAgendaItem(
  state: PlanningWorkspaceState,
  itemId: string
): PlanningWorkspaceState {
  const agenda = renumberAgenda(
    state.agenda.filter((item) => item.id !== itemId)
  );
  const mapPins = renumberMapPins(
    state.mapPins.filter((pin) =>
      agenda.some((item) => item.stop === pin.stop || item.title === pin.label)
    ),
    agenda
  );

  return withSelectedItem({
    ...state,
    selectedItemId:
      state.selectedItemId === itemId ? agenda[0]?.id ?? null : state.selectedItemId,
    agenda,
    mapPins
  });
}

function withSelectedItem(
  state: Omit<PlanningWorkspaceState, "selectedItem">
): PlanningWorkspaceState {
  return {
    ...state,
    selectedItem: getSelectedPlanningAgendaItem(state)
  };
}

function renumberAgenda(agenda: PlanningAgendaItem[]) {
  return agenda.map((item, index) => ({
    ...item,
    stop: index + 1
  }));
}

function renumberMapPins(
  pins: PlanningMapPin[],
  agenda: PlanningAgendaItem[]
) {
  return agenda.map((item, index) => {
    const existingPin = pins.find(
      (pin) => pin.label === item.title || pin.stop === item.stop
    );

    return {
      ...(existingPin ?? {
        label: item.title,
        x: Math.min(82, 34 + (index + 1) * 11),
        y: Math.min(82, 28 + (index + 1) * 12)
      }),
      stop: index + 1,
      label: item.title
    };
  });
}
