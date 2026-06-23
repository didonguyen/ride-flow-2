import { Sparkles } from "lucide-react";

import { cn } from "@/src/lib/utils";
import type { DashboardActivity } from "@/src/application/trips/dashboard-summary-data";

type DashboardPlanningActivityProps = {
  entries: DashboardActivity[];
};

export function DashboardPlanningActivity({ entries }: DashboardPlanningActivityProps) {
  return (
    <article
      aria-label="Planning activity"
      className="flex h-full flex-col gap-5 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200 sm:p-6"
      data-testid="dashboard-planning-activity"
    >
      <header className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink-950">Planning Activity</h2>
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-500"
        >
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      </header>
      {entries.length === 0 ? (
        <div
          className="rounded-2xl bg-sage-50 p-5 text-sm leading-6 text-ink-700 ring-1 ring-sage-200"
          data-testid="dashboard-activity-empty"
        >
          Your planning updates will appear here once you create a trip or add
          route details.
        </div>
      ) : (
      <ol className="relative flex flex-col gap-4">
        <span
          aria-hidden="true"
          className="absolute left-[5px] top-3 bottom-3 w-px border-l border-dashed border-sage-300"
        />
        {entries.map((entry) => (
          <li
            className="relative flex gap-3 pb-4 last:pb-0"
            data-testid={`dashboard-activity-${entry.id}`}
            key={entry.id}
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-1.5 z-10 inline-flex h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-paper-50",
                entry.actor === "You"
                  ? "bg-forest-800 ring-forest-800"
                  : "bg-sage-300 ring-sage-300"
              )}
            />
            <div className="flex min-w-0 flex-col gap-1 text-sm">
              <p className="leading-5 text-ink-950">
                <span className="font-semibold">{entry.actor}</span>{" "}
                <span className="text-ink-700">{entry.action}</span>{" "}
                {entry.target ? (
                  <span className="font-semibold text-forest-800">
                    {entry.target}
                  </span>
                ) : null}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">
                {entry.relativeTime}
              </p>
            </div>
          </li>
        ))}
      </ol>
      )}
      {entries.length > 0 ? (
        <a
          className="text-center text-sm font-semibold text-forest-800 underline-offset-4 hover:underline"
          data-testid="dashboard-activity-full"
          href="#"
        >
          View full history
        </a>
      ) : null}
    </article>
  );
}
