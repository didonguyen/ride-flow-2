"use client";

import { ChevronDown, ChevronUp, GripVertical, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  BackupOptionCard
} from "@/components/planning/stop-card/backup-option-card";
import {
  CandidateOptionCard
} from "@/components/planning/stop-card/candidate-option-card";
import {
  PinnedOptionCard
} from "@/components/planning/stop-card/pinned-option-card";
import type { Stop, StopOption } from "@/src/domain/stop-options";
import { getActiveOption, getBackupOptions, sortBackupOptions } from "@/src/domain/stop-options";
import { cn } from "@/src/lib/utils";

type StopCardVariant = "action_needed" | "pinned" | "read_only";

type StopCardProps = {
  stop: Stop;
  canEdit: boolean;
  onPinOption?: (optionId: string) => void;
  onEditStop?: (stopId: string) => void;
  onDeleteStop?: (stopId: string) => void;
  onGenerateOptions?: (stopId: string) => void;
  onSearchGooglePlaces?: (stopId: string) => void;
  onAddManualOption?: (stopId: string) => void;
  onRemoveOption?: (optionId: string) => void;
  onEditOption?: (optionId: string) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
};

function statusLabel(stop: Stop): string {
  if (stop.status === "pinned") return "Pinned";
  if (stop.options.length === 0) return "Action needed";
  return "Action needed";
}

function candidateOptionsForStop(stop: Stop): StopOption[] {
  return stop.options.filter(
    (option) =>
      option.status === "candidate" &&
      option.id !== stop.pinnedOptionId
  );
}

