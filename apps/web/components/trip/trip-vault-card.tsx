import { Camera, MapPin, NotebookPen, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

type VaultStat = {
  label: string;
  value: number;
  icon: LucideIcon;
};

const ICON_TONE = "bg-sage-100 text-forest-800";

type TripVaultCardProps = {
  photosCount: number;
  journalCount: number;
  placesCount: number;
  onAddMemory?: () => void;
  className?: string;
};

export function TripVaultCard({
  photosCount,
  journalCount,
  placesCount,
  onAddMemory,
  className
}: TripVaultCardProps) {
  const stats: VaultStat[] = [
    { label: "Photos", value: photosCount, icon: Camera },
    { label: "Journal Entries", value: journalCount, icon: NotebookPen },
    { label: "Places Saved", value: placesCount, icon: MapPin }
  ];

  return (
    <article
      className={cn(
        "flex flex-col gap-5 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200",
        className
      )}
      data-testid="trip-vault-card"
    >
      <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink-950">
        Trip Vault
      </h3>
      <ul className="flex flex-col gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <li
              className="flex items-center gap-3"
              data-testid={`trip-vault-stat-${stat.label.toLowerCase().replace(/\s+/g, "-")}`}
              key={stat.label}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-xl",
                  ICON_TONE
                )}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm font-medium text-ink-700">
                {stat.label}
              </span>
              <span className="text-base font-semibold text-ink-950">
                {stat.value}
              </span>
            </li>
          );
        })}
      </ul>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700"
        data-testid="trip-vault-add"
        type="button"
        onClick={onAddMemory}
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
        Add Memory
      </button>
    </article>
  );
}
