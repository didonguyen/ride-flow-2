# RideFlow V1 Proof Bundle

Evidence bundle for each implemented slice. Each row below runs a real command
and records the actual output. This bundle was extended after the codex worktree
rebase on 2026-06-14: rebase took main's `tasks.md` and `plan.md` for both
conflicted commits (commit `32bccce` became empty and was dropped). The
remaining 5 codex commits landed clean and added 47 new test cases plus a second
Supabase migration.

Run date: 2026-06-14. Environment: Linux, Rust 1.96.0, pnpm 9.15.0, Node v24.16.0,
Python 3 (sqlite3 3.46.1).

## Foundation (US-RF-001)

Domain + product contract + scaffold.

| Check | Command | Result |
|---|---|---|
| Harness CLI build | `cargo build -p harness-cli` | `Finished dev profile in 12.37s` |
| Harness CLI tests | `cargo test --workspace` | `25 passed; 0 failed; 0 ignored` |
| Workspace installed | `pnpm install` | `Already up to date` |
| Domain tests (7 files) | `pnpm --dir apps/web test tests/domain` | `permissions 3, places 3, timeline 5, ai-draft 3, trips 5, env 2, result 1` → 22 pass |
| Spec/plan contract | `ls docs/specs/001-rideflow-v1/{spec.md,plan.md,tasks.md,proof.md}` | 4 files present |

## Supabase Schema + Auth Shell (US-RF-002)

| Check | Command | Result |
|---|---|---|
| Migration v1 present | `ls supabase/migrations/` | `202606110001_rideflow_v1_init.sql` (290 lines) |
| Migration v2 present | `ls supabase/migrations/` | `202606140001_create_profile_on_signup.sql` (24 lines) — adds `handle_new_user()` trigger that inserts into `public.profiles` on `auth.users` insert |
| Schema contract test | `pnpm --dir apps/web test tests/infrastructure/schema-contract` | 5 pass |
| Auth action test | `pnpm --dir apps/web test tests/application/auth-actions` | 4 pass |
| Supabase repos test | `pnpm --dir apps/web test tests/infrastructure/supabase-repositories` | 7 pass |
| Supabase local reset | `supabase db reset` | **Not run** — `supabase` CLI not installed in PATH. Migration ran on CI; local proof pending. |

## Create Trip Flow (US-RF-003)

| Check | Command | Result |
|---|---|---|
| Create trip use-case | `pnpm --dir apps/web test tests/application/create-trip` | 3 pass |
| Create trip server action | `pnpm --dir apps/web test tests/application/create-trip-action` | 2 pass |

## Members & Invites (US-RF-004)

| Check | Command | Result |
|---|---|---|
| Invite use-case | `pnpm --dir apps/web test tests/application/invite-member` | 4 pass |
| Update role use-case | `pnpm --dir apps/web test tests/application/update-member-role` | 3 pass |
| Supabase dashboard data | `pnpm --dir apps/web test tests/application/supabase-dashboard-data` | 3 pass |
| Supabase planning data | `pnpm --dir apps/web test tests/application/supabase-planning-data` | 1 pass |

## Timeline Use Cases + UI (US-RF-005)

| Check | Command | Result |
|---|---|---|
| Timeline use-cases | `pnpm --dir apps/web test tests/application/timeline-use-cases` | 8 pass |
| Planning data | `pnpm --dir apps/web test tests/application/planning-data` | 2 pass |
| Planning workspace state | `pnpm --dir apps/web test tests/application/planning-workspace-state` | 8 pass |
| Planning shell + dashboard shell (UI) | visual | `apps/web/components/{app,planning}/` plus `apps/web/app/(app)/trips/{page,[tripId]/page}.tsx` committed via `d61b5ea`, `eb54bfc`, `19def9e`, `aa64e50` |
| Timeline UI render | `pnpm --dir apps/web test tests/application/timeline-view` | **Not run** — file does not exist yet. `aa64e50` added `ItineraryTimeline` and `SelectedItemInspector` components instead. |
| Drag interaction | `pnpm --dir apps/web test tests/application/drag-time` | **Not run** — file does not exist yet. Planned in plan Task 12. |

## Place Search & Pinning (US-RF-006)

| Check | Command | Result |
|---|---|---|
| Seed provider | `pnpm --dir apps/web test tests/application/places/seed-provider` | 3 pass |
| OSM provider | `pnpm --dir apps/web test tests/application/places/osm-provider` | 3 pass |
| Manual provider | `pnpm --dir apps/web test tests/application/places/manual-provider` | 2 pass |
| Composite provider | `pnpm --dir apps/web test tests/application/places/composite-provider` | 4 pass |
| Search route | `apps/web/app/api/places/search/route.ts` | present (`aa64e50`) |
| Search panel UI | `apps/web/components/planning/place-search-panel.tsx` | present (`aa64e50`) |

## Realtime Sync (US-RF-007)

| Check | Command | Result |
|---|---|---|
| Realtime subscription | `pnpm --dir apps/web test tests/application/realtime/subscription` | 3 pass |
| Realtime status component | `apps/web/components/planning/realtime-status.tsx` | present (`aa64e50`) |

## AI Draft (US-RF-008)

| Check | Command | Result |
|---|---|---|
| AI use-case | `pnpm --dir apps/web test tests/application/ai/use-case` | 5 pass |
| Mock provider | `pnpm --dir apps/web test tests/application/ai/mock-provider` | 3 pass |
| Draft route | `apps/web/app/api/ai/draft/route.ts` | present (`aa64e50`) |
| AI panel UI | `apps/web/components/planning/ai-draft-panel.tsx` | present (`aa64e50`) |

