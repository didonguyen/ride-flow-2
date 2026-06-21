import { Plus } from "lucide-react";

import { DateChip } from "@/components/trip/date-chip";
import { cn } from "@/src/lib/utils";

export type DayRailDay = {
  id: string;
  label: string;
  date: string;
  isSelected?: boolean;
};

type TripDayRailProps = {
  days: DayRailDay[];
  onSelectDay?: (dayId: string) => void;
  onAddDay?: () => void;
  className?: string;
};

export function TripDayRail({
  days,
  onSelectDay,
  onAddDay,
  className
}: TripDayRailProps) {
  return (
    <aside
      aria-label="Trip days"
      className={cn(
        "flex w-full flex-col gap-5",
        className
      )}
      data-testid="trip-day-rail"
    >
      <h2 className="sr-only">Trip days</h2>
      <ol className="relative flex flex-col gap-5">
        <span
          aria-hidden="true"
          className="absolute left-3 top-4 bottom-4 w-px border-l border-dashed border-sage-300"
        />
        {days.map((day) => (
          <li className="relative" key={day.id}>
            <button
              aria-pressed={day.isSelected ? "true" : "false"}
              className="group flex w-full items-center gap-4 rounded-2xl bg-transparent py-1 text-left transition"
              data-testid={`trip-day-rail-day-${day.id}`}
              type="button"
              onClick={() => onSelectDay?.(day.id)}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 inline-flex h-3 w-3 shrink-0 rounded-full ring-4 ring-paper-50 transition",
                  day.isSelected
                    ? "bg-forest-800"
                    : "bg-sage-200 group-hover:bg-sage-300"
                )}
              />
              <DateChip
                date={day.date}
                isSelected={Boolean(day.isSelected)}
                label={day.label}
              />
            </button>
          </li>
        ))}
      </ol>
      <button
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-paper-300 bg-paper-50 px-4 py-4 text-sm font-semibold text-ink-700 transition hover:border-forest-800/40 hover:text-forest-800"
        data-testid="trip-day-rail-add"
        type="button"
        onClick={onAddDay}
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
        Add Day
      </button>
    </aside>
  );
}
