import type {
  MemberRepository,
  TripMemberRecord
} from "@/src/application/members/types";
import type { TripRole } from "@/src/domain/permissions";
import type { AiDraftRepository } from "@/src/application/ai/types";
import type { ItineraryDraft } from "@/src/domain/ai-draft";
import type {
  TimelineRepository
} from "@/src/application/timeline/types";
import type {
  CreatedTrip,
  CreatedTripDay,
  TripQueryRepository,
  TripRepository
} from "@/src/application/trips/types";
import type {
  SupabaseDashboardTripRow
} from "@/src/application/trips/supabase-dashboard-data";
import type {
  SupabasePlanningDayRow,
  SupabasePlanningTimelineRow,
  SupabasePlanningTripRow
} from "@/src/application/trips/supabase-planning-data";
import type { PlaceSearchResult } from "@/src/domain/places";

export type RideFlowSupabaseClient = {
  from(table: string): {
    insert(payload: unknown): RideFlowSupabaseQuery;
    select(columns?: string): RideFlowSupabaseQuery;
    update(payload: unknown): RideFlowSupabaseQuery;
    delete(): RideFlowSupabaseQuery;
    upsert(payload: unknown): RideFlowSupabaseQuery;
  };
};

type RideFlowSupabaseQuery = PromiseLike<{
  data?: unknown;
  error?: SupabaseError | null;
}> & {
  eq(column: string, value: string): RideFlowSupabaseQuery;
  order(
    column: string,
    options?: { ascending?: boolean }
  ): RideFlowSupabaseQuery;
  select(columns?: string): RideFlowSupabaseQuery;
  single(): Promise<{
    data?: unknown;
    error?: SupabaseError | null;
  }>;
};

type SupabaseError = {
  code?: string;
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

type DashboardTripRow = {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
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

type TripOwnerRow = {
  owner_id: string;
};

type IdRow = {
  id: string;
};

function throwIfSupabaseError(error: SupabaseError | null | undefined) {
  if (error) {
    throw new Error(error.message);
  }
}

function isNoRowsError(error: SupabaseError | null | undefined) {
  return (
    error?.code === "PGRST116" ||
    error?.message.includes("multiple (or no) rows returned") ||
    error?.message.includes("0 rows")
  );
}

export function createSupabaseTripRepository(
  supabase: RideFlowSupabaseClient
): TripRepository {
  return {
    async createTripWithDays(input) {
      const createdTrip: TripRow = {
        id: crypto.randomUUID(),
        owner_id: input.ownerId,
        name: input.name,
        destination: input.destination,
        start_date: input.startDate,
        end_date: input.endDate
      };
      const createdDays: TripDayRow[] = input.days.map((day) => ({
        id: crypto.randomUUID(),
        trip_id: createdTrip.id,
        date: day.date,
        day_index: day.dayIndex
      }));

      const { error: tripError } = await supabase
        .from("trips")
        .insert({
          id: createdTrip.id,
          owner_id: createdTrip.owner_id,
          name: createdTrip.name,
          destination: createdTrip.destination,
          start_date: createdTrip.start_date,
          end_date: createdTrip.end_date
        });

      throwIfSupabaseError(tripError);

      const { error: ownerMemberError } = await supabase
        .from("trip_members")
        .insert({
          trip_id: createdTrip.id,
          user_id: input.ownerId,
          invited_email: input.ownerEmail ?? "",
          role: "owner",
          invite_status: "accepted",
          accepted_at: new Date().toISOString()
        });

      throwIfSupabaseError(ownerMemberError);

      const { error: daysError } = await supabase
        .from("trip_days")
        .insert(
          createdDays.map((day) => ({
            id: day.id,
            trip_id: day.trip_id,
            date: day.date,
            day_index: day.day_index
          }))
        );

      throwIfSupabaseError(daysError);

      return {
        id: createdTrip.id,
        ownerId: createdTrip.owner_id,
        name: createdTrip.name,
        destination: createdTrip.destination,
        startDate: createdTrip.start_date,
        endDate: createdTrip.end_date,
        days: createdDays.map(mapTripDayRow)
      } satisfies CreatedTrip;
    }
  };
}

export async function ensureSupabaseProfile(
  supabase: RideFlowSupabaseClient,
  input: { displayName?: string; email: string; userId: string }
) {
  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: input.userId,
      email: input.email,
      display_name: input.displayName ?? ""
    })
    .select("id")
    .single();

  throwIfSupabaseError(error);
}

