import type {
  Stop,
  StopOption,
  StopOptionDraft,
  StopOptionSource,
  StopOptionStatus
} from "@/src/domain/stop-options";
import type {
  StopOptionRepository,
  StopRepository
} from "@/src/application/stop-options/types";
import type { RideFlowSupabaseClient } from "@/src/infrastructure/supabase/repositories";

type StopRow = {
  address: string | null;
  created_by: string | null;
  day_id: string;
  description: string;
  id: string;
  lat: number | null;
  lng: number | null;
  location_name: string | null;
  note: string;
  pinned_option_id: string | null;
  sort_order: number;
  status: "action_needed" | "pinned";
  time: string | null;
  title: string;
  trip_id: string;
};

type StopOptionRow = {
  address: string | null;
  description: string | null;
  distance_text: string | null;
  duration_text: string | null;
  google_maps_url: string | null;
  google_place_id: string | null;
  id: string;
  image_url: string | null;
  lat: number | null;
  lng: number | null;
  name: string;
  price_level: number | null;
  rating: number | null;
  sort_order: number;
  source: StopOptionSource;
  status: StopOptionStatus;
  stop_id: string;
  trip_id: string;
};

function throwIfSupabaseError(error: unknown) {
  if (error) {
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as { message: unknown }).message)
        : "Supabase request failed";
    throw new Error(message);
  }
}

function mapStopRow(row: StopRow): Stop {
  return {
    id: row.id,
    tripId: row.trip_id,
    dayId: row.day_id,
    title: row.title,
    time: row.time ?? undefined,
    description: row.description,
    note: row.note,
    locationName: row.location_name ?? undefined,
    address: row.address ?? undefined,
    lat: row.lat,
    lng: row.lng,
    status: row.status,
    pinnedOptionId: row.pinned_option_id,
    sortOrder: row.sort_order,
    createdBy: row.created_by,
    options: []
  };
}

function mapStopOptionRow(row: StopOptionRow): StopOption {
  return {
    id: row.id,
    stopId: row.stop_id,
    tripId: row.trip_id,
    name: row.name,
    address: row.address ?? undefined,
    description: row.description ?? undefined,
    imageUrl: row.image_url ?? undefined,
    rating: row.rating,
    distanceText: row.distance_text ?? undefined,
    durationText: row.duration_text ?? undefined,
    googlePlaceId: row.google_place_id ?? undefined,
    googleMapsUrl: row.google_maps_url ?? undefined,
    lat: row.lat,
    lng: row.lng,
    source: row.source,
    status: row.status,
    sortOrder: row.sort_order
  };
}

export function createSupabaseStopRepository(
  supabase: RideFlowSupabaseClient
): StopRepository {
  return {
    async addStop(input) {
      const id = crypto.randomUUID();
      const { error } = await supabase.from("trip_stops").insert({
        id,
        trip_id: input.tripId,
        day_id: input.dayId,
        title: input.draft.title,
        time: input.draft.time ?? null,
        description: input.draft.description ?? "",
        note: input.draft.note ?? "",
        location_name: input.draft.locationName ?? null,
        address: input.draft.address ?? null,
        lat: input.draft.lat ?? null,
        lng: input.draft.lng ?? null,
        sort_order: input.sortOrder,
        created_by: input.createdBy ?? null
      });

      throwIfSupabaseError(error);
      return { id };
    },

    async updateStop(input) {
      const payload: Record<string, unknown> = {};
      if (input.patch.title !== undefined) payload.title = input.patch.title;
      if (input.patch.time !== undefined) payload.time = input.patch.time;
      if (input.patch.description !== undefined)
        payload.description = input.patch.description;
      if (input.patch.note !== undefined) payload.note = input.patch.note;
      if (input.patch.locationName !== undefined)
        payload.location_name = input.patch.locationName;
      if (input.patch.address !== undefined)
        payload.address = input.patch.address;
      if (input.patch.lat !== undefined) payload.lat = input.patch.lat;
      if (input.patch.lng !== undefined) payload.lng = input.patch.lng;

      const { data, error } = await supabase
        .from("trip_stops")
        .update(payload)
        .eq("id", input.stopId)
        .select("id")
        .single();

      throwIfSupabaseError(error);
      return { id: (data as { id: string }).id };
    },

    async deleteStop(input) {
      const { data, error } = await supabase
        .from("trip_stops")
        .delete()
        .eq("id", input.stopId)
        .select("id")
        .single();

      throwIfSupabaseError(error);
      return { id: (data as { id: string }).id };
    },

    async reorderStops(input) {
      const stopIds: string[] = [];
      for (const move of input.moves) {
        const { error } = await supabase
          .from("trip_stops")
          .update({ day_id: move.dayId, sort_order: move.sortOrder })
          .eq("id", move.stopId);
        throwIfSupabaseError(error);
        stopIds.push(move.stopId);
      }
      return { stopIds };
    }
  };
}

