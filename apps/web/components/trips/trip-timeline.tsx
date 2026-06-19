import { MapPin, Star, Target } from "lucide-react";
import Image from "next/image";

import { PinnedOptionBadge } from "@/components/trip/pinned-option-badge";
import { TripStatusChip, type TripStatusTone } from "@/components/trip/trip-status-chip";
import type { PlanningAgendaItem } from "@/src/application/trips/planning-data";
import { cn } from "@/src/lib/utils";

const STATUS_TONE: Record<string, TripStatusTone> = {
  confirmed: "confirmed",
  ready: "ready",
  pending: "pending"
};

type TripTimelineItemProps = {
  item: PlanningAgendaItem;
  onSelect?: (itemId: string) => void;
  onConfirm?: (itemId: string) => void;
  isSelected?: boolean;
};

export function TripTimelineItem({
  item,
  onSelect,
  onConfirm,
  isSelected
}: TripTimelineItemProps) {
  return (
    <article
      className="relative"
      data-testid="trip-timeline-item"
      data-item-id={item.id}
    >
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-paper-200 bg-paper-50 text-forest-800"
        >
          <Target aria-hidden="true" className="h-4 w-4" />
        </span>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            {item.time}
          </span>
          <h3 className="font-display text-lg text-ink-950">{item.title}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
            {item.place?.address ? (
              <span className="inline-flex items-center gap-1">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                {item.place.address}
              </span>
            ) : item.description ? (
              <span>{item.description}</span>
            ) : null}
          </div>
        </div>
        {item.category === "hotel" ? (
          <TripStatusChip tone="confirmed">Confirmed</TripStatusChip>
        ) : (
          <TripStatusChip tone="ready">Ready</TripStatusChip>
        )}
      </div>

      {item.imageUrl ? (
        <div
          className={cn(
            "mt-4 overflow-hidden rounded-2xl bg-paper-100 ring-1 ring-paper-200",
            isSelected && "ring-2 ring-forest-800"
          )}
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
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink-950">{item.title}</h4>
              {onConfirm ? (
                <button
                  className="inline-flex items-center justify-center rounded-full bg-forest-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-forest-700"
                  data-testid="trip-timeline-confirm"
                  type="button"
                  onClick={() => onConfirm(item.id)}
                >
                  Book / Confirm
                </button>
              ) : null}
            </div>
            {item.description ? (
              <p className="text-xs leading-5 text-ink-700">{item.description}</p>
            ) : null}
            <span
              className="inline-flex w-fit items-center gap-1.5 rounded-full bg-paper-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500"
              data-testid="trip-timeline-backup"
            >
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
};

export function TripTimeline({
  items,
  onSelectItem,
  onConfirmItem,
  selectedItemId
}: TripTimelineProps) {
  return (
    <ol className="flex flex-col gap-6" data-testid="trip-timeline">
      {items.map((item) => (
        <li key={item.id}>
          <TripTimelineItem
            isSelected={selectedItemId === item.id}
            item={item}
            onConfirm={onConfirmItem}
            onSelect={onSelectItem}
          />
        </li>
      ))}
    </ol>
  );
}

export { STATUS_TONE };
