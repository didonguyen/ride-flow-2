import { canMutateTimeline } from "@/src/domain/permissions";
import { validateTimelineItemDraft } from "@/src/domain/timeline";
import { err, ok, type Result } from "@/src/lib/result";
import type {
  AddedTimelineItem,
  AddTimelineItemError,
  AddTimelineItemInput,
  TimelineRepository
} from "@/src/application/timeline/types";

export async function addTimelineItemUseCase(
  repository: TimelineRepository,
  input: AddTimelineItemInput
): Promise<Result<AddedTimelineItem, AddTimelineItemError>> {
  if (!canMutateTimeline(input.actorRole)) {
    return err("timeline_mutation_forbidden");
  }

  const draft = validateTimelineItemDraft({
    title: input.title,
    startTime: input.startTime,
    durationMinutes: input.durationMinutes,
    notes: input.notes
  });

  if (!draft.ok) {
    return draft;
  }

  const item = await repository.addItem({
    tripId: input.tripId,
    tripDayId: input.tripDayId,
    title: draft.value.title,
    startTime: draft.value.startTime,
    durationMinutes: draft.value.durationMinutes,
    notes: draft.value.notes,
    place: input.place
  });

  return ok(item) as Result<AddedTimelineItem, AddTimelineItemError>;
}
