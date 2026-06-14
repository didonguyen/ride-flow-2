# US-RF-009 E2E Happy Path

## Status

planned

## Lane

normal

## Product Contract

An end-to-end smoke test (Playwright) runs the flow: sign up → sign in → create a
trip → invite a member → add a timeline item → pin a place → generate an AI
draft (mock) → apply. The suite runs on two viewports: Chromium desktop and
Pixel 7 mobile.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Acceptance Test Matrix, "End-to-end" rows)
- `docs/specs/001-rideflow-v1/plan.md` (Task 15)
- `docs/specs/001-rideflow-v1/tasks.md` (row 15)

## Acceptance Criteria

- `apps/web/playwright.config.ts` configures 2 projects (chromium, mobile/Pixel 7),
  starts `pnpm dev` as the `webServer`, and uses `http://127.0.0.1:3000` as the
  `baseURL`.
- `apps/web/tests/e2e/planning-core.spec.ts`:
  - Sign up with email/password and land on `/trips`
  - Create a trip with a 3-day date range, get redirected to `/trips/[tripId]`, see
    3 day-rail items
  - Add a "Coffee" timeline item at 09:00 for 60 minutes and see it appear in the agenda
  - Search "Hoi An" in the place panel and see at least one result with the Seed badge
  - Pin the place and see the snapshot stored on the item
  - (Optional) Generate a mock AI draft, preview it, and apply via append
- E2E runs independently from the unit (vitest) and integration (schema contract) suites.
- The web server is cleaned up after the run finishes.

## Design Notes

- Playwright `fullyParallel: true` for desktop, with a dedicated mobile project.
- `webServer.reuseExistingServer: true` lets the suite reuse an active dev session.
- `trace: "on-first-retry"` for debugging failures.
- E2E requires a local Supabase stack running (`supabase start`) before the suite
  starts; CI provides the service container.
- Skip the realtime test inside this E2E (US-RF-007 has its own multi-client
  simulation).
- Each test sets up: a fresh user through the API, creates a new trip, and cleans up
  in `afterAll`.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Existing 49 pass (US-RF-001..005) |
| Integration | Existing 5 schema-contract pass |
| E2E | `pnpm --dir apps/web test:e2e` — **planned** |
| Platform | 2 projects: chromium desktop + Pixel 7 mobile |
| Release | Not applicable |

## Harness Delta

- No change to Harness.

## Evidence (none yet)

- Code has not been committed.

## Open follow-up

- Install `@playwright/test` inside `apps/web` (not yet listed in `package.json`).
- Write 1-2 smoke specs first (sign-up, create trip); expand to the other flows
  across sprints.
- CI workflow that runs the E2E suite on every PR.
- Visual regression: snapshot the key pages (Dashboard, Planning) to catch UI drift.
