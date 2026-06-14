# RideFlow V1 Tasks

Atomic task table mapping: plan task ↔ slice/story ↔ git commit ↔ proof.
Each row corresponds to one atomic change that has been made (status `implemented`)
or will be made (status `planned`). Status tracks `TEST_MATRIX.md`; story packets
under `docs/stories/epics/E04-rideflow-v1/` hold the details.

## Mapping slice → plan task

| Slice (Story)              | Plan Task  | Name                          |
|----------------------------|------------|-------------------------------|
| US-RF-001 Foundation       | 1, 2, 3, 4 | Scaffold + domain + contract  |
| US-RF-002 Auth & Supabase  | 5, 6       | Supabase schema + auth shell  |
| US-RF-003 Create Trip      | 7          | Trip create + trip days       |
| US-RF-004 Members          | 8          | Invite + role use cases       |
| US-RF-005 Timeline CRUD    | 9, 10, 12  | Use cases + UI + drag         |
| US-RF-006 Place Search     | 11         | Hybrid seed/OSM + pin         |
| US-RF-007 Realtime Sync    | 13         | Supabase Realtime channel     |
| US-RF-008 AI Draft         | 14         | Mock/OpenAI provider          |
| US-RF-009 E2E Happy Path   | 15         | Playwright planning core      |
| US-RF-010 Mobile Agenda    | (tbd)      | Mobile bottom sheet + day picker |
| US-RF-011 Memories Shell   | (tbd)      | Album layout + PDF export     |
| US-RF-012 Expenses Shell   | (tbd)      | Donut + transaction table     |

## Atomic Task Table

