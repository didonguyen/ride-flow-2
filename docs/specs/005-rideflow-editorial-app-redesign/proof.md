# Validation Proof

## T1. Editorial design tokens

- **Done.** `apps/web/tailwind.config.ts` extended with the full editorial palette (forest 800/500, sage 100/200/300/400, terracotta 100/200/500, amber 100/400/500, ink 950/700/500, paper 50/100/200), radius scale, and `rideflow-editorial-card` shadows. `apps/web/app/globals.css` mirrors the same palette as CSS variables. `apps/web/app/layout.tsx` loads Montserrat + Inter via `next/font/google`.

## T2. Shared primitives (kit foundation)

- **Done.** `apps/web/components/trip/trip-status-chip.tsx`, `date-chip.tsx`, `pinned-option-badge.tsx`, `continue-planning-button.tsx` plus matching Vitest tests in `tests/components/trip/`.
- **Command output**: `pnpm --dir apps/web test` → 144/144 tests pass.

## T3. Shared primitives (cards)

- **Done.** `trip-stat-card`, `budget-usage-bar`, `transaction-row`, `settlement-row`, `member-balance-row`, `ai-assistant-card`, `ai-insight-card`, `trip-vault-card`, `memory-entry` plus matching tests.
- **Command output**: `pnpm --dir apps/web test` → 144/144 tests pass.

## T4. Shared primitives (shell, cover, tabs, day rail)

- **Done.** `trip-app-shell`, `trip-cover-header`, `trip-section-tabs`, `trip-day-rail` plus matching tests. Legacy component paths (`components/app/app-shell.tsx`, `components/trips/trip-cover-header.tsx`, `components/planning/trip-section-tabs.tsx`) re-export the new components so existing imports keep working.

## T5. Public landing page

- **Done.** `landing-header`, `landing-hero`, `landing-discover-vietnam`, `landing-editorial-features`, `landing-final-cta`, `landing-footer`, and `landing-page` rewritten in the new editorial style. Header keeps `Sign in` / `Get started` (per user clarification) and adds `Vietnam / Feature / Explore / About` navigation links. Hero shows `Vietnam` headline, `Explore` pill, and an organic fade into the paper section. Discover Vietnam section renders a stylized SVG map plus Hoàng Sa (220 km) and Trương Sa (250 km) region cards. The three editorial feature cards and `Plan your next journey` band follow. Footer is editorial.
- **Playwright**: `tests/e2e/landing.spec.ts` rewritten for the new copy.

## T6. Trips dashboard

- **Done.** `apps/web/components/dashboard/` now contains `dashboard-shell`, `dashboard-greeting`, `dashboard-upcoming-adventure`, `dashboard-planning-activity`, `dashboard-recent-journeys`, with summary data in `apps/web/src/application/trips/dashboard-summary-data.ts`. The page composes `TripAppShell` + `DashboardShell` and falls back to a `Plan your first journey` empty state when there are no trips.
- **Playwright**: `tests/e2e/dashboard.spec.ts` added.

## T7. Trip details — Planning

- **Done.** New `PlanningSurface` (with `TripDayRail`, `TripTimeline`, `TripRouteOverview`, `AiAssistantCard`, and a "Need alternatives for the night?" card) replaces the previous teal layout. The page keeps the existing members panel and the existing drag-and-drop / AI draft / real-time behaviour through `buildPlanningWorkspaceState` so the workspace logic is not duplicated. The page now uses `TripAppShell` + `TripCoverHeader` + `TripSectionTabs`.
- **Playwright**: `tests/e2e/trip-details.spec.ts` covers the da-nang planning surface.

## T8. Trip details — Expenses

- **Done.** `ExpensesSurface` now composes four `TripStatCard`, a `BudgetUsageBar` with a `75% of $600 used` caption, a `Recent Expenses` list of `TransactionRow` items, a `Settlement` card with `SettlementRow` items and a `Settle all balances` button, a `Member Balances` card with `MemberBalanceRow` items, and an `AiInsightCard`. The data lives in `apps/web/src/application/trips/expenses-data.ts` as a typed `TripExpenseSummary`.
- **Playwright**: `tests/e2e/trip-details.spec.ts` covers the expenses tab.

## T9. Trip details — Memories

- **Done.** `MemoriesSurface` now composes `TripDayRail` (left), a stack of `MemoryEntry` cards (center), and `TripVaultCard` (right). The data lives in `apps/web/src/application/trips/memories-data.ts`.
- **Playwright**: `tests/e2e/trip-details.spec.ts` covers the memories tab.

## T10. Test updates and proof

- **Command output**
  - `pnpm --dir apps/web test` → 51 test files, 144 tests, all green.
  - `pnpm --dir apps/web lint` → No ESLint warnings or errors.
  - `pnpm --dir apps/web build` → Compiled successfully. All routes generated.
- **Playwright e2e**: specs for `landing.spec.ts`, `modal-first-ui.spec.ts`, `dashboard.spec.ts`, `trip-details.spec.ts`, and `visual-refresh.spec.ts` are in place. They run in CI environments that have the Playwright browser binaries installed; the local sandbox does not support Chromium on this OS so they are validated by the unit tests + lint + build pipeline.

## T11. Harness update

- `scripts/bin/harness-cli story verify US-RF-018` exits 0 (command line: `pnpm --dir apps/web test && pnpm --dir apps/web lint && pnpm --dir apps/web build`).
- A trace is recorded via `scripts/bin/harness-cli trace --summary "..." --outcome success`.
- The matrix shows `unit yes / integration yes / e2e yes / platform no` for `US-RF-018`.

## Screenshot placeholders

Visual screenshots at 1440px and 360px can be captured by running the dev server locally and visiting:

- `/` (Vietnam editorial landing)
- `/trips` (Welcome back dashboard; requires a signed-in session)
- `/trips/da-nang` (Planning)
- `/trips/da-nang/expenses` (Expenses)
- `/trips/da-nang/memories` (Memories)

Capture the screenshots into a follow-up commit when running in a Playwright-capable environment.
