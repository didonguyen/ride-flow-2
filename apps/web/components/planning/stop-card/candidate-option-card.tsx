"use client";

import Image from "next/image";
import type { StopOption } from "@/src/domain/stop-options";
import { cn } from "@/src/lib/utils";

const SOURCE_LABEL: Record<StopOption["source"], string> = {
  ai: "AI",
  google_places: "Google",
  manual: "Manual"
};

const SOURCE_STYLE: Record<StopOption["source"], string> = {
  ai: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  google_places: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  manual: "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
};

type CandidateOptionCardProps = {
  option: StopOption;
  onPin?: (optionId: string) => void;
  onEdit?: (optionId: string) => void;
  onRemove?: (optionId: string) => void;
  canEdit: boolean;
};

export function CandidateOptionCard({
  option,
  onPin,
  onEdit,
  onRemove,
  canEdit
}: CandidateOptionCardProps) {
  return (
    <article
      aria-label={`Option ${option.name}`}
      className="flex flex-col gap-3 rounded-2xl border border-paper-200 bg-paper-50 p-4 shadow-rideflow-chip"
      data-testid={`candidate-option-${option.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper-200">
          {option.imageUrl ? (
            <Image
              alt={option.name}
              className="object-cover"
              fill
              sizes="64px"
              src={option.imageUrl}
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-full w-full items-center justify-center text-xs font-bold uppercase text-forest-700"
            >
              {option.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide",
                SOURCE_STYLE[option.source]
              )}
            >
              {SOURCE_LABEL[option.source]}
            </span>
            {typeof option.rating === "number" ? (
              <span className="text-xs font-semibold text-forest-800">
                {option.rating.toFixed(1)} ★
              </span>
            ) : null}
          </div>
          <h3 className="text-sm font-extrabold text-ink-950">{option.name}</h3>
          {option.address ? (
            <p className="line-clamp-2 text-xs text-ink-500">{option.address}</p>
          ) : null}
          {option.distanceText || option.durationText ? (
            <p className="text-[11px] font-semibold uppercase tracking-wide text-forest-800/80">
              {[option.distanceText, option.durationText]
                .filter(Boolean)
                .join(" • ")}
            </p>
          ) : null}
        </div>
      </div>
      {option.description ? (
        <p className="text-xs leading-5 text-ink-700">{option.description}</p>
      ) : null}
      {canEdit ? (
        <div className="flex flex-wrap gap-2">
          {onPin ? (
            <button
              className="inline-flex items-center justify-center rounded-full bg-forest-800 px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-forest-700"
              data-testid={`pin-option-${option.id}`}
              onClick={() => onPin(option.id)}
              type="button"
            >
              Pin this
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
        </div>
      ) : null}
    </article>
  );
}