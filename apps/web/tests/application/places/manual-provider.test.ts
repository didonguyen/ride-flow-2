import { describe, expect, it } from "vitest";

import { createManualPlaceSearchProvider } from "@/src/application/places/manual-provider";

describe("manualPlaceSearchProvider", () => {
  it("returns a manual PlaceSearchResult for a non-empty query", async () => {
    const provider = createManualPlaceSearchProvider();
    const results = await provider.searchPlaces("Hidden cafe in Da Lat", {});

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      source: "manual",
      name: "Hidden cafe in Da Lat",
      id: "manual:hidden-cafe-in-da-lat"
    });
  });

  it("returns empty array for blank queries", async () => {
    const provider = createManualPlaceSearchProvider();
    const results = await provider.searchPlaces("   ", {});

    expect(results).toEqual([]);
  });
});
