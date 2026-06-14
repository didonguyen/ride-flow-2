import type {
  MemberRepository
} from "@/src/application/members/types";
import type {
  TimelineRepository
} from "@/src/application/timeline/types";
import type {
  CreatedTrip,
  CreatedTripDay,
  TripRepository
} from "@/src/application/trips/types";
import type { PlaceSearchResult } from "@/src/domain/places";

type RideFlowSupabaseClient = {
  from(table: string): {
    insert(payload: unknown): RideFlowSupabaseQuery;
    update(payload: unknown): RideFlowSupabaseQuery;
    delete(): RideFlowSupabaseQuery;
  };
};

type RideFlowSupabaseQuery = PromiseLike<{
  data?: unknown;
  error?: SupabaseError | null;
}> & {
  eq(column: string, value: string): RideFlowSupabaseQuery;
  select(columns?: string): RideFlowSupabaseQuery;
  single(): Promise<{
    data?: unknown;
    error?: SupabaseError | null;
  }>;
};

type SupabaseError = {
  message: string;
};

type TripRow = {
  id: string;
  owner_id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
};

type TripDayRow = {
  id: string;
  trip_id: string;
  date: string;
  day_index: number;
};

type TimelineMovedRow = {
  id: string;
  start_time: string;
};

type MemberRoleRow = {
  id: string;
  role: "planner" | "viewer";
};

type IdRow = {
  id: string;
};

function throwIfSupabaseError(error: SupabaseError | null | undefined) {
  if (error) {
    throw new Error(error.message);
  }
}

export function createSupabaseTripRepository(
  supabase: RideFlowSupabaseClient
): TripRepository {
  return {
    async createTripWithDays(input) {
      const { data: trip, error: tripError } = await supabase
        .from("trips")
        .insert({
          owner_id: input.ownerId,
          name: input.name,
          destination: input.destination,
          start_date: input.startDate,
          end_date: input.endDate
        })
        .select("id, owner_id, name, destination, start_date, end_date")
        .single();

      throwIfSupabaseError(tripError);

      if (!trip) {
        throw new Error("Trip was not created");
      }

      const createdTrip = trip as TripRow;

      const { data: days, error: daysError } = await supabase
        .from("trip_days")
        .insert(
          input.days.map((day) => ({
            trip_id: createdTrip.id,
            date: day.date,
            day_index: day.dayIndex
          }))
        )
        .select("id, trip_id, date, day_index");

      throwIfSupabaseError(daysError);

      return {
        id: createdTrip.id,
        ownerId: createdTrip.owner_id,
        name: createdTrip.name,
        destination: createdTrip.destination,
        startDate: createdTrip.start_date,
        endDate: createdTrip.end_date,
        days: ((days ?? []) as TripDayRow[]).map(mapTripDayRow)
      } satisfies CreatedTrip;
    }
  };
}

export function createSupabaseTimelineRepository(
  supabase: RideFlowSupabaseClient
): TimelineRepository {
  return {
    async addItem(input) {
      const { data, error } = await supabase
        .from("timeline_items")
        .insert({
          trip_id: input.tripId,
          trip_day_id: input.tripDayId,
          title: input.title,
          start_time: input.startTime,
          duration_minutes: input.durationMinutes,
          notes: input.notes,
          ...mapPlaceToTimelineColumns(input.place)
        })
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Timeline item was not created");
      }

      return { id: (data as IdRow).id };
    },

    async moveItem(input) {
      const { data, error } = await supabase
        .from("timeline_items")
        .update({ start_time: input.startTime })
        .eq("id", input.itemId)
        .select("id, start_time")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Timeline item was not moved");
      }

      const movedItem = data as TimelineMovedRow;

      return {
        id: movedItem.id,
        startTime: movedItem.start_time
      };
    },

    async deleteItem(input) {
      const { data, error } = await supabase
        .from("timeline_items")
        .delete()
        .eq("id", input.itemId)
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Timeline item was not deleted");
      }

      return { id: (data as IdRow).id };
    }
  };
}

export function createSupabaseMemberRepository(
  supabase: RideFlowSupabaseClient
): MemberRepository {
  return {
    async inviteMember(input) {
      const { data, error } = await supabase
        .from("trip_members")
        .insert({
          trip_id: input.tripId,
          invited_email: input.email,
          role: input.role
        })
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Trip member invite was not created");
      }

      return { id: (data as IdRow).id };
    },

    async updateMemberRole(input) {
      const { data, error } = await supabase
        .from("trip_members")
        .update({ role: input.role })
        .eq("id", input.memberId)
        .select("id, role")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Trip member role was not updated");
      }

      const member = data as MemberRoleRow;

      return {
        id: member.id,
        role: member.role
      };
    }
  };
}

function mapTripDayRow(row: TripDayRow): CreatedTripDay {
  return {
    id: row.id,
    tripId: row.trip_id,
    date: row.date,
    dayIndex: row.day_index
  };
}

function mapPlaceToTimelineColumns(place?: PlaceSearchResult) {
  return {
    place_source: place?.source ?? null,
    place_source_id: place?.id ?? null,
    place_name: place?.name ?? null,
    place_address: place?.address ?? null,
    place_lat: place?.lat ?? null,
    place_lng: place?.lng ?? null,
    place_external_url: place?.externalUrl ?? null
  };
}
