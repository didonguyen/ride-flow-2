import { describe, expect, it } from "vitest";
import {
  snapMinutesToTimeline,
  validateTimelineItemDraft
} from "@/src/domain/timeline";

describe("timeline domain rules", () => {
  it("accepts and normalizes a valid draft", () => {
    expect(
      validateTimelineItemDraft({
        title: "  Lunch ",
        startTime: "12:30",
        durationMinutes: 45,
        notes: "  Seafood "
      })
    ).toEqual({
      ok: true,
      value: {
        title: "Lunch",
        startTime: "12:30",
        durationMinutes: 45,
        notes: "Seafood"
      }
    });
  });

  it("rejects an empty title", () => {
    expect(
      validateTimelineItemDraft({
        title: "   ",
        startTime: "09:00",
        durationMinutes: 30,
        notes: ""
      })
    ).toEqual({ ok: false, error: "timeline_title_required" });
  });

  it("rejects an invalid time", () => {
    expect(
      validateTimelineItemDraft({
        title: "Walk",
        startTime: "25:00",
        durationMinutes: 30,
        notes: ""
      })
    ).toEqual({ ok: false, error: "timeline_time_invalid" });
  });

  it("rejects a non-positive duration", () => {
    expect(
      validateTimelineItemDraft({
        title: "Walk",
        startTime: "09:00",
        durationMinutes: 0,
        notes: ""
      })
    ).toEqual({ ok: false, error: "timeline_duration_invalid" });
  });

  it("snaps minutes to the nearest timeline increment", () => {
    expect(snapMinutesToTimeline(548)).toBe(555);
  });
});
