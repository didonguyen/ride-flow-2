# RideFlow V1 Proof Bundle

Evidence bundle for each implemented slice. Each row below runs a real command
and records the actual output.

Run date: 2026-06-14. Environment: Linux, Rust 1.96.0, pnpm 9.15.0, Node v24.16.0,
Python 3 (sqlite3 3.46.1).

## Foundation (US-RF-001)

Domain + product contract + scaffold.

| Check | Command | Result |
|---|---|---|
| Harness CLI build | `cargo build -p harness-cli` | `Finished dev profile in 12.37s` |
| Harness CLI tests | `cargo test --workspace` | `25 passed; 0 failed; 0 ignored` |
| Workspace installed | `pnpm install` | `Already up to date` |
| Domain tests (4 files) | `pnpm --dir apps/web test tests/domain` | `permissions 3, places 3, timeline 5, ai-draft 3, trips 5, env 2, result 1` → 22 pass |
| Spec/plan contract | `ls docs/specs/001-rideflow-v1/{spec.md,plan.md,tasks.md,proof.md}` | 4 files present |

## Supabase Schema + Auth Shell (US-RF-002)

| Check | Command | Result |
|---|---|---|
| Migration present | `ls supabase/migrations/` | `202606110001_rideflow_v1_init.sql` (290 lines) |
| Schema contract test | `pnpm --dir apps/web test tests/infrastructure/schema-contract` | 5 pass |
| Auth action test | `pnpm --dir apps/web test tests/application/auth-actions` | 4 pass |
| Supabase local reset | `supabase db reset` | **Not run** — `supabase` CLI not installed in PATH. Migration ran on CI; local proof pending. |

## Create Trip Flow (US-RF-003)

| Check | Command | Result |
|---|---|---|
| Create trip use-case | `pnpm --dir apps/web test tests/application/create-trip` | 3 pass |

## Members & Invites (US-RF-004)

| Check | Command | Result |
|---|---|---|
| Invite use-case | `pnpm --dir apps/web test tests/application/invite-member` | 4 pass |
| Update role use-case | `pnpm --dir apps/web test tests/application/update-member-role` | 3 pass |

## Timeline Use Cases (US-RF-005 — use cases only, UI pending)

| Check | Command | Result |
|---|---|---|
| Timeline use-cases | `pnpm --dir apps/web test tests/application/timeline-use-cases` | 8 pass |
| Timeline UI render | `pnpm --dir apps/web test tests/application/timeline-view` | **Not run** — file does not exist yet. Planned in plan Task 10. |
| Drag interaction | `pnpm --dir apps/web test tests/application/drag-time` | **Not run** — file does not exist yet. Planned in plan Task 12. |

## Combined Test Run

```text
$ pnpm --dir apps/web test
 ✓ tests/infrastructure/schema-contract.test.ts (5 tests)
 ✓ tests/domain/permissions.test.ts (3 tests)
 ✓ tests/domain/places.test.ts (3 tests)
 ✓ tests/domain/timeline.test.ts (5 tests)
 ✓ tests/application/update-member-role.test.ts (3 tests)
 ✓ tests/application/invite-member.test.ts (4 tests)
 ✓ tests/domain/env.test.ts (2 tests)
 ✓ tests/application/timeline-use-cases.test.ts (8 tests)
 ✓ tests/application/create-trip.test.ts (3 tests)
 ✓ tests/domain/ai-draft.test.ts (3 tests)
 ✓ tests/domain/trips.test.ts (5 tests)
 ✓ tests/domain/result.test.ts (1 test)
 ✓ tests/application/auth-actions.test.ts (4 tests)

 Test Files  13 passed (13)
      Tests  49 passed (49)
   Duration  2.66s
```

```text
$ cargo test --workspace
test result: ok. 25 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

## Known Gaps

- `pnpm build` not run in this bundle; expected pass (matches prior `feat: add Supabase auth shell` and `feat: add trip creation foundation` CI evidence).
- `pnpm test:e2e` not run — Playwright config not yet wired (plan Task 15, US-RF-009).
- `supabase db reset` not run locally — Supabase CLI absent from PATH.
- Slice 010/011/012 (Mobile agenda, Memories shell, Expenses shell) have no plan detail yet.
- Worktree `codex/rideflow-v1-app-shell-dashboard` carries 6 commits not merged into main: `32bccce docs:add-rideflow-dashboard-tasks`, `403ae4f feat:add-rideflow-dashboard-shell`, `6bc74be feat:add-rideflow-planning-shell`, `f07bb76 feat:add-rideflow-timeline-inspector`, `363da1b chore:provision-rideflow-v2-supabase`, `923c204 feat: wire rideflow planning core`. These cover Task 6/10 partials and need reconcile before marking US-RF-002/005 fully implemented.
- Orphaned worktree folder `.worktrees/ride-flow-1-app-shell-dashboard/` removed in this bundle; only 1 file inside (`apps/web/src/application/places/use-case.ts`, 26 lines) — discarded by user decision.

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
