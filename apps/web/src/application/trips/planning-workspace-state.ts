import type {
  PlanningAgendaItem,
  PlanningMapPin,
  PlanningTrip
} from "@/src/application/trips/planning-data";
import {
  minutesToTime,
  timeToMinutes
} from "@/src/domain/timeline";

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

type PinPlaceInput = {
  itemId: string;
  place: NonNullable<PlanningAgendaItem["place"]>;
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

export function movePlanningAgendaItem(
  state: PlanningWorkspaceState,
  input: { itemId: string; minutesSinceMidnight: number }
): PlanningWorkspaceState {
  const targetIndex = state.agenda.findIndex((item) => item.id === input.itemId);
  if (targetIndex < 0) {
    return state;
  }

  const target = state.agenda[targetIndex];
  const currentMinutes = agendaTimeMinutes(target);
  if (currentMinutes === input.minutesSinceMidnight) {
    return state;
  }

  const newTime = formatTimeLabel(minutesToTime(input.minutesSinceMidnight));
  const withMovedTime = state.agenda.map((item, index) =>
    index === targetIndex ? { ...item, time: newTime } : item
  );
  const sorted = [...withMovedTime].sort(
    (a, b) => agendaTimeMinutes(a) - agendaTimeMinutes(b)
  );
  const renumbered = renumberAgenda(sorted);

  return withSelectedItem({
    ...state,
    agenda: renumbered
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

export function pinPlaceToAgendaItem(
  state: PlanningWorkspaceState,
  input: PinPlaceInput
): PlanningWorkspaceState {
  const agenda = state.agenda.map((item) =>
    item.id === input.itemId
      ? {
          ...item,
          place: input.place,
          title: input.place.name,
          imageUrl: input.place.imageUrl ?? item.imageUrl,
          imageAlt: input.place.name
        }
      : item
  );

  const updatedItem = agenda.find((item) => item.id === input.itemId);
  const mapPins = updatedItem
    ? state.mapPins.map((pin) =>
        pin.stop === updatedItem.stop
          ? { ...pin, label: updatedItem.title }
          : pin
      )
    : state.mapPins;

  return withSelectedItem({
    ...state,
    agenda,
    mapPins
  });
}

export function clearPlaceFromAgendaItem(
  state: PlanningWorkspaceState,
  itemId: string
): PlanningWorkspaceState {
  const agenda = state.agenda.map((item) =>
    item.id === itemId ? { ...item, place: undefined } : item
  );

  return withSelectedItem({ ...state, agenda });
}

export type ApplyAiDraftMode = "append" | "replace";

type ApplyAiDraftInput = {
  mode: ApplyAiDraftMode;
  items: Array<{
    startTime: string;
    durationMinutes: number;
    title: string;
    notes?: string;
    suggestedPlaceName?: string;
  }>;
};

function toAgendaItem(
  draftItem: ApplyAiDraftInput["items"][number],
  index: number,
  baseId: string
): PlanningAgendaItem {
  const startTime = formatTimeLabel(draftItem.startTime);
  return {
    id: `${baseId}-${index}`,
    stop: 0,
    time: startTime,
    title: draftItem.title,
    description: draftItem.notes ?? "",
    category: "food",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=520&q=85",
    imageAlt: draftItem.title,
    place: draftItem.suggestedPlaceName
      ? {
          id: `draft:${slugify(draftItem.suggestedPlaceName)}`,
          source: "manual",
          name: draftItem.suggestedPlaceName
        }
      : undefined
  };
}

function formatTimeLabel(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  const hourNumber = Number(hours);
  const minuteNumber = Number(minutes);
  const period = hourNumber >= 12 ? "PM" : "AM";
  const displayHour = ((hourNumber + 11) % 12) + 1;
  const displayMinute = minuteNumber.toString().padStart(2, "0");
  return `${displayHour}:${displayMinute} ${period}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "place";
}

function agendaTimeMinutes(item: PlanningAgendaItem): number {
  const parsed = timeToMinutes(to24HourAgendaTime(item.time));
  return parsed ?? 0;
}

function to24HourAgendaTime(label: string): string {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(label.trim());
  if (!match) {
    return label;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  let hour24 = hours % 12;
  if (meridiem === "PM") {
    hour24 += 12;
  }
  return `${hour24.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function applyAiDraftToAgenda(
  state: PlanningWorkspaceState,
  input: ApplyAiDraftInput
): PlanningWorkspaceState {
  const baseId = `ai-${Date.now().toString(36)}`;
  const baseAgenda =
    input.mode === "replace" ? [] : state.agenda;

  const draftItems = input.items.map((item, index) =>
    toAgendaItem(item, index, baseId)
  );

  const merged = renumberAgenda([...baseAgenda, ...draftItems]);

  const mapPins = merged.map((item, index) => ({
    stop: index + 1,
    label: item.title,
    x: Math.min(82, 34 + (index + 1) * 11),
    y: Math.min(82, 28 + (index + 1) * 12)
  }));

  return withSelectedItem({
    ...state,
    agenda: merged,
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