## Dashboard + App Shell (US-RF-002, extended)

| Check | Command | Result |
|---|---|---|
| Dashboard data | `pnpm --dir apps/web test tests/application/dashboard-data` | 1 pass |
| App shell | `apps/web/components/app/app-shell.tsx` | present (`d61b5ea`) |
| Trip card | `apps/web/components/trips/trip-card.tsx` | present (`d61b5ea`) |
| Logo asset | `apps/web/public/design/RideFlow_logo.png` (824030 bytes) | present (`d61b5ea`) |

## Memories Shell (US-RF-011) + Mobile Trip Header (US-RF-010)

| Check | Command | Result |
|---|---|---|
| Memories surface | `apps/web/components/trips/memories-surface.tsx` | present (`aa64e50`) |
| Memories page | `apps/web/app/(app)/trips/[tripId]/memories/page.tsx` | present (`aa64e50`) |
| Mobile trip header | `apps/web/components/planning/mobile-trip-header.tsx` | present (`aa64e50`) |

## Expenses Shell (US-RF-012)

| Check | Command | Result |
|---|---|---|
| Expenses surface | `apps/web/components/trips/expenses-surface.tsx` | present (`aa64e50`) |
| Expenses page | `apps/web/app/(app)/trips/[tripId]/expenses/page.tsx` | present (`aa64e50`) |

## E2E Happy Path (US-RF-009)

| Check | Command | Result |
|---|---|---|
| Playwright config | `apps/web/playwright.config.ts` | **Not run** — file does not exist yet. Planned in plan Task 15. |

## Combined Test Run (after codex rebase)

```text
$ pnpm --dir apps/web test
 ✓ tests/infrastructure/schema-contract.test.ts (5 tests)
 ✓ tests/application/places/osm-provider.test.ts (3 tests)
 ✓ tests/infrastructure/supabase-repositories.test.ts (7 tests)
 ✓ tests/application/planning-workspace-state.test.ts (8 tests)
 ✓ tests/application/invite-member.test.ts (4 tests)
 ✓ tests/application/places/composite-provider.test.ts (4 tests)
 ✓ tests/application/timeline-use-cases.test.ts (8 tests)
 ✓ tests/application/realtime/subscription.test.ts (3 tests)
 ✓ tests/application/ai/use-case.test.ts (5 tests)
 ✓ tests/application/create-trip.test.ts (3 tests)
 ✓ tests/application/create-trip-action.test.ts (2 tests)
 ✓ tests/application/update-member-role.test.ts (3 tests)
 ✓ tests/domain/timeline.test.ts (5 tests)
 ✓ tests/domain/env.test.ts (2 tests)
 ✓ tests/application/supabase-planning-data.test.ts (1 test)
 ✓ tests/application/supabase-dashboard-data.test.ts (3 tests)
 ✓ tests/application/ai/mock-provider.test.ts (3 tests)
 ✓ tests/domain/trips.test.ts (5 tests)
 ✓ tests/domain/ai-draft.test.ts (3 tests)
 ✓ tests/domain/places.test.ts (3 tests)
 ✓ tests/application/places/seed-provider.test.ts (3 tests)
 ✓ tests/application/dashboard-data.test.ts (1 test)
 ✓ tests/domain/permissions.test.ts (3 tests)
 ✓ tests/application/planning-data.test.ts (2 tests)
 ✓ tests/application/places/manual-provider.test.ts (2 tests)
 ✓ tests/domain/result.test.ts (1 test)
 ✓ tests/application/auth-actions.test.ts (4 tests)

 Test Files  27 passed (27)
      Tests  96 passed (96)
   Duration  3.82s
```

```text
$ cargo test --workspace
test result: ok. 25 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

## Known Gaps

- `pnpm build` not run in this bundle; expected pass (matches prior `feat: add Supabase auth shell` and `feat: add trip creation foundation` CI evidence).
- `pnpm test:e2e` not run — Playwright config not yet wired (plan Task 15, US-RF-009).
- `supabase db reset` not run locally — Supabase CLI absent from PATH.
- Worktree `codex/rideflow-v1-app-shell-dashboard` was rebased onto main and the
  6 commits fast-forward merged; the working tree is now redundant. Cleanup
  pending: `git worktree remove .worktrees/rideflow-v1-app-shell-dashboard`.
- Worktree `epic/rf-place-search` is at commit `e817954` (pre-codex-merge); bring
  it forward via `git rebase main` before slicing the next change.
- Drag interaction test (`tests/application/drag-time.test.ts`) and timeline-view
  render test (`tests/application/timeline-view.test.tsx`) referenced in
  `US-RF-005` story packet are still pending; codex's `aa64e50` implemented
  `ItineraryTimeline` and `SelectedItemInspector` components but not the
  associated vitest files. Either keep the story at `in_progress` and add the
  tests, or close it and split the remaining drag work into a new story.
- Story status in `harness.db` for the codex-driven slices (US-RF-002, 005, 006,
  007, 008, 010, 011, 012) is still `planned`/`in_progress` despite evidence in
  this bundle; need a follow-up `harness-cli story update` pass.

## Reproduce

```bash
# Harness CLI
. "$HOME/.cargo/env"
cargo test --workspace

# Ride-flow apps
pnpm install
pnpm --dir apps/web test

# Optional
pnpm --dir apps/web build
```
