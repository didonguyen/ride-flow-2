# Implementation Plan

## Goal

Apply the editorial design system from `design/rideflow_editorial/DESIGN.md` to the public landing page, the trips dashboard, and the three trip detail tabs (Planning, Expenses, Memories). Introduce a shared component kit under `components/trip/` so the trip detail tabs render the same shell, cover, tabs, day rail, status chips, and AI cards. Preserve every existing server action, route, schema, RLS rule, and Playwright auth flow.

## Workstreams

The work is split into 9 workstreams so a reviewer can see what changed and why.

### W1. Editorial design tokens and typography

- Extend `apps/web/tailwind.config.ts`:
  - Add full editorial palette (forest 800/500, sage 100/200/400, terracotta 100/200/500, amber 100/500, ink 950/700/500, paper 50/100/200).
  - Add `rounded` extension matching the radius scale in the spec.
  - Add `boxShadow` for `rideflow-editorial-card` and `rideflow-editorial-card-hover`.
- Extend `apps/web/app/globals.css` with the same palette as CSS variables (`:root { --rideflow-forest-primary: #003527; ... }`) so server components and inline styles can reference the same colors.
- Add Montserrat via `next/font/google` in `apps/web/app/layout.tsx` and expose it as `font-montserrat` utility.

### W2. Shared primitives under `components/trip/`

Create one file per primitive in the spec, each with explicit props and a forward-compatible re-export in the legacy location. Each new component gets a Vitest render test under `tests/components/trip/`.

Files to create:

- `apps/web/components/trip/trip-app-shell.tsx`
- `apps/web/components/trip/trip-cover-header.tsx`
- `apps/web/components/trip/trip-section-tabs.tsx`
- `apps/web/components/trip/trip-day-rail.tsx`
- `apps/web/components/trip/trip-stat-card.tsx`
- `apps/web/components/trip/budget-usage-bar.tsx`
- `apps/web/components/trip/transaction-row.tsx`
- `apps/web/components/trip/settlement-row.tsx`
- `apps/web/components/trip/member-balance-row.tsx`
- `apps/web/components/trip/ai-assistant-card.tsx`
- `apps/web/components/trip/ai-insight-card.tsx`
- `apps/web/components/trip/trip-status-chip.tsx`
- `apps/web/components/trip/trip-vault-card.tsx`
- `apps/web/components/trip/memory-entry.tsx`
- `apps/web/components/trip/pinned-option-badge.tsx`
- `apps/web/components/trip/date-chip.tsx`
- `apps/web/components/trip/continue-planning-button.tsx`

Then add re-exports in:

- `apps/web/components/app/app-shell.tsx` (re-export `TripAppShell` as `AppShell`).
- `apps/web/components/planning/trip-section-tabs.tsx` (re-export `TripSectionTabs`).
- `apps/web/components/trips/trip-cover-header.tsx` (re-export `TripCoverHeader`).
- `apps/web/components/planning/date-rail.tsx` (re-export `TripDayRail`).

### W3. Public landing page

- Rewrite `apps/web/components/landing/landing-hero.tsx` → `LandingHeroEditorial` (Vietnam hero, navigation links, Explore pill, organic fade into the paper section).
- Add `apps/web/components/landing/landing-discover-vietnam.tsx` (the map + region cards section).
- Replace `apps/web/components/landing/landing-top-destinations.tsx` content with the editorial 3-column feature grid (`landing-editorial-features.tsx`).
- Rewrite `apps/web/components/landing/landing-final-cta.tsx` with the new `Plan your next journey` band.
- Rewrite `apps/web/components/landing/landing-footer.tsx` with the editorial footer (wordmark, copyright, single `Sign in` link).
- Keep `landing-header.tsx` with `Vietnam | Feature | Explore | About` navigation plus the existing `Sign in` / `Get started` buttons.
- `landing-page.tsx` continues to compose the new sections.

### W4. Trips dashboard

