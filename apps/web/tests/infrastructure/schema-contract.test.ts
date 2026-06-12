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
      "ai_draft_runs"
    ] satisfies Array<keyof Tables>;

    expect(tableNames).toHaveLength(6);
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

  it("exposes accept_trip_invite function shape", () => {
    type AcceptTripInvite = Database["public"]["Functions"]["accept_trip_invite"];

    const args = { target_trip_id: "trip-1" } satisfies AcceptTripInvite["Args"];
    const result = undefined satisfies AcceptTripInvite["Returns"];

    expect(args.target_trip_id).toBe("trip-1");
    expect(result).toBeUndefined();
  });
});