| #   | Story      | Plan | Title                                  | Files (key)                                                                                          | Status     | Commit      | Evidence                                     |
|-----|------------|------|----------------------------------------|------------------------------------------------------------------------------------------------------|------------|-------------|----------------------------------------------|
| 1   | US-RF-001  | 1    | Workspace + Next.js scaffold           | `package.json`, `pnpm-workspace.yaml`, `apps/web/{package.json,tsconfig.json,next.config.ts,app/}`   | implemented | `5370343`   | `pnpm build` pass                           |
| 2   | US-RF-001  | 2.1  | Test setup (vitest + jsdom)             | `apps/web/vitest.config.ts`, `apps/web/tests/setup.ts`, `tests/domain/result.test.ts`               | implemented | `a94648e`   | `pnpm --dir apps/web test` 1 pass           |
| 2.1 | US-RF-001  | 2.2  | Harden env parsing                     | `apps/web/src/lib/env.ts`, `tests/domain/env.test.ts`                                                 | implemented | `b785d28`   | env.test 1 pass                              |
| 3   | US-RF-001  | 3    | Domain rules                           | `apps/web/src/domain/{permissions,trips,timeline,places,ai-draft,dates}.ts`                          | implemented | `61e4f83`   | `pnpm test tests/domain` 5 pass             |
| 3.1 | US-RF-001  | 3.x  | Harden date + place validation          | domain + test patches                                                                                | implemented | `5c6d2ab`   | re-test pass                                 |
| 4   | US-RF-001  | 4    | Product contract + story packet         | `docs/product/rideflow-v1.md`, `docs/stories/rideflow-v1-planning-core.md`, `docs/TEST_MATRIX.md`     | implemented | `0e6fa13`   | files exist                                  |
| 4.1 | US-RF-001  | 4.x  | Update TEST_MATRIX row                  | `docs/TEST_MATRIX.md`                                                                                | implemented | `da6bb2d` + `4af6355` | row present                  |
| 4.2 | US-RF-001  | 4.x  | shadcn utility helper                  | `apps/web/src/lib/utils.ts`                                                                          | implemented | `c8faa71`   | file exists                                  |
| 5   | US-RF-002  | 5    | Supabase schema + RLS + types           | `supabase/migrations/202606110001_rideflow_v1_init.sql`, `apps/web/src/infrastructure/supabase/*`     | implemented | `86568d7`   | `supabase db reset` pass                     |
| 5.1 | US-RF-002  | 5.x  | Harden schema contract                  | migration patch                                                                                      | implemented | `a1dbf03`   | re-test pass                                 |
| 5.2 | US-RF-002  | 5.x  | .gitignore local runtime                | `.gitignore`                                                                                          | implemented | `59a786b`   | file exists                                  |
| 5.3 | US-RF-002  | 5.x  | Provision supabase v2 (worktree branch) | `codex/rideflow-v1-app-shell-dashboard` branch only (not in main)                                     | branch-only | `363da1b`   | (not merged into main)                       |
| 6   | US-RF-002  | 6    | Supabase clients + auth pages           | `apps/web/src/{infrastructure/supabase,application/auth}/`, `apps/web/app/(auth)/`                   | implemented | `ab70915`   | `pnpm build` pass                            |
| 7   | US-RF-003  | 7    | Create trip use case + UI               | `apps/web/src/application/trips/*`, `app/(app)/trips/{new,page}`, `components/trips/new-trip-form.tsx` | implemented | `40d2e73`   | `pnpm test tests/application/create-trip` 1 pass |
| 8   | US-RF-004  | 8    | Member invite + role use cases          | `apps/web/src/application/members/*`, `components/trips/member-list.tsx`                              | implemented | `af4d1cc`   | `pnpm test tests/application/{invite,update}-member` 2 pass |
| 9   | US-RF-005  | 9    | Timeline use cases (add/move/delete)    | `apps/web/src/application/timeline/*`                                                                 | implemented | `d3f8639`   | `pnpm test tests/application/timeline-use-cases` 3 pass |
| 9.1 | US-RF-005  | 9.x  | Fix timeline move-item                  | `apps/web/src/application/timeline/move-item.ts`                                                      | implemented | `f385f5a`   | timeline test re-pass                        |
| 10  | US-RF-005  | 10   | Timeline UI shell                       | `apps/web/components/timeline/*`, `app/(app)/trips/[tripId]/page.tsx`                                 | implemented | `d61b5ea`+`eb54bfc`+`19def9e`+`aa64e50` | planning + workspace state tests 2+8+8 pass; visual via dashboard + planning shells |
| 10.1| US-RF-005  | 10.1 | Timeline inspector (worktree only, rebased) | `codex/rideflow-v1-app-shell-dashboard` branch (rebased onto main)                                     | merged     | `f07bb76`   | (renamed `19def9e` after rebase)             |
| 10.2| US-RF-005  | 10.2 | Planning shell (worktree only, rebased) | `codex/rideflow-v1-app-shell-dashboard` branch (rebased onto main)                                     | merged     | `6bc74be`   | (renamed `eb54bfc` after rebase)             |
| 10.3| US-RF-005  | 10.3 | Wire planning core (worktree only, rebased) | `codex/rideflow-v1-app-shell-dashboard` branch (rebased onto main)                                  | merged     | `923c204`   | (renamed `aa64e50` after rebase)             |
| 11  | US-RF-006  | 11   | Hybrid place search                     | `apps/web/src/{application,infrastructure}/places/*`, `app/api/places/search`, `components/planning/place-search-panel.tsx` | implemented | `aa64e50`   | 4 provider tests (12 cases) + composite 4 cases = 16 pass |
| 12  | US-RF-005  | 12   | Drag timeline interaction               | `apps/web/components/timeline/draggable-timeline.tsx`                                                 | planned     | —           | —                                            |
| 13  | US-RF-007  | 13   | Realtime timeline subscription          | `apps/web/src/application/realtime/*`, `components/planning/realtime-status.tsx`                       | implemented | `aa64e50`   | `subscription.test.ts` 3 pass                |
| 14  | US-RF-008  | 14   | AI draft provider (mock + OpenAI)       | `apps/web/src/application/ai/*`, `app/api/ai/draft`, `components/planning/ai-draft-panel.tsx`         | implemented | `aa64e50`   | `use-case` 5 + `mock-provider` 3 = 8 pass     |
| 15  | US-RF-009  | 15   | Playwright E2E happy path               | `apps/web/playwright.config.ts`, `apps/web/tests/e2e/*`                                               | planned     | —           | —                                            |
| 16  | US-RF-010  | tbd  | Mobile agenda shell + day picker        | `apps/web/app/(app)/trips/[tripId]/mobile/`, `components/planning/mobile-trip-header.tsx`             | implemented | `aa64e50`   | mobile-trip-header.tsx present; layout integrates with planning workspace |
| 17  | US-RF-011  | tbd  | Memories shell (album + PDF export)     | `apps/web/components/trips/memories-surface.tsx`, `app/(app)/trips/[tripId]/memories/page.tsx`        | implemented | `aa64e50`   | shell present; export action stub            |
| 18  | US-RF-012  | tbd  | Expenses shell (donut + table)          | `apps/web/components/trips/expenses-surface.tsx`, `app/(app)/trips/[tripId]/expenses/page.tsx`        | implemented | `aa64e50`   | shell present; donut + table per spec        |
| 19  | US-RF-002  | 5.x  | Supabase v2 profile trigger             | `supabase/migrations/202606140001_create_profile_on_signup.sql`                                        | implemented | `0bfa1a2`   | handle_new_user() trigger inserts profiles row on auth.users insert |
| 20  | US-RF-004  | 8.x  | Supabase dashboard + planning data       | `apps/web/src/application/trips/supabase-dashboard-data.ts`, `supabase-planning-data.ts`, `infrastructure/supabase/repositories.ts` | implemented | `0bfa1a2`+`aa64e50` | supabase-dashboard-data 3 pass + supabase-planning-data 1 pass + supabase-repositories 7 pass |
| 21  | US-RF-005  | 10.4 | Members panel UI (rebased)              | `apps/web/components/trips/members-panel.tsx`                                                          | implemented | `aa64e50`   | UI shipped in wire-planning-core commit       |
| 22  | US-RF-005  | 10.5 | Selected item inspector UI (rebased)    | `apps/web/components/planning/selected-item-inspector.tsx`                                              | implemented | `aa64e50`   | UI shipped in wire-planning-core commit       |

## Notes

- Tasks 10-22 include the 5 codex commits that landed via rebase on 2026-06-14
  (`d61b5ea`, `eb54bfc`, `19def9e`, `0bfa1a2`, `aa64e50`). The original 6th
  codex commit `32bccce docs:add-rideflow-dashboard-tasks` was dropped during
  rebase because resolving both `docs/specs/001-rideflow-v1/{plan,tasks}.md`
  with main's content made the commit empty.
- Tasks 16-18 have no plan detail yet. Add a follow-up plan or scaffold the
  slice first, then break it into tasks when entering the slice.
- File `docs/superpowers/plans/2026-06-11-rideflow-v1-planning-core.md` was moved
  to `docs/specs/001-rideflow-v1/plan.md` (this change is uncommitted; review
  via `git status`).
