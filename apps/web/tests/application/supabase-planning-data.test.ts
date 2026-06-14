import { describe, expect, it } from "vitest";

import { mapSupabasePlanningTrip } from "@/src/application/trips/supabase-planning-data";

describe("supabase planning data", () => {
  it("maps trip, day, and timeline rows into the Planning workspace model", () => {
    const trip = mapSupabasePlanningTrip({
      trip: {
        id: "trip-1",
        name: "Da Nang Trip",
        destination: "Da Nang",
        start_date: "2026-07-01",
        end_date: "2026-07-02"
      },
      days: [
        {
          id: "day-1",
          trip_id: "trip-1",
          date: "2026-07-01",
          day_index: 1
        }
      ],
      timelineItems: [
        {
          id: "item-1",
          trip_id: "trip-1",
          trip_day_id: "day-1",
          start_time: "10:45:00",
          duration_minutes: 90,
          title: "Airport arrival",
          notes: "Pick up rental van",
          place_name: "Da Nang Airport",
          place_lat: 16.0439,
          place_lng: 108.1994
        }
      ]
    });

    expect(trip).toMatchObject({
      id: "trip-1",
      name: "Da Nang Trip",
      dateRange: "Jul 1 - Jul 2, 2026",
      selectedDayId: "day-1"
    });
    expect(trip.days[0]).toMatchObject({
      id: "day-1",
      label: "Day 1",
      date: "Wed, Jul 1"
    });
    expect(trip.agenda[0]).toMatchObject({
      id: "item-1",
      stop: 1,
      time: "10:45 AM",
      title: "Airport arrival",
      description: "Pick up rental van"
    });
    expect(trip.mapPins[0]).toMatchObject({
      stop: 1,
      label: "Da Nang Airport"
    });
  });
});
