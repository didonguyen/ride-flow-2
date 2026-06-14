import { describe, expect, it } from "vitest";

import { mapSupabaseDashboardTrips } from "@/src/application/trips/supabase-dashboard-data";

describe("mapSupabaseDashboardTrips", () => {
  it("maps trip rows into dashboard trip cards with formatted date range", () => {
    const trips = mapSupabaseDashboardTrips([
      {
        id: "trip-1",
        name: "Da Nang Trip",
        destination: "Da Nang, Vietnam",
        start_date: "2026-05-10",
        end_date: "2026-05-16",
        created_at: "2026-06-13T10:00:00Z"
      }
    ]);

    expect(trips[0]).toMatchObject({
      id: "trip-1",
      name: "Da Nang Trip",
      destination: "Da Nang, Vietnam",
      region: "Da Nang, Vietnam",
      dateRange: "May 10 - May 16, 2026",
      imageAlt: "Da Nang, Vietnam travel destination"
    });
    expect(trips[0].imageUrl).toMatch(/^https:\/\//);
  });

  it("includes both years when the trip crosses a year boundary", () => {
    const trips = mapSupabaseDashboardTrips([
      {
        id: "trip-2",
        name: "New Year Loop",
        destination: "Tokyo, Japan",
        start_date: "2025-12-30",
        end_date: "2026-01-02",
        created_at: "2026-06-13T10:00:00Z"
      }
    ]);

    expect(trips[0].dateRange).toBe("Dec 30, 2025 - Jan 2, 2026");
  });

  it("returns an empty array when no rows are provided", () => {
    expect(mapSupabaseDashboardTrips([])).toEqual([]);
  });
});
