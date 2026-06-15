# Feature Specification: Public Landing Page

**Feature ID:** 002-public-landing
**Status:** Draft, awaiting sign-off
**Created:** 2026-06-15
**Owner:** RideFlow product
**Primary implementation surface:** `apps/web`
**Source story:** `US-RF-014 Public Landing Page` (planned in harness matrix)
**Intake record:** intake #3 (lane: normal, flags: public-contracts, existing-behavior)

## Source Material

- `docs/product/rideflow-v1.md` (product contract)
- `docs/specs/001-rideflow-v1/spec.md` (visual direction, brand tokens, screen contracts)
- `apps/web/app/page.tsx` (current behavior: hard redirect to `/trips`)
- `apps/web/app/layout.tsx` and `apps/web/app/globals.css` (brand tokens, font)
- `apps/web/components/app/app-shell.tsx` (logo and color usage inside the app)
- `publics/design/RideFlow_logo.png` (primary wordmark)
- `publics/design/RideFlow_Dashboard.png` (visual reference for image-led cards)
- Figma reference: `https://www.figma.com/make/LWiUg00Rn6XJ2DrWsgWbTv/Travel-app-homepage-design` (informational; Figma content not fetched, layout decisions are derived from the dashboard reference and standard travel landing conventions)
- User prompt (2026-06-15): replace the immediate `redirect("/trips")` with a public marketing landing; keep the RideFlow wordmark visible; replace the previous background image with a higher-quality travel image while keeping the same product messaging.

## Product Summary

RideFlow V1 currently sends every visitor to `/trips`, which immediately redirects anonymous users to `/sign-in`. This is correct for a returning user, but it gives first-time visitors no way to learn what RideFlow is, what the planning workflow looks like, or how to begin. This feature adds a real public landing page at `/` that explains RideFlow to anonymous visitors, shows the brand, and offers clear paths to sign up or sign in. Authenticated users keep their current behavior and are still redirected to `/trips`.

## Goals

- **G-001 Anonymous discoverability.** A first-time visitor can open `/` and understand what RideFlow is within five seconds.
- **G-002 Brand identity.** The RideFlow wordmark (`publics/design/RideFlow_logo.png`) is the primary brand element on the landing page.
- **G-003 Conversion paths.** Two primary CTAs (`Get started` and `Sign in`) and a single final CTA section are visible without scrolling on desktop.
- **G-004 Visual quality.** The hero background uses a high-resolution travel image sourced from Unsplash. Information density matches the existing dashboard card treatment.
- **G-005 Non-disruptive auth flow.** Logged-in users continue to be redirected to `/trips`; protected routes and the auth contract are not modified.

## Non-Goals

- **NG-001** No new auth provider, no new signup form, no marketing automation, no email capture.
- **NG-002** No pricing, no testimonials, no blog, no separate legal pages.
- **NG-003** No i18n. The landing is in English to match `apps/web/app/layout.tsx` and the rest of the app.
- **NG-004** No SEO sitemap, no Open Graph image generation, no analytics integration in this slice.
- **NG-005** No animation libraries; sections are static. Sticky header is the only dynamic behavior.

## User Roles

The landing page is anonymous-only by design. It contains no authenticated data, no trip lists, and no member-aware actions. Logged-in users are routed past it.

| Role on landing | Behavior |
| --- | --- |
| Anonymous visitor | Sees the landing page. |
| Authenticated user | Server-side redirected to `/trips` (current behavior preserved). |

## Core User Journey

### J-001 Anonymous Visitor Lands On Marketing Page

1. Visitor opens `https://<host>/`.
2. Server confirms there is no Supabase session.
3. Server renders the landing page.
4. Visitor sees the hero, the four feature cards, the three-step `How it works`, the visual preview, the final CTA, and the footer.
5. Visitor clicks `Get started` and is taken to `/sign-up?next=/trips`.
6. Visitor clicks `Sign in` and is taken to `/sign-in?next=/trips`.

