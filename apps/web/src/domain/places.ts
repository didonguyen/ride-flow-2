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
  imageUrl?: string;
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
  const slug = value
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `place-${hashString(value)}`;
}

function hashString(value: string): string {
  let hash = 0;

  for (const char of value) {
    hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  }

  return hash.toString(36);
}
