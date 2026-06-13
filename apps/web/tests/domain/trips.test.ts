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

  it("rejects malformed and impossible calendar dates", () => {
    expect(validateTripDateRange("bad", "2026-07-01")).toEqual({
      ok: false,
      error: "trip_date_invalid"
    });

    expect(validateTripDateRange("2026-02-31", "2026-03-01")).toEqual({
      ok: false,
      error: "trip_date_invalid"
    });
  });

  it("creates one trip day per calendar date inclusively", () => {
    expect(createTripDays("2026-07-01", "2026-07-03")).toEqual([
      { date: "2026-07-01", dayIndex: 1 },
      { date: "2026-07-02", dayIndex: 2 },
      { date: "2026-07-03", dayIndex: 3 }
    ]);
  });

  it("throws a clear error when creating days from invalid dates", () => {
    expect(() => createTripDays("bad", "2026-07-01")).toThrow(
      "Invalid trip date range"
    );
  });
});
