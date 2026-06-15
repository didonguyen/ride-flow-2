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
| US-RF-005 Timeline CRUD + Drag | Use cases + UI shell + inspector; drag math + UI drag shipped; move use case wired to workspace state | yes | yes | required (Playwright chromium unsupported on host) | not run (web only) | implemented | 8 timeline-use-cases + 2 planning-data + 8 planning-workspace-state + 4 timeline-view + 6 drag-time = 28 pass; `pnpm build` pass; `pnpm lint` pass; `DraggableTimeline` ships with `@dnd-kit/core`; `aria-grabbed` + drag label rendered on trip detail; spec story packet `docs/stories/epics/E04-rideflow-v1/US-RF-005-timeline.md` |
| US-RF-006 Place Search & Pinning | Seed + OSM + manual + composite providers, search route, panel UI | yes | yes | not run | not run | implemented | 12 provider tests (seed 3 + osm 3 + manual 2 + composite 4) = 16 pass; route + panel present |
| US-RF-007 Realtime Sync | Subscription helper + status component | yes | yes | not run | not run | implemented | 3 subscription pass; realtime-status.tsx present; multi-client simulation pending |
| US-RF-008 AI Draft | Use case + mock + OpenAI provider + panel UI | yes | yes | not run | not run | implemented | 5 use-case + 3 mock-provider = 8 pass; route + panel present |
| US-RF-009 E2E Happy Path | Playwright config + planning-core spec | not run | not run | required | not run | planned | config and spec file not yet written |
| US-RF-010 Mobile Agenda | Mobile trip header + responsive layout | yes | yes | not run | not run | implemented | mobile-trip-header.tsx shipped; integration via planning workspace; viewport tests pending |
| US-RF-011 Memories Shell | Memories tab surface + page route | yes | not run | not run | not run | implemented | memories-surface.tsx + memories/page.tsx present; PDF export stub |
| US-RF-012 Expenses Shell | Expenses tab surface + page route | yes | not run | not run | not run | implemented | expenses-surface.tsx + expenses/page.tsx present; donut + table layout |
| US-RF-014 Public Landing | `/` marketing page; anon redirect preserved; Unsplash hero image | yes (existing) | yes (next/image build) | required (spec landed; Playwright chromium unsupported on host) | not run | implemented | `pnpm build` pass; route `/` 5.34 kB; curl smoke 200 + 65 kB HTML; 96/96 existing tests still pass; spec `docs/specs/002-public-landing/spec.md`; proof `docs/specs/002-public-landing/proof.md` |
| US-RF-015 Visual Refresh: Forest-Green Travel Aesthetic | New forest-green tokens; refreshed landing hero with sliding CTA pill; refreshed trip card with mint rating badge; new trip cover header; mobile-first responsive | yes (existing) | yes (next/image build) | required (Playwright chromium unsupported on host) | not run (web only) | implemented | `pnpm build` pass; route `/` 174 B + 111 kB shared; `/trips/[tripId]` 86.6 kB + 197 kB shared; 96/96 unit tests pass; `pnpm lint` pass (warnings only, no errors); dev server smoke 200 on `/` with new hero copy; spec `docs/specs/003-visual-refresh-green/spec.md`; proof `docs/specs/003-visual-refresh-green/proof.md` |
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