export function createSupabaseStopOptionRepository(
  supabase: RideFlowSupabaseClient
): StopOptionRepository {
  return {
    async addOption(input) {
      const id = crypto.randomUUID();
      const { error } = await supabase.from("stop_options").insert({
        id,
        trip_id: input.tripId,
        stop_id: input.stopId,
        name: input.draft.name,
        address: input.draft.address ?? null,
        description: input.draft.description ?? null,
        image_url: input.draft.imageUrl ?? null,
        rating: input.draft.rating ?? null,
        distance_text: input.draft.distanceText ?? null,
        duration_text: input.draft.durationText ?? null,
        google_place_id: input.draft.googlePlaceId ?? null,
        google_maps_url: input.draft.googleMapsUrl ?? null,
        lat: input.draft.lat ?? null,
        lng: input.draft.lng ?? null,
        source: input.source,
        status: input.status,
        sort_order: 0
      });

      throwIfSupabaseError(error);
      return { id };
    },

    async updateOptionStatus(input) {
      const { data, error } = await supabase
        .from("stop_options")
        .update({ status: input.status })
        .eq("id", input.optionId)
        .eq("stop_id", input.stopId)
        .select("id")
        .single();

      throwIfSupabaseError(error);
      return { id: (data as { id: string }).id };
    },

    async updateStopPinned(input) {
      const { data, error } = await supabase
        .from("trip_stops")
        .update({
          pinned_option_id: input.pinnedOptionId,
          status: input.status
        })
        .eq("id", input.stopId)
        .select("id")
        .single();

      throwIfSupabaseError(error);
      return { id: (data as { id: string }).id };
    },

    async listOptionsForStop(input) {
      const { data, error } = await supabase
        .from("stop_options")
        .select(
          "id, stop_id, trip_id, name, address, description, image_url, rating, distance_text, duration_text, google_place_id, google_maps_url, lat, lng, source, status, sort_order"
        )
        .eq("stop_id", input.stopId)
        .order("sort_order", { ascending: true });

      throwIfSupabaseError(error);
      return ((data ?? []) as StopOptionRow[]).map(mapStopOptionRow);
    },

    async listOptionsForStops(input) {
      const { data, error } = await supabase
        .from("stop_options")
        .select(
          "id, stop_id, trip_id, name, address, description, image_url, rating, distance_text, duration_text, google_place_id, google_maps_url, lat, lng, source, status, sort_order"
        )
        .in("stop_id", input.stopIds as string[])
        .order("sort_order", { ascending: true });

      throwIfSupabaseError(error);
      return ((data ?? []) as StopOptionRow[]).map(mapStopOptionRow);
    },

    async removeOption(input) {
      const { data, error } = await supabase
        .from("stop_options")
        .update({ status: "removed" })
        .eq("id", input.optionId)
        .eq("stop_id", input.stopId)
        .select("id")
        .single();

      throwIfSupabaseError(error);
      return { id: (data as { id: string }).id };
    }
  };
}

export async function listSupabaseStops(
  supabase: RideFlowSupabaseClient,
  tripId: string
): Promise<Stop[]> {
  const { data, error } = await supabase
    .from("trip_stops")
    .select(
      "id, trip_id, day_id, title, time, description, note, location_name, address, lat, lng, status, pinned_option_id, sort_order, created_by"
    )
    .eq("trip_id", tripId)
    .order("sort_order", { ascending: true });

  if (error) {
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as { message: unknown }).message)
        : "Supabase request failed";
    if (message.toLowerCase().includes("does not exist")) {
      return [];
    }
    throw new Error(message);
  }

  const stops = ((data ?? []) as StopRow[]).map(mapStopRow);
  const stopIds = stops.map((stop) => stop.id);

  if (stopIds.length === 0) {
    return stops;
  }

  const { data: options, error: optionsError } = await supabase
    .from("stop_options")
    .select(
      "id, stop_id, trip_id, name, address, description, image_url, rating, distance_text, duration_text, google_place_id, google_maps_url, lat, lng, source, status, sort_order"
    )
    .in("stop_id", stopIds)
    .order("sort_order", { ascending: true });

  if (optionsError) {
    const message =
      typeof optionsError === "object" &&
      optionsError &&
      "message" in optionsError
        ? String((optionsError as { message: unknown }).message)
        : "Supabase request failed";
    if (!message.toLowerCase().includes("does not exist")) {
      throw new Error(message);
    }
    return stops;
  }

  const optionsByStop = new Map<string, StopOption[]>();
  for (const optionRow of (options ?? []) as StopOptionRow[]) {
    const option = mapStopOptionRow(optionRow);
    const list = optionsByStop.get(option.stopId) ?? [];
    list.push(option);
    optionsByStop.set(option.stopId, list);
  }

  return stops.map((stop) => ({
    ...stop,
    options: optionsByStop.get(stop.id) ?? []
  }));
}

export type StopOptionDraftInput = StopOptionDraft;