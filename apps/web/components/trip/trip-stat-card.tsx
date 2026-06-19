import type { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

type TripStatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "pending";
  caption?: string;
  className?: string;
};

export function TripStatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  caption,
  className
}: TripStatCardProps) {
  const isPending = tone === "pending";
  return (
    <article
      className={cn(
        "flex h-full min-w-0 flex-col gap-3 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200",
        isPending && "ring-2 ring-terracotta-200",
        className
      )}
      data-testid="trip-stat-card"
      data-tone={tone}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
          {label}
        </span>
        <span
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-xl",
            isPending
              ? "bg-terracotta-100 text-terracotta-500"
              : "bg-sage-100 text-forest-800"
          )}
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
        </span>
      </div>
      <div
        className={cn(
          "text-3xl font-semibold tracking-[-0.02em]",
          isPending ? "text-terracotta-500" : "text-ink-950"
        )}
      >
        {value}
      </div>
      {caption ? (
        <p className="text-xs font-medium text-ink-500">{caption}</p>
      ) : null}
    </article>
  );
}
