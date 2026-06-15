# US-RF-015 Visual Refresh: Forest-Green Travel Aesthetic

## Status

planned

## Lane

normal

## Product Contract

RideFlow's public landing, trips dashboard trip cards, and trip detail cover header adopt a new forest-green travel aesthetic with image-led cards, a smooth slide-in hero CTA, and a mobile-first responsive layout. No product behavior, route, permission, or data model changes. Authenticated redirect from `/` to `/trips` is preserved. Existing planning, auth, members, AI draft, place search, expenses, and memories behavior is unchanged.

## Relevant Product Docs

- `docs/specs/003-visual-refresh-green/spec.md` (full RF-001..RF-055)
- `docs/specs/003-visual-refresh-green/plan.md` (file plan and architecture)
- `docs/specs/003-visual-refresh-green/tasks.md` (atomic task table)
- `docs/specs/003-visual-refresh-green/proof.md` (validation evidence bundle)
- `docs/specs/002-public-landing/spec.md` (superseded for the public landing surface)
- `docs/specs/001-rideflow-v1/spec.md` (planning, auth, members contracts preserved)
- `docs/product/rideflow-v1.md` (product contract)
- `apps/web/app/globals.css` (design tokens)
- `apps/web/tailwind.config.ts` (theme extensions)
- `apps/web/components/landing/*` (landing components)
- `apps/web/components/trips/trip-card.tsx` (refreshed trip card)
- `apps/web/components/trips/trip-cover-header.tsx` (new cover header)
- `apps/web/app/(app)/trips/page.tsx` (trips dashboard)
- `apps/web/app/(app)/trips/[tripId]/page.tsx` (trip detail)

## Acceptance Criteria

- `apps/web/app/globals.css` defines the new color tokens (`--rideflow-forest-900/700/500`, `--rideflow-mint-400`, `--rideflow-amber-400`, `--rideflow-cream-50`, `--rideflow-ink-900/500`, `--rideflow-line-200`, `--rideflow-shadow-card`, `--rideflow-shadow-card-hover`) and a `prefers-reduced-motion` block.
- `apps/web/tailwind.config.ts` extends the theme with `forest`, `mint`, `amber`, `cream` colors, the two `rideflow-card*` shadows, the `4xl` radius, and the three motion keyframes/animations (`rideflow-card-lift`, `rideflow-hero-rise`, `rideflow-cover-fade`).
- `apps/web/components/landing/landing-page.tsx` renders the new section order: header, hero, top destinations, features, final CTA, footer.
- `LandingHero` uses a forest gradient + Unsplash background, white headline `Explore Your Favorite Journey`, white subheadline `Let's Make Our Life Better`, and a glass pill containing a circular white `Go` button with a `ChevronsUp` icon. The pill animates in once on first paint with `animate-rideflow-hero-rise`.
- `LandingTopDestinations` renders a horizontal strip of 6 illustrative destination cards.
- `LandingFeatures` icon badge background changes from teal to `forest-700`.
- `LandingHowItWorks` and `LandingPreview` files are removed.
- `LandingFinalCta` band background changes to `forest-700`.
- `LandingFooter` background changes to `forest-900` with white text.
- `TripCard` is image-led with a floating white info chip and a mint star rating badge. Hover translates `-translate-y-1` with `rideflow-card-lift`. Falls back to a forest gradient when `imageUrl` is empty.
- `NewTripCard` border changes to `border-forest-500/40` with `hover:bg-cream-50`.
- `TripCoverHeader` renders full-bleed with a forest-900 gradient overlay, white trip name and destination, and a 1-4 thumbnail carousel that collapses to a horizontal strip on mobile.
- `/trips/[tripId]` renders `<TripCoverHeader />` above `MobileTripHeader` and `TripSectionTabs`.
- The authenticated redirect from `/` to `/trips` is preserved.
- `pnpm --dir apps/web build` passes.
- `pnpm --dir apps/web test` passes with no regressions.
- `pnpm --dir apps/web lint` passes.
- A Playwright spec lands at `apps/web/tests/e2e/visual-refresh.spec.ts` covering: anonymous hero, hero CTA animation, authenticated redirect, trip card hover, trip card image fallback, cover header, cover carousel mobile collapse, and `prefers-reduced-motion`.
- Screenshots at 360px, 768px, 1024px, and 1440px for `/`, `/trips`, and `/trips/[tripId]` are added to `proof.md`.

## Design Notes

- Commands: `pnpm --dir apps/web build`, `pnpm --dir apps/web test`, `pnpm --dir apps/web lint`, `pnpm --dir apps/web test:e2e -- visual-refresh.spec.ts`.
- Queries: none. No database access added.
- API: no new routes.
- Tables: no schema change. `DashboardTrip.rating` is added as an optional field.
- Domain rules: none. UI-only change.
- UI surfaces: `/`, `/trips`, `/trips/[tripId]`.
- Architecture: server components, no `'use client'`, no animation libraries. CSS-driven motion with `prefers-reduced-motion` opt-out.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Existing unit tests still pass. No new domain rule. |
| Integration | `next/image` build accepts the existing Unsplash remote pattern. |
| E2E | New Playwright `visual-refresh.spec.ts` covers 8 flows. |
| Platform | Web only. Mobile and desktop visual screenshots at 4 viewports. |
| Release | `pnpm --dir apps/web build` passes. |

Story proof update:

```bash
scripts/bin/harness-cli story update --id US-RF-015 --unit 1 --integration 1 --e2e 1 --platform 1
```

Story verification command:

```bash
scripts/bin/harness-cli story update --id US-RF-015 --verify "pnpm --dir apps/web test:e2e -- visual-refresh.spec.ts"
```

## Harness Delta

- New story row in `docs/TEST_MATRIX.md` for US-RF-015.
- New spec folder `docs/specs/003-visual-refresh-green/` with `spec.md`, `plan.md`, `tasks.md`, `proof.md`.
- Annotation on `docs/specs/002-public-landing/spec.md` that the public landing surface is now governed by `003-visual-refresh-green`.
- Trace recorded after implementation via `scripts/bin/harness-cli trace`.
- Any friction (e.g. unexpected Tailwind purge of new tokens) recorded via `scripts/bin/harness-cli backlog add`.

## Evidence

To be filled in `docs/specs/003-visual-refresh-green/proof.md` after implementation with:

- Build output.
- Test output.
- Lint output.
- Playwright spec output.
- Screenshots at 360px, 768px, 1024px, 1440px for `/`, `/trips`, `/trips/[tripId]`.
