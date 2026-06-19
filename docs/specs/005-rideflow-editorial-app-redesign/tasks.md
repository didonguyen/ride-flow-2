# Implementation Tasks

The tasks below are ordered so each one builds on the previous and can be reviewed in isolation. Every task lists the files it touches and the proof it must produce.

## T1. Editorial design tokens

- **Files**
  - `apps/web/tailwind.config.ts`
  - `apps/web/app/globals.css`
  - `apps/web/app/layout.tsx`
- **Acceptance**
  - Tailwind exposes the full editorial palette, radius scale, and shadows.
  - `globals.css` exposes the same colors as CSS variables.
  - Montserrat is loaded through `next/font/google` and used by `display-*` classes.
- **Proof**
  - `pnpm --dir apps/web build` succeeds.

## T2. Shared primitives (kit foundation)

- **Files**
  - `apps/web/components/trip/trip-status-chip.tsx` (+ test)
  - `apps/web/components/trip/date-chip.tsx` (+ test)
  - `apps/web/components/trip/pinned-option-badge.tsx` (+ test)
  - `apps/web/components/trip/continue-planning-button.tsx` (+ test)
- **Acceptance**
  - Each primitive renders and is class-stable.
  - Each test asserts at least one role and one label.
- **Proof**
  - `pnpm --dir apps/web test trip/status-chip` (and equivalents) pass.

## T3. Shared primitives (cards)

- **Files**
  - `apps/web/components/trip/trip-stat-card.tsx` (+ test)
  - `apps/web/components/trip/budget-usage-bar.tsx` (+ test)
  - `apps/web/components/trip/transaction-row.tsx` (+ test)
  - `apps/web/components/trip/settlement-row.tsx` (+ test)
  - `apps/web/components/trip/member-balance-row.tsx` (+ test)
  - `apps/web/components/trip/ai-assistant-card.tsx` (+ test)
  - `apps/web/components/trip/ai-insight-card.tsx` (+ test)
  - `apps/web/components/trip/trip-vault-card.tsx` (+ test)
  - `apps/web/components/trip/memory-entry.tsx` (+ test)
- **Acceptance**
  - Cards render in their design system tone (forest/sage/terracotta/amber).
  - `TripVaultCard` shows three stat rows plus the Add Memory button.
  - `MemoryEntry` shows timestamp, title, image, body, attribution.
- **Proof**
  - All new component tests pass.

## T4. Shared primitives (shell, cover, tabs, day rail)

- **Files**
  - `apps/web/components/trip/trip-app-shell.tsx` (+ test)
  - `apps/web/components/trip/trip-cover-header.tsx` (+ test)
  - `apps/web/components/trip/trip-section-tabs.tsx` (+ test)
  - `apps/web/components/trip/trip-day-rail.tsx` (+ test)
  - `apps/web/components/app/app-shell.tsx` (re-export `TripAppShell` as `AppShell`)
  - `apps/web/components/planning/trip-section-tabs.tsx` (re-export)
  - `apps/web/components/trips/trip-cover-header.tsx` (re-export)
  - `apps/web/components/planning/date-rail.tsx` (re-export `TripDayRail` as `DateRail`)
- **Acceptance**
  - Existing imports keep working.
  - The shell shows The Modern Explorer profile, Upgrade to Pro pill, Dashboard / My Trips / New Trip, Settings / Help Center.
  - The cover header shows the title, three pill metadata items (date, days, transport).
  - Tabs render Planning / Memories / Expenses with the active tab underlined in forest.
  - Day rail shows vertical Day chips plus Add Day.
- **Proof**
  - All four shell tests pass.
  - `pnpm --dir apps/web test` still green for the legacy test files.

## T5. Public landing page

- **Files**
  - `apps/web/components/landing/landing-header.tsx` (Vietnam nav + Sign in + Get started)
  - `apps/web/components/landing/landing-hero.tsx` (`LandingHeroEditorial` with the Vietnam hero)
  - `apps/web/components/landing/landing-discover-vietnam.tsx` (new)
  - `apps/web/components/landing/landing-editorial-features.tsx` (new; replaces `landing-features.tsx` content)
  - `apps/web/components/landing/landing-final-cta.tsx` (rewrite)
  - `apps/web/components/landing/landing-footer.tsx` (rewrite)
  - `apps/web/components/landing/landing-page.tsx` (compose the new sections)
  - `apps/web/tests/e2e/landing.spec.ts` (update)
- **Acceptance**
  - `/` shows `Vietnam` headline, `Explore` pill, `Discover Vietnam` section, three feature cards, final `Plan your next journey` band, footer.
  - `Sign in` and `Get started` in the header still open their auth modals.
