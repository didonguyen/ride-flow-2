"use client";

import Image from "next/image";
import { ExternalLink, MapPin } from "lucide-react";
import type { StopOption } from "@/src/domain/stop-options";

const SOURCE_LABEL: Record<StopOption["source"], string> = {
  ai: "AI suggestion",
  google_places: "Google Places",
  manual: "Manual entry"
};

type PinnedOptionCardProps = {
  option: StopOption;
  onPinInstead?: (optionId: string) => void;
  onEdit?: (optionId: string) => void;
  onRemove?: (optionId: string) => void;
  canEdit: boolean;
};

export function PinnedOptionCard({
  option,
  onPinInstead,
  onEdit,
  onRemove,
  canEdit
}: PinnedOptionCardProps) {
  return (
    <article
      aria-label={`Pinned option ${option.name}`}
      className="relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-forest-800/30 bg-gradient-to-br from-forest-800/8 via-paper-50 to-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-forest-800/20"
      data-testid={`pinned-option-${option.id}`}
    >
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-forest-800 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white"
      >
        Pinned
      </span>
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-paper-200 ring-1 ring-paper-300">
          {option.imageUrl ? (
            <Image
              alt={option.name}
              className="object-cover"
              fill
              sizes="80px"
              src={option.imageUrl}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-extrabold uppercase text-forest-800">
              {option.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-forest-800">
            {SOURCE_LABEL[option.source]}
          </span>
          <h3 className="text-lg font-extrabold text-ink-950">{option.name}</h3>
          {typeof option.rating === "number" ? (
            <p className="text-xs font-semibold text-ink-700">
              {option.rating.toFixed(1)} ★ rating
            </p>
          ) : null}
          {option.address ? (
            <p className="text-xs text-ink-500">{option.address}</p>
          ) : null}
        </div>
      </div>
      {option.description ? (
        <p className="text-sm leading-6 text-ink-700">{option.description}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        {option.googleMapsUrl ? (
          <a
            className="inline-flex items-center gap-1 rounded-full border border-forest-800/40 bg-paper-50 px-3 py-1.5 text-xs font-extrabold text-forest-800 transition hover:bg-forest-800/5"
            href={option.googleMapsUrl}
            rel="noreferrer noopener"
            target="_blank"
          >
            <MapPin aria-hidden="true" className="h-3 w-3" />
            View on map
            <ExternalLink aria-hidden="true" className="h-3 w-3" />
          </a>
        ) : null}
        {canEdit ? (
          <>
            {onPinInstead ? (
              <button
                className="inline-flex items-center justify-center rounded-full border border-paper-300 bg-paper-50 px-3 py-1.5 text-xs font-extrabold text-ink-700 transition hover:border-forest-800/40 hover:text-forest-800"
                data-testid={`pin-instead-${option.id}`}
                onClick={() => onPinInstead(option.id)}
                type="button"
              >
                Change option
              </button>
            ) : null}
            {onEdit ? (
              <button
                className="inline-flex items-center justify-center rounded-full border border-paper-300 bg-paper-50 px-3 py-1.5 text-xs font-extrabold text-ink-700 transition hover:border-forest-800/40 hover:text-forest-800"
                onClick={() => onEdit(option.id)}
                type="button"
              >
                Edit
              </button>
            ) : null}
            {onRemove ? (
              <button
                className="inline-flex items-center justify-center rounded-full border border-transparent px-3 py-1.5 text-xs font-extrabold text-red-700 transition hover:bg-red-50"
                onClick={() => onRemove(option.id)}
                type="button"
              >
                Remove
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </article>
  );
}