import type { DashboardActivity } from "@/src/application/trips/dashboard-summary-data";

type DashboardPlanningActivityProps = {
  entries: DashboardActivity[];
};

export function DashboardPlanningActivity({ entries }: DashboardPlanningActivityProps) {
  return (
    <article
      aria-label="Planning activity"
      className="flex h-full flex-col gap-4 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
      data-testid="dashboard-planning-activity"
    >
      <header className="flex items-center justify-between">
        <h2 className="font-display text-xl text-ink-950">Planning Activity</h2>
        <span aria-hidden="true" className="text-amber-400">
          ★
        </span>
      </header>
      <ol className="flex flex-col gap-4">
        {entries.map((entry) => (
          <li
            className="flex gap-3 border-b border-paper-200 pb-4 last:border-b-0 last:pb-0"
            data-testid={`dashboard-activity-${entry.id}`}
            key={entry.id}
          >
            <span
              aria-hidden="true"
              className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-forest-800 ring-2 ring-sage-100"
            />
            <div className="flex min-w-0 flex-col gap-1 text-sm">
              <p className="text-ink-950">
                <span className="font-semibold">{entry.actor}</span>{" "}
                <span className="text-ink-700">{entry.action}</span>{" "}
                {entry.target ? (
                  <span className="font-semibold text-forest-800">
                    {entry.target}
                  </span>
                ) : null}
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-500">
                {entry.relativeTime}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <a
        className="text-sm font-semibold text-forest-800 underline-offset-4 hover:underline"
        data-testid="dashboard-activity-full"
        href="#"
      >
        View full history
      </a>
    </article>
  );
}
