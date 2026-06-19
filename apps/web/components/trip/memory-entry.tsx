import { Star } from "lucide-react";
import Image from "next/image";

import { PinnedOptionBadge } from "@/components/trip/pinned-option-badge";
import { cn } from "@/src/lib/utils";

type MemoryEntryProps = {
  timestamp: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  body: string;
  attribution: string;
  attributionInitial: string;
  rating?: number;
  pinned?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  backupLabel?: string;
  className?: string;
};

export function MemoryEntry({
  timestamp,
  title,
  imageUrl,
  imageAlt,
  body,
  attribution,
  attributionInitial,
  rating,
  pinned,
  actionLabel,
  onAction,
  backupLabel,
  className
}: MemoryEntryProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200",
        className
      )}
      data-testid="memory-entry"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
        {timestamp}
      </span>
      <h3 className="text-2xl font-semibold tracking-[-0.02em] text-ink-950">
        {title}
      </h3>
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          alt={imageAlt}
          className="aspect-[16/10] w-full object-cover"
          height={480}
          sizes="(min-width: 1024px) 60vw, 100vw"
          src={imageUrl}
          width={960}
        />
        {pinned ? (
          <div className="absolute left-4 top-4">
            <PinnedOptionBadge />
          </div>
        ) : null}
      </div>
      <p className="text-base leading-7 text-ink-700">{body}</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sage-200 text-xs font-semibold text-forest-800"
          >
            {attributionInitial}
          </span>
          <span className="text-sm font-medium text-ink-700">
            — Added by {attribution}
          </span>
        </div>
        {rating ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
            <Star aria-hidden="true" className="h-4 w-4" fill="currentColor" />
            {rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      {(actionLabel || backupLabel) && (
        <div className="flex flex-wrap items-center gap-2">
          {actionLabel ? (
            <button
              className="inline-flex items-center justify-center rounded-full bg-forest-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-forest-700"
              data-testid="memory-entry-action"
              type="button"
              onClick={onAction}
            >
              {actionLabel}
            </button>
          ) : null}
          {backupLabel ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-paper-100 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500 ring-1 ring-paper-200"
              data-testid="memory-entry-backup"
            >
              {backupLabel}
            </span>
          ) : null}
        </div>
      )}
    </article>
  );
}
