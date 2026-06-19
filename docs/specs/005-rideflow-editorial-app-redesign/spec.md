# Feature Specification: RideFlow Editorial App Redesign

**Feature ID:** 005-rideflow-editorial-app-redesign
**Status:** Active — supersedes the visual treatment from `US-RF-017 Figma Travel-App Redesign` for the surfaces listed in §1.
**Created:** 2026-06-19
**Owner:** RideFlow product
**Primary implementation surface:** `apps/web`
**Source story:** `US-RF-018 RideFlow Editorial App Redesign` (in progress in harness matrix)
**Intake record:** intake #13 (lane: normal, flags: public-contracts, existing-behavior, cross-platform, weak-proof)
**Design system source of truth:** `design/rideflow_editorial/DESIGN.md` (Vietnam / Modern Explorer palette, typography, spacing, shape language).

## 1. Scope

Five user-visible surfaces are redesigned in this slice while preserving every existing backend, route, server action, and domain rule.

| # | Surface | Route | Owner component |
| - | --- | --- | --- |
| 1 | Public landing | `/` | `apps/web/components/landing/landing-page.tsx` |
| 2 | Trips dashboard | `/trips` | `apps/web/components/dashboard/dashboard-shell.tsx` (new) |
| 3 | Trip details — Planning | `/trips/[tripId]` | `apps/web/components/trips/planning-surface.tsx` (new) |
| 4 | Trip details — Expenses | `/trips/[tripId]/expenses` | `apps/web/components/trips/expenses-surface.tsx` (rewrite) |
| 5 | Trip details — Memories | `/trips/[tripId]/memories` | `apps/web/components/trips/memories-surface.tsx` (rewrite) |

The five surfaces are the only ones in scope. Other parts of the app (auth, members panel, place search modal, AI draft modal, map, real-time, the Create Trip modal, fallback pages) keep their current implementation; their visual polish comes from the shared primitives introduced in §4.

## 2. Goals

- **G-001 Editorial visual language.** All five surfaces look like one editorial product: deep forest primary, soft sage surfaces, terracotta accents, generous whitespace, Montserrat display + Inter body.
- **G-002 Reusable primitives.** The trip detail shell, cover header, day rail, section tabs, stat cards, budget bar, transaction rows, settlement rows, member balance rows, AI assistant / insight cards, status chips, trip-vault card, and memory entry card are first-class components reused across all three trip tabs.
- **G-003 Predictable layouts.** Each surface works in three breakpoints (mobile / tablet / desktop) and has documented paddings, gutters, and card radii.
- **G-004 No behavior regressions.** Auth, RLS, data model, server actions, server-rendered redirects, the modal-first flow, and the trip details section navigation are all preserved.
- **G-005 Testable surfaces.** Every new surface has at least one Vitest component test, the landing keeps its Playwright smoke spec, and the dashboard gets a new Playwright smoke spec. No surface is shipped without visible-text assertions that match the new copy.

## 3. Non-Goals

- **NG-001** No auth provider, schema, RLS, or permission changes.
- **NG-002** No new server actions, no new API routes, no new domain entities. Expenses, memories, and planning read from the existing `PlanningTrip` / `PlanningAgendaItem` seed data and from the same Supabase repositories that `getPlanningTripById` and `getSupabasePlanningTripRows` already expose.
- **NG-003** No new fonts in code other than loading the Montserrat family in `next/font` and reusing the existing Inter stack in `globals.css`.
- **NG-004** No new dependencies. Radix Dialog, lucide-react, next/image, Tailwind, and the existing icon set are reused.
- **NG-005** The "Overview" and "Route" tabs visible in `design/trip_detail_expenses/screen.png` are out of scope. The 3-tab set (Planning / Memories / Expenses) is the source of truth and matches `US-RF-018` clarification with the user.
- **NG-006** No new background photo shoots. The new landing uses a royalty-free Unsplash photograph hosted on `images.unsplash.com`, which is already in `next.config.ts` `remotePatterns`.

## 4. Shared Design System

