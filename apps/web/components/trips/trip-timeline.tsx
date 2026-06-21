import { MapPin, Star, Target } from "lucide-react";
import Image from "next/image";

import { PinnedOptionBadge } from "@/components/trip/pinned-option-badge";
import { TripStatusChip, type TripStatusTone } from "@/components/trip/trip-status-chip";
import type { PlanningAgendaItem } from "@/src/application/trips/planning-data";
import { cn } from "@/src/lib/utils";

type TripTimelineItemProps = {
  item: PlanningAgendaItem;
  statusOverride?: "confirmed" | "ready" | "pending";
  statusLabelOverride?: string;
  isLast?: boolean;
  isSelected?: boolean;
  onSelect?: (itemId: string) => void;
  onConfirm?: (itemId: string) => void;
};

function defaultStatus(item: PlanningAgendaItem, index: number) {
  if (item.status) {
    return item.status;
  }
  return index === 0 ? "confirmed" : "ready";
}

function defaultStatusLabel(status: "confirmed" | "ready" | "pending") {
  if (status === "confirmed") {
    return "Confirmed";
  }
  if (status === "pending") {
    return "Pending";
  }
  return "Ready";
}

function statusTone(status: "confirmed" | "ready" | "pending"): TripStatusTone {
  if (status === "confirmed") {
    return "confirmed";
  }
  if (status === "pending") {
    return "pending";
  }
  return "ready";
}

export function TripTimelineItem({
  item,
  statusOverride,
  statusLabelOverride,
  isLast,
  isSelected,
  onSelect,
  onConfirm
}: TripTimelineItemProps) {
  const status = statusOverride ?? item.status ?? "ready";
  const tone = statusTone(status);
  const label = statusLabelOverride ?? defaultStatusLabel(status);

  return (
    <article
      className="relative pl-10 sm:pl-12"
      data-testid="trip-timeline-item"
      data-item-id={item.id}
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-1.5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-forest-800 bg-paper-50 text-forest-800"
      >
        <Target aria-hidden="true" className="h-3 w-3" />
      </span>
      {!isLast ? (
        <span
          aria-hidden="true"
          className="absolute left-[11px] top-8 bottom-0 w-px border-l border-dashed border-sage-300 sm:left-[35px]"
        />
      ) : null}

      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl bg-paper-50 p-5 ring-1 transition",
          isSelected ? "ring-2 ring-forest-800" : "ring-paper-200"
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            {item.time}
          </span>
          <TripStatusChip tone={tone}>{label}</TripStatusChip>
        </div>
        <h3 className="font-display text-[22px] leading-tight text-ink-950 sm:text-2xl">
          {item.title}
        </h3>
        {item.place?.address ? (
          <p className="inline-flex items-center gap-1.5 text-sm text-ink-500">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
            {item.place.address}
          </p>
        ) : null}
        {item.imageUrl ? (
          <div
            className="mt-2 overflow-hidden rounded-2xl bg-paper-100 ring-1 ring-paper-200"
            data-testid="trip-timeline-image"
          >
            <div className="relative aspect-[16/9] w-full">
              <Image
                alt={item.imageAlt ?? item.title}
                className="object-cover"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                src={item.imageUrl}
              />
              <div className="absolute left-4 top-4">
                <PinnedOptionBadge />
              </div>
              {item.rating ? (
                <div
                  className="absolute right-4 bottom-4 inline-flex items-center gap-1 rounded-full bg-paper-50/95 px-2.5 py-1 text-xs font-semibold text-amber-500 shadow-rideflow-chip"
                  data-testid="trip-timeline-rating"
                >
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
        {item.description && !item.imageUrl ? (
          <p className="text-sm leading-6 text-ink-700">{item.description}</p>
        ) : null}
        {onSelect ? (
          <button
            aria-label={`Select ${item.title}`}
            className="absolute inset-0 cursor-pointer"
            data-testid="trip-timeline-select"
            onClick={() => onSelect(item.id)}
          />
        ) : null}
      </div>
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
  if (items.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed border-paper-200 bg-paper-50 p-6 text-center text-sm text-ink-500"
        data-testid="trip-timeline-empty"
      >
        No stops for this day yet. Use the “Find places” or “AI draft” actions
        above to add one.
      </div>
    );
  }
  return (
    <ol
      className="flex flex-col gap-5"
      data-testid="trip-timeline"
    >
      {items.map((item, index) => {
        const override = statusOverrides?.[item.id];
        const status = override?.status ?? defaultStatus(item, index);
        return (
          <li key={item.id}>
            <TripTimelineItem
              isLast={index === items.length - 1}
              isSelected={selectedItemId === item.id}
              item={item}
              onConfirm={onConfirmItem}
              onSelect={onSelectItem}
              statusLabelOverride={override?.label}
              statusOverride={status}
            />
          </li>
        );
      })}
    </ol>
  );
}
