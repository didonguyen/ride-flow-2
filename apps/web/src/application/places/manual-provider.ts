import { normalizeManualPlace } from "@/src/domain/places";

import type { PlaceSearchProvider } from "@/src/application/places/types";

export function createManualPlaceSearchProvider(): PlaceSearchProvider {
  return {
    source: "manual",
    async searchPlaces(query) {
      const trimmed = query.trim();
      if (!trimmed) {
        return [];
      }

      const result = normalizeManualPlace({ name: trimmed });

      if (!result.ok) {
        return [];
      }

      return [result.value];
    }
  };
}
