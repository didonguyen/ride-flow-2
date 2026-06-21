import { describe, expect, it } from "vitest";

import {
  getPlanningTripById,
  planningTrips
} from "@/src/application/trips/planning-data";

describe("planning data", () => {
  it("returns the demo planning workspace for the Da Nang trip", () => {
    const trip = getPlanningTripById("da-nang");

    expect(trip?.name).toBe("Da Nang Trip");
    expect(trip?.selectedDayId).toBe("day-1");
    expect(trip?.days).toHaveLength(3);
    expect(trip?.agenda).toHaveLength(3);
  });

  it("keeps agenda stop order aligned with map pins", () => {
    const trip = getPlanningTripById("da-nang");
    const agendaStops = trip?.agenda.map((item) => item.stop) ?? [];
    const mapStops = trip?.mapPins.map((pin) => pin.stop) ?? [];

    expect(agendaStops).toEqual([1, 2, 3]);
    expect(mapStops).toEqual(agendaStops);
  });

  it("returns the new Nam Cát Tiên sample trip with per-day agenda", () => {
    const trip = getPlanningTripById("nam-cat-tien");

    expect(trip?.name).toBe("Nam Cát Tiên Exploration");
    expect(trip?.days).toHaveLength(2);
    expect(trip?.agenda).toHaveLength(9);
    expect(trip?.agenda.filter((item) => item.dayId === "day-1")).toHaveLength(
      5
    );
    expect(trip?.agenda.filter((item) => item.dayId === "day-2")).toHaveLength(
      4
    );
  });
});
