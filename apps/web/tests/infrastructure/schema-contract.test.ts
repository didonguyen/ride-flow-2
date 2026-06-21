import { describe, expect, it } from "vitest";
import type { Database } from "@/src/infrastructure/supabase/database.types";

describe("database type contract", () => {
  it("exposes RideFlow v1 public tables", () => {
    type Tables = Database["public"]["Tables"];

    const tableNames = [
      "profiles",
      "trips",
      "trip_members",
      "trip_days",
      "timeline_items",
      "ai_draft_runs",
      "memory_entries",
      "memory_assets",
      "expense_entries",
      "expense_participants"
    ] satisfies Array<keyof Tables>;

    expect(tableNames).toHaveLength(10);
  });

  it("exposes enum values used by RideFlow schema contracts", () => {
    type Enums = Database["public"]["Enums"];

    const roles = ["owner", "planner", "viewer"] satisfies Enums["trip_role"][];
    const inviteStatuses = ["pending", "accepted"] satisfies Enums["invite_status"][];
    const placeSources = ["seed", "osm", "manual", "google"] satisfies Enums["place_source"][];
    const draftStatuses = ["pending", "completed", "failed"] satisfies Enums["ai_draft_status"][];

    expect(roles).toContain("owner");
    expect(inviteStatuses).toContain("accepted");
    expect(placeSources).toContain("manual");
    expect(draftStatuses).toContain("failed");
  });

  it("exposes trip cover and transport columns without trip budget fields", () => {
    type TripRow = Database["public"]["Tables"]["trips"]["Row"];
    type TripInsert = Database["public"]["Tables"]["trips"]["Insert"];

    const trip = {
      id: "trip-1",
      name: "Da Nang",
      destination: "Da Nang",
      start_date: "2026-07-01",
      end_date: "2026-07-03",
      owner_id: "user-1",
      cover_image_url: "https://example.com/cover.jpg",
      cover_image_path: "trips/trip-1/user-1/cover.jpg",
      transport: "Motorcycle",
      created_at: "2026-06-11T00:00:00Z",
      updated_at: "2026-06-11T00:00:00Z"
    } satisfies TripRow;

    const tripInsert = {
      name: "Da Nang",
      destination: "Da Nang",
      start_date: "2026-07-01",
      end_date: "2026-07-03",
      owner_id: "user-1",
      transport: "Motorcycle"
    } satisfies TripInsert;

    expect(trip.cover_image_path).toContain("trip-1");
    expect(tripInsert).not.toHaveProperty("budget_currency");
  });

  it("exposes trip member row states", () => {
    type TripMember = Database["public"]["Tables"]["trip_members"]["Row"];

    const pendingInvite = {
      id: "member-1",
      trip_id: "trip-1",
      user_id: null,
      invited_email: "friend@example.com",
      role: "viewer",
      invite_status: "pending",
      created_at: "2026-06-11T00:00:00Z",
      accepted_at: null
    } satisfies TripMember;

    const acceptedOwnerBootstrap = {
      id: "member-2",
      trip_id: "trip-1",
      user_id: "user-1",
      invited_email: "",
      role: "owner",
      invite_status: "accepted",
      created_at: "2026-06-11T00:00:00Z",
      accepted_at: "2026-06-11T00:00:00Z"
    } satisfies TripMember;

    const acceptedInvite = {
      ...acceptedOwnerBootstrap,
      id: "member-3",
      user_id: "user-2",
      invited_email: "friend@example.com",
      role: "planner"
    } satisfies TripMember;

    expect(pendingInvite.user_id).toBeNull();
    expect(acceptedOwnerBootstrap.invited_email).toBe("");
    expect(acceptedInvite.invited_email).toBe("friend@example.com");
  });

  it("exposes timeline item rows with place snapshots", () => {
    type TimelineItem = Database["public"]["Tables"]["timeline_items"]["Row"];

    const item = {
      id: "item-1",
      trip_id: "trip-1",
      trip_day_id: "day-1",
      start_time: "09:00",
      duration_minutes: 60,
      title: "Coffee",
      notes: "Start slow",
      place_source: "manual",
      place_source_id: "manual:coffee",
      place_name: "Coffee shop",
      place_address: "Da Nang",
      place_lat: 16.047079,
      place_lng: 108.20623,
      place_external_url: "https://maps.google.com/?q=coffee",
      updated_by: "user-1",
      created_at: "2026-06-11T00:00:00Z",
      updated_at: "2026-06-11T00:00:00Z"
    } satisfies TimelineItem;

    expect(item.place_source).toBe("manual");
  });

  it("exposes memory rows with image assets", () => {
    type MemoryEntry = Database["public"]["Tables"]["memory_entries"]["Row"];
    type MemoryAsset = Database["public"]["Tables"]["memory_assets"]["Row"];

    const memory = {
      id: "memory-1",
      trip_id: "trip-1",
      created_by: "user-1",
      title: "Morning ride",
      content: "Cool air and an early start.",
      created_at: "2026-06-11T00:00:00Z",
      updated_at: "2026-06-11T00:00:00Z"
    } satisfies MemoryEntry;

    const asset = {
      id: "asset-1",
      memory_entry_id: "memory-1",
      trip_id: "trip-1",
      uploaded_by: "user-1",
      image_url: "https://example.com/memory.jpg",
      image_path: "trips/trip-1/user-1/memory.jpg",
      alt_text: "Morning ride",
      sort_order: 0,
      created_at: "2026-06-11T00:00:00Z"
    } satisfies MemoryAsset;

    expect(memory.trip_id).toBe(asset.trip_id);
  });

  it("exposes expense rows with participant shares", () => {
    type Expense = Database["public"]["Tables"]["expense_entries"]["Row"];
    type Participant = Database["public"]["Tables"]["expense_participants"]["Row"];

    const expense = {
      id: "expense-1",
      trip_id: "trip-1",
      title: "Coffee stop",
      amount: 120000,
      currency: "VND",
      category: "food",
      paid_by_member_id: "member-1",
      expense_date: "2026-07-01",
      notes: "Morning coffee",
      created_by: "user-1",
      created_at: "2026-06-11T00:00:00Z",
      updated_at: "2026-06-11T00:00:00Z"
    } satisfies Expense;

    const participant = {
      id: "participant-1",
      expense_id: "expense-1",
      trip_id: "trip-1",
      trip_member_id: "member-2",
      share_amount: 60000,
      created_at: "2026-06-11T00:00:00Z"
    } satisfies Participant;

    expect(expense.id).toBe(participant.expense_id);
  });

  it("exposes accept_trip_invite function shape", () => {
    type AcceptTripInvite = Database["public"]["Functions"]["accept_trip_invite"];

    const args = { target_trip_id: "trip-1" } satisfies AcceptTripInvite["Args"];
    const result = undefined satisfies AcceptTripInvite["Returns"];

    expect(args.target_trip_id).toBe("trip-1");
    expect(result).toBeUndefined();
  });
});
