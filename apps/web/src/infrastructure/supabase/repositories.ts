import type {
  MemberRepository,
  TripMemberRecord
} from "@/src/application/members/types";
import type { TripRole } from "@/src/domain/permissions";
import type { AiDraftRepository } from "@/src/application/ai/types";
import type { ItineraryDraft } from "@/src/domain/ai-draft";
import type { TimelineRepository } from "@/src/application/timeline/types";
import type {
  CreatedTrip,
  CreatedTripDay,
  ExpenseRecord,
  ExpenseRepository,
  MemoryRecord,
  MemoryRepository,
  TripDayRepository,
  TripQueryRepository,
  TripRepository
} from "@/src/application/trips/types";
import type { SupabaseDashboardTripRow } from "@/src/application/trips/supabase-dashboard-data";
import type {
  SupabasePlanningDayRow,
  SupabasePlanningTimelineRow,
  SupabasePlanningTripRow
} from "@/src/application/trips/supabase-planning-data";
import type { PlaceSearchResult } from "@/src/domain/places";

export type RideFlowSupabaseClient = {
  from(table: string): {
    delete(): RideFlowSupabaseQuery;
    insert(payload: unknown): RideFlowSupabaseQuery;
    select(columns?: string): RideFlowSupabaseQuery;
    update(payload: unknown): RideFlowSupabaseQuery;
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
  cover_image_path: string | null;
  cover_image_url: string | null;
  destination: string;
  end_date: string;
  id: string;
  name: string;
  owner_id: string;
  start_date: string;
  transport: string;
};

type TripDayRow = {
  date: string;
  day_index: number;
  id: string;
  trip_id: string;
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

type MemoryEntryRow = {
  content: string;
  created_at: string;
  created_by: string;
  id: string;
  title: string;
  trip_id: string;
};

type MemoryAssetRow = {
  alt_text: string;
  id: string;
  image_path: string;
  image_url: string;
  memory_entry_id: string;
  sort_order: number;
};

type ExpenseEntryRow = {
  amount: number;
  category: string;
  created_by: string;
  currency: string;
  expense_date: string;
  id: string;
  notes: string;
  paid_by_member_id: string;
  title: string;
  trip_id: string;
};

type ExpenseParticipantRow = {
  expense_id: string;
  share_amount: number;
  trip_member_id: string;
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

function isMissingFunctionalTripColumnError(
  error: SupabaseError | null | undefined
) {
  if (!error) return false;

  const message = error.message.toLowerCase();
  const mentionsFunctionalTripColumn =
    message.includes("cover_image_url") || message.includes("transport");

  return (
    mentionsFunctionalTripColumn &&
    (message.includes("does not exist") ||
      message.includes("could not find") ||
      message.includes("schema cache"))
  );
}

function isMissingRelationError(
  error: SupabaseError | null | undefined,
  relations: string[]
) {
  if (!error) return false;

  const message = error.message.toLowerCase();
  const mentionsRelation = relations.some((relation) =>
    message.includes(relation.toLowerCase())
  );

  return (
    mentionsRelation &&
    (message.includes("does not exist") ||
      message.includes("could not find") ||
      message.includes("schema cache"))
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
        end_date: input.endDate,
        cover_image_path: input.coverImagePath ?? null,
        cover_image_url: input.coverImageUrl ?? null,
        transport: input.transport?.trim() || "Motorcycle"
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
          end_date: createdTrip.end_date,
          cover_image_path: createdTrip.cover_image_path,
          cover_image_url: createdTrip.cover_image_url,
          transport: createdTrip.transport
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

      return mapCreatedTrip(createdTrip, createdDays);
    },

    async updateTripCover(input) {
      const { error } = await supabase
        .from("trips")
        .update({
          cover_image_path: input.coverImagePath,
          cover_image_url: input.coverImageUrl
        })
        .eq("id", input.tripId)
        .select("id")
        .single();

      throwIfSupabaseError(error);
    }
  };
}

export function createSupabaseTripDayRepository(
  supabase: RideFlowSupabaseClient
): TripDayRepository {
  return {
    async addTripDay(input) {
      const id = crypto.randomUUID();
      const { data, error } = await supabase
        .from("trip_days")
        .insert({
          id,
          trip_id: input.tripId,
          date: input.date,
          day_index: input.dayIndex
        })
        .select("id, trip_id, date, day_index")
        .single();

      throwIfSupabaseError(error);

      return mapTripDayRow((data as TripDayRow | undefined) ?? {
        id,
        trip_id: input.tripId,
        date: input.date,
        day_index: input.dayIndex
      });
    },

    async updateTripEndDate(input) {
      const { error } = await supabase
        .from("trips")
        .update({ end_date: input.endDate })
        .eq("id", input.tripId)
        .select("id")
        .single();

      throwIfSupabaseError(error);
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
    .select("id, name, destination, start_date, end_date, cover_image_url, transport")
    .eq("id", tripId)
    .single();

  let tripRow = trip as SupabasePlanningTripRow | undefined;

  if (isMissingFunctionalTripColumnError(tripError)) {
    const { data: legacyTrip, error: legacyTripError } = await supabase
      .from("trips")
      .select("id, name, destination, start_date, end_date")
      .eq("id", tripId)
      .single();

    throwIfSupabaseError(legacyTripError);
    tripRow = legacyTrip
      ? {
          ...(legacyTrip as SupabasePlanningTripRow),
          cover_image_url: null,
          transport: null
        }
      : undefined;
  } else {
    throwIfSupabaseError(tripError);
  }

  if (!tripRow) {
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
      "id, trip_id, trip_day_id, start_time, duration_minutes, title, notes, place_source, place_source_id, place_name, place_address, place_lat, place_lng, place_external_url"
    )
    .eq("trip_id", tripId);

  throwIfSupabaseError(timelineError);

  return {
    trip: tripRow,
    days: (days ?? []) as SupabasePlanningDayRow[],
    timelineItems: (timelineItems ?? []) as SupabasePlanningTimelineRow[]
  };
}

export async function listDashboardTrips(
  supabase: RideFlowSupabaseClient
): Promise<SupabaseDashboardTripRow[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("id, name, destination, start_date, end_date, created_at, cover_image_url, transport")
    .order("created_at", { ascending: false });

  if (isMissingFunctionalTripColumnError(error)) {
    const { data: legacyData, error: legacyError } = await supabase
      .from("trips")
      .select("id, name, destination, start_date, end_date, created_at")
      .order("created_at", { ascending: false });

    throwIfSupabaseError(legacyError);

    return ((legacyData ?? []) as SupabaseDashboardTripRow[]).map((row) => ({
      ...row,
      cover_image_url: row.cover_image_url ?? null,
      transport: row.transport ?? null
    }));
  }

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
  }>).map(mapTripMemberRow);
}

function mapDashboardTripRow(row: SupabaseDashboardTripRow) {
  return {
    id: row.id,
    name: row.name,
    destination: row.destination,
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
    coverImageUrl: row.cover_image_url,
    transport: row.transport
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

    async updateItem(input) {
      const payload: Record<string, unknown> = {};
      if (input.title !== undefined) payload.title = input.title;
      if (input.notes !== undefined) payload.notes = input.notes;
      if (input.startTime !== undefined) payload.start_time = input.startTime;
      if (input.place !== undefined) {
        Object.assign(payload, mapPlaceToTimelineColumns(input.place ?? undefined));
      }

      const { data, error } = await supabase
        .from("timeline_items")
        .update(payload)
        .eq("id", input.itemId)
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Timeline item was not updated");
      }

      return { id: (data as IdRow).id };
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

export function createSupabaseMemoryRepository(
  supabase: RideFlowSupabaseClient
): MemoryRepository {
  return {
    async createMemory(input) {
      const { data, error } = await supabase
        .from("memory_entries")
        .insert({
          trip_id: input.tripId,
          created_by: input.createdBy,
          title: input.title,
          content: input.content
        })
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Memory entry was not created");
      }

      const memoryId = (data as IdRow).id;

      if (input.assets.length > 0) {
        const { error: assetsError } = await supabase
          .from("memory_assets")
          .insert(input.assets.map((asset) => ({
            memory_entry_id: memoryId,
            trip_id: input.tripId,
            uploaded_by: input.createdBy,
            image_url: asset.imageUrl,
            image_path: asset.imagePath,
            alt_text: asset.altText ?? input.title,
            sort_order: asset.sortOrder
          })));

        throwIfSupabaseError(assetsError);
      }

      return { id: memoryId };
    },

    async deleteMemory(input) {
      const { data, error } = await supabase
        .from("memory_entries")
        .delete()
        .eq("id", input.memoryId)
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Memory entry was not deleted");
      }

      return { id: (data as IdRow).id };
    },

    async listMemories(tripId) {
      const { data: memories, error: memoriesError } = await supabase
        .from("memory_entries")
        .select("id, trip_id, created_by, title, content, created_at")
        .eq("trip_id", tripId)
        .order("created_at", { ascending: false });

      if (isMissingRelationError(memoriesError, ["memory_entries"])) {
        return [];
      }

      throwIfSupabaseError(memoriesError);

      const { data: assets, error: assetsError } = await supabase
        .from("memory_assets")
        .select("id, memory_entry_id, image_url, image_path, alt_text, sort_order")
        .eq("trip_id", tripId)
        .order("sort_order", { ascending: true });

      if (isMissingRelationError(assetsError, ["memory_assets"])) {
        return mapMemoryRows((memories ?? []) as MemoryEntryRow[], []);
      }

      throwIfSupabaseError(assetsError);

      return mapMemoryRows(
        (memories ?? []) as MemoryEntryRow[],
        (assets ?? []) as MemoryAssetRow[]
      );
    }
  };
}

export function createSupabaseExpenseRepository(
  supabase: RideFlowSupabaseClient
): ExpenseRepository {
  return {
    async createExpense(input) {
      const { data, error } = await supabase
        .from("expense_entries")
        .insert({
          trip_id: input.tripId,
          title: input.title,
          amount: input.amount,
          currency: input.currency,
          category: input.category,
          paid_by_member_id: input.paidByMemberId,
          expense_date: input.date,
          notes: input.notes,
          created_by: input.createdBy
        })
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Expense was not created");
      }

      const expenseId = (data as IdRow).id;
      await insertExpenseParticipants(supabase, {
        expenseId,
        participants: input.participants,
        tripId: input.tripId
      });

      return { id: expenseId };
    },

    async deleteExpense(input) {
      const { data, error } = await supabase
        .from("expense_entries")
        .delete()
        .eq("id", input.expenseId)
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Expense was not deleted");
      }

      return { id: (data as IdRow).id };
    },

    async listExpenses(tripId) {
      const { data: expenses, error: expensesError } = await supabase
        .from("expense_entries")
        .select("id, trip_id, title, amount, currency, category, paid_by_member_id, expense_date, notes, created_by")
        .eq("trip_id", tripId)
        .order("expense_date", { ascending: false });

      if (isMissingRelationError(expensesError, ["expense_entries"])) {
        return [];
      }

      throwIfSupabaseError(expensesError);

      const { data: participants, error: participantsError } = await supabase
        .from("expense_participants")
        .select("expense_id, trip_member_id, share_amount")
        .eq("trip_id", tripId);

      if (isMissingRelationError(participantsError, ["expense_participants"])) {
        return mapExpenseRows((expenses ?? []) as ExpenseEntryRow[], []);
      }

      throwIfSupabaseError(participantsError);

      return mapExpenseRows(
        (expenses ?? []) as ExpenseEntryRow[],
        (participants ?? []) as ExpenseParticipantRow[]
      );
    },

    async updateExpense(input) {
      const { data, error } = await supabase
        .from("expense_entries")
        .update({
          title: input.title,
          amount: input.amount,
          currency: input.currency,
          category: input.category,
          paid_by_member_id: input.paidByMemberId,
          expense_date: input.date,
          notes: input.notes
        })
        .eq("id", input.expenseId)
        .select("id")
        .single();

      throwIfSupabaseError(error);

      if (!data) {
        throw new Error("Expense was not updated");
      }

      const { error: deleteError } = await supabase
        .from("expense_participants")
        .delete()
        .eq("expense_id", input.expenseId);

      throwIfSupabaseError(deleteError);
      await insertExpenseParticipants(supabase, {
        expenseId: input.expenseId,
        participants: input.participants,
        tripId: input.tripId
      });

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
      return listSupabaseMembers(supabase, tripId);
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

function mapCreatedTrip(trip: TripRow, days: TripDayRow[]): CreatedTrip {
  return {
    id: trip.id,
    ownerId: trip.owner_id,
    name: trip.name,
    destination: trip.destination,
    startDate: trip.start_date,
    endDate: trip.end_date,
    coverImagePath: trip.cover_image_path,
    coverImageUrl: trip.cover_image_url,
    transport: trip.transport,
    days: days.map(mapTripDayRow)
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

function mapTripMemberRow(member: {
  id: string;
  trip_id: string;
  user_id: string | null;
  invited_email: string;
  role: TripRole;
  invite_status: "pending" | "accepted";
}): TripMemberRecord {
  return {
    id: member.id,
    tripId: member.trip_id,
    userId: member.user_id,
    email: member.invited_email,
    role: member.role,
    inviteStatus: member.invite_status
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

function mapMemoryRows(
  memories: MemoryEntryRow[],
  assets: MemoryAssetRow[]
): MemoryRecord[] {
  return memories.map((memory) => ({
    id: memory.id,
    tripId: memory.trip_id,
    createdBy: memory.created_by,
    title: memory.title,
    content: memory.content,
    createdAt: memory.created_at,
    assets: assets
      .filter((asset) => asset.memory_entry_id === memory.id)
      .map((asset) => ({
        id: asset.id,
        imageUrl: asset.image_url,
        imagePath: asset.image_path,
        altText: asset.alt_text,
        sortOrder: asset.sort_order
      }))
  }));
}

function mapExpenseRows(
  expenses: ExpenseEntryRow[],
  participants: ExpenseParticipantRow[]
): ExpenseRecord[] {
  return expenses.map((expense) => ({
    id: expense.id,
    tripId: expense.trip_id,
    title: expense.title,
    amount: Number(expense.amount),
    currency: expense.currency,
    category: expense.category,
    paidByMemberId: expense.paid_by_member_id,
    date: expense.expense_date,
    notes: expense.notes,
    createdBy: expense.created_by,
    participants: participants
      .filter((participant) => participant.expense_id === expense.id)
      .map((participant) => ({
        memberId: participant.trip_member_id,
        shareAmount: Number(participant.share_amount)
      }))
  }));
}

async function insertExpenseParticipants(
  supabase: RideFlowSupabaseClient,
  input: {
    expenseId: string;
    participants: Array<{ memberId: string; shareAmount: number }>;
    tripId: string;
  }
) {
  if (input.participants.length === 0) {
    return;
  }

  const { error } = await supabase
    .from("expense_participants")
    .insert(input.participants.map((participant) => ({
      expense_id: input.expenseId,
      trip_id: input.tripId,
      trip_member_id: participant.memberId,
      share_amount: participant.shareAmount
    })));

  throwIfSupabaseError(error);
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
