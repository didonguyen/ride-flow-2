import { addDays, format, isBefore, parseISO } from "date-fns";
import { err, ok, type Result } from "@/src/lib/result";

export type TripDateRange = { startDate: string; endDate: string };
export type TripDayDraft = { date: string; dayIndex: number };

export function validateTripDateRange(
  startDate: string,
  endDate: string
): Result<TripDateRange, "trip_end_before_start"> {
  if (isBefore(parseISO(endDate), parseISO(startDate))) {
    return err("trip_end_before_start");
  }

  return ok({ startDate, endDate }) as Result<
    TripDateRange,
    "trip_end_before_start"
  >;
}

export function createTripDays(
  startDate: string,
  endDate: string
): TripDayDraft[] {
  const days: TripDayDraft[] = [];
  const end = parseISO(endDate);
  let current = parseISO(startDate);
  let dayIndex = 1;

  while (!isBefore(end, current)) {
    days.push({ date: format(current, "yyyy-MM-dd"), dayIndex });
    current = addDays(current, 1);
    dayIndex += 1;
  }

  return days;
}
