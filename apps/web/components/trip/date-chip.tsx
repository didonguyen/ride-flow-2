import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

type DateChipProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  date: string;
  isSelected?: boolean;
};

export function DateChip({
  label,
  date,
  isSelected = false,
  className,
  ...rest
}: DateChipProps) {
  return (
    <div
      className={cn(
        "flex w-full min-w-[112px] items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-center transition",
        isSelected
          ? "border-forest-800 bg-sage-100 text-forest-800"
          : "border-paper-200 bg-paper-50 text-ink-700 hover:border-sage-300",
        className
      )}
      data-selected={isSelected ? "true" : "false"}
      data-testid="date-chip"
      {...rest}
    >
      <span
        className={cn(
          "text-[11px] font-semibold uppercase tracking-[0.18em]",
          isSelected ? "text-forest-800" : "text-ink-500"
        )}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "h-3 w-px",
          isSelected ? "bg-forest-800/30" : "bg-paper-200"
        )}
      />
      <span className="text-sm font-semibold leading-tight">{date}</span>
    </div>
  );
}
