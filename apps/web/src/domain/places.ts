import { err, ok, type Result } from "@/src/lib/result";

export type PlaceSource = "seed" | "osm" | "manual" | "google";

export type PlaceSearchResult = {
  id: string;
  source: PlaceSource;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  category?: string;
  externalUrl?: string;
  metadata?: Record<string, unknown>;
};

export type ManualPlaceInput = {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  category?: string;
  externalUrl?: string;
  metadata?: Record<string, unknown>;
};

export function normalizeManualPlace(
  input: ManualPlaceInput
): Result<PlaceSearchResult, "place_name_required"> {
  const name = input.name.trim();

  if (!name) {
    return err("place_name_required");
  }

  return ok({
    ...input,
    id: `manual:${slugify(name)}`,
    source: "manual",
    name
  }) as Result<PlaceSearchResult, "place_name_required">;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
