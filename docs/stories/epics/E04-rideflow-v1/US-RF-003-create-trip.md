# US-RF-003 Create Trip Flow

## Status

implemented

## Lane

normal

## Product Contract

The Owner creates a trip with name, destination, start date, and end date. The server
validates the date range, generates one `trip_day` record per date in the range, and
promotes the Owner to an accepted member with role `owner`. The user is then redirected
to the Planning tab of the new trip.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 003 + RF-004 + FR-019..FR-024 + J-002)
- `docs/specs/001-rideflow-v1/plan.md` (Task 7)
- `docs/specs/001-rideflow-v1/tasks.md` (row 7)

## Acceptance Criteria

- Form `apps/web/components/trips/new-trip-form.tsx` exposes inputs for name, destination,
  start date, and end date.
- Server action `createTripAction` (in `app/(app)/trips/new/page.tsx`) invokes
  `createTripUseCase`.
- `createTripUseCase`:
  - Rejects an empty name with `trip_name_required`
  - Rejects an empty destination with `trip_destination_required`
  - Rejects `end_date < start_date` with `trip_end_before_start`
  - Generates `days[]` via `createTripDays(start, end)`, each day carrying `date`
    (YYYY-MM-DD) and `day_index` (1..N)
  - Calls `repository.createTripWithDays({ ownerId, name, destination, startDate, endDate, days })`
- `apps/web/app/(app)/trips/page.tsx` shows the heading "Trips" and a "New trip" CTA
  pointing at `/trips/new`.
- Tests cover 3 cases (success, end-before-start, day generation) in
  `tests/application/create-trip.test.ts`.

## Design Notes

- The repository interface (`TripRepository`) is defined in `application/trips/types.ts`;
  the concrete implementation will wire into Supabase once a session is available.
- Today `createTripAction` only `console.log`s the payload (Task 7 step 7). It must be
  wired to a `supabase` client in a follow-up story; that can be a sub-task of US-RF-002.
- The domain rule `createTripDays` from `domain/trips.ts` is shared between the unit
  test and the use case.
- The use case returns `Result<CreatedTrip, ...>` and never throws.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `pnpm --dir apps/web test tests/application/create-trip` → 3 pass |
| Integration | `pnpm --dir apps/web test tests/infrastructure/schema-contract` → 5 pass (covers `trip_days` table) |
| E2E | Not run; planned in US-RF-009 |
| Platform | `pnpm build` (CI evidence from `40d2e73`) |
| Release | Not applicable |

## Harness Delta

- No change to Harness.
- The `Result<T, E>` pattern in `src/lib/result.ts` is shared across all use cases; this
  is a ride-flow convention, not a Harness policy.

## Evidence

- `apps/web/src/application/trips/{types,create-trip}.ts` exist
- `apps/web/components/trips/new-trip-form.tsx` plus 2 page routes
- Tests: 3 pass (proof.md "Create Trip Flow")
- Git: `40d2e73 feat: add trip creation foundation`

## Open follow-up

- Wire `createTripAction` to Supabase for real (currently `console.log`).
- Generate `trip_days` rows inside a DB transaction (1 trip + N days).
- Insert a `trip_members` row for the owner with `invite_status='accepted'`,
  `role='owner'`, `user_id=auth.uid()`.
- Render the trip list at `/trips` from a Supabase query instead of the empty state.
