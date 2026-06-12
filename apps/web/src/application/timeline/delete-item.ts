import { canMutateTimeline } from "@/src/domain/permissions";
import { err, ok, type Result } from "@/src/lib/result";
import type {
  DeletedTimelineItem,
  DeleteTimelineItemInput,
  TimelineMutationError,
  TimelineRepository
} from "@/src/application/timeline/types";

export async function deleteTimelineItemUseCase(
  repository: TimelineRepository,
  input: DeleteTimelineItemInput
): Promise<Result<DeletedTimelineItem, TimelineMutationError>> {
  if (!canMutateTimeline(input.actorRole)) {
    return err("timeline_mutation_forbidden");
  }

  const item = await repository.deleteItem({ itemId: input.itemId });

  return ok(item) as Result<DeletedTimelineItem, TimelineMutationError>;
}
