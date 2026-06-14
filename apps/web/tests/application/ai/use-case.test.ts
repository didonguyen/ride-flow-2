import { describe, expect, it, vi } from "vitest";

import {
  generateAiDraftUseCase,
  markAiDraftAppliedUseCase
} from "@/src/application/ai/use-case";
import type {
  AiDraftRepository,
  GenerateAiDraftDependencies,
  ItineraryDraftProvider
} from "@/src/application/ai/types";

const validDraft = {
  days: [
    {
      date: "2026-07-01",
      items: [
        {
          startTime: "09:00",
          durationMinutes: 90,
          title: "Visit Hoi An",
          suggestedPlaceName: "Hoi An Ancient Town"
        }
      ]
    }
  ]
};

function makeProvider(overrides: Partial<ItineraryDraftProvider> = {}): ItineraryDraftProvider {
  return {
    async generateDraft() {
      return {
        summary: "ok",
        draft: validDraft
      };
    },
    ...overrides
  };
}

function makeRepository(overrides: Partial<AiDraftRepository> = {}): AiDraftRepository {
  return {
    async recordRun() {
      return { id: "run-1" };
    },
    async updateRunStatus(runId) {
      return { id: runId };
    },
    ...overrides
  };
}

function makeDeps(
  overrides: Partial<GenerateAiDraftDependencies> = {}
): GenerateAiDraftDependencies {
  return {
    provider: makeProvider(),
    repository: makeRepository(),
    ...overrides
  };
}

describe("generateAiDraftUseCase", () => {
  it("validates the provider output before persisting", async () => {
    const recordRun = vi.fn(async () => ({ id: "run-1" }));
    const result = await generateAiDraftUseCase(
      {
        ...makeDeps(),
        repository: makeRepository({ recordRun })
      },
      {
        tripId: "trip-1",
        destination: "Da Nang",
        startDate: "2026-07-01",
        endDate: "2026-07-03",
        pace: "balanced",
        requestedBy: "user-1"
      }
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.draft.days).toHaveLength(1);
      expect(recordRun).toHaveBeenCalledWith(
        expect.objectContaining({
          tripId: "trip-1",
          status: "completed"
        })
      );
    }
  });

  it("rejects empty-day drafts", async () => {
    const result = await generateAiDraftUseCase(
      makeDeps({
        provider: makeProvider({
          async generateDraft() {
            return { summary: "empty", draft: { days: [] } };
          }
        })
      }),
      {
        tripId: "trip-1",
        destination: "Bali",
        startDate: "2026-08-01",
        endDate: "2026-08-01",
        pace: "balanced",
        requestedBy: "user-1"
      }
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("ai_draft_days_required");
    }
  });

  it("converts provider failures into ai_draft_provider_failed", async () => {
    const result = await generateAiDraftUseCase(
      makeDeps({
        provider: makeProvider({
          async generateDraft() {
            throw new Error("upstream down");
          }
        })
      }),
      {
        tripId: "trip-1",
        destination: "Bali",
        startDate: "2026-08-01",
        endDate: "2026-08-01",
        pace: "balanced",
        requestedBy: "user-1"
      }
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("ai_draft_provider_failed");
    }
  });
});

describe("markAiDraftAppliedUseCase", () => {
  it("keeps the persisted run status compatible with the database enum", async () => {
    const update = vi.fn(async (runId: string) => ({ id: runId }));
    const result = await markAiDraftAppliedUseCase(
      makeRepository({ updateRunStatus: update }),
      "run-42"
    );

    expect(result.ok).toBe(true);
    expect(update).toHaveBeenCalledWith("run-42", "completed");
  });

  it("returns ai_draft_run_record_failed on repository error", async () => {
    const result = await markAiDraftAppliedUseCase(
      makeRepository({
        async updateRunStatus() {
          throw new Error("db down");
        }
      }),
      "run-42"
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("ai_draft_run_record_failed");
    }
  });
});
