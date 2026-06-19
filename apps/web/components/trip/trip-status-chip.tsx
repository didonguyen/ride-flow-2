import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export type TripStatusTone =
  | "confirmed"
  | "ready"
  | "pending"
  | "settled"
  | "needs-transfer"
  | "neutral";

const TONE_CLASSES: Record<TripStatusTone, string> = {
  confirmed: "bg-sage-200 text-forest-800",
  ready: "bg-sage-100 text-forest-800",
  pending: "bg-terracotta-100 text-terracotta-500",
  settled: "bg-sage-200 text-forest-800",
  "needs-transfer": "bg-terracotta-100 text-terracotta-500",
  neutral: "bg-paper-100 text-ink-700"
};

type TripStatusChipProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: TripStatusTone;
  uppercase?: boolean;
};

export function TripStatusChip({
  children,
  className,
  tone = "neutral",
  uppercase = true,
  ...rest
}: TripStatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold leading-none",
        uppercase && "uppercase tracking-[0.14em]",
        TONE_CLASSES[tone],
        className
      )}
      data-testid="trip-status-chip"
      data-tone={tone}
      {...rest}
    >
      {children}
    </span>
  );
}
