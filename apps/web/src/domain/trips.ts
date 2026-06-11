import { addDays, format, isBefore, parseISO } from "date-fns";
import { isStrictDateOnly } from "@/src/domain/dates";
import { err, ok, type Result } from "@/src/lib/result";

export type TripDateRange = { startDate: string; endDate: string };
export type TripDayDraft = { date: string; dayIndex: number };

export function validateTripDateRange(
  startDate: string,
  endDate: string
): Result<TripDateRange, "trip_date_invalid" | "trip_end_before_start"> {
  if (!isStrictDateOnly(startDate) || !isStrictDateOnly(endDate)) {
    return err("trip_date_invalid");
  }

  if (isBefore(parseISO(endDate), parseISO(startDate))) {
    return err("trip_end_before_start");
  }

  return ok({ startDate, endDate }) as Result<
    TripDateRange,
    "trip_date_invalid" | "trip_end_before_start"
  >;
}

export function createTripDays(
  startDate: string,
  endDate: string
): TripDayDraft[] {
  const dateRange = validateTripDateRange(startDate, endDate);

  if (!dateRange.ok) {
    throw new Error("Invalid trip date range");
  }

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
