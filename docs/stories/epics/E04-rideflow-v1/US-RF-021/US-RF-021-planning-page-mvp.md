# US-RF-021 Planning Page MVP (Stop + Option model)

## Status

in_progress

## Lane

high-risk

## Product Contract

This story implements Phase 1 of the RideFlow Planning Page spec
(`docs/specs/004-planning-mvp/spec.md`): the Stop + Option model that
replaces the legacy single-place Timeline Item.

Trip → Days → Stops → Options.

Rules locked for MVP:

- A `Stop` carries `status` in `{ "action_needed", "pinned" }`.
- A `Stop` may have zero, one, or many `StopOption`s.
- A `StopOption` carries `status` in `{ "candidate", "pinned", "backup", "removed" }`.
- Exactly one option per stop can be `pinned`. The stop status then becomes `pinned`.
- All other non-removed options become `backup` once one option is pinned.
- Removing the pinned option resets stop status to `action_needed`.
- `OptionSource` is `"ai" | "google_places" | "manual"`.
- `TripRole` becomes `"owner" | "planner" | "member" | "viewer"`.
- Mutations require `owner` or `planner`. `member` and `viewer` are read-only.
- Mutations are checked at the application layer (`use cases`) and at the
  database layer (`stop_options_*` RLS policies).

## Relevant Product Docs

- `docs/specs/004-planning-mvp/spec.md` (input product spec)
- `docs/product/rideflow-v1.md`
- `docs/decisions/0009-stop-option-model.md`

## Acceptance Criteria

- `validateStopOptionDraft`:
  - Rejects empty name with `option_name_required`.
  - Rejects invalid rating range with `option_rating_invalid`.
- `validateStopDraft`:
  - Rejects empty title with `stop_title_required`.
  - Rejects invalid time format with `stop_time_invalid`.
- `pinStopOptionUseCase`:
  - Rejects mutation for `member` / `viewer` with `option_mutation_forbidden`.
  - Rejects an unknown `optionId` with `option_not_found`.
  - Promotes the chosen option to `pinned` and demotes all other non-removed
    options for the stop to `backup`.
  - Sets `stop.status = "pinned"` and `stop.pinned_option_id`.
- `unpinStopOptionUseCase`:
  - Rejects mutation for `member` / `viewer`.
  - Moves pinned option to `candidate` (MVP recommendation: do not hard delete).
  - Sets `stop.status = "action_needed"` and `stop.pinned_option_id = null`.
- `addManualOptionUseCase`:
  - Rejects mutation for `member` / `viewer`.
  - Creates an option with `source = "manual"`, `status = "candidate"`.
- `generateStopOptionsUseCase`:
  - Rejects mutation for `member` / `viewer`.
  - Creates 3–5 candidate options with `source = "ai"`.
- `searchGooglePlacesForStopUseCase`:
  - Rejects mutation for `member` / `viewer`.
  - Maps provider results to `StopOption` candidates with
    `source = "google_places"`.
- `reorderTripStopsUseCase`:
  - Rejects mutation for `member` / `viewer`.
  - Updates `day_id` for cross-day moves and `sort_order` for affected days.
- UI:
  - `StopCardActionNeeded` renders `Action needed` badge and at least one
    candidate option card with a `Pin this` CTA.
  - `StopCardPinned` renders `Pinned` badge and a `Backup options (N)` toggle.
  - `StopCardReadOnly` hides all edit / pin / delete CTAs.
  - `RouteOverviewPanel` shows the trip header summary, stops count, and a
    placeholder map area.
- Database:
  - `stop_options` table exists with the spec columns, RLS policies for
    read members / write planners, and triggers for `updated_at`.
- Permissions:
  - `canMutatePlanning` returns `true` for `owner` and `planner` only.
  - `canReadPlanning` returns `true` for all four roles.

## Design Notes

- New domain file: `apps/web/src/domain/stop-options.ts` holds pure validation
  and option normalization helpers. No database, framework, or provider
  imports.
- New application folder: `apps/web/src/application/stop-options/` holds use
  cases, repository types, and workspace state reducers.
- New UI folder: `apps/web/components/planning/stop-card/` holds the three
  StopCard variants plus the option card family.
- Workspace state lives in `apps/web/src/application/stop-options/workspace-state.ts`
  and is consumed by a new `StopPlanningWorkspace` client component. It is
  rendered alongside the existing V1 surface for the demo trip IDs, and the
  spec asks for the new surface to be the primary planning surface.
- Existing V1 timeline (`timeline_items`) is left untouched for the demo
  fallback trip IDs (`nam-cat-tien`, `da-nang`). New UUID trips still render
  through the legacy `PlanningSurface` for Phase 1. Phase 2 will switch the
  primary surface to `StopPlanningWorkspace`.
- The `Member` role is added to the `trip_role` Postgres enum via a new
  migration. Existing RLS policies using `'planner'` are unchanged for now
  (they accept `owner`, `planner`, and `viewer` reads; planners write).
  Adding `'member'` to the read-only set is additive and safe.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `pnpm --dir apps/web test tests/domain/stop-options` (5 pass) |
| Unit | `pnpm --dir apps/web test tests/application/stop-options-use-cases` (8 pass) |
| Unit | `pnpm --dir apps/web test tests/application/stop-options-workspace-state` (8 pass) |
| Integration | `pnpm --dir apps/web test tests/infrastructure/schema-contract` (5 pass; covers `stop_options`) |
| E2E | Not run; Playwright chromium unsupported on host |
| Platform | `pnpm build` passes; `pnpm lint` clean |

Story proof update:

```bash
scripts/bin/harness-cli story update --id US-RF-021 --status implemented \
  --unit 1 --integration 1 --e2e 0 --platform 0
```

Story verification command:

```bash
scripts/bin/harness-cli story update --id US-RF-021 --verify "pnpm --dir apps/web test"
```

## Harness Delta

- New domain file: `apps/web/src/domain/stop-options.ts`.
- New application folder: `apps/web/src/application/stop-options/`.
- New UI folder: `apps/web/components/planning/stop-card/`.
- New component: `apps/web/components/planning/route-overview-panel.tsx`.
- New migration: `supabase/migrations/202606230001_stop_options_phase1.sql`.
- New decision: `docs/decisions/0009-stop-option-model.md`.
- Updated `apps/web/src/domain/permissions.ts` to add `member` role.
- Updated `apps/web/src/infrastructure/supabase/repositories.ts` to expose
  `StopOptionRepository` and `StopRepository` adapters.
- New tests: `tests/domain/stop-options.test.ts`,
  `tests/application/stop-options-use-cases.test.ts`,
  `tests/application/stop-options-workspace-state.test.ts`,
  `tests/infrastructure/schema-contract.test.ts` extended for `stop_options`.

## Open follow-up (Phase 2 / 3)

- Wire `StopPlanningWorkspace` to the Supabase repository via server actions
  (Phase 2 — smart options).
- Replace `RouteOverviewPanel` placeholder with Google Maps embed (Phase 3).
- Real Google Places provider call; today the use case accepts an injected
  `PlaceProvider` for tests.
- AI option generation: today the use case accepts an injected
  `StopOptionDraftGenerator` for tests.

## Evidence

- Test output below once tests run.
- Build output below once `pnpm build` runs.