### 4.1 Color tokens (extend `tailwind.config.ts` and `globals.css`)

| Token | Hex | Use |
| --- | --- | --- |
| `forest` 900 | `#003527` | Brand header text, primary buttons, cover overlay, sidebar nav active |
| `forest` 800 | `#064E3B` | Primary container (sidebar logo, cover) |
| `forest` 700 | `#1B3A2C` | Primary hover, secondary surface borders |
| `forest` 500 | `#2B6954` | Surface tint, body emphasis |
| `sage` 100 | `#E7F2EC` | Selected nav background, status chip background |
| `sage` 200 | `#C3ECD7` | Secondary container, settled chip background |
| `sage` 400 | `#A8CFBC` | Sage accents |
| `terracotta` 500 | `#B65A3A` | Action chips, "Start Ride" button, PENDING pills |
| `terracotta` 100 | `#FBE9E0` | Pending / Needs transfer chip background |
| `terracotta` 200 | `#F2CFBF` | Map route highlight, Budget bar Misc slice |
| `amber` 100 | `#FFEDC2` | AI Assistant Tip / AI Insight card background |
| `amber` 500 | `#F5B544` | AI assistant icon, sunrise accent |
| `ink` 950 | `#191C1B` | Body text on light surface |
| `ink` 700 | `#404944` | Subhead text on light surface |
| `ink` 500 | `#707974` | Outline / muted text |
| `paper` 50 | `#F8FAF6` | App background |
| `paper` 100 | `#F2F4F1` | Card alt background |
| `paper` 200 | `#ECEEEB` | Card hover background |

The current `tailwind.config.ts` already exposes `forest` 500/700/900, `mint` 400, `amber` 400, and `cream` 50. This spec extends the palette to the full editorial set and adds CSS variables in `globals.css` so server-rendered pages can reference the same tokens.

### 4.2 Typography

- **Display** (Montserrat 700, tight tracking) is added through `next/font/google`. Display sizes: `display-lg` 48/56, `display-md` 36/44, `display-sm` 28/36.
- **Headline** (Montserrat 600): `headline-md` 24/32, `headline-sm` 20/28.
- **Body** (Inter 400): `body-lg` 18/28, `body-md` 16/24, `body-sm` 14/20.
- **Label-caps** (Inter 600 uppercase, +0.08em): 12/16. Used for section eyebrows, table headers, and the "UPCOMING ADVENTURE" / "COMPLETED • OCT 12" lines.
- Body inherits the existing Inter stack in `globals.css`; only the Montserrat family is added in `app/layout.tsx`.

### 4.3 Spacing, radius, and elevation

- Base spacing 8px. Section gap 64px on desktop, 48px on tablet, 40px on mobile.
- Container padding: 20px on mobile, 32px on tablet, 48px on desktop.
- Radius scale: `sm` 8px, `md` 12px, `lg` 16px, `xl` 24px, `2xl` 32px, `pill` 9999px. Cards and image containers use `xl` (24px). Inputs and chips use `md` (12px) or `pill`.
- Elevation: cards use a 1px forest/5% border + soft shadow `0 12px 32px -12px rgba(0, 53, 39, 0.18)`. Hover state uses `0 24px 48px -16px rgba(0, 53, 39, 0.28)`.

## 5. Shared Components (new)

All shared components live under `apps/web/components/trip/` and are imported by the surfaces. Each one has a Vitest render test in `apps/web/tests/components/trip/`.

