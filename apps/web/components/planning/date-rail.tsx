import { ChevronLeft, ChevronRight, Cloud, Sun } from "lucide-react";

import type { PlanningDay } from "@/src/application/trips/planning-data";

type DateRailProps = {
  days: PlanningDay[];
};

export function DateRail({ days }: DateRailProps) {
  return (
    <section className="bg-forest-800 px-5 py-7 text-white shadow-sm sm:px-8 lg:px-9">
      <div className="mx-auto flex max-w-[1280px] items-center gap-5">
        <button
          aria-label="Previous day"
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15 lg:flex"
          type="button"
        >
          <ChevronLeft aria-hidden="true" className="h-6 w-6" />
        </button>

        <div className="flex min-w-0 flex-1 gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {days.map((day) => {
            const WeatherIcon = day.weatherIcon === "sun" ? Sun : Cloud;

            return (
              <button
                aria-pressed={day.isSelected ? "true" : "false"}
                className={[
                  "min-w-[190px] rounded-xl px-5 py-5 text-left ring-1 transition sm:min-w-[210px]",
                  day.isSelected
                    ? "bg-white text-slate-950 shadow-xl shadow-slate-950/10 ring-white"
                    : "bg-white/10 text-white ring-white/25 hover:bg-white/15"
                ].join(" ")}
                key={day.id}
                type="button"
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={[
                      "text-sm font-extrabold uppercase tracking-[0.16em]",
                      day.isSelected ? "text-forest-800" : "text-white/80"
                    ].join(" ")}
                  >
                    {day.label}
                  </span>
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <WeatherIcon aria-hidden="true" className="h-4 w-4" />
                    {day.temperature}
                  </span>
                </div>
                <div className="mt-5 text-2xl font-extrabold tracking-[-0.03em]">
                  {day.date}
                </div>
              </button>
            );
          })}
        </div>

        <button
          aria-label="Next day"
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/15 lg:flex"
          type="button"
        >
          <ChevronRight aria-hidden="true" className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
