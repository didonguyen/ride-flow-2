"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, X } from "lucide-react";

import type { ItineraryDraft } from "@/src/domain/ai-draft";

type ApplyMode = "append" | "replace";

type AiDraftPanelProps = {
  open: boolean;
  onClose: () => void;
  tripId: string;
  destination: string;
  startDate: string;
  endDate: string;
  existingItemCount: number;
  onApply: (input: { items: ItineraryDraft["days"][number]["items"]; mode: ApplyMode }) => void;
};

type GenerateResponse = {
  runId: string;
  summary: string;
  draft: ItineraryDraft;
};

const paceOptions: Array<{ value: "slow" | "balanced" | "fast"; label: string }> = [
  { value: "slow", label: "Slow" },
  { value: "balanced", label: "Balanced" },
  { value: "fast", label: "Fast" }
];

const suggestionChips = [
  "Food focused",
  "Family friendly",
  "Scenic viewpoints",
  "Hidden gems",
  "Markets and street food",
  "Coffee + cafes"
];

export function AiDraftPanel({
  open,
  onClose,
  tripId,
  destination,
  startDate,
  endDate,
  existingItemCount,
  onApply
}: AiDraftPanelProps) {
  const [pace, setPace] = useState<"slow" | "balanced" | "fast">("balanced");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ItineraryDraft | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [applyMode, setApplyMode] = useState<ApplyMode>("append");
  const [replaceConfirmed, setReplaceConfirmed] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }
    setError(null);
  }, [open]);

  if (!open) {
    return null;
  }

  const totalItems = draft?.days.reduce((acc, day) => acc + day.items.length, 0) ?? 0;
  const requiresReplaceConfirm =
    existingItemCount > 0 && applyMode === "replace" && !replaceConfirmed;

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setDraft(null);
    setSummary(null);
    setRunId(null);

    try {
      const response = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          destination,
          startDate,
          endDate,
          pace,
          preferencePrompt: prompt
        })
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? `Request failed: ${response.status}`);
      }

      const payload = (await response.json()) as GenerateResponse;
      setDraft(payload.draft);
      setSummary(payload.summary);
      setRunId(payload.runId);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (!draft) {
      return;
    }
    const items = draft.days.flatMap((day) => day.items);
    onApply({ items, mode: applyMode });
    onClose();
  }

  return (
    <div
      aria-label="AI itinerary draft"
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center sm:p-8"
      role="dialog"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold tracking-[-0.02em] text-slate-950">
              <Sparkles aria-hidden="true" className="h-4 w-4 text-[#00565b]" />
              AI itinerary draft
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Mock provider for now — generates a {pace} itinerary for {destination}.
            </p>
          </div>
          <button
            aria-label="Close AI draft panel"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-6 py-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="block text-sm font-semibold text-slate-700">
              Preferences
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#00565b] focus:ring-4 focus:ring-[#00565b]/10"
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="e.g. Food focused, family friendly"
                value={prompt}
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Pace
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold capitalize text-slate-950 outline-none transition focus:border-[#00565b] focus:ring-4 focus:ring-[#00565b]/10"
                onChange={(event) =>
                  setPace(event.target.value as "slow" | "balanced" | "fast")
                }
                value={pace}
              >
                {paceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestionChips.map((chip) => (
              <button
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-extrabold text-slate-600 transition hover:border-[#00565b]/40 hover:text-[#00565b]"
                key={chip}
                onClick={() =>
                  setPrompt((current) =>
                    current ? `${current}, ${chip.toLowerCase()}` : chip.toLowerCase()
                  )
                }
                type="button"
              >
                {chip}
              </button>
            ))}
          </div>
          <button
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00565b] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#004853] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            disabled={loading}
            onClick={handleGenerate}
            type="button"
          >
            {loading ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles aria-hidden="true" className="h-4 w-4" />
            )}
            Generate draft
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error ? (
            <div
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              <p className="font-extrabold">Draft failed</p>
              <p className="mt-1">{error}</p>
              <p className="mt-1 text-xs">
                Manual planning remains available. Try again with a different prompt.
              </p>
            </div>
          ) : null}

          {draft && summary ? (
            <div data-testid="ai-draft-preview">
              <p className="text-sm text-slate-600">{summary}</p>
              {runId ? (
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                  Run id: {runId}
                </p>
              ) : null}
              <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                {draft.days.length} days · {totalItems} items
              </p>
              <ol className="mt-3 space-y-3">
                {draft.days.map((day) => (
                  <li
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    key={day.date}
                  >
                    <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      {day.date}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {day.items.map((item, index) => (
                        <li
                          className="rounded-lg border border-slate-200 bg-white p-3 text-sm"
                          key={`${day.date}-${index}`}
                        >
                          <p className="font-extrabold text-slate-950">
                            {item.startTime} · {item.title}
                          </p>
                          {item.suggestedPlaceName ? (
                            <p className="text-xs text-slate-500">
                              {item.suggestedPlaceName}
                            </p>
                          ) : null}
                          {item.notes ? (
                            <p className="mt-1 text-xs text-slate-500">{item.notes}</p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {!draft && !error ? (
            <p className="text-sm text-slate-500">
              Generate a draft to preview a structured itinerary grouped by day.
            </p>
          ) : null}
        </div>

        {draft ? (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <fieldset className="space-y-2">
              <legend className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Apply mode
              </legend>
              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    checked={applyMode === "append"}
                    name="apply-mode"
                    onChange={() => setApplyMode("append")}
                    type="radio"
                    value="append"
                  />
                  Append
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input
                    checked={applyMode === "replace"}
                    name="apply-mode"
                    onChange={() => setApplyMode("replace")}
                    type="radio"
                    value="replace"
                  />
                  Replace
                </label>
                {applyMode === "replace" && existingItemCount > 0 ? (
                  <label className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                    <input
                      checked={replaceConfirmed}
                      onChange={(event) => setReplaceConfirmed(event.target.checked)}
                      type="checkbox"
                    />
                    Confirm replace
                  </label>
                ) : null}
              </div>
            </fieldset>
            <button
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#00565b] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#004853] disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={requiresReplaceConfirm}
              onClick={handleApply}
              type="button"
            >
              Apply draft
            </button>
            {requiresReplaceConfirm ? (
              <p className="mt-2 text-xs font-semibold text-red-600">
                Confirm replace to overwrite the current agenda.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
