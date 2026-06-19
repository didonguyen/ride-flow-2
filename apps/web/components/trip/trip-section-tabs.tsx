import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/src/lib/utils";

export type TripSection = "Planning" | "Memories" | "Expenses";

const TABS: TripSection[] = ["Planning", "Memories", "Expenses"];

const hrefFor = (tab: TripSection, tripId: string): Route => {
  if (tab === "Planning") {
    return `/trips/${tripId}` as Route;
  }
  if (tab === "Memories") {
    return `/trips/${tripId}/memories` as Route;
  }
  return `/trips/${tripId}/expenses` as Route;
};

type TripSectionTabsProps = {
  tripId: string;
  activeTab: TripSection;
  className?: string;
};

export function TripSectionTabs({
  tripId,
  activeTab,
  className
}: TripSectionTabsProps) {
  return (
    <nav
      aria-label="Trip sections"
      className={cn(
        "flex w-full items-center justify-center border-b border-paper-200 bg-paper-50 px-4 py-4",
        className
      )}
      data-testid="trip-section-tabs"
    >
      <ul className="flex items-center gap-8 text-sm font-semibold">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <li key={tab}>
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative inline-flex items-center pb-1 text-base transition",
                  isActive
                    ? "text-forest-800"
                    : "text-ink-500 hover:text-ink-700"
                )}
                data-testid={`trip-section-tab-${tab.toLowerCase()}`}
                href={hrefFor(tab, tripId)}
              >
                {tab}
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-forest-800"
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
