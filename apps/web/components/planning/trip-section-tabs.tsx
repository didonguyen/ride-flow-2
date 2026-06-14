import Link from "next/link";
import type { Route } from "next";

type TripSectionTabsProps = {
  tripId: string;
  activeTab: "Planning" | "Memories" | "Expenses";
};

const tabs = ["Planning", "Memories", "Expenses"] as const;

export function TripSectionTabs({ activeTab, tripId }: TripSectionTabsProps) {
  return (
    <nav
      aria-label="Trip sections"
      className="mx-auto flex w-full max-w-[560px] items-center justify-center rounded-b-[1.6rem] bg-white px-4 py-5 shadow-[0_16px_34px_rgba(15,23,42,0.08)] ring-1 ring-slate-100"
    >
      <div className="flex w-full items-center justify-center gap-5 text-base font-semibold text-slate-500 sm:gap-10">
        {tabs.map((tab) => (
          <Link
            aria-current={tab === activeTab ? "page" : undefined}
            className={[
              "rounded-full px-2 py-1 transition hover:text-[#005a60]",
              tab === activeTab ? "text-[#004853]" : "text-slate-500"
            ].join(" ")}
            href={`/trips/${tripId}` as Route}
            key={tab}
          >
            {tab}
          </Link>
        ))}
      </div>
    </nav>
  );
}
