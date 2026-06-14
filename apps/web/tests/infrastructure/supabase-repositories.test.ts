import { describe, expect, it, vi } from "vitest";

import {
  createSupabaseMemberRepository,
  createSupabaseTimelineRepository,
  createSupabaseTripRepository
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
      insert(payload: unknown) {
        calls.push({ table, operation: "insert", payload });
        return builder(table);
      },
      update(payload: unknown) {
        calls.push({ table, operation: "update", payload });
        return builder(table);
      },
      delete() {
        calls.push({ table, operation: "delete" });
        return builder(table);
      },
      select() {
        return builder(table);
      },
      eq(_column: string, _value: string) {
        return builder(table);
      },
      single: vi.fn(async () => response),
      then(resolve: (value: QueryResponse) => unknown) {
        return Promise.resolve(resolve(response));
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

describe("Supabase repositories", () => {
  it("creates a trip and its generated trip days", async () => {
    const supabase = createSupabaseMock({
      trips: {
        data: {
          id: "trip-1",
          owner_id: "user-1",
          name: "Da Nang",
          destination: "Vietnam",
          start_date: "2026-07-01",
          end_date: "2026-07-02"
        }
      },
      trip_days: {
        data: [
          {
            id: "day-1",
            trip_id: "trip-1",
            date: "2026-07-01",
            day_index: 1
          },
          {
            id: "day-2",
            trip_id: "trip-1",
            date: "2026-07-02",
            day_index: 2
          }
        ]
      }
    });

    const repository = createSupabaseTripRepository(supabase.client);
    const result = await repository.createTripWithDays({
      ownerId: "user-1",
      name: "Da Nang",
      destination: "Vietnam",
      startDate: "2026-07-01",
      endDate: "2026-07-02",
      days: [
        { date: "2026-07-01", dayIndex: 1 },
        { date: "2026-07-02", dayIndex: 2 }
      ]
    });

    expect(supabase.calls[0]).toMatchObject({
      table: "trips",
      operation: "insert",
      payload: {
        owner_id: "user-1",
        name: "Da Nang",
        destination: "Vietnam",
        start_date: "2026-07-01",
        end_date: "2026-07-02"
      }
    });
    expect(supabase.calls[1]).toMatchObject({
      table: "trip_days",
      operation: "insert",
      payload: [
        { trip_id: "trip-1", date: "2026-07-01", day_index: 1 },
        { trip_id: "trip-1", date: "2026-07-02", day_index: 2 }
      ]
    });
    expect(result.days).toHaveLength(2);
  });

  it("persists timeline add, move, and delete mutations", async () => {
    const addSupabase = createSupabaseMock({
      timeline_items: { data: { id: "item-1" } }
    });
    const repository = createSupabaseTimelineRepository(addSupabase.client);

    await repository.addItem({
      tripId: "trip-1",
      tripDayId: "day-1",
      title: "Dinner",
      startTime: "19:00",
      durationMinutes: 90,
      notes: "Seafood",
      place: {
        id: "manual:seafood",
        source: "manual",
        name: "Seafood House",
        address: "My Khe",
        lat: 16.067,
        lng: 108.245,
        externalUrl: "https://example.com"
      }
    });

    expect(addSupabase.calls[0]).toMatchObject({
      table: "timeline_items",
      operation: "insert",
      payload: {
        trip_id: "trip-1",
        trip_day_id: "day-1",
        title: "Dinner",
        start_time: "19:00",
        duration_minutes: 90,
        notes: "Seafood",
        place_source: "manual",
        place_source_id: "manual:seafood",
        place_name: "Seafood House",
        place_address: "My Khe",
        place_lat: 16.067,
        place_lng: 108.245,
        place_external_url: "https://example.com"
      }
    });

    const moveSupabase = createSupabaseMock({
      timeline_items: { data: { id: "item-1", start_time: "09:15" } }
    });
    await createSupabaseTimelineRepository(moveSupabase.client).moveItem({
      itemId: "item-1",
      startTime: "09:15"
    });
    expect(moveSupabase.calls[0]).toMatchObject({
      table: "timeline_items",
      operation: "update",
      payload: { start_time: "09:15" }
    });

    const deleteSupabase = createSupabaseMock({
      timeline_items: { data: { id: "item-1" } }
    });
    await createSupabaseTimelineRepository(deleteSupabase.client).deleteItem({
      itemId: "item-1"
    });
    expect(deleteSupabase.calls[0]).toMatchObject({
      table: "timeline_items",
      operation: "delete"
    });
  });

  it("persists member invite and role update mutations", async () => {
    const inviteSupabase = createSupabaseMock({
      trip_members: { data: { id: "member-1" } }
    });
    await createSupabaseMemberRepository(inviteSupabase.client).inviteMember({
      tripId: "trip-1",
      email: "planner@example.com",
      role: "planner"
    });

    expect(inviteSupabase.calls[0]).toMatchObject({
      table: "trip_members",
      operation: "insert",
      payload: {
        trip_id: "trip-1",
        invited_email: "planner@example.com",
        role: "planner"
      }
    });

    const updateSupabase = createSupabaseMock({
      trip_members: { data: { id: "member-1", role: "viewer" } }
    });
    const result = await createSupabaseMemberRepository(
      updateSupabase.client
    ).updateMemberRole({
      memberId: "member-1",
      role: "viewer"
    });

    expect(updateSupabase.calls[0]).toMatchObject({
      table: "trip_members",
      operation: "update",
      payload: { role: "viewer" }
    });
    expect(result).toEqual({ id: "member-1", role: "viewer" });
  });
});
