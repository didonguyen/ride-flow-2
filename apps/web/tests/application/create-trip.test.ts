import { describe, expect, it, vi } from "vitest";
import { createTripUseCase } from "@/src/application/trips/create-trip";
import type { TripRepository } from "@/src/application/trips/types";

describe("createTripUseCase", () => {
  it("persists a trip with one day per date in the requested range", async () => {
    const repository: TripRepository = {
      createTripWithDays: vi.fn(async (input) => ({
        id: "trip-1",
        ownerId: input.ownerId,
        name: input.name,
        destination: input.destination,
        startDate: input.startDate,
        endDate: input.endDate,
        days: input.days.map((day, index) => ({
          id: `day-${index + 1}`,
          tripId: "trip-1",
          date: day.date,
          dayIndex: day.dayIndex
        }))
      }))
    };

    const result = await createTripUseCase(repository, {
      ownerId: "user-1",
      name: "Da Nang Food Trip",
      destination: "Da Nang",
      startDate: "2026-07-01",
      endDate: "2026-07-02"
    });

    expect(repository.createTripWithDays).toHaveBeenCalledWith({
      ownerId: "user-1",
      name: "Da Nang Food Trip",
      destination: "Da Nang",
      startDate: "2026-07-01",
      endDate: "2026-07-02",
      days: [
        { date: "2026-07-01", dayIndex: 1 },
        { date: "2026-07-02", dayIndex: 2 }
      ]
    });
    expect(result).toEqual({
      ok: true,
      value: {
        id: "trip-1",
        ownerId: "user-1",
        name: "Da Nang Food Trip",
        destination: "Da Nang",
        startDate: "2026-07-01",
        endDate: "2026-07-02",
        days: [
          {
            id: "day-1",
            tripId: "trip-1",
            date: "2026-07-01",
            dayIndex: 1
          },
          {
            id: "day-2",
            tripId: "trip-1",
            date: "2026-07-02",
            dayIndex: 2
          }
        ]
      }
    });
  });

  it("rejects a blank trip name before calling the repository", async () => {
    const repository: TripRepository = {
      createTripWithDays: vi.fn()
    };

    const result = await createTripUseCase(repository, {
      ownerId: "user-1",
      name: "  ",
      destination: "Da Nang",
      startDate: "2026-07-01",
      endDate: "2026-07-02"
    });

    expect(result).toEqual({ ok: false, error: "trip_name_required" });
    expect(repository.createTripWithDays).not.toHaveBeenCalled();
  });

  it("rejects invalid trip dates before calling the repository", async () => {
    const repository: TripRepository = {
      createTripWithDays: vi.fn()
    };

    const result = await createTripUseCase(repository, {
      ownerId: "user-1",
      name: "Da Nang Food Trip",
      destination: "Da Nang",
      startDate: "bad-date",
      endDate: "2026-07-02"
    });

    expect(result).toEqual({ ok: false, error: "trip_date_invalid" });
    expect(repository.createTripWithDays).not.toHaveBeenCalled();
  });
});
