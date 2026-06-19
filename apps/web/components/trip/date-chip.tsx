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
        "flex w-[88px] flex-col items-center gap-1 rounded-2xl border px-3 py-3 text-center transition",
        isSelected
          ? "border-forest-800 bg-sage-100 text-forest-800"
          : "border-paper-200 bg-paper-50 text-ink-700 hover:border-sage-300",
        className
      )}
      data-selected={isSelected ? "true" : "false"}
      data-testid="date-chip"
      {...rest}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.14em]">
        {label}
      </span>
      <span className="text-sm font-semibold leading-tight">{date}</span>
    </div>
  );
}