| Component | File | Purpose |
| --- | --- | --- |
| `TripAppShell` | `trip/trip-app-shell.tsx` | Sidebar with avatar, "The Modern Explorer / Premium Member", Upgrade-to-Pro pill, nav (Dashboard / My Trips / New Trip), Settings and Help Center at the bottom. Replaces `components/app/app-shell.tsx` for any route under `/(app)`. |
| `TripCoverHeader` | `trip/trip-cover-header.tsx` | Full-width forest cover, white "back to /trips" link, trip title, and the three pill metadata items (date range, days, transport). |
| `TripSectionTabs` | `trip/trip-section-tabs.tsx` | Three-tab nav (Planning / Memories / Expenses) with forest underline on the active tab. |
| `TripDayRail` | `trip/trip-day-rail.tsx` | Vertical left rail showing `Day 1 / Oct 14`, `Day 2 / Oct 15`, and an "Add Day" pill button. |
| `TripStatCard` | `trip/trip-stat-card.tsx` | White card with an icon, an uppercase label, a $ amount, and an optional trailing badge (e.g. "Pending" in terracotta). |
| `BudgetUsageBar` | `trip/budget-usage-bar.tsx` | Segmented progress bar with a legend row beneath it. |
| `TransactionRow` | `trip/transaction-row.tsx` | Icon tile + title + "Paid by … • date" + amount + status pill (Settled / Pending / Needs transfer). |
| `SettlementRow` | `trip/settlement-row.tsx` | Avatar + "Name owes Name" + amount + check icon. |
| `MemberBalanceRow` | `trip/member-balance-row.tsx` | Avatar + name + "Gets $X" (green) or "Owes $X" (terracotta). |
| `AiAssistantCard` | `trip/ai-assistant-card.tsx` | Amber-tinted card with a sparkle icon, a heading, body text, and one or two pill buttons. |
| `AiInsightCard` | `trip/ai-insight-card.tsx` | Amber-tinted card with a sparkle icon, multi-line insight body, and a single action link. |
| `TripStatusChip` | `trip/trip-status-chip.tsx` | Pill chip with tone variants: `confirmed` (sage), `ready` (sage-dim), `pending` (terracotta), `settled` (sage), `needs-transfer` (terracotta-soft). |
| `TripVaultCard` | `trip/trip-vault-card.tsx` | Card with a heading, three stat rows (Photos / Journal Entries / Places Saved), and a full-width "Add Memory" primary button. |
| `MemoryEntry` | `trip/memory-entry.tsx` | Card containing a small timestamp pill, a heading, a hero image with an optional "Pinned Option" tag, journal paragraph, and an attribution row. |
| `PinnedOptionBadge` | `trip/pinned-option-badge.tsx` | Small green pill with a pin icon used as an image overlay. |
| `DateChip` | `trip/date-chip.tsx` | Pill chip with "Day N" + date, used in the day rail. |
| `ContinuePlanningButton` | `trip/continue-planning-button.tsx` | Forest primary button used in the dashboard "Upcoming Adventure" card. |

The current `app/app-shell.tsx`, `trips/trip-section-tabs.tsx`, `trips/trip-cover-header.tsx`, and `planning/date-rail.tsx` are kept as backward-compatible re-exports so any tests that import them do not break. New code imports from `components/trip/*`.

## 6. Surface Specifications

### 6.1 Public landing (`/`)

- Hero: full-bleed Vietnam photo with the existing `LandingHero` replaced by a new `LandingHeroEditorial` that renders the design in `design/landingpage-rideflow.png`:
  - Top-right nav links: `Vietnam`, `Feature`, `Explore`, `About`. (These are anchor links for the new design and the existing `Sign in` / `Get started` buttons remain in the same sticky header per user clarification.)
  - Top-left: small hairline rule above a large serif-feel `Vietnam` title in display-md, a 4-line body in `body-md` describing Vietnam, and a `Explore` pill button (mint on forest).
  - The bottom 35% of the hero transitions into a cream paper background via a hand-drawn organic fade.
- Discover Vietnam section: two-column layout. Left: a stylized SVG map of Vietnam showing pins for Hanoi, Ha Long Bay, Hue, Da Nang, and HCMC. Right: a `Discover Vietnam` heading, three-line body, and two info cards for Hoàng Sa (Paracel Islands) at 220 km and Trương Sa (Spratly Islands) at 250 km.
- Section 3: 3-column feature grid (`Day-by-day planning`, `Group first, route second`, `Memory vault`) that echoes the design's restrained editorial tone.
- Final CTA band: `Plan your next journey` heading on forest-900 with a single `Start planning` pill.
- Footer: wordmark, copyright, single `Sign in` link.
- The `LandingHeroEditorial` is rendered through the existing `LandingPage` server component. `landing-hero.tsx` and `landing-features.tsx` and `landing-final-cta.tsx` and `landing-footer.tsx` are rewritten in place so the new landing remains a single composition rooted in `LandingPage`.

