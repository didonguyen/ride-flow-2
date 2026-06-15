import { err, ok, type Result } from "@/src/lib/result";

export type TimelineItemDraft = {
  title: string;
  startTime: string;
  durationMinutes: number;
  notes: string;
};

export type TimelineValidationError =
  | "timeline_title_required"
  | "timeline_time_invalid"
  | "timeline_duration_invalid";

export function validateTimelineItemDraft(
  draft: TimelineItemDraft
): Result<TimelineItemDraft, TimelineValidationError> {
  const title = draft.title.trim();

  if (!title) {
    return err("timeline_title_required");
  }

  if (timeToMinutes(draft.startTime) === null) {
    return err("timeline_time_invalid");
  }

  if (
    !Number.isInteger(draft.durationMinutes) ||
    draft.durationMinutes <= 0
  ) {
    return err("timeline_duration_invalid");
  }

  return ok({
    title,
    startTime: draft.startTime,
    durationMinutes: draft.durationMinutes,
    notes: draft.notes.trim()
  }) as Result<TimelineItemDraft, TimelineValidationError>;
}

export function timeToMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

export function minutesToTime(minutesSinceMidnight: number): string {
  const boundedMinutes = Math.max(0, Math.min(1439, minutesSinceMidnight));
  const hours = Math.floor(boundedMinutes / 60);
  const minutes = boundedMinutes % 60;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function snapMinutesToTimeline(minutesSinceMidnight: number): number {
  const snapped = Math.round(minutesSinceMidnight / 15) * 15;

  return Math.max(0, Math.min(1439, snapped));
}

export type PixelDeltaInput = {
  originalMinutes: number;
  deltaY: number;
  pixelsPerHour: number;
};

export function pixelDeltaToTimelineMinutes({
  originalMinutes,
  deltaY,
  pixelsPerHour
}: PixelDeltaInput): number {
  if (!Number.isFinite(pixelsPerHour) || pixelsPerHour <= 0) {
    return snapMinutesToTimeline(originalMinutes);
  }

  const minutesPerPixel = 60 / pixelsPerHour;
  const proposed = originalMinutes + deltaY * minutesPerPixel;

  return snapMinutesToTimeline(proposed);
}
