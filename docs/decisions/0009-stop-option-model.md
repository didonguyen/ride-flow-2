# 0009 Stop + Option model

## Status

accepted

## Context

The RideFlow Planning page V1 stores each itinerary row as a `timeline_items`
row that carries a single optional place snapshot. The new product spec
(`docs/specs/004-planning-mvp/spec.md`) introduces a Stop + Option model in
which each stop can hold zero, one, or many options, with exactly one
option pinned and the rest kept as backups.

The model is the core product differentiator and is too important to leave
as inline placeholders. We must lock it as a durable decision before any
schema change ships.

## Decision

The Planning page uses a Stop + Option model on top of the existing
`trips` and `trip_days` tables:

- `trip_stops` (new): one row per stop. Carries `status` in
  `action_needed | pinned`, optional `pinned_option_id`, `sort_order`,
  `time`, `location_name`, `lat`, `lng`, `description`, `note`,
  `title`, `day_id`, and `created_by`.
- `stop_options` (new): one row per option. Carries `status` in
  `candidate | pinned | backup | removed`, `source` in
  `ai | google_places | manual`, plus place detail, sort order, and the
  trip / stop foreign keys.
- `trip_role` enum adds the `member` role so that we can distinguish
  read-only contributors (`member`) from read-only observers (`viewer`)
  without giving `member` write access.

Invariants enforced in the application layer and database layer:

- At most one option per stop has `status = 'pinned'`.
- A stop's `status = 'pinned'` iff `pinned_option_id` is non-null.
- Mutations require `role IN ('owner', 'planner')`. `member` and `viewer`
  are read-only.

## Consequences

- Existing `timeline_items` table stays for the demo fallback trip IDs.
  Phase 2 will move the primary surface to `trip_stops` for all trips.
- New RLS policies on `trip_stops` and `stop_options` mirror the existing
  `timeline_items` policy shape: read for all members, write for
  `owner` and `planner` only.
- New use cases are added under `apps/web/src/application/stop-options/`.
- The existing `TripRole` type is extended with `"member"`. All call sites
  that use a literal role are forced through `permissions.ts` so that
  adding the role does not break authorization.

## Alternatives considered

- Keep the existing single-place model and add a `place_options` JSONB
  column on `timeline_items`. Rejected because the spec requires per-option
  status, source, and reordering that a JSONB column cannot guarantee
  cleanly.
- Pin options directly on `timeline_items` (drop the separate option table).
  Rejected because backups, deduping, and Google Places enrichment all
  benefit from a first-class row.