import type { PlaceSearchResult, PlaceSource } from "@/src/domain/places";

export type PlaceSearchOptions = {
  tripId?: string;
  destination?: string;
  near?: {
    lat: number;
    lng: number;
  };
  limit?: number;
};

export interface PlaceSearchProvider {
  readonly source: PlaceSource;
  searchPlaces(
    query: string,
    options: PlaceSearchOptions
  ): Promise<PlaceSearchResult[]>;
}

export type PlaceProviderStatus = "ok" | "empty" | "failed";

export type PlaceProviderReport = {
  source: PlaceSource;
  status: PlaceProviderStatus;
  results: PlaceSearchResult[];
  error?: string;
};

export type PlaceSearchUseCaseResult = {
  query: string;
  results: PlaceSearchResult[];
  reports: PlaceProviderReport[];
  failures: PlaceProviderReport[];
};

export type PlaceSearchDependencies = {
  providers: PlaceSearchProvider[];
  limit?: number;
};

export type PlaceSearchUseCaseInput = {
  query: string;
  options: PlaceSearchOptions;
};