- **Proof**
  - `pnpm --dir apps/web test:e2e -- landing.spec.ts` passes.

## T6. Trips dashboard

- **Files**
  - `apps/web/components/dashboard/dashboard-shell.tsx` (new)
  - `apps/web/components/dashboard/dashboard-greeting.tsx` (new)
  - `apps/web/components/dashboard/dashboard-upcoming-adventure.tsx` (new)
  - `apps/web/components/dashboard/dashboard-planning-activity.tsx` (new)
  - `apps/web/components/dashboard/dashboard-recent-journeys.tsx` (new)
  - `apps/web/app/(app)/trips/page.tsx` (use `DashboardShell`)
  - `apps/web/tests/e2e/dashboard.spec.ts` (new)
- **Acceptance**
  - `/trips` shows `Welcome back.` heading, `Planning Activity` card, `Upcoming Adventure` card, and a `Recent Journeys` section.
  - The empty state shows a `Plan your first journey` hero card.
  - `Continue planning` button links to the upcoming trip.
- **Proof**
  - `pnpm --dir apps/web test:e2e -- dashboard.spec.ts` passes.

## T7. Trip details — Planning

- **Files**
  - `apps/web/components/trips/trip-timeline.tsx` (new)
  - `apps/web/components/trips/trip-route-overview.tsx` (new)
  - `apps/web/components/trips/planning-surface.tsx` (new)
  - `apps/web/app/(app)/trips/[tripId]/page.tsx` (use new shell + cover + tabs + surface)
  - `apps/web/tests/e2e/trip-details.spec.ts` (new, planning portion)
- **Acceptance**
  - `/trips/[tripId]` shows the new cover, the day rail, the timeline, the route overview, and the AI assistant card.
  - The day rail `Add Day` button is visible.
  - Drag-and-drop from `DraggableTimeline` still works.
- **Proof**
  - `pnpm --dir apps/web test:e2e -- trip-details.spec.ts` planning section passes.

## T8. Trip details — Expenses

- **Files**
  - `apps/web/src/application/trips/expenses-data.ts` (new, typed seed)
  - `apps/web/components/trips/expenses-surface.tsx` (rewrite)
  - `apps/web/app/(app)/trips/[tripId]/expenses/page.tsx` (use new shell + cover + tabs + surface)
  - `apps/web/tests/e2e/trip-details.spec.ts` (expenses portion)
- **Acceptance**
  - `/trips/[tripId]/expenses` shows four stat cards, the budget usage bar, the recent expenses list, the settlement card, the member balances card, and the AI insight card.
  - The settlement row and member balance rows use the design's avatar + amount + color treatment.
- **Proof**
  - `pnpm --dir apps/web test:e2e -- trip-details.spec.ts` expenses section passes.

## T9. Trip details — Memories

- **Files**
  - `apps/web/src/application/trips/memories-data.ts` (new, typed seed)
  - `apps/web/components/trips/memories-surface.tsx` (rewrite)
  - `apps/web/app/(app)/trips/[tripId]/memories/page.tsx` (use new shell + cover + tabs + surface)
  - `apps/web/tests/e2e/trip-details.spec.ts` (memories portion)
- **Acceptance**
  - `/trips/[tripId]/memories` shows the day rail, the memory entry stack, and the Trip Vault card with three stat rows and `Add Memory` button.
- **Proof**
  - `pnpm --dir apps/web test:e2e -- trip-details.spec.ts` memories section passes.

## T10. Test updates and proof

- **Files**
  - `apps/web/tests/components/modal-accessibility.test.tsx` (touch if needed)
  - `apps/web/tests/components/ui-primitives.test.tsx` (touch if needed)
  - `docs/specs/005-rideflow-editorial-app-redesign/proof.md` (new)
- **Acceptance**
  - `pnpm --dir apps/web test` is green.
  - `pnpm --dir apps/web lint` is green.
  - `pnpm --dir apps/web build` is green.
  - `pnpm --dir apps/web test:e2e` is green for landing, dashboard, trip-details.
- **Proof**
  - `proof.md` lists the actual command outputs and links to screenshots.

## T11. Harness update

- **Files**
  - `docs/TEST_MATRIX.md` (no change needed; matrix is regenerated from CLI)
  - `harness.db` (updated by CLI)
- **Acceptance**
  - `scripts/bin/harness-cli story verify US-RF-018` exits 0.
  - `scripts/bin/harness-cli query matrix` shows US-RF-018 with `unit yes / integration yes / e2e yes`.
  - A trace is recorded via `scripts/bin/harness-cli trace`.
- **Proof**
  - Trace ID printed in the final response.
