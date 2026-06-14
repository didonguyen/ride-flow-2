# Test Matrix

This file maps product behavior to proof.

RideFlow V1 product behavior is defined in the product contract and should stay
mapped to explicit proof expectations here. Do not mark a row implemented until
tests or validation evidence exist.

## Status Values

| Status | Meaning |
| --- | --- |
| planned | Accepted as intended behavior, not implemented |
| in_progress | Actively being built |
| implemented | Implemented and proof exists |
| changed | Contract changed after earlier implementation |
| retired | No longer part of the product contract |

## Matrix

| Story | Contract | Unit | Integration | E2E | Platform | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| US-RF-001 Stabilize Foundation | Workspace, domain rules, env parsing, product contract | yes | yes (schema smoke) | not required | yes (build) | implemented | 22 domain tests pass (`tests/domain/*`); schema-contract 5 pass; `pnpm build` CI evidence |
| US-RF-002 Auth & Supabase Foundation | Supabase migration, RLS, auth pages, supabase repos | yes | yes | not run | not run (supabase CLI absent) | implemented | 5 schema-contract + 4 auth-actions + 7 supabase-repositories = 16 pass; 2 migrations present (290 + 24 lines) |
| US-RF-003 Create Trip Flow | Trip create form, use case, trip_days generation | yes | yes (server action) | not run | not run | implemented | 3 create-trip + 2 create-trip-action = 5 pass |
| US-RF-004 Members & Invites | Invite, role update, members panel UI | yes | yes | not run | not run | implemented | 4 invite-member + 3 update-member-role + 3 supabase-dashboard-data = 10 pass; members-panel.tsx shipped |
| US-RF-005 Timeline CRUD + Drag | Use cases + UI shell + inspector; drag pending | yes | yes | not run | not run | in_progress | 8 timeline-use-cases + 2 planning-data + 8 planning-workspace-state = 18 pass; UI components shipped; drag test + timeline-view test still missing |
| US-RF-006 Place Search & Pinning | Seed + OSM + manual + composite providers, search route, panel UI | yes | yes | not run | not run | implemented | 12 provider tests (seed 3 + osm 3 + manual 2 + composite 4) = 16 pass; route + panel present |
| US-RF-007 Realtime Sync | Subscription helper + status component | yes | yes | not run | not run | implemented | 3 subscription pass; realtime-status.tsx present; multi-client simulation pending |
| US-RF-008 AI Draft | Use case + mock + OpenAI provider + panel UI | yes | yes | not run | not run | implemented | 5 use-case + 3 mock-provider = 8 pass; route + panel present |
| US-RF-009 E2E Happy Path | Playwright config + planning-core spec | not run | not run | required | not run | planned | config and spec file not yet written |
| US-RF-010 Mobile Agenda | Mobile trip header + responsive layout | yes | yes | not run | not run | implemented | mobile-trip-header.tsx shipped; integration via planning workspace; viewport tests pending |
| US-RF-011 Memories Shell | Memories tab surface + page route | yes | not run | not run | not run | implemented | memories-surface.tsx + memories/page.tsx present; PDF export stub |
| US-RF-012 Expenses Shell | Expenses tab surface + page route | yes | not run | not run | not run | implemented | expenses-surface.tsx + expenses/page.tsx present; donut + table layout |
| US-RF-000 Reconcile spec-driven + epic structure | Move plan.md, add tasks.md/proof.md, scaffold E04 | not run | not run | not run | not run | planned | doc-only initiative; 3 commits + 13 story packets shipped |

## Evidence Rules

- Unit proof covers pure domain and application rules.
- Integration proof covers backend enforcement, data integrity, provider
  behavior, jobs, or service contracts.
- E2E proof covers user-visible browser flows.
- Platform proof covers only shell, deployment, mobile, desktop, or runtime
  behavior that cannot be proven in lower layers.
- A story can be implemented without every proof column if the story packet
  explains why.
