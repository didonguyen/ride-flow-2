import { canMutateTimeline } from "@/src/domain/permissions";
import { minutesToTime, snapMinutesToTimeline } from "@/src/domain/timeline";
import { err, ok, type Result } from "@/src/lib/result";
import type {
  MoveTimelineItemInput,
  MovedTimelineItem,
  TimelineMutationError,
  TimelineRepository
} from "@/src/application/timeline/types";

export async function moveTimelineItemUseCase(
  repository: TimelineRepository,
  input: MoveTimelineItemInput
): Promise<Result<MovedTimelineItem, TimelineMutationError>> {
  if (!canMutateTimeline(input.actorRole)) {
    return err("timeline_mutation_forbidden");
  }

  if (!Number.isFinite(input.minutesSinceMidnight)) {
    return err("timeline_time_invalid");
  }

  const startTime = minutesToTime(
    snapMinutesToTimeline(input.minutesSinceMidnight)
  );
  const item = await repository.moveItem({
    itemId: input.itemId,
    startTime
  });

  return ok(item) as Result<MovedTimelineItem, TimelineMutationError>;
}
