import { describe, expect, it, vi } from "vitest";

import {
  createSupabaseExpenseRepository,
  createSupabaseMemoryRepository,
  createSupabaseTimelineRepository,
  createSupabaseTripDayRepository
} from "@/src/infrastructure/supabase/repositories";

type QueryResponse = {
  data?: unknown;
  error?: { message: string } | null;
};

function createSupabaseMock(responses: Record<string, QueryResponse>) {
  const calls: { table: string; operation: string; payload?: unknown }[] = [];

  function builder(table: string) {
    const response = responses[table] ?? { data: null, error: null };

    return {
      delete() {
        calls.push({ table, operation: "delete" });
        return builder(table);
      },
      eq(_column: string, _value: string) {
        return builder(table);
      },
      insert(payload: unknown) {
        calls.push({ table, operation: "insert", payload });
        return builder(table);
      },
      order(_column: string, _options?: { ascending?: boolean }) {
        return builder(table);
      },
      select() {
        return builder(table);
      },
      single: vi.fn(async () => response),
      then(resolve: (value: QueryResponse) => unknown) {
        return Promise.resolve(resolve(response));
      },
      update(payload: unknown) {
        calls.push({ table, operation: "update", payload });
        return builder(table);
      },
      upsert(payload: unknown) {
        calls.push({ table, operation: "upsert", payload });
        return builder(table);
      }
    };
  }

  return {
    calls,
    client: {
      from: vi.fn((table: string) => builder(table))
    }
  };
}

describe("functional trip data repositories", () => {
  it("adds a trip day and updates the trip end date", async () => {
    const randomUuid = vi
      .spyOn(crypto, "randomUUID")
      .mockReturnValue("day-2" as ReturnType<typeof crypto.randomUUID>);
    const supabase = createSupabaseMock({
      trip_days: {
        data: {
          date: "2026-07-02",
          day_index: 2,
          id: "day-2",
          trip_id: "trip-1"
        }
      },
      trips: { data: { id: "trip-1" } }
    });

    const repository = createSupabaseTripDayRepository(supabase.client);
    await repository.addTripDay({
      date: "2026-07-02",
      dayIndex: 2,
      tripId: "trip-1"
    });
    await repository.updateTripEndDate({ endDate: "2026-07-02", tripId: "trip-1" });

    expect(supabase.calls[0]).toMatchObject({
      operation: "insert",
      payload: {
        date: "2026-07-02",
        day_index: 2,
        id: "day-2",
        trip_id: "trip-1"
      },
      table: "trip_days"
    });
    expect(supabase.calls[1]).toMatchObject({
      operation: "update",
      payload: { end_date: "2026-07-02" },
      table: "trips"
    });
    randomUuid.mockRestore();
  });

  it("updates timeline item details and place snapshot", async () => {
    const supabase = createSupabaseMock({ timeline_items: { data: { id: "item-1" } } });

    await createSupabaseTimelineRepository(supabase.client).updateItem({
      itemId: "item-1",
      notes: "Updated notes",
      place: {
        address: "Da Nang",
        externalUrl: "https://example.com",
        id: "manual:bridge",
        lat: 16.06,
        lng: 108.22,
        name: "Dragon Bridge",
        source: "manual"
      },
      startTime: "20:30",
      title: "Dragon Bridge show"
    });

    expect(supabase.calls[0]).toMatchObject({
      operation: "update",
      payload: {
        notes: "Updated notes",
        place_address: "Da Nang",
        place_external_url: "https://example.com",
        place_lat: 16.06,
        place_lng: 108.22,
        place_name: "Dragon Bridge",
        place_source: "manual",
        place_source_id: "manual:bridge",
        start_time: "20:30",
        title: "Dragon Bridge show"
      },
      table: "timeline_items"
    });
  });

  it("creates a memory entry and its image assets", async () => {
    const supabase = createSupabaseMock({ memory_entries: { data: { id: "memory-1" } } });

    await createSupabaseMemoryRepository(supabase.client).createMemory({
      assets: [
        {
          altText: "Beach dinner",
          imagePath: "trips/trip-1/user-1/photo.jpg",
          imageUrl: "https://example.com/photo.jpg",
          sortOrder: 0
        }
      ],
      content: "Dinner near My Khe.",
      createdBy: "user-1",
      title: "Beach dinner",
      tripId: "trip-1"
    });

    expect(supabase.calls[0]).toMatchObject({
      operation: "insert",
      payload: {
        content: "Dinner near My Khe.",
        created_by: "user-1",
        title: "Beach dinner",
        trip_id: "trip-1"
      },
      table: "memory_entries"
    });
    expect(supabase.calls[1]).toMatchObject({
      operation: "insert",
      payload: [
        {
          alt_text: "Beach dinner",
          image_path: "trips/trip-1/user-1/photo.jpg",
          image_url: "https://example.com/photo.jpg",
          memory_entry_id: "memory-1",
          sort_order: 0,
          trip_id: "trip-1",
          uploaded_by: "user-1"
        }
      ],
      table: "memory_assets"
    });
  });

  it("creates and updates expenses with participant shares", async () => {
    const createSupabase = createSupabaseMock({ expense_entries: { data: { id: "expense-1" } } });

    await createSupabaseExpenseRepository(createSupabase.client).createExpense({
      amount: 120000,
      category: "food",
      createdBy: "user-1",
      currency: "VND",
      date: "2026-07-01",
      notes: "Coffee stop",
      paidByMemberId: "member-1",
      participants: [
        { memberId: "member-1", shareAmount: 60000 },
        { memberId: "member-2", shareAmount: 60000 }
      ],
      title: "Coffee",
      tripId: "trip-1"
    });

    expect(createSupabase.calls[0]).toMatchObject({
      operation: "insert",
      table: "expense_entries"
    });
    expect(createSupabase.calls[1]).toMatchObject({
      operation: "insert",
      payload: [
        {
          expense_id: "expense-1",
          share_amount: 60000,
          trip_id: "trip-1",
          trip_member_id: "member-1"
        },
        {
          expense_id: "expense-1",
          share_amount: 60000,
          trip_id: "trip-1",
          trip_member_id: "member-2"
        }
      ],
      table: "expense_participants"
    });

    const updateSupabase = createSupabaseMock({ expense_entries: { data: { id: "expense-1" } } });
    await createSupabaseExpenseRepository(updateSupabase.client).updateExpense({
      amount: 90000,
      category: "transport",
      currency: "VND",
      date: "2026-07-02",
      expenseId: "expense-1",
      notes: "Taxi",
      paidByMemberId: "member-2",
      participants: [{ memberId: "member-2", shareAmount: 90000 }],
      title: "Taxi",
      tripId: "trip-1"
    });

    expect(updateSupabase.calls.map((call) => call.operation)).toEqual([
      "update",
      "delete",
      "insert"
    ]);
  });
});
