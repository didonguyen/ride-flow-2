import { MapPin } from "lucide-react";
import { cn } from "@/src/lib/utils";

type PinnedOptionBadgeProps = {
  className?: string;
};

export function PinnedOptionBadge({ className }: PinnedOptionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-forest-800 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-rideflow-chip",
        className
      )}
      data-testid="pinned-option-badge"
    >
      <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
      Pinned Option
    </span>
  );
}
