import { describe, expect, it, vi } from "vitest";

import {
  createSupabaseMemberRepository,
  createSupabaseTimelineRepository,
  createSupabaseTripQueryRepository,
  createSupabaseTripRepository,
  listDashboardTrips,
  listSupabaseMembers
} from "@/src/infrastructure/supabase/repositories";

type QueryResponse = {
  data?: unknown;
  error?: { message: string } | null;
};

function asUuid(value: string) {
  return value as ReturnType<typeof crypto.randomUUID>;
}

function createSupabaseMock(responses: Record<string, QueryResponse>) {
  const calls: { table: string; operation: string; payload?: unknown }[] = [];

  function builder(table: string) {
    const response = responses[table] ?? { data: null, error: null };

    return {
      insert(payload: unknown) {
        calls.push({ table, operation: "insert", payload });
        return builder(table);
      },
      upsert(payload: unknown) {
        calls.push({ table, operation: "upsert", payload });
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
      order(_column: string, _options?: { ascending?: boolean }) {
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
    const randomUuid = vi
      .spyOn(crypto, "randomUUID")
      .mockReturnValueOnce(asUuid("trip-1"))
      .mockReturnValueOnce(asUuid("day-1"))
      .mockReturnValueOnce(asUuid("day-2"));
    const supabase = createSupabaseMock({});

    const repository = createSupabaseTripRepository(supabase.client);
    const result = await repository.createTripWithDays({
      ownerId: "user-1",
      ownerEmail: "owner@example.com",
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
        id: "trip-1",
        owner_id: "user-1",
        name: "Da Nang",
        destination: "Vietnam",
        start_date: "2026-07-01",
        end_date: "2026-07-02"
      }
    });
    expect(supabase.calls[1]).toMatchObject({
      table: "trip_members",
      operation: "insert",
      payload: {
        trip_id: "trip-1",
        user_id: "user-1",
        invited_email: "owner@example.com",
        role: "owner",
        invite_status: "accepted",
        accepted_at: expect.any(String)
      }
    });
    expect(supabase.calls[2]).toMatchObject({
      table: "trip_days",
      operation: "insert",
      payload: [
        { id: "day-1", trip_id: "trip-1", date: "2026-07-01", day_index: 1 },
        { id: "day-2", trip_id: "trip-1", date: "2026-07-02", day_index: 2 }
      ]
    });
    expect(result.id).toBe("trip-1");
    expect(result.days).toHaveLength(2);
    randomUuid.mockRestore();
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

  it("lists dashboard trips ordered by created_at descending", async () => {
    const supabase = createSupabaseMock({
      trips: {
        data: [
          {
            id: "trip-2",
            name: "Bali Surf",
            destination: "Uluwatu, Indonesia",
            start_date: "2026-02-14",
            end_date: "2026-02-21",
            created_at: "2026-06-14T00:00:00Z"
          },
          {
            id: "trip-1",
            name: "Da Nang Trip",
            destination: "Da Nang, Vietnam",
            start_date: "2026-05-10",
            end_date: "2026-05-16",
            created_at: "2026-06-13T00:00:00Z"
          }
        ]
      }
    });

    const result = await listDashboardTrips(supabase.client);
    expect(supabase.calls.some(
      (call) => call.table === "trips" && call.operation === "select"
    )).toBe(false);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("trip-2");
    expect(result[0].name).toBe("Bali Surf");

    const repository = createSupabaseTripQueryRepository(supabase.client);
    await expect(repository.listDashboardTrips()).resolves.toHaveLength(2);
  });

  it("lists trip members with camelCase fields", async () => {
    const supabase = createSupabaseMock({
      trip_members: {
        data: [
          {
            id: "member-1",
            trip_id: "trip-1",
            user_id: "user-1",
            invited_email: "owner@example.com",
            role: "owner",
            invite_status: "accepted"
          },
          {
            id: "member-2",
            trip_id: "trip-1",
            user_id: null,
            invited_email: "planner@example.com",
            role: "planner",
            invite_status: "pending"
          }
        ]
      }
    });

    const members = await listSupabaseMembers(supabase.client, "trip-1");
    expect(members).toHaveLength(2);
    expect(members[0]).toMatchObject({
      id: "member-1",
      email: "owner@example.com",
      role: "owner",
      inviteStatus: "accepted"
    });
    expect(members[1].inviteStatus).toBe("pending");

    const repository = createSupabaseMemberRepository(supabase.client);
    const listed = await repository.listMembers("trip-1");
    expect(listed).toEqual(members);
  });

  it("resolves the viewer's accepted role for a trip", async () => {
    const supabase = createSupabaseMock({
      trip_members: {
        data: {
          role: "planner",
          invite_status: "accepted"
        }
      }
    });

    const repository = createSupabaseMemberRepository(supabase.client);
    const role = await repository.getViewerRole("trip-1", "user-1");
    expect(role).toBe("planner");
  });

  it("resolves the trip owner role from trips when no accepted member row exists", async () => {
    const supabase = createSupabaseMock({
      trip_members: {
        data: null,
        error: {
          code: "PGRST116",
          message: "JSON object requested, multiple (or no) rows returned"
        }
      },
      trips: {
        data: {
          owner_id: "user-1"
        }
      }
    });

    const repository = createSupabaseMemberRepository(supabase.client);
    const role = await repository.getViewerRole("trip-1", "user-1");
    expect(role).toBe("owner");
  });
});
