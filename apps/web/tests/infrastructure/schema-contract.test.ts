import { describe, expect, it } from "vitest";
import type { Database } from "@/src/infrastructure/supabase/database.types";

describe("database type contract", () => {
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
});