### 6.2 Trips dashboard (`/trips`)

- Replaces the existing `Trips Dashboard` heading with a `Welcome back.` display-md greeting and a `The road is calling. Let's get planning.` subhead in `body-md` ink-700.
- Right column: `Planning Activity` card listing the last 4–6 activity entries (e.g. "Alex added a waypoint: Bao Loc Pass • 2 hours ago"). Each entry has a green or sage bullet, a primary line, a name in ink-700, and a relative timestamp. A `View full history` link sits at the bottom of the card.
- Center column: `Upcoming Adventure` card.
  - 16:9 hero image (cover of the most recent active trip, or a generic editorial fallback if no trip exists).
  - Top-left chips: `Off-Road` (terracotta) and `3 Days` (paper).
  - White sub-card overlapping the cover with `UPCOMING ADVENTURE` label, trip name headline, a `65% Planned` indicator on the right, a forest progress bar, the avatar stack of members, and a forest `Continue planning` button.
- Bottom: `Recent Journeys` section. A two-card grid with each card using a 16:9 hero image, `COMPLETED • OCT 12` label, trip name headline, and a row of metadata (`450 mi • 4 Riders`). If the user has zero completed trips, fall back to a `Recent Journeys` empty state with a `Plan a journey` CTA.
- Empty state: if the user has zero trips, hide the `Upcoming Adventure` card and show a `Plan your first journey` hero card with the existing `CreateTripButton` and an illustration or hero image.

### 6.3 Trip details — Planning (`/trips/[tripId]`)

- Layout: 3-column grid — `TripDayRail` (≈ 220px) on the left, planning center, and a right-side column (≈ 320px) with `Route Overview` card on top and `AiAssistantCard` below.
- Timeline cards match the new design: each card has a small target-icon, a `07:00 AM` time, a status chip (`CONFIRMED` or `READY`), a `Depart from HCM` headline, a `Starting Point` location line with a map pin, and an optional hero image with `Pinned Option` badge, a star rating row, and a forest `Book / Confirm` button.
- The right column shows a forest `Route Overview` card with two pins (start + end) on a soft sage map and a `142 km • 3h 15m` metadata line, plus the `AiAssistantCard` with `Heavy rain is expected for Day 2 afternoon. Should we look for indoor backup activities or adjust riding gear?` and two pill buttons (`Find Indoor Activities`, `Dismiss`).
- `Add Day` button at the bottom of the day rail.
- The existing `PlanningWorkspace` (drag, search, AI draft, real-time, map) is preserved; the new surface reuses the agenda items it produces. The `DraggableTimeline` keeps its drag-and-drop behavior but the new visual wraps it in a card with the design's spacing and chips.

### 6.4 Trip details — Expenses (`/trips/[tripId]/expenses`)

- Top row: four `TripStatCard` instances — `Total Spent $450`, `Trip Budget $600`, `Pending $128` (terracotta border), `Per Person $75`.
- `Budget Usage` card: heading + `75% of $600 used` right-aligned. Below sits a `BudgetUsageBar` segmented across Accommodation (forest), Food (sage), Fuel (sage-light), Tickets (terracotta-200), Misc (terracotta). Legend beneath, one dot per category with the dollar amount.
- `Recent Expenses` card: heading, two pill buttons on the right (`Split equally`, `+ Add expense`). Below, a column of `TransactionRow` items: `Fuel refill / Paid by Nhut • Jul 10 / $68.00 / Settled`, `Coffee stop / Paid by Minh • Jul 10 / $24.00 / Pending`, `Green Bamboo Lodge / Paid by An • Jul 10 / $180.00 / Needs transfer`, `National park entrance / Paid by Binh • Jul 11 / $42.00 / Pending`. Each row has the design's icon tile (sage or terracotta tint), title, paid-by, date, amount, and a status pill.
- Right column: `Settlement` card with two `SettlementRow` entries (`Minh owes Nhut $18.00` with checkmark, `Binh owes An $32.00` with checkmark) and a forest `Settle all balances` button.
- Below settlement: `Member Balances` card with four `MemberBalanceRow` items (An `Gets $45` green, Nhut `Gets $12` green, Minh `Owes $25` terracotta, Binh `Owes $32` terracotta).
- Bottom right: `AiInsightCard` reading `Your accommodation costs are running 15% higher than typical for Đồng Nai region. Consider booking standard lodges to keep within your $600 total budget.` with a `Review alternatives` action link.

