# US-RF-014 Public Landing Page

## Status

planned

## Lane

normal

## Product Contract

Anonymous visitors opening `/` see a public marketing landing page that explains
what RideFlow is, shows the RideFlow wordmark, and offers clear paths to sign up
or sign in. Authenticated users opening `/` continue to be redirected to `/trips`
exactly as today. The landing does not require authentication, does not load any
trip data, and does not change the existing auth, planning, or trips behavior.

## Relevant Product Docs

- `docs/specs/002-public-landing/spec.md` (full RF-001..RF-063)
- `docs/specs/002-public-landing/plan.md` (file plan and architecture)
- `docs/product/rideflow-v1.md` (product contract)
- `docs/specs/001-rideflow-v1/spec.md` (visual direction, brand tokens, FR-007..FR-010)
- `apps/web/app/page.tsx` (current behavior, hard redirect)
- `apps/web/components/app/app-shell.tsx` (logo and teal usage reference)
- `publics/design/RideFlow_logo.png` (primary wordmark)
- `publics/design/RideFlow_Dashboard.png` (visual preview asset)

## Acceptance Criteria

- `apps/web/app/page.tsx` becomes a server component that checks the Supabase
  session. If a user is present, it calls `redirect("/trips")`. If not, it
  renders `<LandingPage />`.
- A new `apps/web/components/landing/` folder contains:
  - `landing-page.tsx` (top-level composition)
  - `landing-header.tsx` (sticky header, wordmark, Sign in, Get started)
  - `landing-hero.tsx` (background image, headline, subheadline, dual CTA)
  - `landing-features.tsx` (four feature cards)
  - `landing-how-it-works.tsx` (three numbered steps)
  - `landing-preview.tsx` (embedded `RideFlow_Dashboard.png` preview)
  - `landing-final-cta.tsx` (teal final CTA band)
  - `landing-footer.tsx` (wordmark, copyright, Sign in)
- The hero background image uses `next/image` with `fill`, `priority`, and a
  remote pattern that allows `images.unsplash.com`.
- `apps/web/next.config.ts` declares the Unsplash remote pattern under
  `images.remotePatterns`.
- Hero headline: `Plan trips together, day by day.`
- Hero subheadline matches FR-018 verbatim.
- Primary CTA links to `/sign-up?next=/trips`; secondary link to
  `/sign-in?next=/trips` (typed routes).
- Feature card copy matches FR-026..FR-029.
- How-it-works copy matches FR-034..FR-036.
- Final CTA uses deep teal `bg-[#004853]` and a white `Get started` button.
- Layout is responsive: 1 col mobile, 2-4 col desktop for features, 1-3 col
  for how-it-works.
- `pnpm --dir apps/web build` passes.
- `pnpm --dir apps/web test` passes with no regressions.
- A Playwright smoke spec lands at `apps/web/tests/e2e/landing.spec.ts`
  covering: anonymous user sees the hero copy, anonymous user can reach
  `/sign-up` from the hero CTA, authenticated user is redirected to `/trips`.
- The RideFlow wordmark renders at `h-10` in the header and `h-12` in the
  footer using `object-contain` and `publics/design/RideFlow_logo.png`.

## Design Notes

- Commands: `pnpm --dir apps/web build`, `pnpm --dir apps/web test`,
  `pnpm --dir apps/web test:e2e -- landing.spec.ts`.
- Queries: none.
- API: no new routes; existing `/sign-in` and `/sign-up` are reused.
- Tables: no schema change.
- Domain rules: none. UI-only change at the application/infrastructure layers.
- UI surfaces: `/` is replaced from redirect-only to a marketing surface.
- Architecture: server component, no `'use client'`, no animation libraries,
  no Tailwind plugin changes. Existing `createSupabaseServerClient` is the
  only allowed session probe.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Existing unit tests still pass (no new domain rule). |
| Integration | `next/image` build accepts the Unsplash remote pattern. |
| E2E | New Playwright `landing.spec.ts` covers three flows. |
| Platform | Not run; web only. |
| Release | `pnpm --dir apps/web build` passes. |

Story proof update:

```bash
scripts/bin/harness-cli story update --id US-RF-014 --unit 1 --integration 1 --e2e 1 --platform 0
```

Story verification command:

```bash
scripts/bin/harness-cli story update --id US-RF-014 --verify "pnpm --dir apps/web test:e2e -- landing.spec.ts"
```

## Harness Delta

- New story row in `docs/TEST_MATRIX.md` for US-RF-014.
- Spec folder `docs/specs/002-public-landing/` with `spec.md`, `plan.md`,
  `tasks.md`, `proof.md`.
- Trace recorded after implementation via `scripts/bin/harness-cli trace`.
- Any friction (e.g. image domain config surprise) recorded via
  `scripts/bin/harness-cli backlog add`.

## Evidence

To be filled in `docs/specs/002-public-landing/proof.md` after implementation
with:

- Build output.
- Test output.
- Playwright spec output.
- Screenshots at 1440px and 360px.
