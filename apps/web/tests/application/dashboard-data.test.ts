import { describe, expect, it } from "vitest";
import {
  dashboardCreateTripCta,
  dashboardTrips
} from "@/src/application/trips/dashboard-data";

describe("dashboardTrips", () => {
  it("matches the approved dashboard reference content contract", () => {
    expect(dashboardTrips).toHaveLength(3);
    expect(dashboardTrips.map((trip) => trip.name)).toEqual([
      "Da Nang Trip",
      "Japan Spring Escape",
      "Bali Surf & Chill"
    ]);

    for (const trip of dashboardTrips) {
      expect(trip.id).toMatch(/^[a-z0-9-]+$/);
      expect(trip.destination.length).toBeGreaterThan(3);
      expect(trip.dateRange).toContain("2025");
      expect(new URL(trip.imageUrl).protocol).toBe("https:");
      expect(trip.imageAlt.length).toBeGreaterThan(12);
    }

    expect(dashboardCreateTripCta).toEqual({
      title: "Bắt đầu chuyến đi mới",
      subtitle: "Plan your next journey"
    });
  });
});
