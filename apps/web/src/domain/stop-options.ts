import { err, ok, type Result } from "@/src/lib/result";

export const stopStatuses = ["action_needed", "pinned"] as const;
export type StopStatus = (typeof stopStatuses)[number];

export const stopOptionStatuses = ["candidate", "pinned", "backup", "removed"] as const;
export type StopOptionStatus = (typeof stopOptionStatuses)[number];

export const stopOptionSources = ["ai", "google_places", "manual"] as const;
export type StopOptionSource = (typeof stopOptionSources)[number];

export type StopDraft = {
  title: string;
  time?: string;
  description?: string;
  note?: string;
  locationName?: string;
  address?: string;
  lat?: number | null;
  lng?: number | null;
};

export type StopOptionDraft = {
  name: string;
  address?: string;
  description?: string;
  imageUrl?: string;
  rating?: number | null;
  distanceText?: string;
  durationText?: string;
  googlePlaceId?: string;
  googleMapsUrl?: string;
  lat?: number | null;
  lng?: number | null;
  source: StopOptionSource;
};

export type StopValidationError =
  | "stop_title_required"
  | "stop_time_invalid"
  | "stop_location_required";

export type StopOptionValidationError =
  | "option_name_required"
  | "option_rating_invalid"
  | "option_source_invalid";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export function validateStopDraft(
  draft: StopDraft
): Result<StopDraft, StopValidationError> {
  const title = draft.title.trim();
  if (!title) {
    return err("stop_title_required");
  }

  if (draft.time !== undefined && draft.time !== "") {
    if (!timePattern.test(draft.time)) {
      return err("stop_time_invalid");
    }
  }

  const locationName = draft.locationName?.trim() ?? "";
  const address = draft.address?.trim() ?? "";

  return ok({
    title,
    time: draft.time?.trim() || undefined,
    description: draft.description?.trim() ?? "",
    note: draft.note?.trim() ?? "",
    locationName: locationName || undefined,
    address: address || undefined,
    lat: draft.lat ?? null,
    lng: draft.lng ?? null
  }) as Result<StopDraft, StopValidationError>;
}

export function validateStopOptionDraft(
  draft: StopOptionDraft
): Result<StopOptionDraft, StopOptionValidationError> {
  const name = draft.name.trim();
  if (!name) {
    return err("option_name_required");
  }

  if (!stopOptionSources.includes(draft.source)) {
    return err("option_source_invalid");
  }

  if (draft.rating !== undefined && draft.rating !== null) {
    if (!Number.isFinite(draft.rating) || draft.rating < 0 || draft.rating > 5) {
      return err("option_rating_invalid");
    }
  }

  return ok({
    name,
    address: draft.address?.trim() || undefined,
    description: draft.description?.trim() || undefined,
    imageUrl: draft.imageUrl?.trim() || undefined,
    rating: draft.rating ?? null,
    distanceText: draft.distanceText?.trim() || undefined,
    durationText: draft.durationText?.trim() || undefined,
    googlePlaceId: draft.googlePlaceId?.trim() || undefined,
    googleMapsUrl: draft.googleMapsUrl?.trim() || undefined,
    lat: draft.lat ?? null,
    lng: draft.lng ?? null,
    source: draft.source
  }) as Result<StopOptionDraft, StopOptionValidationError>;
}

export function isStopStatus(value: unknown): value is StopStatus {
  return (
    typeof value === "string" &&
    (stopStatuses as readonly string[]).includes(value)
  );
}

export function isStopOptionStatus(value: unknown): value is StopOptionStatus {
  return (
    typeof value === "string" &&
    (stopOptionStatuses as readonly string[]).includes(value)
  );
}

export function isStopOptionSource(value: unknown): value is StopOptionSource {
  return (
    typeof value === "string" &&
    (stopOptionSources as readonly string[]).includes(value)
  );
}

export type StopOption = {
  id: string;
  stopId: string;
  tripId: string;
  name: string;
  address?: string;
  description?: string;
  imageUrl?: string;
  rating?: number | null;
  distanceText?: string;
  durationText?: string;
  googlePlaceId?: string;
  googleMapsUrl?: string;
  lat?: number | null;
  lng?: number | null;
  source: StopOptionSource;
  status: StopOptionStatus;
  sortOrder: number;
};

export type Stop = {
  id: string;
  tripId: string;
  dayId: string;
  title: string;
  time?: string;
  description?: string;
  note?: string;
  locationName?: string;
  address?: string;
  lat?: number | null;
  lng?: number | null;
  status: StopStatus;
  pinnedOptionId: string | null;
  sortOrder: number;
  createdBy?: string | null;
  options: StopOption[];
};

export function getActiveOption(stop: Stop): StopOption | null {
  if (!stop.pinnedOptionId) {
    return null;
  }
  return stop.options.find((option) => option.id === stop.pinnedOptionId) ?? null;
}

export function getCandidateOptions(stop: Stop): StopOption[] {
  return stop.options.filter(
    (option) =>
      option.status === "candidate" &&
      option.id !== stop.pinnedOptionId
  );
}

export function getBackupOptions(stop: Stop): StopOption[] {
  return stop.options.filter(
    (option) =>
      option.id !== stop.pinnedOptionId &&
      (option.status === "backup" ||
        (option.status === "candidate" && Boolean(stop.pinnedOptionId)))
  );
}

export function sortBackupOptions(
  options: StopOption[]
): StopOption[] {
  return [...options].sort((left, right) => {
    const ratingLeft = left.rating ?? -Infinity;
    const ratingRight = right.rating ?? -Infinity;
    if (ratingRight !== ratingLeft) {
      return ratingRight - ratingLeft;
    }
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }
    return left.name.localeCompare(right.name);
  });
}

export function applyPin(
  options: StopOption[],
  pinnedId: string
): StopOption[] {
  return options.map((option) => {
    if (option.id === pinnedId) {
      return { ...option, status: "pinned" };
    }
    if (option.status === "removed") {
      return option;
    }
    return { ...option, status: "backup" };
  });
}

export function applyUnpin(options: StopOption[]): StopOption[] {
  return options.map((option) => {
    if (option.status === "pinned") {
      return { ...option, status: "candidate" };
    }
    return option;
  });
}