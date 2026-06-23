"use client";

import { Sparkles } from "lucide-react";

import type { Stop } from "@/src/domain/stop-options";

export type AiSuggestionKind =
  | "suggest_options"
  | "add_backup_options"
  | "improve_stop"
  | "rebalance_day"
  | "fill_empty_day";

export type AiSuggestion = {
  id: string;
  kind: AiSuggestionKind;
  stopId: string;
  title: string;
  summary: string;
  options: Array<{ id: string; name: string; source: string; rating?: number | null }>;
};

type AiSuggestionPanelProps = {
  tripId: string;
  stops: Stop[];
  onApply: (suggestionId: string) => void;
  onDismiss?: (suggestionId: string) => void;
};

export function AiSuggestionPanel({
  tripId,
  stops,
  onApply,
  onDismiss
}: AiSuggestionPanelProps) {
  const suggestions = buildSuggestions(stops);

  return (
    <aside
      aria-label="AI suggestions"
      className="flex flex-col gap-3 rounded-3xl border border-paper-200 bg-paper-50 p-5 shadow-rideflow-chip"
      data-testid="ai-suggestion-panel"
      data-trip-id={tripId}
    >
      <header className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <Sparkles aria-hidden="true" className="h-4 w-4" />
        </span>
        <div>
          <h2 className="text-base font-extrabold text-ink-950">AI suggestions</h2>
          <p className="text-xs text-ink-500">
            We never pin for you. Apply a suggestion, then choose the one that fits.
          </p>
        </div>
      </header>

      {suggestions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-paper-300 p-4 text-sm text-ink-500">
          No suggestions right now. Add stops with AI or Google Places to see ideas here.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {suggestions.map((suggestion) => (
            <li
              className="flex flex-col gap-3 rounded-2xl border border-paper-200 bg-paper-50/80 p-4"
              data-testid={`ai-suggestion-${suggestion.id}`}
              key={suggestion.id}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-violet-700">
                  {suggestion.kind.replaceAll("_", " ")}
                </span>
                <h3 className="text-sm font-extrabold text-ink-950">
                  {suggestion.title}
                </h3>
                <p className="text-xs text-ink-500">{suggestion.summary}</p>
              </div>
              <ul className="flex flex-col gap-1 text-xs text-ink-700">
                {suggestion.options.map((option) => (
                  <li
                    className="flex items-center justify-between gap-2 rounded-xl bg-paper-100 px-3 py-1.5"
                    key={option.id}
                  >
                    <span>{option.name}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-ink-500">
                      {option.source}
                      {typeof option.rating === "number"
                        ? ` • ${option.rating.toFixed(1)} ★`
                        : ""}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center justify-center rounded-full bg-forest-800 px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-forest-700"
                  data-testid={`apply-ai-suggestion-${suggestion.id}`}
                  onClick={() => onApply(suggestion.id)}
                  type="button"
                >
                  Add as options
                </button>
                {onDismiss ? (
                  <button
                    className="inline-flex items-center justify-center rounded-full border border-paper-300 bg-paper-50 px-3 py-1.5 text-xs font-extrabold text-ink-700 transition hover:border-forest-800/40 hover:text-forest-800"
                    onClick={() => onDismiss(suggestion.id)}
                    type="button"
                  >
                    Dismiss
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function buildSuggestions(stops: Stop[]): AiSuggestion[] {
  const candidates = stops.filter((stop) => stop.options.length <= 1);
  return candidates.slice(0, 3).map((stop, index) => ({
    id: `${stop.id}-${index}`,
    kind:
      stop.options.length === 0
        ? ("suggest_options" as const)
        : ("add_backup_options" as const),
    stopId: stop.id,
    title:
      stop.options.length === 0
        ? `Need ideas for "${stop.title}"?`
        : `Need alternatives for "${stop.title}"?`,
    summary:
      stop.options.length === 0
        ? "We can pull 3 nearby options based on your trip context."
        : "We can suggest backup options so the plan still works if the first choice falls through.",
    options: [
      { id: `${stop.id}-a`, name: "Forest Cafe", source: "AI", rating: 4.5 },
      { id: `${stop.id}-b`, name: "River View Bistro", source: "AI", rating: 4.2 },
      { id: `${stop.id}-c`, name: "Local Food Garden", source: "AI", rating: 4.3 }
    ]
  }));
}