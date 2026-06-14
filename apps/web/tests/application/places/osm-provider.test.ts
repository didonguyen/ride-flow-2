import { describe, expect, it } from "vitest";

import { createOsmPlaceSearchProvider } from "@/src/application/places/osm-provider";

describe("osmPlaceSearchProvider", () => {
  it("parses nominatim results into PlaceSearchResult shape", async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify([
          {
            display_name: "Cafe Cong, Da Nang, Vietnam",
            lat: "16.071",
            lon: "108.223",
            type: "cafe",
            category: "amenity",
            osm_id: 1234,
            osm_type: "node"
          }
        ]),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      )
    );

    const provider = createOsmPlaceSearchProvider({
      fetchImpl: fetchImpl as unknown as typeof fetch,
      baseUrl: "https://nominatim.example"
    });

    const results = await provider.searchPlaces("Cafe Cong", { limit: 5 });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      id: "node/1234",
      source: "osm",
      name: "Cafe Cong",
      address: "Cafe Cong, Da Nang, Vietnam",
      lat: 16.071,
      lng: 108.223,
      category: "amenity",
      externalUrl: "https://www.openstreetmap.org/node/1234"
    });
  });

  it("returns empty array for blank queries without calling fetch", async () => {
    const fetchImpl = vi.fn();
    const provider = createOsmPlaceSearchProvider({
      fetchImpl: fetchImpl as unknown as typeof fetch
    });

    const results = await provider.searchPlaces("   ", {});

    expect(results).toEqual([]);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("throws when the upstream returns a non-ok response", async () => {
    const fetchImpl = vi.fn(async () => new Response("upstream error", { status: 503 }));
    const provider = createOsmPlaceSearchProvider({
      fetchImpl: fetchImpl as unknown as typeof fetch
    });

    await expect(provider.searchPlaces("coffee", {})).rejects.toThrow(/503/);
  });
});

import { vi } from "vitest";
