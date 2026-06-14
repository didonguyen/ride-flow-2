import type { PlaceSearchResult } from "@/src/domain/places";

import type {
  PlaceProviderReport,
  PlaceSearchProvider,
  PlaceSearchUseCaseResult
} from "@/src/application/places/types";

export type CompositeSearchDependencies = {
  providers: PlaceSearchProvider[];
  limit?: number;
};

function dedupeAndRank(results: PlaceSearchResult[], limit?: number) {
  const seen = new Map<string, PlaceSearchResult>();

  for (const result of results) {
    const key = `${result.source}:${result.id}`;
    if (!seen.has(key)) {
      seen.set(key, result);
    }
  }

  const ordered = [...seen.values()].sort((a, b) => {
    const sourceOrder: Record<string, number> = {
      seed: 0,
      osm: 1,
      manual: 2,
      google: 3
    };
    const aOrder = sourceOrder[a.source] ?? 99;
    const bOrder = sourceOrder[b.source] ?? 99;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return a.name.localeCompare(b.name);
  });

  return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
}

export async function runProviderSearch(
  provider: PlaceSearchProvider,
  query: string,
  options: Parameters<PlaceSearchProvider["searchPlaces"]>[1]
): Promise<PlaceProviderReport> {
  try {
    const results = await provider.searchPlaces(query, options);
    return {
      source: provider.source,
      status: results.length === 0 ? "empty" : "ok",
      results
    };
  } catch (error) {
    return {
      source: provider.source,
      status: "failed",
      results: [],
      error: error instanceof Error ? error.message : "unknown_error"
    };
  }
}

export async function runCompositeSearch(
  query: string,
  options: Parameters<PlaceSearchProvider["searchPlaces"]>[1],
  dependencies: CompositeSearchDependencies
): Promise<PlaceSearchUseCaseResult> {
  const trimmed = query.trim();

  if (!trimmed) {
    return {
      query: "",
      results: [],
      reports: dependencies.providers.map((provider) => ({
        source: provider.source,
        status: "empty",
        results: []
      })),
      failures: []
    };
  }

  const settled = await Promise.all(
    dependencies.providers.map((provider) =>
      runProviderSearch(provider, trimmed, options)
    )
  );

  const failures = settled.filter((report) => report.status === "failed");
  const combined = settled.flatMap((report) => report.results);

  return {
    query: trimmed,
    results: dedupeAndRank(combined, dependencies.limit),
    reports: settled,
    failures
  };
}
