import { runCompositeSearch } from "@/src/application/places/composite-provider";
import { createManualPlaceSearchProvider } from "@/src/application/places/manual-provider";
import { createSeedPlaceSearchProvider } from "@/src/application/places/seed-provider";
import type {
  PlaceSearchDependencies,
  PlaceSearchUseCaseResult
} from "@/src/application/places/types";

export function createDefaultPlaceSearchDependencies(
  overrides: Partial<PlaceSearchDependencies> = {}
): PlaceSearchDependencies {
  return {
    providers: overrides.providers ?? [
      createSeedPlaceSearchProvider(),
      createManualPlaceSearchProvider()
    ],
    limit: overrides.limit
  };
}

export async function searchPlacesUseCase(
  dependencies: PlaceSearchDependencies,
  input: {
    query: string;
    options?: Parameters<typeof runCompositeSearch>[1];
  }
): Promise<PlaceSearchUseCaseResult> {
  return runCompositeSearch(input.query, input.options ?? {}, dependencies);
}
