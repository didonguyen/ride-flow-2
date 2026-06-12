import type { PlaceSearchResult } from "@/src/domain/places";
import type { TripRole } from "@/src/domain/permissions";
import type { TimelineValidationError } from "@/src/domain/timeline";

export type AddTimelineItemInput = {
  actorRole: TripRole;
  tripId: string;
  tripDayId: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  notes: string;
  place?: PlaceSearchResult;
};

export type PersistTimelineItemInput = {
  tripId: string;
  tripDayId: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  notes: string;
  place?: PlaceSearchResult;
};

export type MoveTimelineItemInput = {
  actorRole: TripRole;
  itemId: string;
  minutesSinceMidnight: number;
};

export type DeleteTimelineItemInput = {
  actorRole: TripRole;
  itemId: string;
};

export type AddedTimelineItem = {
  id: string;
};

export type MovedTimelineItem = {
  id: string;
  startTime: string;
};

export type DeletedTimelineItem = {
  id: string;
};

export type TimelineMutationError = "timeline_mutation_forbidden";

export type AddTimelineItemError =
  | TimelineMutationError
  | TimelineValidationError;

export type TimelineRepository = {
  addItem(input: PersistTimelineItemInput): Promise<AddedTimelineItem>;
  moveItem(input: {
    itemId: string;
    startTime: string;
  }): Promise<MovedTimelineItem>;
  deleteItem(input: { itemId: string }): Promise<DeletedTimelineItem>;
};
