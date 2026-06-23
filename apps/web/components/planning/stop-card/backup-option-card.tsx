"use client";

import Image from "next/image";
import { ExternalLink, MapPin } from "lucide-react";
import type { StopOption } from "@/src/domain/stop-options";
import { cn } from "@/src/lib/utils";

const SOURCE_LABEL: Record<StopOption["source"], string> = {
  ai: "AI",
  google_places: "Google",
  manual: "Manual"
};

type BackupOptionCardProps = {
  option: StopOption;
  onPinInstead?: (optionId: string) => void;
  onEdit?: (optionId: string) => void;
  onRemove?: (optionId: string) => void;
  canEdit: boolean;
};

export function BackupOptionCard({
  option,
  onPinInstead,
  onEdit,
  onRemove,
  canEdit
}: BackupOptionCardProps) {
  return (
    <article
      aria-label={`Backup option ${option.name}`}
      className="flex flex-col gap-2 rounded-2xl border border-paper-200 bg-paper-50 p-3"
      data-testid={`backup-option-${option.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-paper-200">
          {option.imageUrl ? (
            <Image
              alt={option.name}
              className="object-cover"
              fill
              sizes="48px"
              src={option.imageUrl}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold uppercase text-forest-700">
              {option.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-paper-200 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink-700">
              {SOURCE_LABEL[option.source]}
            </span>
            {typeof option.rating === "number" ? (
              <span className="text-xs font-semibold text-forest-800">
                {option.rating.toFixed(1)} ★
              </span>
            ) : null}
          </div>
          <h4 className="line-clamp-1 text-sm font-extrabold text-ink-950">
            {option.name}
          </h4>
          {option.address ? (
            <p className="line-clamp-1 text-xs text-ink-500">{option.address}</p>
          ) : null}
          {option.distanceText || option.durationText ? (
            <p className="text-[11px] font-semibold text-forest-800/80">
              {[option.distanceText, option.durationText]
                .filter(Boolean)
                .join(" • ")}
            </p>
          ) : null}
        </div>
      </div>
      {canEdit || option.googleMapsUrl ? (
        <div className={cn("flex flex-wrap gap-2")}>
          {option.googleMapsUrl ? (
            <a
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-forest-800 hover:underline"
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
                  className="inline-flex items-center justify-center rounded-full border border-forest-800/40 bg-paper-50 px-3 py-1 text-[11px] font-extrabold text-forest-800 transition hover:bg-forest-800/5"
                  data-testid={`pin-instead-backup-${option.id}`}
                  onClick={() => onPinInstead(option.id)}
                  type="button"
                >
                  Pin instead
                </button>
              ) : null}
              {onEdit ? (
                <button
                  className="inline-flex items-center justify-center rounded-full border border-paper-300 bg-paper-50 px-3 py-1 text-[11px] font-extrabold text-ink-700 transition hover:border-forest-800/40 hover:text-forest-800"
                  onClick={() => onEdit(option.id)}
                  type="button"
                >
                  Edit
                </button>
              ) : null}
              {onRemove ? (
                <button
                  className="inline-flex items-center justify-center rounded-full border border-transparent px-3 py-1 text-[11px] font-extrabold text-red-700 transition hover:bg-red-50"
                  onClick={() => onRemove(option.id)}
                  type="button"
                >
                  Remove
                </button>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}