import { describe, expect, it } from "vitest";
import { createTripDays, validateTripDateRange } from "@/src/domain/trips";

describe("trip date rules", () => {
  it("accepts a valid date range", () => {
    expect(validateTripDateRange("2026-07-01", "2026-07-03")).toEqual({
      ok: true,
      value: { startDate: "2026-07-01", endDate: "2026-07-03" }
    });
  });

  it("rejects an end date before the start date", () => {
    expect(validateTripDateRange("2026-07-03", "2026-07-01")).toEqual({
      ok: false,
      error: "trip_end_before_start"
    });
  });

  it("creates one trip day per calendar date inclusively", () => {
    expect(createTripDays("2026-07-01", "2026-07-03")).toEqual([
      { date: "2026-07-01", dayIndex: 1 },
      { date: "2026-07-02", dayIndex: 2 },
      { date: "2026-07-03", dayIndex: 3 }
    ]);
  });
});
