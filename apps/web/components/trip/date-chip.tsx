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
        "flex w-[124px] items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-center transition",
        isSelected
          ? "border-forest-800 bg-sage-100 text-forest-800"
          : "border-paper-200 bg-paper-50 text-ink-700 hover:border-sage-300",
        className
      )}
      data-selected={isSelected ? "true" : "false"}
      data-testid="date-chip"
      {...rest}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.16em]">
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "h-3 w-px",
          isSelected ? "bg-forest-800/30" : "bg-paper-200"
        )}
      />
      <span className="text-xs font-semibold tracking-[0.04em]">{date}</span>
    </div>
  );
}
