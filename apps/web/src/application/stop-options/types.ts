import type { TripRole } from "@/src/domain/permissions";
import type {
  Stop,
  StopDraft,
  StopOption,
  StopOptionDraft,
  StopOptionSource,
  StopOptionStatus
} from "@/src/domain/stop-options";

export type StopMutationError =
  | "stop_mutation_forbidden"
  | "stop_not_found"
  | "option_not_found"
  | "stop_day_not_found";

export type OptionMutationError =
  | "stop_mutation_forbidden"
  | "stop_not_found"
  | "option_not_found";

export type AddStopInput = {
  actorRole: TripRole;
  tripId: string;
  dayId: string;
  draft: StopDraft;
  createdBy?: string;
};

export type UpdateStopInput = {
  actorRole: TripRole;
  stopId: string;
  patch: Partial<StopDraft>;
};

export type DeleteStopInput = {
  actorRole: TripRole;
  stopId: string;
};

export type ReorderStopsInput = {
  actorRole: TripRole;
  moves: Array<{ stopId: string; dayId: string; sortOrder: number }>;
};

export type PinOptionInput = {
  actorRole: TripRole;
  stopId: string;
  optionId: string;
};

export type UnpinOptionInput = {
  actorRole: TripRole;
  stopId: string;
};

export type AddOptionInput = {
  actorRole: TripRole;
  stopId: string;
  tripId: string;
  draft: StopOptionDraft;
};

export type SearchGooglePlacesInput = {
  actorRole: TripRole;
  stopId: string;
  tripId: string;
  query: string;
  results: StopOptionDraft[];
};

export type GenerateAiOptionsInput = {
  actorRole: TripRole;
  stopId: string;
  tripId: string;
  stopTitle: string;
  destination: string;
  results: StopOptionDraft[];
};

export type RemoveOptionInput = {
  actorRole: TripRole;
  stopId: string;
  optionId: string;
};

export type StopRecord = Stop;
export type StopOptionRecord = StopOption;

export type StopId = { id: string };
export type StopOptionId = { id: string };

export type StopRepository = {
  addStop(input: {
    tripId: string;
    dayId: string;
    draft: StopDraft;
    sortOrder: number;
    createdBy?: string;
  }): Promise<StopId>;
  updateStop(input: { stopId: string; patch: Partial<StopDraft> }): Promise<StopId>;
  deleteStop(input: { stopId: string }): Promise<StopId>;
  reorderStops(input: {
    moves: Array<{ stopId: string; dayId: string; sortOrder: number }>;
  }): Promise<{ stopIds: string[] }>;
};

export type StopOptionRepository = {
  addOption(input: {
    stopId: string;
    tripId: string;
    draft: StopOptionDraft;
    status: StopOptionStatus;
    source: StopOptionSource;
  }): Promise<StopOptionId>;
  updateOptionStatus(input: {
    stopId: string;
    optionId: string;
    status: StopOptionStatus;
  }): Promise<StopOptionId>;
  updateStopPinned(input: {
    stopId: string;
    pinnedOptionId: string | null;
    status: "action_needed" | "pinned";
  }): Promise<StopId>;
  listOptionsForStop(input: { stopId: string }): Promise<StopOption[]>;
  listOptionsForStops(input: { stopIds: ReadonlyArray<string> }): Promise<StopOption[]>;
  removeOption(input: { stopId: string; optionId: string }): Promise<StopOptionId>;
};

export type StopOptionProvider = {
  searchGooglePlaces(input: {
    query: string;
    near: { lat?: number | null; lng?: number | null };
  }): Promise<StopOptionDraft[]>;
};

export type StopOptionAiGenerator = {
  generateOptions(input: {
    stopTitle: string;
    destination: string;
  }): Promise<StopOptionDraft[]>;
};