import { MapPin, Star, Target } from "lucide-react";
import Image from "next/image";

import { PinnedOptionBadge } from "@/components/trip/pinned-option-badge";
import { TripStatusChip, type TripStatusTone } from "@/components/trip/trip-status-chip";
import type { PlanningAgendaItem } from "@/src/application/trips/planning-data";
import { cn } from "@/src/lib/utils";

type TripTimelineItemProps = {
  item: PlanningAgendaItem;
  status?: "confirmed" | "ready" | "pending";
  statusLabel?: string;
  isSelected?: boolean;
  onSelect?: (itemId: string) => void;
  onConfirm?: (itemId: string) => void;
};

export function TripTimelineItem({
  item,
  status = "ready",
  statusLabel,
  isSelected,
  onSelect,
  onConfirm
}: TripTimelineItemProps) {
  const tone: TripStatusTone = status;
  return (
    <article
      className="relative"
      data-testid="trip-timeline-item"
      data-item-id={item.id}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-forest-800 bg-paper-50 text-forest-800"
        >
          <Target aria-hidden="true" className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
              {item.time}
            </span>
            <TripStatusChip tone={tone}>
              {statusLabel ?? (status === "confirmed" ? "Confirmed" : "Ready")}
            </TripStatusChip>
          </div>
          <h3 className="mt-1.5 font-display text-2xl text-ink-950 sm:text-[26px]">
            {item.title}
          </h3>
          {item.place?.address ? (
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-500">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              {item.place.address}
            </p>
          ) : null}
        </div>
      </div>

      {item.imageUrl ? (
        <div
          className={cn(
            "ml-13 mt-4 overflow-hidden rounded-2xl bg-paper-100 ring-1 ring-paper-200",
            isSelected && "ring-2 ring-forest-800"
          )}
          data-testid="trip-timeline-image"
        >
          <div className="relative aspect-[16/9] w-full">
            <Image
              alt={item.imageAlt}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              src={item.imageUrl}
            />
            <div className="absolute left-4 top-4">
              <PinnedOptionBadge />
            </div>
            {item.rating ? (
              <div className="absolute right-4 bottom-4 inline-flex items-center gap-1 rounded-full bg-paper-50/95 px-2.5 py-1 text-xs font-semibold text-amber-500 shadow-rideflow-chip">
                <Star aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor" />
                {item.rating}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h4 className="text-base font-semibold text-ink-950">
                  {item.title}
                </h4>
                {item.description ? (
                  <p className="text-xs leading-5 text-ink-700">
                    {item.description}
                  </p>
                ) : null}
              </div>
              {onConfirm ? (
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-forest-700"
                  data-testid="trip-timeline-confirm"
                  type="button"
                  onClick={() => onConfirm(item.id)}
                >
                  Book / Confirm
                </button>
              ) : null}
            </div>
            <span
              className="inline-flex w-fit items-center gap-1.5 rounded-full bg-paper-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500"
              data-testid="trip-timeline-backup"
            >
              <span aria-hidden="true">🔖</span>
              Backup Option
            </span>
          </div>
        </div>
      ) : null}

      {onSelect ? (
        <button
          aria-label={`Select ${item.title}`}
          className="absolute inset-0 cursor-pointer"
          data-testid="trip-timeline-select"
          onClick={() => onSelect(item.id)}
        />
      ) : null}
    </article>
  );
}

type TripTimelineProps = {
  items: PlanningAgendaItem[];
  onSelectItem?: (itemId: string) => void;
  onConfirmItem?: (itemId: string) => void;
  selectedItemId?: string | null;
  statusOverrides?: Record<string, { status: "confirmed" | "ready" | "pending"; label?: string }>;
};

export function TripTimeline({
  items,
  onSelectItem,
  onConfirmItem,
  selectedItemId,
  statusOverrides
}: TripTimelineProps) {
  return (
    <ol
      className="relative flex flex-col gap-7"
      data-testid="trip-timeline"
    >
      {items.map((item, index) => {
        const override = statusOverrides?.[item.id];
        const fallbackStatus = index === 0 ? "confirmed" : "ready";
        return (
          <li key={item.id}>
            <TripTimelineItem
              isSelected={selectedItemId === item.id}
              item={item}
              onConfirm={onConfirmItem}
              onSelect={onSelectItem}
              status={override?.status ?? fallbackStatus}
              statusLabel={override?.label}
            />
          </li>
        );
      })}
    </ol>
  );
}
