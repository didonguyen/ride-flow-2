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
        "flex flex-col gap-3 rounded-2xl bg-paper-50 p-4 ring-1 ring-paper-200",
        className
      )}
      data-testid="trip-day-rail"
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
        Day plan
      </h2>
      <div className="relative flex flex-col gap-3">
        <span
          aria-hidden="true"
          className="absolute left-[43px] top-3 bottom-3 w-px border-l border-dashed border-sage-300"
        />
        {days.map((day) => (
          <button
            aria-pressed={day.isSelected ? "true" : "false"}
            className="flex items-center gap-3 text-left transition"
            data-testid={`trip-day-rail-day-${day.id}`}
            key={day.id}
            type="button"
            onClick={() => onSelectDay?.(day.id)}
          >
            <span
              aria-hidden="true"
              className={cn(
                "relative z-10 inline-flex h-3 w-3 shrink-0 rounded-full ring-2 ring-paper-50",
                day.isSelected
                  ? "bg-forest-800"
                  : "bg-sage-200"
              )}
            />
            <DateChip
              date={day.date}
              isSelected={Boolean(day.isSelected)}
              label={day.label}
            />
          </button>
        ))}
      </div>
      <button
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl border border-dashed border-paper-200 bg-paper-50 px-4 py-3 text-sm font-semibold text-ink-700 transition hover:border-forest-800/40 hover:text-forest-800"
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
