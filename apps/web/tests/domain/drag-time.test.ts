import { describe, expect, it } from "vitest";
import { pixelDeltaToTimelineMinutes } from "@/src/domain/timeline";

describe("pixelDeltaToTimelineMinutes", () => {
  it("converts a 20px downward drag to one 15-minute step at 80px/hour", () => {
    const result = pixelDeltaToTimelineMinutes({
      originalMinutes: 9 * 60,
      deltaY: 20,
      pixelsPerHour: 80
    });

    expect(result).toBe(9 * 60 + 15);
  });

  it("converts a 40px downward drag to 30 minutes at 80px/hour", () => {
    const result = pixelDeltaToTimelineMinutes({
      originalMinutes: 8 * 60,
      deltaY: 40,
      pixelsPerHour: 80
    });

    expect(result).toBe(8 * 60 + 30);
  });

  it("rounds to the nearest 15-minute snap on a non-aligned drag", () => {
    const result = pixelDeltaToTimelineMinutes({
      originalMinutes: 8 * 60,
      deltaY: 60,
      pixelsPerHour: 80
    });

    expect(result).toBe(8 * 60 + 45);
  });

  it("clamps to 0 when the drag would push before midnight", () => {
    const result = pixelDeltaToTimelineMinutes({
      originalMinutes: 30,
      deltaY: -500,
      pixelsPerHour: 80
    });

    expect(result).toBe(0);
  });

  it("clamps to 1439 when the drag would push past 23:45", () => {
    const result = pixelDeltaToTimelineMinutes({
      originalMinutes: 23 * 60 + 30,
      deltaY: 2000,
      pixelsPerHour: 80
    });

    expect(result).toBe(1439);
  });

  it("returns the snapped original minutes when pixelsPerHour is invalid", () => {
    expect(
      pixelDeltaToTimelineMinutes({
        originalMinutes: 9 * 60 + 7,
        deltaY: 100,
        pixelsPerHour: 0
      })
    ).toBe(9 * 60);

    expect(
      pixelDeltaToTimelineMinutes({
        originalMinutes: 9 * 60 + 22,
        deltaY: 100,
        pixelsPerHour: Number.NaN
      })
    ).toBe(9 * 60 + 15);
  });
});