### 6.5 Trip details — Memories (`/trips/[tripId]/memories`)

- Left rail: `TripDayRail` with the same Day / Add Day structure as the planning tab.
- Center column: vertical `MemoryEntry` stack. Each entry has:
  - A small uppercase `06:30 AM • Sep 12` timestamp.
  - A `headline-sm` title.
  - A 16:9 hero image.
  - An italic body paragraph.
  - A `— Added by Marcus` attribution row.
- Right column: `TripVaultCard` with `Photos 48 / Journal Entries 7 / Places Saved 12` rows and a forest `+ Add Memory` primary button.

## 7. Data and State

- No database migrations.
- No new server actions. Existing `createTripAction`, `signInAction`, `signUpAction`, `createTripFromFormData`, and trip/member queries are untouched.
- The `PlanningTrip` seed (`apps/web/src/application/trips/planning-data.ts`) gains three new optional display fields used by the new surfaces: `members: { id, name, role }[]`, `activity: { actor, action, target, timestamp }[]`, and `expenses: { totalSpent, budget, pending, perPerson, breakdown, transactions, settlements, balances }`. The seed trip (`da-nang`) is extended with editorial sample data so the new surfaces have realistic content; the same data is also reused by the new dashboard greeting.
- The Memories and Expenses pages continue to read from `getPlanningTripById` and `getSupabasePlanningTripRows`. If a Supabase trip has no `expenses` / `activity` / `members` data yet, the new surfaces fall back to the seed data so the new design renders for any trip in the database.

## 8. Validation Strategy

| Layer | Expectation |
| --- | --- |
| Unit | New `apps/web/tests/components/trip/*.test.tsx` covering `TripAppShell`, `TripCoverHeader`, `TripSectionTabs`, `TripDayRail`, `TripStatCard`, `BudgetUsageBar`, `TransactionRow`, `SettlementRow`, `MemberBalanceRow`, `AiAssistantCard`, `AiInsightCard`, `TripStatusChip`, `TripVaultCard`, `MemoryEntry`, `PinnedOptionBadge`, `DateChip`, `ContinuePlanningButton`. Existing component tests must remain green. |
| Integration | Existing `create-trip-action`, `auth-actions`, `dashboard-data`, and `planning-data` tests stay green. |
| E2E (Playwright) | Update `tests/e2e/landing.spec.ts` to assert the new Vietnam copy. Add `tests/e2e/dashboard.spec.ts` for the dashboard greeting, `tests/e2e/trip-details.spec.ts` covering tab navigation between Planning/Memories/Expenses, and `tests/e2e/trip-expenses.spec.ts` for the new stat cards. |
| Platform | `pnpm --dir apps/web build`, `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`. |
| Visual | Manual screenshots at 1440px and 360px captured into `docs/specs/005-rideflow-editorial-app-redesign/proof.md`. |
| Performance | No new heavy dependency. Background images are still served via `next/image` with the existing `images.unsplash.com` remote pattern. |

## 9. Risks

