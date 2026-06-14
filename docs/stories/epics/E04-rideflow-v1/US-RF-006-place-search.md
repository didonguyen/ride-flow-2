# US-RF-006 Place Search & Pinning

## Status

planned

## Lane

normal

## Product Contract

The Owner or Planner searches places from the seed data (Vietnam), OpenStreetMap
(Nominatim), or the manual fallback. Every result conforms to the standard
`PlaceSearchResult` shape and carries a source badge (Seed/OSM/Manual). Pinning a
place into a timeline item stores a snapshot (name, address, lat, lng, externalUrl,
imageUrl) — future provider changes do not break old trips.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 006 + RF-008 + FR-048..FR-057 + J-004)
- `docs/specs/001-rideflow-v1/plan.md` (Task 11)
- `docs/specs/001-rideflow-v1/tasks.md` (row 11)
- Provider contracts in `spec.md` (TypeScript `PlaceSearchProvider` interface)

## Acceptance Criteria

- `PlaceSearchProvider` interface: `searchPlaces(query, options)`,
  `getPlaceDetails(placeId)`.
- 3 provider implementations:
  - `SeedPlaceSearchProvider` (default 8-item limit, filter by name/address/category match)
  - `OsmPlaceSearchProvider` (Nominatim `/search?format=jsonv2`, `User-Agent` required)
  - `HybridPlaceSearchProvider` (primary → fallback when the primary returns empty)
- Seed data: 3 Vietnam places (Hoi An Ancient Town, My Khe Beach, Ben Thanh Market).
- `app/api/places/search/route.ts` GET `/api/places/search?q=...` returns
  `{results: PlaceSearchResult[]}`.
- `apps/web/components/places/place-search-panel.tsx` provides the UI: input + search
  button + result list with source badge.
- Domain `normalizeManualPlace({name, address?, lat?, lng?, externalUrl?})` returns
  `PlaceSearchResult` with `id: "manual:slug"`.
- Manual fallback kicks in on no result or on provider failure.
- Pinning a place into a timeline item copies the snapshot fields into the
  `timeline_items` row (`place_source`, `place_source_id`, `place_name`,
  `place_address`, `place_lat`, `place_lng`, `place_external_url`, `place_image_url`).

## Design Notes

- Provider-swap pattern: in the route, `if env.OPENAI_API_KEY → OpenAI else Mock`;
  the same shape applies for place search (`seed → osm`).
- Manual place normalization: `slugify(name) → manual:slug` to keep results idempotent.
- OSM response: `display_name.split(",")[0]` for the name, the full string for the address.
- Two-phase: search → pin. The pin is a separate mutation (calls
  `addTimelineItemUseCase` with the `place` field).
- Future Google adapter: add another `PlaceSearchProvider` implementation and swap it
  in the route.
- Result cards: name, address, source badge, pin action. The source badge derives
  from `result.source` (`seed` | `osm` | `manual` | `google`).

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `pnpm --dir apps/web test tests/infrastructure/place-search` → 2 pass (seed + hybrid fallback) — **planned** |
| Integration | `pnpm --dir apps/web test tests/application/...` (pin use case) — **planned** |
| E2E | Not run; planned in US-RF-009 (search → pin flow) |
| Platform | `pnpm build` (planned) |
| Release | Not applicable |

## Harness Delta

- No change to Harness.

## Evidence (none yet)

- Code has not been committed; everything lives in plan Task 11.

## Open follow-up

- Implement the 3 providers, the route, and the UI panel.
- Add a `place-search` test fixture with the seed data plus a mocked OSM client.
- Wire `addTimelineItemUseCase` to accept `place?: PlaceSearchResult` and persist the
  snapshot.
- Visual proof: search result cards match the `publics/design/Planning.png` source
  badge style.