export function StopCard({
  stop,
  canEdit,
  onPinOption,
  onEditStop,
  onDeleteStop,
  onGenerateOptions,
  onSearchGooglePlaces,
  onAddManualOption,
  onRemoveOption,
  onEditOption,
  dragHandleProps
}: StopCardProps) {
  const variant: StopCardVariant = !canEdit
    ? "read_only"
    : stop.status;
  const [showBackups, setShowBackups] = useState(false);

  const active = getActiveOption(stop);
  const candidates = candidateOptionsForStop(stop);
  const backups = sortBackupOptions(getBackupOptions(stop));

  return (
    <article
      aria-label={stop.title}
      className={cn(
        "flex flex-col gap-4 rounded-3xl border bg-paper-50 p-5 shadow-rideflow-editorial-card",
        variant === "action_needed" &&
          "border-amber-200/70 ring-1 ring-amber-200/60",
        variant === "pinned" &&
          "border-forest-800/30 ring-1 ring-forest-800/20",
        variant === "read_only" && "border-paper-200"
      )}
      data-testid={`stop-card-${stop.id}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {dragHandleProps && variant !== "read_only" ? (
            <button
              aria-label={`Reorder ${stop.title}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-500 transition hover:bg-paper-200 hover:text-ink-950"
              type="button"
              {...dragHandleProps}
            >
              <GripVertical aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : (
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-200 text-ink-500"
            >
              <GripVertical aria-hidden="true" className="h-4 w-4" />
            </span>
          )}
          <div className="flex flex-col gap-1">
            {stop.time ? (
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-forest-800">
                {stop.time}
              </span>
            ) : null}
            <h3 className="text-lg font-extrabold text-ink-950">{stop.title}</h3>
            {stop.locationName || stop.address ? (
              <p className="text-xs text-ink-500">
                {[stop.locationName, stop.address].filter(Boolean).join(" • ")}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge label={statusLabel(stop)} variant={variant} />
          {canEdit && onDeleteStop ? (
            <button
              aria-label={`Delete ${stop.title}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-700 transition hover:bg-red-50"
              data-testid={`delete-stop-${stop.id}`}
              onClick={() => onDeleteStop(stop.id)}
              type="button"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </header>

      {stop.description ? (
        <p className="text-sm leading-6 text-ink-700">{stop.description}</p>
      ) : null}

      {variant === "action_needed" ? (
        <ActionNeededBody
          canEdit={canEdit}
          candidates={candidates}
          onAddManualOption={onAddManualOption}
          onGenerateOptions={onGenerateOptions}
          onPinOption={onPinOption}
          onRemoveOption={onRemoveOption}
          onSearchGooglePlaces={onSearchGooglePlaces}
          stop={stop}
        />
      ) : null}

      {variant === "pinned" && active ? (
        <PinnedBody
          active={active}
          canEdit={canEdit}
          onEditOption={onEditOption}
          onPinInstead={onPinOption}
          onRemoveOption={onRemoveOption}
        />
      ) : null}

      {variant === "read_only" ? (
        <ReadOnlyBody
          active={active}
          candidates={candidates}
          stop={stop}
        />
      ) : null}

      {variant !== "read_only" && backups.length > 0 ? (
        <BackupOptionsSection
          backups={backups}
          canEdit={canEdit}
          expanded={showBackups}
          onEditOption={onEditOption}
          onPinInstead={onPinOption}
          onRemoveOption={onRemoveOption}
          onToggle={() => setShowBackups((prev) => !prev)}
        />
      ) : null}

      {canEdit && onEditStop ? (
        <button
          className="self-start text-xs font-extrabold uppercase tracking-[0.16em] text-forest-800 hover:underline"
          onClick={() => onEditStop(stop.id)}
          type="button"
        >
          Edit stop
        </button>
      ) : null}
    </article>
  );
}

function StatusBadge({
  label,
  variant
}: {
  label: string;
  variant: StopCardVariant;
}) {
  const style =
    variant === "pinned"
      ? "bg-forest-800 text-white"
      : variant === "action_needed"
        ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
        : "bg-paper-200 text-ink-700 ring-1 ring-paper-300";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em]",
        style
      )}
      data-testid={`stop-status-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {label}
    </span>
  );
}

type ActionNeededBodyProps = {
  canEdit: boolean;
  candidates: StopOption[];
  onPinOption?: (optionId: string) => void;
  onGenerateOptions?: (stopId: string) => void;
  onSearchGooglePlaces?: (stopId: string) => void;
  onAddManualOption?: (stopId: string) => void;
  onRemoveOption?: (optionId: string) => void;
  stop: Stop;
};

function ActionNeededBody({
  canEdit,
  candidates,
  onPinOption,
  onGenerateOptions,
  onSearchGooglePlaces,
  onAddManualOption,
  onRemoveOption,
  stop
}: ActionNeededBodyProps) {
  if (candidates.length === 0) {
    return (
      <div
        className="flex flex-col gap-3 rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 p-4 text-sm leading-6 text-ink-700"
        data-testid={`stop-empty-${stop.id}`}
      >
        <p>Choose one option to pin for this stop.</p>
        {canEdit ? (
          <div className="flex flex-wrap gap-2">
            {onGenerateOptions ? (
              <button
                className="inline-flex items-center justify-center gap-1 rounded-full bg-forest-800 px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-forest-700"
                onClick={() => onGenerateOptions(stop.id)}
                type="button"
              >
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                Suggest with AI
              </button>
            ) : null}
            {onSearchGooglePlaces ? (
              <button
                className="inline-flex items-center justify-center rounded-full border border-forest-800/40 bg-paper-50 px-3 py-1.5 text-xs font-extrabold text-forest-800 transition hover:bg-forest-800/5"
                onClick={() => onSearchGooglePlaces(stop.id)}
                type="button"
              >
                Search Google Places
              </button>
            ) : null}
            {onAddManualOption ? (
              <button
                className="inline-flex items-center justify-center rounded-full border border-paper-300 bg-paper-50 px-3 py-1.5 text-xs font-extrabold text-ink-700 transition hover:border-forest-800/40 hover:text-forest-800"
                onClick={() => onAddManualOption(stop.id)}
                type="button"
              >
                Add option manually
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {candidates.map((option) => (
        <CandidateOptionCard
          canEdit={canEdit}
          key={option.id}
          onEdit={canEdit ? (id) => undefined : undefined}
          onPin={(id) => onPinOption?.(id)}
          onRemove={canEdit ? (id) => onRemoveOption?.(id) : undefined}
          option={option}
        />
      ))}
    </div>
  );
}

type PinnedBodyProps = {
  active: StopOption;
  canEdit: boolean;
  onPinInstead?: (optionId: string) => void;
  onEditOption?: (optionId: string) => void;
  onRemoveOption?: (optionId: string) => void;
};

function PinnedBody({
  active,
  canEdit,
  onPinInstead,
  onEditOption,
  onRemoveOption
}: PinnedBodyProps) {
  return (
    <PinnedOptionCard
      canEdit={canEdit}
      onEdit={canEdit ? onEditOption : undefined}
      onPinInstead={canEdit ? onPinInstead : undefined}
      onRemove={canEdit ? onRemoveOption : undefined}
      option={active}
    />
  );
}

type ReadOnlyBodyProps = {
  active: StopOption | null;
  candidates: StopOption[];
  stop: Stop;
};

function ReadOnlyBody({ active, candidates, stop }: ReadOnlyBodyProps) {
  if (active) {
    return <PinnedOptionCard canEdit={false} option={active} />;
  }

  if (candidates.length > 0) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {candidates.map((option) => (
          <CandidateOptionCard canEdit={false} key={option.id} option={option} />
        ))}
      </div>
    );
  }

  return (
    <p
      className="rounded-2xl border border-dashed border-paper-300 bg-paper-50 p-4 text-sm text-ink-500"
      data-testid={`stop-readonly-empty-${stop.id}`}
    >
      No options yet. An Owner or Planner needs to add and pin one.
    </p>
  );
}

type BackupOptionsSectionProps = {
  backups: StopOption[];
  canEdit: boolean;
  expanded: boolean;
  onToggle: () => void;
  onPinInstead?: (optionId: string) => void;
  onEditOption?: (optionId: string) => void;
  onRemoveOption?: (optionId: string) => void;
};

function BackupOptionsSection({
  backups,
  canEdit,
  expanded,
  onToggle,
  onPinInstead,
  onEditOption,
  onRemoveOption
}: BackupOptionsSectionProps) {
  return (
    <section
      aria-label="Backup options"
      className="rounded-2xl border border-paper-200 bg-paper-50/70 p-4"
      data-testid="backup-options-section"
    >
      <button
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-2 text-left"
        onClick={onToggle}
        type="button"
      >
        <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink-700">
          Backup options ({backups.length})
        </span>
        {expanded ? (
          <ChevronUp aria-hidden="true" className="h-4 w-4 text-ink-700" />
        ) : (
          <ChevronDown aria-hidden="true" className="h-4 w-4 text-ink-700" />
        )}
      </button>
      {expanded ? (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {backups.map((option) => (
            <BackupOptionCard
              canEdit={canEdit}
              key={option.id}
              onEdit={canEdit ? onEditOption : undefined}
              onPinInstead={canEdit ? onPinInstead : undefined}
              onRemove={canEdit ? onRemoveOption : undefined}
              option={option}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}