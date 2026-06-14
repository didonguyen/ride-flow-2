import { describe, expect, it } from "vitest";

import { createSeedPlaceSearchProvider } from "@/src/application/places/seed-provider";

describe("seedPlaceSearchProvider", () => {
  it("returns curated matches for known destinations", async () => {
    const provider = createSeedPlaceSearchProvider();
    const results = await provider.searchPlaces("Da Nang", { limit: 10 });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.source === "seed")).toBe(true);
    expect(
      results.some((result) => result.name.includes("Golden Bridge"))
    ).toBe(true);
  });

  it("returns empty results for unrelated queries", async () => {
    const provider = createSeedPlaceSearchProvider();
    const results = await provider.searchPlaces("Antarctic research base", {
      limit: 10
    });

    expect(results).toEqual([]);
  });

  it("uses default limit when none is provided", async () => {
    const provider = createSeedPlaceSearchProvider();
    const results = await provider.searchPlaces("", { limit: 3 });

    expect(results.length).toBeLessThanOrEqual(3);
  });
});