Acceptance:

- `/` returns HTTP 200 for anonymous users.
- The page passes the `lcp` and `cls` quick visual sanity check (no broken images, no overlapping text).
- The hero background image renders on first paint via `next/image` priority.
- CTA links use typed routes (`/sign-up` and `/sign-in`).

### J-002 Authenticated Visitor Skips The Landing

1. Authenticated user opens `https://<host>/`.
2. Server detects a Supabase session.
3. Server responds with a redirect to `/trips`.
4. User lands on the dashboard exactly as today.

Acceptance:

- The redirect status is 307 (Next.js default for `redirect()`).
- The behavior is identical to the pre-feature behavior for authenticated users.

## Feature Requirements

### RF-001 Route And Auth Gating

- FR-001: The root route `/` shall be a server component.
- FR-002: When the visitor has no Supabase session, `/` shall render the landing page.
- FR-003: When the visitor has a Supabase session, `/` shall call `redirect("/trips")` exactly as today.
- FR-004: The landing page shall not import or depend on any `trips` data, members, or planning modules.
- FR-005: The landing page shall not add new public API routes.

### RF-002 Page Composition

The page shall be composed of the following top-to-bottom sections, in this order:

- FR-006: A sticky transparent header containing the RideFlow wordmark, a `Sign in` link, and a `Get started` button.
- FR-007: A hero section with a background image, a primary headline, a supporting subheadline, and a `Get started` primary button plus a `Sign in` secondary link.
- FR-008: A features section with four feature cards, each containing an icon, a title, and a one-sentence description.
- FR-009: A `How it works` section with three numbered steps and a short description per step.
- FR-010: A visual preview section that re-uses the existing `publics/design/RideFlow_Dashboard.png` mock or a CSS-only approximation of the dashboard card grid.
- FR-011: A final CTA section with one `Get started` button.
- FR-012: A minimal footer with the wordmark, a short copyright line, and a `Sign in` link.

### RF-003 Hero Section

- FR-013: The hero shall use `next/image` with `priority` and `fill` for the background.
- FR-014: The hero background image shall be `https://images.unsplash.com/photo-1502602898657-3e91760cbb34` with `?auto=format&fit=crop&w=2400&q=80` query parameters.
- FR-015: The hero image shall be hosted under the `images.unsplash.com` domain, declared in `apps/web/next.config.ts` via `images.remotePatterns` so `next/image` can optimize it.
- FR-016: A dark gradient overlay (`from-black/70 via-black/40 to-black/20`) shall sit between the image and the copy to keep text legible.
- FR-017: Headline text shall read: `Plan trips together, day by day.`
- FR-018: Subheadline text shall read: `RideFlow is a calm, image-led workspace for groups to build a shared itinerary, pin places, and let AI draft the first version.`
- FR-019: Hero copy color shall be white (`text-white`) for AAA contrast on the dark overlay.
- FR-020: Hero CTA primary button text: `Get started` linking to `/sign-up?next=/trips`.
- FR-021: Hero CTA secondary link text: `Already have an account? Sign in` linking to `/sign-in?next=/trips`.

### RF-004 Brand And Wordmark

- FR-022: The header wordmark shall use the existing asset at `publics/design/RideFlow_logo.png`.
- FR-023: The wordmark height shall be `h-10` on the transparent header and `h-12` in the footer.
- FR-024: The wordmark shall render with `object-contain` and a sensible width cap so it does not stretch.
- FR-025: The landing page shall not introduce a new logo variant; the existing black wordmark is reused.

### RF-005 Features Section

Four feature cards, each implemented as a `Card` with icon, title, and description:

- FR-026: Card 1 — `Day-by-day timeline`. Description: `One card per day with a teal date rail and clear time slots for every stop.`
- FR-027: Card 2 — `Place search that pins snapshots`. Description: `Find cafes, viewpoints, and stays from seed data or OpenStreetMap, and freeze the choice onto the timeline.`
- FR-028: Card 3 — `Editable AI itinerary`. Description: `Generate a first draft, preview it, then append or replace. Your work is never overwritten.`
- FR-029: Card 4 — `Realtime with your group`. Description: `Owners and planners see each other's edits within seconds. Viewers can follow along read-only.`
- FR-030: Each card shall use the deep teal accent (`bg-[#004853]`) for the icon badge and white text on the badge.
- FR-031: Section heading: `Everything your group needs, in one workspace.`
- FR-032: Section subheading: `Four building blocks replace the messy group chat and the scattered notes.`

### RF-006 How It Works Section

- FR-033: Section heading: `How RideFlow works.`
- FR-034: Step 1 — `Create a trip`: `Name, destination, dates. We generate one card per day.`
- FR-035: Step 2 — `Build the plan`: `Drag stops into the timeline. Pin places, attach notes, set durations.`
- FR-036: Step 3 — `Invite and go`: `Invite members as Planner or Viewer. The trip stays live as it changes.`
- FR-037: Each step number shall be rendered inside a teal-filled circle with white text.
- FR-038: Steps shall be displayed as a three-column grid on desktop and a stacked single column on mobile.

### RF-007 Visual Preview Section

- FR-039: Section heading: `See the dashboard before you sign up.`
- FR-040: The section shall embed `publics/design/RideFlow_Dashboard.png` via `next/image` inside a rounded card with a soft shadow.
- FR-041: The image shall have descriptive alt text: `RideFlow dashboard preview showing three trip cards and a new-trip card.`
- FR-042: The image container shall cap width to `max-w-5xl` and center it horizontally.

### RF-008 Final CTA And Footer

- FR-043: Final CTA section background: deep teal (`bg-[#004853]`).
- FR-044: Final CTA heading: `Ready to plan your next trip?`
- FR-045: Final CTA button: `Get started`, linking to `/sign-up?next=/trips`.
- FR-046: Footer wordmark: `RideFlow` (logo asset).
- FR-047: Footer copyright: `© 2026 RideFlow. All rights reserved.`
- FR-048: Footer link: `Sign in` to `/sign-in`.

### RF-009 Responsive Behavior

- FR-049: Layout shall be single column on `<640px` width.
- FR-050: Features grid shall be `1 col → 2 col (md) → 4 col (lg)`.
- FR-051: How-it-works grid shall be `1 col → 3 col (md)`.
- FR-052: Hero copy shall remain readable on 360px width without horizontal overflow.
- FR-053: Sticky header shall remain visible across all viewports.

### RF-010 Visual And Brand Tokens

- FR-054: The landing page shall use existing CSS variables from `apps/web/app/globals.css` where applicable.
- FR-055: The deep teal accent (`#004853`) shall be the primary accent.
- FR-056: The page background shall be white (`bg-white`) for the body, with the hero image acting as the only large color block.
- FR-057: Typography shall default to the body Inter stack already configured in `globals.css`.
- FR-058: Section vertical rhythm shall use `py-20 sm:py-24` between major sections.

### RF-011 Accessibility

- FR-059: All images shall have meaningful `alt` text or `alt=""` if decorative.
- FR-060: The hero background image shall be marked `aria-hidden` because the actual meaning is in the headline.
- FR-061: Buttons shall have visible focus rings using the same `ring-sky-600` pattern as the auth form.
- FR-062: Color contrast for body text on white background shall be at least WCAG AA.
- FR-063: Color contrast for hero text on the dark gradient overlay shall be at least WCAG AA.

## Acceptance Test Matrix

| Requirement Area | Unit | Integration | E2E | Visual |
| --- | --- | --- | --- | --- |
| Route gating (anonymous vs auth) | No | No | Yes | Yes |
| Hero background renders | No | No | Yes | Yes |
| CTA links resolve to typed routes | No | No | Yes | No |
| Responsive layout 360px to 1440px | No | No | Yes | Yes |
| Sticky header stays visible | No | No | Yes | Yes |
| Wordmark asset loads | No | No | Yes | Yes |
| `next/image` remote pattern allows Unsplash | No | Yes (build) | No | No |

