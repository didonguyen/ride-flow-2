import { canMutatePlanning } from "@/src/domain/permissions";
import {
  applyPin,
  applyUnpin,
  validateStopDraft,
  validateStopOptionDraft,
  type Stop,
  type StopOption
} from "@/src/domain/stop-options";
import { err, ok, type Result } from "@/src/lib/result";

import type {
  AddOptionInput,
  AddStopInput,
  DeleteStopInput,
  GenerateAiOptionsInput,
  OptionMutationError,
  PinOptionInput,
  RemoveOptionInput,
  ReorderStopsInput,
  SearchGooglePlacesInput,
  StopMutationError,
  StopOptionAiGenerator,
  StopOptionProvider,
  StopOptionRepository,
  StopRepository,
  UnpinOptionInput,
  UpdateStopInput
} from "@/src/application/stop-options/types";

export async function addStopUseCase(
  repository: StopRepository,
  input: AddStopInput
): Promise<Result<{ id: string }, StopMutationError>> {
  if (!canMutatePlanning(input.actorRole)) {
    return err("stop_mutation_forbidden");
  }

  const validation = validateStopDraft(input.draft);
  if (!validation.ok) {
    return err("stop_mutation_forbidden");
  }

  const created = await repository.addStop({
    tripId: input.tripId,
    dayId: input.dayId,
    draft: validation.value,
    sortOrder: 0,
    createdBy: input.createdBy
  });

  return ok(created) as Result<{ id: string }, StopMutationError>;
}

export async function updateStopUseCase(
  repository: StopRepository,
  input: UpdateStopInput
): Promise<Result<{ id: string }, StopMutationError>> {
  if (!canMutatePlanning(input.actorRole)) {
    return err("stop_mutation_forbidden");
  }

  const result = await repository.updateStop({
    stopId: input.stopId,
    patch: input.patch
  });

  return ok(result) as Result<{ id: string }, StopMutationError>;
}

export async function deleteStopUseCase(
  repository: StopRepository,
  input: DeleteStopInput
): Promise<Result<{ id: string }, StopMutationError>> {
  if (!canMutatePlanning(input.actorRole)) {
    return err("stop_mutation_forbidden");
  }

  const result = await repository.deleteStop({ stopId: input.stopId });
  return ok(result) as Result<{ id: string }, StopMutationError>;
}

export async function reorderStopsUseCase(
  repository: StopRepository,
  input: ReorderStopsInput
): Promise<Result<{ stopIds: string[] }, StopMutationError>> {
  if (!canMutatePlanning(input.actorRole)) {
    return err("stop_mutation_forbidden");
  }

  const result = await repository.reorderStops({ moves: input.moves });
  return ok(result) as Result<{ stopIds: string[] }, StopMutationError>;
}

export async function pinStopOptionUseCase(
  repository: StopOptionRepository,
  input: PinOptionInput
): Promise<Result<{ stopId: string; optionId: string }, OptionMutationError>> {
  if (!canMutatePlanning(input.actorRole)) {
    return err("stop_mutation_forbidden");
  }

  const options = await repository.listOptionsForStop({ stopId: input.stopId });
  const target = options.find((option) => option.id === input.optionId);

  if (!target) {
    return err("option_not_found");
  }

  const updated = applyPin(options, input.optionId);

  for (const option of updated) {
    if (option.status !== options.find((existing) => existing.id === option.id)?.status) {
      await repository.updateOptionStatus({
        stopId: option.stopId,
        optionId: option.id,
        status: option.status
      });
    }
  }

  await repository.updateStopPinned({
    stopId: input.stopId,
    pinnedOptionId: input.optionId,
    status: "pinned"
  });

  return ok({
    stopId: input.stopId,
    optionId: input.optionId
  }) as Result<{ stopId: string; optionId: string }, OptionMutationError>;
}

export async function unpinStopOptionUseCase(
  repository: StopOptionRepository,
  input: UnpinOptionInput
): Promise<Result<{ stopId: string }, OptionMutationError>> {
  if (!canMutatePlanning(input.actorRole)) {
    return err("stop_mutation_forbidden");
  }

  const options = await repository.listOptionsForStop({ stopId: input.stopId });
  const updated = applyUnpin(options);

  for (const option of updated) {
    if (option.status !== options.find((existing) => existing.id === option.id)?.status) {
      await repository.updateOptionStatus({
        stopId: option.stopId,
        optionId: option.id,
        status: option.status
      });
    }
  }

  await repository.updateStopPinned({
    stopId: input.stopId,
    pinnedOptionId: null,
    status: "action_needed"
  });

  return ok({ stopId: input.stopId }) as Result<
    { stopId: string },
    OptionMutationError
  >;
}

