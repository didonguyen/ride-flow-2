import type { PlaceSearchResult } from "@/src/domain/places";

import type {
  PlaceSearchOptions,
  PlaceSearchProvider
} from "@/src/application/places/types";

export type OsmPlaceSearchProviderOptions = {
  fetchImpl?: typeof fetch;
  baseUrl?: string;
  userAgent?: string;
  timeoutMs?: number;
};

type NominatimPlace = {
  display_name?: string;
  lat?: string;
  lon?: string;
  type?: string;
  category?: string;
  osm_id?: number;
  osm_type?: string;
  extratags?: Record<string, string>;
  boundingbox?: [string, string, string, string];
};

const defaultBaseUrl = "https://nominatim.openstreetmap.org";

function toOsmId(place: NominatimPlace) {
  if (!place.osm_id || !place.osm_type) {
    return null;
  }

  return `${place.osm_type}/${place.osm_id}`;
}

function toCategory(place: NominatimPlace) {
  return place.category ?? place.type ?? undefined;
}

function toExternalUrl(place: NominatimPlace) {
  const id = toOsmId(place);
  if (!id) {
    return undefined;
  }

  return `https://www.openstreetmap.org/${id}`;
}

export function createOsmPlaceSearchProvider(
  options: OsmPlaceSearchProviderOptions = {}
): PlaceSearchProvider {
  const baseUrl = options.baseUrl ?? defaultBaseUrl;
  const userAgent = options.userAgent ?? "RideFlow/1.0 (https://rideflow.app)";
  const timeoutMs = options.timeoutMs ?? 8000;
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    source: "osm",
    async searchPlaces(
      query: string,
      placeOptions: PlaceSearchOptions
    ): Promise<PlaceSearchResult[]> {
      const trimmed = query.trim();
      if (!trimmed) {
        return [];
      }

      const params = new URLSearchParams({
        format: "jsonv2",
        q: trimmed,
        addressdetails: "0",
        limit: String(placeOptions.limit ?? 10),
        dedupe: "1"
      });

      if (placeOptions.near) {
        const { lat, lng } = placeOptions.near;
        params.set(
          "viewbox",
          [lng - 0.5, lat + 0.5, lng + 0.5, lat - 0.5].join(",")
        );
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetchImpl(`${baseUrl}/search?${params.toString()}`, {
          headers: {
            Accept: "application/json",
            "User-Agent": userAgent
          },
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`OSM search failed: ${response.status}`);
        }

        const payload = (await response.json()) as NominatimPlace[];

        return payload.map(
          (place): PlaceSearchResult => {
            const lat = place.lat ? Number(place.lat) : undefined;
            const lng = place.lon ? Number(place.lon) : undefined;
            const name = place.display_name?.split(",")[0]?.trim() ?? "Unnamed place";

            return {
              id: toOsmId(place) ?? `osm:${name}:${lat}:${lng}`,
              source: "osm",
              name,
              address: place.display_name,
              lat: Number.isFinite(lat) ? lat : undefined,
              lng: Number.isFinite(lng) ? lng : undefined,
              category: toCategory(place),
              externalUrl: toExternalUrl(place)
            };
          }
        );
      } finally {
        clearTimeout(timeout);
      }
    }
  };
}