- Replace the current `Trips Dashboard` heading and trip grid in `apps/web/app/(app)/trips/page.tsx` with the new `Welcome back.` layout.
- New `apps/web/components/dashboard/dashboard-greeting.tsx` (heading + subhead).
- New `apps/web/components/dashboard/dashboard-shell.tsx` composes greeting + activity card + upcoming adventure + recent journeys.
- New `apps/web/components/dashboard/dashboard-upcoming-adventure.tsx` (cover, chips, status, progress bar, avatars, `Continue planning` button).
- New `apps/web/components/dashboard/dashboard-planning-activity.tsx` (activity feed card).
- New `apps/web/components/dashboard/dashboard-recent-journeys.tsx` (2-card completed-trips grid + empty state).
- Reuse `ContinuePlanningButton`, `TripStatCard`, `DateChip` where applicable.
- Reuse the `CreateTripButton` from `dashboard-create-trip-button.tsx` for the empty state.

### W5. Trip details — Planning

- New `apps/web/components/trips/planning-surface.tsx` that composes `TripDayRail` (left), a new editorial `TripTimeline` (center), and a right column with `TripRouteOverview` + `AiAssistantCard`.
- Add `apps/web/components/trips/trip-timeline.tsx` that wraps the existing `DraggableTimeline` and re-styles each card with the new chip, status pill, and book/confirm button.
- Add `apps/web/components/trips/trip-route-overview.tsx` (forest card with two pins, distance / duration line).
- Update `apps/web/app/(app)/trips/[tripId]/page.tsx` to use `TripCoverHeader` + `TripSectionTabs` (Planning active) + `PlanningSurface` + `MembersPanel` (the members panel is preserved below the new surface).

### W6. Trip details — Expenses

- Rewrite `apps/web/components/trips/expenses-surface.tsx` to compose four `TripStatCard`, `BudgetUsageBar`, `RecentExpensesList` (which uses `TransactionRow`), `SettlementCard` (which uses `SettlementRow`), `MemberBalancesCard` (which uses `MemberBalanceRow`), and `AiInsightCard`.
- Update `apps/web/app/(app)/trips/[tripId]/expenses/page.tsx` to use `TripCoverHeader` + `TripSectionTabs` (Expenses active) + new `ExpensesSurface`.
- New helper `apps/web/src/application/trips/expenses-data.ts` exports a typed `TripExpenses` shape with `totalSpent`, `budget`, `pending`, `perPerson`, `breakdown`, `transactions`, `settlements`, `balances`. Seed data lives here; falls back to it when Supabase has no expenses yet.

### W7. Trip details — Memories

- Rewrite `apps/web/components/trips/memories-surface.tsx` to compose `TripDayRail` (left), `MemoryEntry` stack (center), and `TripVaultCard` (right).
- Update `apps/web/app/(app)/trips/[tripId]/memories/page.tsx` to use `TripCoverHeader` + `TripSectionTabs` (Memories active) + new `MemoriesSurface`.
- New helper `apps/web/src/application/trips/memories-data.ts` exports a typed `TripMemory` shape with `timestamp`, `title`, `imageUrl`, `body`, `attribution`. Seed data lives here.

### W8. Tests

- Add Vitest component tests for every new shared primitive (17 test files in `apps/web/tests/components/trip/`).
- Update `tests/components/modal-accessibility.test.tsx` if it referenced the old `app-shell`.
- Update `tests/e2e/landing.spec.ts` to assert the new copy and the `Vietnam` hero text.
- Add `tests/e2e/dashboard.spec.ts` (greeting, upcoming adventure card, planning activity card).
- Add `tests/e2e/trip-details.spec.ts` (tab navigation, planning surface text, memories surface text, expenses surface text).
- Existing `tests/components/auth-panel.test.tsx`, `create-trip-panel.test.tsx`, and `ui-primitives.test.tsx` should remain green.

### W9. Verification and harness

- Run `pnpm --dir apps/web build`, `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`.
- Run the new Playwright specs headlessly.
- Capture screenshots at 1440px and 360px into `docs/specs/005-rideflow-editorial-app-redesign/proof.md`.
- Update the spec's `proof.md` with command outputs.
- `scripts/bin/harness-cli story verify US-RF-018` must exit 0.
- Record a trace with `scripts/bin/harness-cli trace --summary "..." --outcome success`.
- If any friction is found, record it via `scripts/bin/harness-cli backlog add`.

## Stop Conditions

Pause and ask the human for confirmation if:

- The user wants to change the lane to high-risk (e.g. because of a proposed new server action).
- The user wants to add `Overview` / `Route` tabs after all.
- The Montserrat font fetch fails in the build environment (fall back to a system serif only with explicit sign-off).
- A new dependency becomes necessary (currently none is).
- A new environment variable or schema change is requested.
