import type { ItineraryDraft } from "@/src/domain/ai-draft";

export type ItineraryDraftInput = {
  tripId: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  pace?: "slow" | "balanced" | "fast";
  preferencePrompt?: string;
};

export type ItineraryDraftSummary = {
  summary: string;
  draft: ItineraryDraft;
};

export interface ItineraryDraftProvider {
  generateDraft(input: ItineraryDraftInput): Promise<ItineraryDraftSummary>;
}

export type ItineraryDraftRunStatus =
  | "pending"
  | "completed"
  | "failed";

export type PersistAiDraftRunInput = {
  tripId: string;
  requestedBy: string;
  prompt: string;
  status: ItineraryDraftRunStatus;
  validatedSummary: ItineraryDraft | null;
  rawResponse: unknown;
};

export type AiDraftRunRecord = {
  id: string;
};

export type AiDraftRepository = {
  recordRun(input: PersistAiDraftRunInput): Promise<AiDraftRunRecord>;
  updateRunStatus(
    runId: string,
    status: ItineraryDraftRunStatus
  ): Promise<AiDraftRunRecord>;
};

export type GenerateAiDraftDependencies = {
  provider: ItineraryDraftProvider;
  repository: AiDraftRepository;
};

export type GenerateAiDraftResult = {
  draft: ItineraryDraft;
  runId: string;
  summary: string;
};