export async function getSupabasePlanningTripRows(
  supabase: RideFlowSupabaseClient,
  tripId: string
): Promise<{
  days: SupabasePlanningDayRow[];
  timelineItems: SupabasePlanningTimelineRow[];
  trip: SupabasePlanningTripRow;
} | null> {
  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id, name, destination, start_date, end_date")
    .eq("id", tripId)
    .single();

  throwIfSupabaseError(tripError);

  if (!trip) {
    return null;
  }

  const { data: days, error: daysError } = await supabase
    .from("trip_days")
    .select("id, trip_id, date, day_index")
    .eq("trip_id", tripId);

  throwIfSupabaseError(daysError);

  const { data: timelineItems, error: timelineError } = await supabase
    .from("timeline_items")
    .select(
      "id, trip_id, trip_day_id, start_time, duration_minutes, title, notes, place_name, place_lat, place_lng"
    )
    .eq("trip_id", tripId);

  throwIfSupabaseError(timelineError);

  return {
    trip: trip as SupabasePlanningTripRow,
    days: (days ?? []) as SupabasePlanningDayRow[],
    timelineItems: (timelineItems ?? []) as SupabasePlanningTimelineRow[]
  };
}

export async function listDashboardTrips(
  supabase: RideFlowSupabaseClient
): Promise<SupabaseDashboardTripRow[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("id, name, destination, start_date, end_date, created_at")
    .order("created_at", { ascending: false });

  throwIfSupabaseError(error);

  return (data ?? []) as SupabaseDashboardTripRow[];
}

export async function listSupabaseMembers(
  supabase: RideFlowSupabaseClient,
  tripId: string
): Promise<TripMemberRecord[]> {
  const { data, error } = await supabase
    .from("trip_members")
    .select("id, trip_id, user_id, invited_email, role, invite_status")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  throwIfSupabaseError(error);

  return ((data ?? []) as Array<{
    id: string;
    trip_id: string;
    user_id: string | null;
    invited_email: string;
    role: TripRole;
    invite_status: "pending" | "accepted";
  }>).map((member) => ({
    id: member.id,
    tripId: member.trip_id,
    userId: member.user_id,
    email: member.invited_email,
    role: member.role,
    inviteStatus: member.invite_status
  }));
}

function mapDashboardTripRow(row: SupabaseDashboardTripRow) {
  return {
    id: row.id,
    name: row.name,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at
  };
}

export function createSupabaseTripQueryRepository(
  supabase: RideFlowSupabaseClient
): TripQueryRepository {
  return {
    async listDashboardTrips() {
      const rows = await listDashboardTrips(supabase);
      return rows.map(mapDashboardTripRow);
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
    },

    async listMembers(tripId) {
      const { data, error } = await supabase
        .from("trip_members")
        .select("id, trip_id, user_id, invited_email, role, invite_status")
        .eq("trip_id", tripId)
        .order("created_at", { ascending: true });

      throwIfSupabaseError(error);

      return ((data ?? []) as Array<{
        id: string;
        trip_id: string;
        user_id: string | null;
        invited_email: string;
        role: TripRole;
        invite_status: "pending" | "accepted";
      }>).map((member) => ({
        id: member.id,
        tripId: member.trip_id,
        userId: member.user_id,
        email: member.invited_email,
        role: member.role,
        inviteStatus: member.invite_status
      }));
    },

    async getViewerRole(tripId, userId) {
      const { data, error } = await supabase
        .from("trip_members")
        .select("role, invite_status")
        .eq("trip_id", tripId)
        .eq("user_id", userId)
        .single();

      if (error && !isNoRowsError(error)) {
        throwIfSupabaseError(error);
      }

      if (!data) {
        const { data: trip, error: tripError } = await supabase
          .from("trips")
          .select("owner_id")
          .eq("id", tripId)
          .single();

        if (tripError && !isNoRowsError(tripError)) {
          throwIfSupabaseError(tripError);
        }

        if (!trip) {
          return null;
        }

        return (trip as TripOwnerRow).owner_id === userId ? "owner" : null;
      }

      const row = data as { role: TripRole; invite_status: "pending" | "accepted" };
      return row.invite_status === "accepted" ? row.role : null;
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

export function createSupabaseAiDraftRepository(
  supabase: RideFlowSupabaseClient
): AiDraftRepository {
  return {
    async recordRun(input) {
      const { data, error } = await supabase
        .from("ai_draft_runs")
        .insert({
          trip_id: input.tripId,
          requested_by: input.requestedBy,
          prompt: input.prompt,
          status: input.status,
          validated_summary: input.validatedSummary as unknown as ItineraryDraft,
          raw_response: input.rawResponse
        })
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("AI draft run was not recorded");
      }

      return { id: (data as IdRow).id };
    },

    async updateRunStatus(runId, status) {
      const { data, error } = await supabase
        .from("ai_draft_runs")
        .update({ status })
        .eq("id", runId)
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("AI draft run status was not updated");
      }

      return { id: (data as IdRow).id };
    }
  };
}
