"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search, X } from "lucide-react";

import type { PlaceSearchResult } from "@/src/domain/places";

type PlaceSearchReport = {
  source: "seed" | "osm" | "manual" | "google";
  status: "ok" | "empty" | "failed";
  results: PlaceSearchResult[];
  error?: string;
};

type PlaceSearchResponse = {
  query: string;
  results: PlaceSearchResult[];
  reports: PlaceSearchReport[];
  failures: PlaceSearchReport[];
};

type PlaceSearchPanelProps = {
  open: boolean;
  onClose: () => void;
  onPin: (place: PlaceSearchResult) => void;
  hasSelectedItem: boolean;
};

const sourceLabels: Record<PlaceSearchReport["source"], string> = {
  seed: "Seed",
  osm: "OSM",
  manual: "Manual",
  google: "Google"
};

const sourceBadgeClasses: Record<PlaceSearchReport["source"], string> = {
  seed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  osm: "bg-sky-50 text-sky-700 ring-sky-200",
  manual: "bg-amber-50 text-amber-700 ring-amber-200",
  google: "bg-violet-50 text-violet-700 ring-violet-200"
};

export function PlaceSearchPanel({
  open,
  onClose,
  onPin,
  hasSelectedItem
}: PlaceSearchPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [reports, setReports] = useState<PlaceSearchReport[]>([]);
  const [failures, setFailures] = useState<PlaceSearchReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const handle = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const url = new URL("/api/places/search", window.location.origin);
        url.searchParams.set("q", query);
        const response = await fetch(url.toString(), { method: "GET" });
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }
        const payload = (await response.json()) as PlaceSearchResponse;
        setResults(payload.results);
        setReports(payload.reports);
        setFailures(payload.failures);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "unknown_error");
        setResults([]);
        setReports([]);
        setFailures([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(handle);
  }, [query, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-label="Place search"
      className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center sm:p-8"
      role="dialog"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-[-0.02em] text-slate-950">
              Find a place
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search seed data, OpenStreetMap, or add a place manually.
            </p>
          </div>
          <button
            aria-label="Close place search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-200 px-6 py-4">
          <label className="block">
            <span className="sr-only">Search places</span>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-[#00565b] focus-within:ring-4 focus-within:ring-[#00565b]/10">
              <Search aria-hidden="true" className="h-4 w-4 text-slate-400" />
              <input
                className="flex-1 bg-transparent text-sm font-semibold text-slate-950 outline-none"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try 'coffee Da Nang' or 'Bali temple'"
                ref={inputRef}
                value={query}
              />
              {loading ? (
                <Loader2
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin text-slate-400"
                />
              ) : null}
            </div>
          </label>
          {reports.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {reports.map((report) => (
                <span
                  className={[
                    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ring-1",
                    sourceBadgeClasses[report.source]
                  ].join(" ")}
                  key={report.source}
                >
                  {sourceLabels[report.source]} · {report.status}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <p className="font-extrabold">Search failed</p>
              <p className="mt-1">{error}</p>
              {failures.length > 0 ? (
                <p className="mt-1 text-xs">
                  Failed sources: {failures.map((f) => f.source).join(", ")}
                </p>
              ) : null}
            </div>
          ) : null}

          {!error && results.length === 0 && !loading ? (
            <ManualPlaceFallback
              disabled={!hasSelectedItem}
              onPin={onPin}
              query={query}
            />
          ) : null}

          {results.length > 0 ? (
            <ul className="space-y-3" data-testid="place-search-results">
              {results.map((result) => (
                <li
                  className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[#00565b]/40"
                  key={`${result.source}:${result.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ring-1",
                            sourceBadgeClasses[result.source]
                          ].join(" ")}
                        >
                          {sourceLabels[result.source]}
                        </span>
                        {result.category ? (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            {result.category}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-2 truncate text-base font-extrabold text-slate-950">
                        {result.name}
                      </h3>
                      {result.address ? (
                        <p className="mt-1 flex items-start gap-1 text-sm text-slate-500">
                          <MapPin
                            aria-hidden="true"
                            className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-400"
                          />
                          <span className="truncate">{result.address}</span>
                        </p>
                      ) : null}
                    </div>
                    <button
                      className="inline-flex flex-none items-center gap-1 rounded-full bg-[#00565b] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#004853] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                      disabled={!hasSelectedItem}
                      onClick={() => onPin(result)}
                      type="button"
                    >
                      Pin to stop
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type ManualPlaceFallbackProps = {
  query: string;
  disabled: boolean;
  onPin: (place: PlaceSearchResult) => void;
};

function ManualPlaceFallback({
  query,
  disabled,
  onPin
}: ManualPlaceFallbackProps) {
  const trimmed = query.trim();
  const disabledReason = !trimmed
    ? "Type a place name above to add it manually."
    : disabled
      ? "Select a stop first to pin this place."
      : "";

  return (
    <div
      className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4"
      data-testid="place-search-manual"
    >
      <p className="text-sm font-extrabold text-slate-700">No matches yet</p>
      <p className="mt-1 text-sm text-slate-500">
        {trimmed
          ? `Add "${trimmed}" as a manual place and pin it to the selected stop.`
          : "Try a different query or add a place manually."}
      </p>
      <button
        className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#00565b]/30 bg-white px-4 py-2 text-sm font-extrabold text-[#00565b] transition hover:bg-[#00565b]/5 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        disabled={!trimmed || disabled}
        onClick={() => {
          if (!trimmed || disabled) {
            return;
          }
          onPin({
            id: `manual:${slugify(trimmed)}`,
            source: "manual",
            name: trimmed
          });
        }}
        type="button"
      >
        {disabledReason || `Pin "${trimmed}" manually`}
      </button>
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "place";
}