export async function addManualOptionUseCase(
  repository: StopOptionRepository,
  input: AddOptionInput
): Promise<Result<{ id: string }, OptionMutationError>> {
  if (!canMutatePlanning(input.actorRole)) {
    return err("stop_mutation_forbidden");
  }

  const validation = validateStopOptionDraft({ ...input.draft, source: "manual" });
  if (!validation.ok) {
    return err("stop_mutation_forbidden");
  }

  const result = await repository.addOption({
    stopId: input.stopId,
    tripId: input.tripId,
    draft: validation.value,
    status: "candidate",
    source: "manual"
  });

  return ok(result) as Result<{ id: string }, OptionMutationError>;
}

export async function generateStopOptionsUseCase(
  repository: StopOptionRepository,
  generator: StopOptionAiGenerator,
  input: GenerateAiOptionsInput
): Promise<Result<{ added: number }, OptionMutationError>> {
  if (!canMutatePlanning(input.actorRole)) {
    return err("stop_mutation_forbidden");
  }

  let drafts = input.results;

  if (drafts.length === 0) {
    drafts = await generator.generateOptions({
      stopTitle: input.stopTitle,
      destination: input.destination
    });
  }

  const validatedDrafts: typeof drafts = [];
  for (const draft of drafts) {
    const validation = validateStopOptionDraft({ ...draft, source: "ai" });
    if (validation.ok) {
      validatedDrafts.push(validation.value);
    }
    if (validatedDrafts.length >= 5) {
      break;
    }
  }

  if (validatedDrafts.length === 0) {
    return ok({ added: 0 }) as Result<{ added: 0 }, OptionMutationError>;
  }

  for (const draft of validatedDrafts) {
    await repository.addOption({
      stopId: input.stopId,
      tripId: input.tripId,
      draft,
      status: "candidate",
      source: "ai"
    });
  }

  return ok({ added: validatedDrafts.length }) as Result<
    { added: number },
    OptionMutationError
  >;
}

export async function searchGooglePlacesForStopUseCase(
  repository: StopOptionRepository,
  provider: StopOptionProvider,
  input: SearchGooglePlacesInput
): Promise<Result<{ added: number }, OptionMutationError>> {
  if (!canMutatePlanning(input.actorRole)) {
    return err("stop_mutation_forbidden");
  }

  let drafts = input.results;

  if (drafts.length === 0) {
    drafts = await provider.searchGooglePlaces({
      query: input.query,
      near: { lat: null, lng: null }
    });
  }

  const validatedDrafts: typeof drafts = [];
  for (const draft of drafts) {
    const validation = validateStopOptionDraft({
      ...draft,
      source: "google_places"
    });
    if (validation.ok) {
      validatedDrafts.push(validation.value);
    }
    if (validatedDrafts.length >= 5) {
      break;
    }
  }

  for (const draft of validatedDrafts) {
    await repository.addOption({
      stopId: input.stopId,
      tripId: input.tripId,
      draft,
      status: "candidate",
      source: "google_places"
    });
  }

  return ok({ added: validatedDrafts.length }) as Result<
    { added: number },
    OptionMutationError
  >;
}

export async function removeStopOptionUseCase(
  repository: StopOptionRepository,
  input: RemoveOptionInput
): Promise<Result<{ id: string }, OptionMutationError>> {
  if (!canMutatePlanning(input.actorRole)) {
    return err("stop_mutation_forbidden");
  }

  const options = await repository.listOptionsForStop({ stopId: input.stopId });
  const target = options.find((option) => option.id === input.optionId);

  if (!target) {
    return err("option_not_found");
  }

  if (target.status === "pinned") {
    await repository.updateOptionStatus({
      stopId: input.stopId,
      optionId: input.optionId,
      status: "candidate"
    });
    await repository.updateStopPinned({
      stopId: input.stopId,
      pinnedOptionId: null,
      status: "action_needed"
    });
  } else {
    await repository.removeOption({
      stopId: input.stopId,
      optionId: input.optionId
    });
  }

  return ok({ id: input.optionId }) as Result<
    { id: string },
    OptionMutationError
  >;
}

export type ReducePinResult = {
  options: StopOption[];
  pinnedOptionId: string | null;
  status: Stop["status"];
};

export function reducePin(options: StopOption[], optionId: string): ReducePinResult {
  const next = applyPin(options, optionId);
  return {
    options: next,
    pinnedOptionId: optionId,
    status: "pinned"
  };
}

export function reduceUnpin(options: StopOption[]): ReducePinResult {
  return {
    options: applyUnpin(options),
    pinnedOptionId: null,
    status: "action_needed"
  };
}