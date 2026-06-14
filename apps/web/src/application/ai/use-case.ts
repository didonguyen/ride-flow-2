import { validateItineraryDraft, type ItineraryDraft } from "@/src/domain/ai-draft";
import { err, ok, type Result } from "@/src/lib/result";

import type {
  GenerateAiDraftDependencies,
  GenerateAiDraftResult,
  ItineraryDraftInput
} from "@/src/application/ai/types";

export type GenerateAiDraftError =
  | "ai_draft_days_required"
  | "ai_draft_invalid"
  | "ai_draft_provider_failed"
  | "ai_draft_run_record_failed";

export async function generateAiDraftUseCase(
  dependencies: GenerateAiDraftDependencies,
  input: ItineraryDraftInput & { requestedBy: string }
): Promise<Result<GenerateAiDraftResult, GenerateAiDraftError>> {
  let summary: string;
  let rawDraft: unknown;

  try {
    const providerResult = await dependencies.provider.generateDraft(input);
    summary = providerResult.summary;
    rawDraft = providerResult.draft;
  } catch (error) {
    return {
      ok: false,
      error: "ai_draft_provider_failed"
    } satisfies Result<GenerateAiDraftResult, GenerateAiDraftError>;
  }

  const validation = validateItineraryDraft(rawDraft);
  if (!validation.ok) {
    return {
      ok: false,
      error: validation.error
    } satisfies Result<GenerateAiDraftResult, GenerateAiDraftError>;
  }

  const validatedDraft: ItineraryDraft = validation.value;
  const prompt = JSON.stringify({
    destination: input.destination,
    startDate: input.startDate,
    endDate: input.endDate,
    pace: input.pace ?? "balanced",
    preferencePrompt: input.preferencePrompt ?? ""
  });

  let runId: string;
  try {
    const run = await dependencies.repository.recordRun({
      tripId: input.tripId,
      requestedBy: input.requestedBy,
      prompt,
      status: "completed",
      validatedSummary: validatedDraft,
      rawResponse: rawDraft
    });
    runId = run.id;
  } catch (error) {
    return {
      ok: false,
      error: "ai_draft_run_record_failed"
    } satisfies Result<GenerateAiDraftResult, GenerateAiDraftError>;
  }

  return {
    ok: true,
    value: {
      draft: validatedDraft,
      runId,
      summary
    }
  } satisfies Result<GenerateAiDraftResult, GenerateAiDraftError>;
}

export async function markAiDraftAppliedUseCase(
  repository: GenerateAiDraftDependencies["repository"],
  runId: string
): Promise<Result<{ id: string }, "ai_draft_run_record_failed">> {
  try {
    const updated = await repository.updateRunStatus(runId, "completed");
    return {
      ok: true,
      value: { id: updated.id }
    } satisfies Result<{ id: string }, "ai_draft_run_record_failed">;
  } catch (error) {
    return {
      ok: false,
      error: "ai_draft_run_record_failed"
    } satisfies Result<{ id: string }, "ai_draft_run_record_failed">;
  }
}
