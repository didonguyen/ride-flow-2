import { describe, expect, it } from "vitest";
import { validateItineraryDraft } from "@/src/domain/ai-draft";

describe("AI itinerary draft rules", () => {
  it("accepts a valid one-day draft", () => {
    expect(
      validateItineraryDraft({
        days: [
          {
            date: "2026-07-01",
            items: [
              {
                startTime: "09:15",
                durationMinutes: 60,
                title: "Beach walk",
                suggestedPlaceName: "My Khe Beach"
              }
            ]
          }
        ]
      })
    ).toEqual({
      ok: true,
      value: {
        days: [
          {
            date: "2026-07-01",
            items: [
              {
                startTime: "09:15",
                durationMinutes: 60,
                title: "Beach walk",
                suggestedPlaceName: "My Khe Beach",
                notes: ""
              }
            ]
          }
        ]
      }
    });
  });

  it("rejects empty days with a specific error", () => {
    expect(validateItineraryDraft({ days: [] })).toEqual({
      ok: false,
      error: "ai_draft_days_required"
    });
  });

  it("rejects impossible calendar dates", () => {
    expect(
      validateItineraryDraft({ days: [{ date: "2026-02-31", items: [] }] })
    ).toEqual({
      ok: false,
      error: "ai_draft_invalid"
    });
  });
});