## File Plan

| Path | Change |
| --- | --- |
| `apps/web/app/page.tsx` | Replace redirect-only body with session-aware server component. |
| `apps/web/components/landing/landing-page.tsx` | New: top-level server component composing all sections. |
| `apps/web/components/landing/landing-header.tsx` | New: sticky transparent header with wordmark and CTAs. |
| `apps/web/components/landing/landing-hero.tsx` | New: hero with background image and copy. |
| `apps/web/components/landing/landing-features.tsx` | New: four feature cards. |
| `apps/web/components/landing/landing-how-it-works.tsx` | New: three-step section. |
| `apps/web/components/landing/landing-preview.tsx` | New: dashboard preview block. |
| `apps/web/components/landing/landing-final-cta.tsx` | New: final CTA band. |
| `apps/web/components/landing/landing-footer.tsx` | New: minimal footer. |
| `apps/web/next.config.ts` | Add `images.remotePatterns` for `images.unsplash.com`. |
| `docs/specs/002-public-landing/{spec,plan,tasks,proof}.md` | Spec-driven delivery. |
| `docs/stories/epics/E04-rideflow-v1/US-RF-014-public-landing.md` | New story packet. |
| `docs/TEST_MATRIX.md` | Add US-RF-014 row. |
| `docs/stories/rideflow-v1-planning-core.md` (optional) | Append reference to new slice. |

## Architecture Notes

- The landing is rendered as a server component. It does not fetch any application data and does not import any Supabase repos. The only Supabase touch is a read-only `supabase.auth.getUser()` call inside `page.tsx` to detect the session.
- The `createSupabaseServerClient` helper already exists at `apps/web/src/infrastructure/supabase/server.ts` and is the only allowed way to read the session.
- We do not introduce new boundary parsers, new use cases, or new repository types. This is a UI-only change at the application/infrastructure layers.

## Open Decisions Resolved With User

- Hero source: Unsplash (royalty-free, high-res). The image is hosted under `images.unsplash.com`.
- Sections: Hero + 4 Features + How it works (3 steps) + Visual preview + Final CTA + Footer.
- Logged-in users keep the current redirect to `/trips`.
- Implementation: server component on `/` with a sticky transparent header.

## Open Decisions (None Outstanding)

The above list is complete after the user clarification round. If the visual treatment needs tweaking during implementation (font weight, spacing, or copy tone), the spec stays in force and the change is recorded in `proof.md`.

## Definition Of Ready

This spec is ready for implementation once:

- The user signs off on the spec content.
- The hero image URL is confirmed (default: `photo-1502602898657-3e91760cbb34`).

## Definition Of Done

- All RF-001 through RF-063 requirements are implemented.
- The existing `redirect("/trips")` for authenticated users is preserved.
- `pnpm --dir apps/web build` passes.
- `pnpm --dir apps/web test` passes (no new tests required by this slice because behavior is UI-only, but existing tests must stay green).
- A Playwright smoke spec lands at `apps/web/tests/e2e/landing.spec.ts` covering: anonymous user sees the hero, anonymous user can click `Get started` and reach `/sign-up`, authenticated user is redirected to `/trips`.
- `docs/TEST_MATRIX.md` shows US-RF-014 as `in_progress` and links to the story packet.
- `docs/specs/002-public-landing/proof.md` lists the actual command outputs.
- A screenshot of `/` at 1440px and 360px is added to `proof.md`.

## Harness Delta

- Add a planned story `US-RF-014 Public Landing Page` with lane `normal`.
- Add a row to `docs/TEST_MATRIX.md`.
- Create a story packet under `docs/stories/epics/E04-rideflow-v1/`.
- Record a trace after implementation via `scripts/bin/harness-cli trace`.
- If friction is found (e.g. image domain config surprise), record it via `scripts/bin/harness-cli backlog add`.
