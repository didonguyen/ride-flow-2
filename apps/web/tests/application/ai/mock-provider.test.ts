import { describe, expect, it } from "vitest";

import { createMockItineraryDraftProvider } from "@/src/application/ai/mock-provider";

describe("mockItineraryDraftProvider", () => {
  it("produces one day per calendar date in the trip range", async () => {
    const provider = createMockItineraryDraftProvider();
    const summary = await provider.generateDraft({
      tripId: "trip-1",
      destination: "Da Nang",
      startDate: "2026-07-01",
      endDate: "2026-07-03",
      pace: "balanced"
    });

    expect(summary.draft.days).toHaveLength(3);
    expect(summary.draft.days.map((day) => day.date)).toEqual([
      "2026-07-01",
      "2026-07-02",
      "2026-07-03"
    ]);
  });

  it("respects pace by emitting the expected item count per day", async () => {
    const provider = createMockItineraryDraftProvider();
    const slow = await provider.generateDraft({
      tripId: "trip-1",
      destination: "Bali",
      startDate: "2026-08-01",
      endDate: "2026-08-01",
      pace: "slow"
    });
    const fast = await provider.generateDraft({
      tripId: "trip-1",
      destination: "Bali",
      startDate: "2026-08-01",
      endDate: "2026-08-01",
      pace: "fast"
    });

    expect(slow.draft.days[0].items).toHaveLength(2);
    expect(fast.draft.days[0].items).toHaveLength(4);
  });

  it("includes the preference prompt in the summary when provided", async () => {
    const provider = createMockItineraryDraftProvider();
    const summary = await provider.generateDraft({
      tripId: "trip-1",
      destination: "Kyoto",
      startDate: "2026-04-03",
      endDate: "2026-04-05",
      preferencePrompt: "Food focused",
      pace: "balanced"
    });

    expect(summary.summary.toLowerCase()).toContain("food focused");
  });
});
