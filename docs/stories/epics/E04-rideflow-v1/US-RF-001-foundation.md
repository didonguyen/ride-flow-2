# US-RF-001 Stabilize Foundation

## Status

implemented

## Lane

normal

## Product Contract

The repo exposes a working workspace to build and test RideFlow V1: pnpm workspace,
Next.js App Router shell, strict TypeScript, pure domain rules (permissions, dates,
places, timeline, trips, ai-draft), environment parsing through Zod, product
contract, and story packet with evidence in TEST_MATRIX.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 001)
- `docs/specs/001-rideflow-v1/plan.md` (Task 1, 2, 3, 4)
- `docs/specs/001-rideflow-v1/tasks.md` (rows 1-4.2)
- `docs/product/rideflow-v1.md`
- `docs/TEST_MATRIX.md`

## Acceptance Criteria

- `pnpm install` succeeds; lockfile is stable.
- `pnpm --dir apps/web test` runs the 22 domain test cases.
- `pnpm --dir apps/web build` passes (not re-run in this bundle; CI evidence pre-existing).
- `apps/web/src/domain/{permissions,trips,timeline,places,ai-draft,dates}.ts` exists, each with paired tests.
- `docs/TEST_MATRIX.md` carries the row "RideFlow V1 planning core" (will be split into 12 rows once US-RF-002..012 ship).
- Pure domain rules — `validateTripDateRange`, `createTripDays`, `validateTimelineItemDraft`,
  `validateItineraryDraft`, `normalizeManualPlace`, `canMutateTimeline`, `canManageMembers` — behave
  correctly under their paired tests.

## Design Notes

- Commands: `pnpm install`, `pnpm --dir apps/web test`, `pnpm --dir apps/web build`.
- Domain rules stay pure: no framework dependencies, parse-first through Zod at the env
  boundary, `Result<T,E>` for use-case returns.
- Use cases `createTripUseCase`, `addTimelineItemUseCase`, `inviteMemberUseCase`,
  `updateMemberRoleUseCase` are scaffolded in this slice so later slices can wire UI;
  every one validates permissions through `permissions.ts`.
- UI surfaces: route `/` placeholder redirecting to `/trips`; layout follows the standard
  Next.js App Router.
- Tables: not yet touched (US-RF-002 owns that surface).

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `pnpm --dir apps/web test tests/domain` → 22 pass |
| Integration | `pnpm --dir apps/web test tests/infrastructure/schema-contract` → 5 pass (smoke) |
| E2E | Not run; planned in US-RF-009 |
| Platform | `pnpm build` on Linux x64 |
| Release | Not applicable until packaging exists |

## Harness Delta

- DB intake #1 + story US-RF-000 recorded in `harness.db` for the reconcile initiative.
- Foundation does not change Harness policy docs or schema; only the evidence bundle
  in `docs/specs/001-rideflow-v1/proof.md` is new.

## Evidence

- Domain tests: 22/22 pass (proof.md "Foundation" section)
- Combined test: 49/49 pass
- Cargo test: 25/25 pass
- Git: `5370343` (scaffold), `a94648e` (test setup), `b785d28` (env harden),
  `61e4f83` (domain), `5c6d2ab` (validation harden), `0e6fa13` (product contract),
  `4af6355` + `da6bb2d` (TEST_MATRIX update), `c8faa71` (shadcn helper), `59a786b` (.gitignore)
- Files: see `docs/specs/001-rideflow-v1/tasks.md` rows 1-4.2

## Open follow-up

- Split the single TEST_MATRIX row into 12 rows as US-RF-002..012 ship.
- `apps/web/src/application/{auth,members,timeline,places,ai}/types.ts` already exist; add
  the `places/` and `ai/` providers (US-RF-006, US-RF-008).