| Risk flag | Applies | Why |
| --- | --- | --- |
| Public contracts | Yes | `/`, `/trips`, `/trips/[tripId]`, `/trips/[tripId]/memories`, `/trips/[tripId]/expenses` all keep their routes and primary copy but visible text changes; the landing Playwright spec must be updated. |
| Existing behavior | Yes | Auth gating, the trip section tabs, the planning workspace, the AI draft flow, place search, members panel, and the real-time status pill must keep working. |
| Cross-platform | Yes | New editorial layout must work at 360px without overflow. |
| Weak proof | Yes | Without component tests, new shared primitives could regress later. |
| Auth | No | No new auth code, redirect, or session behavior. |
| Authorization | No | Member roles and viewer permissions are unchanged. |
| Data model | No | No schema, migration, or RLS changes. |
| Audit/security | No | No new logs or audit events. |
| External systems | No | No new provider integration. |
| Multi-domain | Yes | Five surfaces change at once, which is the largest multi-domain update since US-RF-016. |

With four flags and no hard gates, the lane is `normal` with stronger validation. The story is high-risk only if a future revision needs to alter auth, RLS, or data model.

## 10. Acceptance Test Matrix

| Requirement Area | Unit | Integration | E2E | Visual |
| --- | --- | --- | --- | --- |
| Editorial tokens loaded | No | Yes (build) | No | Yes |
| Landing renders Vietnam hero + Discover Vietnam + footer | No | No | Yes | Yes |
| Landing CTAs still open auth modal | No | No | Yes | Yes |
| Dashboard greeting + Upcoming Adventure + Planning Activity | Yes | No | Yes | Yes |
| Dashboard empty state when zero trips | Yes | No | Yes | Yes |
| Trip details Planning: day rail + timeline + AI assistant + route overview | Yes | No | Yes | Yes |
| Trip details Expenses: stat cards + budget + transactions + settlement + balances + AI insight | Yes | No | Yes | Yes |
| Trip details Memories: timeline + Trip Vault | Yes | No | Yes | Yes |
| 3-tab navigation between Planning/Memories/Expenses | Yes | No | Yes | No |
| Mobile 360px has no horizontal overflow | No | No | Yes | Yes |
| Existing auth and Create Trip modal flow still work | No | Yes | Yes | Yes |

## 11. Open Decisions Resolved

- **D-001** (resolved 2026-06-19): Landing keeps `Sign in` / `Get started` in the header even though the new design does not show them in the header. The user chose to keep the existing auth pattern.
- **D-002** (resolved 2026-06-19): 3 tabs (Planning / Memories / Expenses) everywhere, not 5. `Overview` and `Route` tabs are future scope.
- **D-003** (resolved 2026-06-19): `/trips` dashboard is also redesigned to the `Welcome back.` layout. The `user_dashboard_rideflow/screen.png` design is in scope.
- **D-004** (resolved 2026-06-19): Design tokens are added to `tailwind.config.ts` and `globals.css`, not inlined as arbitrary classes.

## 12. Definition of Done

- All RF items in §6 implemented and rendered on the listed routes.
- All shared components in §5 ship with Vitest render tests.
- `pnpm --dir apps/web build`, `pnpm --dir apps/web lint`, `pnpm --dir apps/web test`, and the new / updated Playwright specs all pass.
- `docs/specs/005-rideflow-editorial-app-redesign/proof.md` is filled in with command outputs and screenshots.
- `scripts/bin/harness-cli story verify US-RF-018` exits 0.
- A trace is recorded via `scripts/bin/harness-cli trace` and the matrix shows `unit yes / integration yes / e2e yes` for US-RF-018.

## 13. Harness Delta

- Story `US-RF-018 RideFlow Editorial App Redesign` stays in the matrix, status `in_progress` → `implemented`, lane `normal`, proof booleans `unit 1 / integration 1 / e2e 1 / platform 0`.
- New shared primitives under `apps/web/components/trip/*` and matching tests under `apps/web/tests/components/trip/*` are the durable harness contribution of this story.
- If friction is found (e.g. Montserrat font fetch fails offline, or `next/image` rejects a new Unsplash URL), record it via `scripts/bin/harness-cli backlog add`.
