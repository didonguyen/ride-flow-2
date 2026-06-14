import { NextResponse } from "next/server";

import { searchPlacesUseCase } from "@/src/application/places/use-case";
import {
  createOsmPlaceSearchProvider
} from "@/src/application/places/osm-provider";
import { createSeedPlaceSearchProvider } from "@/src/application/places/seed-provider";
import { createManualPlaceSearchProvider } from "@/src/application/places/manual-provider";
import { getServerEnv } from "@/src/lib/env";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const env = getServerEnv();
  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim();
  const limit = Number(url.searchParams.get("limit") ?? "12");
  const destination = url.searchParams.get("destination") ?? undefined;
  const near = parseNear(url);

  if (!query) {
    return NextResponse.json(
      {
        query: "",
        results: [],
        reports: [],
        failures: []
      },
      { status: 200 }
    );
  }

  const result = await searchPlacesUseCase(
    {
      providers: [
        createSeedPlaceSearchProvider(),
        createOsmPlaceSearchProvider({
          baseUrl: env.OSM_NOMINATIM_BASE_URL
        }),
        createManualPlaceSearchProvider()
      ],
      limit: Number.isFinite(limit) && limit > 0 ? limit : 12
    },
    {
      query,
      options: {
        destination: destination ?? undefined,
        near
      }
    }
  );

  return NextResponse.json(result, { status: 200 });
}

function parseNear(url: URL) {
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return undefined;
  }

  return { lat, lng };
}
