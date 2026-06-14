import { describe, expect, it } from "vitest";

import { runCompositeSearch } from "@/src/application/places/composite-provider";
import { createManualPlaceSearchProvider } from "@/src/application/places/manual-provider";
import { createSeedPlaceSearchProvider } from "@/src/application/places/seed-provider";
import type { PlaceSearchProvider } from "@/src/application/places/types";
import type { PlaceSearchResult } from "@/src/domain/places";

function makeResult(
  id: string,
  source: PlaceSearchResult["source"],
  name: string
): PlaceSearchResult {
  return {
    id,
    source,
    name,
    address: "Test address"
  };
}

describe("runCompositeSearch", () => {
  it("merges results across providers and de-duplicates by source+id", async () => {
    const provider: PlaceSearchProvider = {
      source: "osm",
      async searchPlaces() {
        return [
          makeResult("node/1", "osm", "A"),
          makeResult("node/2", "osm", "B")
        ];
      }
    };

    const result = await runCompositeSearch(
      "anything",
      { limit: 10 },
      {
        providers: [
          createSeedPlaceSearchProvider(),
          provider,
          createManualPlaceSearchProvider()
        ]
      }
    );

    expect(result.reports).toHaveLength(3);
    expect(result.failures).toEqual([]);
    expect(result.results.length).toBeGreaterThan(0);
    const ids = result.results.map((entry) => entry.source + ":" + entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("collects provider failures into the failures list without throwing", async () => {
    const provider: PlaceSearchProvider = {
      source: "osm",
      async searchPlaces() {
        throw new Error("network down");
      }
    };

    const result = await runCompositeSearch(
      "Da Nang",
      {},
      { providers: [provider, createSeedPlaceSearchProvider()] }
    );

    expect(result.failures).toHaveLength(1);
    expect(result.failures[0]).toMatchObject({
      source: "osm",
      status: "failed"
    });
    expect(result.results.length).toBeGreaterThan(0);
  });

  it("returns empty results and reports for a blank query", async () => {
    const result = await runCompositeSearch(
      "   ",
      {},
      { providers: [createSeedPlaceSearchProvider()] }
    );

    expect(result.results).toEqual([]);
    expect(result.reports.every((report) => report.status === "empty")).toBe(true);
    expect(result.failures).toEqual([]);
  });

  it("respects the limit option", async () => {
    const result = await runCompositeSearch(
      "",
      { limit: 2 },
      { providers: [createSeedPlaceSearchProvider()] }
    );

    expect(result.results.length).toBeLessThanOrEqual(2);
  });
});
