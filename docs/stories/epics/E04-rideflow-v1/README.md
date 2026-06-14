# E04 — RideFlow V1

Epic that gathers 12 story packets for the 12 implementation slices of RideFlow V1,
following `docs/specs/001-rideflow-v1/spec.md` section "Recommended Implementation
Slices" (Slice 001 → 012).

## Mapping

| Story ID    | Slice | Title                          | Plan Task | Lane      | Status (this bundle) |
|-------------|-------|--------------------------------|-----------|-----------|----------------------|
| US-RF-001   | 001   | Stabilize Foundation           | 1, 2, 3, 4 | normal    | implemented          |
| US-RF-002   | 002   | Auth & Supabase Foundation     | 5, 6       | high-risk | implemented (partial — see note) |
| US-RF-003   | 003   | Create Trip Flow               | 7          | normal    | implemented          |
| US-RF-004   | 004   | Members & Invites              | 8          | high-risk | implemented (use-case only, UI pending) |
| US-RF-005   | 005   | Timeline CRUD + Drag           | 9, 10, 12  | normal    | implemented (use-case only, UI pending) |
| US-RF-006   | 006   | Place Search & Pinning         | 11         | normal    | planned              |
| US-RF-007   | 009   | Realtime Sync                  | 13         | high-risk | planned              |
| US-RF-008   | 008   | AI Draft                       | 14         | normal    | planned              |
| US-RF-009   | test  | E2E Happy Path                 | 15         | normal    | planned              |
| US-RF-010   | 010   | Mobile Agenda                  | tbd        | normal    | planned              |
| US-RF-011   | 011   | Memories Shell                 | tbd        | normal    | planned              |
| US-RF-012   | 012   | Expenses Shell                 | tbd        | normal    | planned              |

> Slice 002 in the spec is "Visual App Shell and Dashboard". Here US-RF-002 is
> expanded to cover auth + Supabase foundation because auth + RLS are prerequisites
> for the dashboard to surface real data. Split into US-RF-002A (auth shell) and
> US-RF-002B (dashboard visual cards) if a future sprint needs finer granularity.

## Branch state

Branch `main` contains 5 ride-flow feature commits (Task 5, 6, 7, 8, 9) plus
hardening commits. Branch `codex/rideflow-v1-app-shell-dashboard` (worktree
`.worktrees/rideflow-v1-app-shell-dashboard`) carries 6 additional commits for
the dashboard shell, planning shell, and timeline inspector. Worktree commits
are not merged into main. Reconcile them before marking the corresponding
stories as `implemented` (see proof.md "Known Gaps").

## Validation contract

Each story that reaches `implemented` must have evidence either in
`docs/specs/001-rideflow-v1/proof.md` or in an Evidence block inside the story
packet itself.
