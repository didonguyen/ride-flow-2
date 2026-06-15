# Feature Specification: Visual Refresh — Forest-Green Travel Aesthetic

**Feature ID:** 003-visual-refresh-green
**Status:** Draft, awaiting sign-off
**Created:** 2026-06-15
**Owner:** RideFlow product
**Primary implementation surface:** `apps/web`
**Source story:** `US-RF-015 Visual Refresh: Forest-Green Travel Aesthetic` (planned, intake #4, lane: normal)
**Supersedes visual direction of:** `docs/specs/002-public-landing/spec.md` (replaced by this spec for the public landing surface)
**Touches (does not supersede):** `docs/specs/001-rideflow-v1/spec.md` (planning, expenses, memories, auth remain on their own visual contracts; this spec only re-skins the surfaces explicitly listed in `## Scope`)

## Source Material

- User prompt (2026-06-15): re-style RideFlow after a reference image — forest-green palette, image-led trip cards, smooth slide-in CTA on the landing, mobile-first with desktop adaptation. Keep RideFlow's product content.
- Reference image (user-supplied, three phone screens): landing with `Explore Your Favorite Journey`, a Discover tab list, and a trip-detail with image carousel, stat cards, and price CTA.
- `docs/product/rideflow-v1.md` (product contract).
- `docs/specs/001-rideflow-v1/spec.md` (existing visual direction, brand tokens, screen contracts).
- `docs/specs/002-public-landing/spec.md` (current public landing implementation, will be replaced by this spec).
- `publics/design/RideFlow_logo.png` (wordmark, retained).
- `publics/design/RideFlow_Dashboard.png` (dashboard reference, retained for Memories/Expenses planning work, not for this slice).
- Existing components reviewed: `apps/web/components/landing/*`, `apps/web/components/trips/trip-card.tsx`, `apps/web/app/(app)/trips/page.tsx`, `apps/web/app/(app)/trips/[tripId]/page.tsx`, `apps/web/app/globals.css`, `apps/web/tailwind.config.ts`.

## Scope

This spec covers a visual refresh only. It changes the look of three surfaces and the design tokens that flow through them. It does not change product behavior, data model, permissions, or routes.

In scope:

- Public landing page at `/` (replaces the hero, features, how-it-works, preview, and final-CTA from `002-public-landing`).
- Trip card component on the trips dashboard `/trips` (re-skin only — `DashboardTrip` data shape, route, and `NewTripCard` remain).
- Trip detail cover header on `/trips/[tripId]` (new full-bleed cover band above the existing `MobileTripHeader` / `TripSectionTabs` / `DateRail` / `PlanningWorkspace`).
- The shared design tokens: new forest-green palette, new mint accent, new motion primitives.

Out of scope (explicitly):

- Discover tab / category filter chips (user opted out).
- Stat cards (Distance / Temp / Rating) on trip detail (user opted out — those are travel-discovery content, not planning content).
- Memories, Expenses, AI Draft, Place Search, Members, Auth visual refresh.
- New product behavior, new data fields, new API routes.
- i18n, RTL, dark mode.
- Marketing automation, analytics, A/B testing.

## Product Summary

RideFlow V1 is a collaborative trip planning workspace. After the V1 launch, the current visual language uses deep teal (`#004853`) on a white shell with image-led dashboard cards. The user-supplied reference image shows a warmer, more vivid forest-green palette, larger image-led trip cards with rating badges, and a hero CTA that slides up smoothly into view.

This refresh moves the public marketing surface, the trip card grid, and the trip detail entry point to the new aesthetic. It keeps every other surface and every product behavior intact. The hero, the trip card, and the cover header are the three places a returning user or anonymous visitor feels the brand, so they are the focus of this slice.

## Goals

- **G-001 Forest-green identity.** The new palette dominates the public landing hero and the trip card rating accent, with a calmer mint accent for secondary state.
- **G-002 Image-led trip cards.** Every trip card on `/trips` shows the destination photo at large, the trip name and location in a soft white chip, and a star rating badge. On hover, the card lifts by 4px with a smooth 200ms ease.
- **G-003 Smooth entry CTA.** The landing hero CTA is a pill-shaped glass card that slides up from the bottom of the hero on first paint, with a 600ms cubic-bezier ease. It contains a circular `Go` button with a double-chevron icon.
- **G-004 Trip cover header.** The trip detail page opens with a full-bleed cover image, the trip name overlaid in white, the destination in a smaller white subline with a pin glyph, and a small horizontal image carousel on the right edge. Planning tabs and workspace start below the cover.
- **G-005 Mobile-first responsive.** Mobile (≤640px) is the primary canvas. Tablet (641-1024px) keeps the mobile single-column layout but widens content to 720px max. Desktop (≥1025px) moves the cover header to a 16:9 hero band, shows the trip card grid as 3 columns, and centers the landing hero copy.
- **G-006 Reusable tokens.** All new colors, radii, shadows, easings, and motion primitives are exposed as CSS variables in `apps/web/app/globals.css` and as Tailwind theme extensions in `apps/web/tailwind.config.ts` so the next slice can reuse them.

## Non-Goals

- **NG-001** No new auth provider, signup form, marketing automation, or email capture.
- **NG-002** No Discover tab, no category filter chips, no new public sample feed.
- **NG-003** No stat cards (Distance / Temp / Rating) on the trip detail.
- **NG-004** No price/total-cost UI on the trip detail.
- **NG-005** No Memories, Expenses, Place Search, AI Draft, or Members visual refresh in this slice.
- **NG-006** No animation libraries (Framer Motion, GSAP). Motion is implemented with CSS transitions and a single Tailwind keyframes block.
- **NG-007** No i18n. All copy is English.
- **NG-008** No SEO, Open Graph, or analytics changes.

## User Roles

The visual refresh does not add roles. Behavior of the existing role matrix in `docs/specs/001-rideflow-v1/spec.md` is preserved.

| Surface | Anonymous | Authenticated | Notes |
| --- | --- | --- | --- |
| Public landing `/` | Sees the new hero. | Redirected to `/trips`. | Preserves FR-002 from `002-public-landing`. |
| Trips dashboard `/trips` | Redirected to `/sign-in`. | Sees the refreshed trip card grid. | Existing auth gate. |
| Trip detail `/trips/[tripId]` | Redirected to `/sign-in`. | Sees the new cover header above the existing planning tabs. | Existing auth gate; cover header is read-only. |

## Visual Contract

This section is the source of truth for the new aesthetic. Implementation must match these tokens. The Tailwind class names in the requirement IDs reference these tokens.

### Color tokens

| Token | Hex | Usage |
| --- | --- | --- |
| `--rideflow-forest-900` | `#0B2A1E` | Hero background, dark overlays on the cover header. |
| `--rideflow-forest-700` | `#1B3A2C` | Hero gradient stop, dark CTA pressed state. |
| `--rideflow-forest-500` | `#2C5F3F` | Forest mid-tone, hover ring on dark surfaces. |
| `--rideflow-mint-400` | `#4FD1C5` | Trip card rating chip background, secondary accent. |
| `--rideflow-amber-400` | `#F5B544` | Rating star glyph. |
| `--rideflow-cream-50` | `#FAF7F2` | Body background of the landing beneath the hero, dashboard surface. |
| `--rideflow-surface` | `#FFFFFF` | Card surface. |
| `--rideflow-ink-900` | `#0F172A` | Primary text on light. |
| `--rideflow-ink-500` | `#475569` | Body text on light. |
| `--rideflow-line-200` | `#E7E5E4` | Hairline borders. |
| `--rideflow-shadow-card` | `0 12px 32px -12px rgba(11, 42, 30, 0.18)` | Trip card resting shadow. |
| `--rideflow-shadow-card-hover` | `0 24px 48px -16px rgba(11, 42, 30, 0.28)` | Trip card hover shadow. |

The existing teal tokens (`--rideflow-teal: #004853`) are retained for the planning date rail and the auth pages. They are not used on the new landing, trip card, or cover header.

### Typography

- Font stack is unchanged: Inter, with the existing `globals.css` declaration.
- Hero headline: `text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.035em] leading-[1.05]`.
- Hero subheadline: `text-base sm:text-lg font-medium text-white/85`.
- Trip card name: `text-xl font-extrabold tracking-[-0.02em] text-slate-950`.
- Trip card location: `text-sm font-medium text-slate-500`.
- Cover header title: `text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-[-0.035em] text-white`.
- Section headings: `text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-slate-950`.

### Radii

- Trip card: `rounded-3xl` (`24px`).
- Trip card info chip: `rounded-2xl` (`16px`).
- Landing hero CTA pill: `rounded-full`.
- Cover header image carousel thumb: `rounded-2xl`.
- Section cards on the landing: `rounded-3xl`.

### Motion

| Primitive | Duration | Easing | Usage |
| --- | --- | --- | --- |
| `rideflow-card-lift` | 200ms | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Trip card hover translate-y `-4px`. |
| `rideflow-hero-rise` | 600ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Landing hero CTA slides up from `translate-y(24px)` to `0` on first paint. |
| `rideflow-cover-fade` | 400ms | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Cover header overlay fades in on mount. |
| `rideflow-carousel-snap` | 300ms | `cubic-bezier(0.22, 0.61, 0.36, 1)` | Carousel thumb scroll-snap. |

`prefers-reduced-motion: reduce` disables all four primitives.

## Core User Journeys

### J-001 Anonymous Visitor Lands On The New Marketing Page

1. Visitor opens `https://<host>/`.
2. Server confirms there is no Supabase session.
3. Server renders the new landing page.
4. On first paint, the hero CTA pill slides up from below the fold over 600ms.
5. Visitor clicks `Go` and is taken to `/sign-up?next=/trips`.
6. Visitor clicks `Sign in` and is taken to `/sign-in?next=/trips`.

Acceptance:

- `/` returns HTTP 200 for anonymous users.
- The hero image renders on first paint via `next/image` with `priority`.
- The CTA pill animates in once on mount and does not replay.
- `prefers-reduced-motion: reduce` skips the animation.

### J-002 Authenticated Visitor Skips The Landing

1. Authenticated user opens `https://<host>/`.
2. Server detects a Supabase session.
3. Server responds with `redirect("/trips")`.
4. User lands on the trips dashboard and sees the refreshed trip card grid.

Acceptance:

- The redirect status is 307.
- The behavior is identical to the pre-refresh behavior for authenticated users.

### J-003 Trip Owner Opens A Trip From The Refreshed Card Grid

1. Owner opens `/trips`.
2. Owner sees a 3-column grid (desktop) or 1-column stack (mobile) of trip cards.
3. Each card shows a destination photo at large, the trip name and location in a white chip, and a star rating.
4. Owner clicks a card.
5. Card animates a 200ms lift to `--rideflow-shadow-card-hover` on press.
6. Owner lands on `/trips/[tripId]`.

Acceptance:

- The card uses the new `--rideflow-forest-900` rating chip background.
- The card hover/active state is implemented with `transition` and `transform`, no JavaScript animation library.
- The route resolves to the existing trip detail.

### J-004 Trip Member Opens A Trip And Sees The New Cover Header

1. Member opens `/trips/[tripId]`.
2. The page renders a full-bleed cover image with the trip name and destination overlaid in white at the bottom-left.
3. A vertical strip of 4 thumbnail images is anchored to the right edge of the cover on desktop, and to the bottom of the cover on mobile.
4. The existing `TripSectionTabs` (Planning, Memories, Expenses), `DateRail`, and `PlanningWorkspace` render below the cover.
5. Member scrolls into the planning workspace exactly as before.

Acceptance:

- The cover header is read-only and contains no mutating controls.
- The cover header respects the existing planner/owner/viewer permission model (no member-management surface on the cover).
- The cover image is loaded with `next/image` `priority` so LCP is not delayed.

### J-005 Returning User On Mobile Sees The Refreshed Hierarchy

1. User opens `/trips` on a 360px-wide viewport.
2. User sees a stacked single-column list of trip cards, each with the full-bleed image at the top of the card.
3. User taps a card and lands on `/trips/[tripId]` with the cover header above the planning tabs.
4. User scrolls naturally; no horizontal overflow appears at 360px or 390px viewports.

Acceptance:

- Layout is single column at ≤640px.
- No horizontal scrollbar at 360px or 390px.
- The cover header collapses its image carousel into a horizontally scrolling strip at the bottom of the cover on mobile.

## Feature Requirements

### RF-001 Route And Auth Gating (Unchanged)

- FR-001: `/` remains a server component. Anonymous visitors see the new landing; authenticated users are redirected to `/trips`.
- FR-002: `/trips` keeps its existing `redirect("/sign-in?next=/trips")` for anonymous users.
- FR-003: `/trips/[tripId]` keeps its existing auth and trip-not-found behavior.
- FR-004: No new public API routes are added.

### RF-002 Design Tokens

- FR-005: `apps/web/app/globals.css` defines the color tokens listed in `## Visual Contract > Color tokens` as CSS custom properties under `:root`.
- FR-006: `apps/web/tailwind.config.ts` extends the theme with the same colors under `theme.extend.colors.forest`, `theme.extend.colors.mint`, `theme.extend.colors.amber`, `theme.extend.colors.cream`, and the radii/shadows listed in `## Visual Contract`.
- FR-007: The motion primitives in `## Visual Contract > Motion` are exposed as Tailwind `keyframes` and `animation` entries.
- FR-008: `prefers-reduced-motion: reduce` is respected by all four motion primitives.

### RF-003 Public Landing Page

- FR-009: The new landing is composed top-to-bottom of: `LandingHeader`, `LandingHero`, `LandingTopDestinations`, `LandingFeatures`, `LandingFinalCta`, `LandingFooter`. The `LandingHowItWorks` and `LandingPreview` sections from `002-public-landing` are removed.
- FR-010: `LandingHeader` is a sticky transparent header with the RideFlow wordmark, a `Sign in` text button, and a `Get started` solid forest pill button. Height: `h-16` mobile, `h-20` desktop.
- FR-011: `LandingHero` is a full-bleed section with a forest-green background, a high-resolution Unsplash jungle photo overlaid with a `--rideflow-forest-900` to `--rideflow-forest-700` gradient, a centered `Explore Your Favorite Journey` headline, the `Let's Make Our Life Better` subheadline, and a pill-shaped glass CTA card containing a circular white `Go` button with a double-chevron icon.
- FR-012: The hero CTA pill animates in with `rideflow-hero-rise` once on first paint.
- FR-013: The hero copy is white with at least WCAG AA contrast against the gradient overlay.
- FR-014: `LandingTopDestinations` is a horizontal scroll strip of 6 image-led destination cards. Each card shows a squircle photo thumbnail, the destination name, the country, and a star rating. The strip is purely illustrative and uses Unsplash images; it is not interactive beyond hover.
- FR-015: `LandingFeatures` is a 4-card grid (1 col mobile, 2 col tablet, 4 col desktop) that reuses the feature copy from `002-public-landing` RF-026..RF-029, with the icon badge background changed from teal to forest (`bg-forest-700`).
- FR-016: `LandingFinalCta` is a solid forest-700 band with the `Ready to plan your next trip?` headline and a single white `Get started` button.
- FR-017: `LandingFooter` is a forest-900 band with the wordmark, copyright line, and `Sign in` link in white.
- FR-018: Headlines match the `## Visual Contract > Typography` sizes.
- FR-019: All hero and CTA links use typed routes (`/sign-up?next=/trips as Route`, `/sign-in?next=/trips as Route`).
- FR-020: The Unsplash `next/image` remote pattern from `002-public-landing` is reused.

### RF-004 Trip Card Component

- FR-021: `apps/web/components/trips/trip-card.tsx` keeps the same exported names (`TripCard`, `NewTripCard`) and the same `DashboardTrip` props contract.
- FR-022: The card surface is image-led: the destination photo fills the card with `object-cover`, with a subtle bottom darkening gradient from `transparent` to `rgba(11, 42, 30, 0.35)` for legibility.
- FR-023: A floating white info chip sits at the bottom-left of the card with the trip name (`text-xl font-extrabold`), the destination (`text-sm font-medium text-slate-500`), and the date range (`text-xs font-medium text-slate-400`).
- FR-024: A star rating badge sits at the top-right of the card. Background `--rideflow-mint-400`, star glyph `--rideflow-amber-400`, rating text in `--rideflow-ink-900`. The badge is `rounded-full` with `px-3 py-1.5` and a subtle `shadow-md`.
- FR-025: The card uses `rounded-3xl`, `min-h-[28rem]` on mobile, `min-h-[34rem]` on `sm`, and the `--rideflow-shadow-card` resting shadow.
- FR-026: On hover, the card translates `-translate-y-1` and switches to `--rideflow-shadow-card-hover` over 200ms with `rideflow-card-lift`. On press, it returns to rest. The animation is implemented with `transition` and `transform` only; no JavaScript animation library.
- FR-027: The card remains a `<Link>` to `/trips/[id]` with the existing `aria-label="Open <trip name>"`.
- FR-028: `NewTripCard` keeps its dashed-outline treatment, but the border color changes from `slate-200` to `forest-500/40` and the hover background changes to `cream-50` so it sits naturally next to the refreshed trip cards.
- FR-029: When `trip.imageUrl` is empty, the card falls back to a CSS-only forest gradient (`bg-gradient-to-br from-forest-700 to-forest-900`) and still renders the white info chip.

### RF-005 Trip Detail Cover Header

- FR-030: A new component `apps/web/components/trips/trip-cover-header.tsx` is created. It accepts `{ tripName, destination, coverImageUrl, gallery: string[] }` as props.
- FR-031: The cover header is rendered above `TripSectionTabs` on `/trips/[tripId]` and above `MobileTripHeader` on mobile. The existing `MobileTripHeader` is preserved.
- FR-032: The cover image is full-bleed with `next/image` `fill` and `priority`. A `--rideflow-forest-900` to transparent gradient overlays the bottom of the image for legibility.
- FR-033: The trip name and destination are overlaid at the bottom-left of the cover in white. The destination line uses a `MapPin` glyph from `lucide-react`.
- FR-034: A vertical strip of up to 4 gallery thumbnails is anchored to the right edge of the cover on `lg` and above. On `md` and below, the strip becomes a horizontal scroll-snap row at the bottom of the cover.
- FR-035: Each gallery thumb is `rounded-2xl`, `h-16 w-16` (mobile) or `h-20 w-20` (desktop), with a 2px white ring on the active thumb.
- FR-036: The cover header contains no mutating controls and is read-only. Owners, Planners, and Viewers see the same header.
- FR-037: The cover header does not duplicate data already shown by the planning tabs; it is purely visual entry scaffolding.
- FR-038: The cover image and the gallery images are loaded with `next/image`. The Unsplash remote pattern covers Unsplash. If a non-Unsplash source is introduced, `apps/web/next.config.ts` is updated to allow its hostname.

### RF-006 Responsive Behavior

- FR-039: Landing hero is full viewport height on mobile (`min-h-[100svh]`) and `min-h-[720px]` capped at `90vh` on desktop.
- FR-040: Landing hero copy is centered vertically and horizontally on desktop, bottom-aligned on mobile.
- FR-041: Trip card grid is 1 column on mobile, 2 columns on `md`, 3 columns on `2xl`.
- FR-042: Top destinations strip scrolls horizontally on all viewports; on `lg` and above it shows 4 cards at a time without scroll, with a `See all` link.
- FR-043: Cover header height is `h-[60svh]` on mobile, `h-[420px]` on `md`, `h-[480px]` on `lg` and above.
- FR-044: No horizontal page scrollbar appears at 360px, 390px, 768px, 1024px, or 1440px viewports.

### RF-007 Accessibility

- FR-045: All images have meaningful `alt` text or `alt=""` if decorative.
- FR-046: The hero background image is `aria-hidden` because meaning is in the headline.
- FR-047: The trip card link keeps its `aria-label`; the rating badge uses `aria-label="Rated X out of 5"`.
- FR-048: Color contrast for body text on `--rideflow-cream-50` is at least WCAG AA.
- FR-049: The hero `Go` button has an accessible name (`aria-label="Get started"`) and a visible focus ring using `ring-mint-400`.
- FR-050: The cover header title and destination are in a `<h1>` and a `<p>` respectively, with appropriate heading order on the page.

### RF-008 Motion

- FR-051: The hero CTA pill animates once on first paint with `rideflow-hero-rise`.
- FR-052: The trip card hover and press states use `rideflow-card-lift`.
- FR-053: The cover header overlay fades in with `rideflow-cover-fade` on mount.
- FR-054: The gallery carousel uses CSS `scroll-snap-type: x mandatory` and a 300ms transition on thumb position; no JS scroll library.
- FR-055: All four primitives are disabled under `prefers-reduced-motion: reduce`.

## Screen Contracts

### SC-001 Public Landing (Replaces SC-001 in `002-public-landing`)

Route: `/` (anonymous only).

Must include:

- Sticky `LandingHeader` with wordmark, `Sign in` link, `Get started` solid button.
- Full-bleed `LandingHero` with forest background, headline, subheadline, glass CTA pill containing circular `Go` button.
- `LandingTopDestinations` horizontal strip of 6 illustrative cards.
- `LandingFeatures` 4-card grid.
- `LandingFinalCta` solid forest band with `Get started`.
- `LandingFooter` forest band with wordmark, copyright, `Sign in` link.

### SC-002 Trips Dashboard With Refreshed Cards (Touches SC-002 in `001-rideflow-v1`)

Route: `/trips` (authenticated only).

Must include:

- Existing `AppShell` and `Trips Dashboard` title.
- Refreshed `TripCard` grid with image-led treatment, floating white info chip, mint star rating badge.
- Refreshed `NewTripCard` with forest-500/40 dashed border.
- Empty state unchanged.

### SC-003 Trip Detail With Cover Header (Touches SC-004 in `001-rideflow-v1`)

Route: `/trips/[tripId]` (authenticated only).

Must include:

- New `TripCoverHeader` above `TripSectionTabs` and `MobileTripHeader`.
- Existing `MobileTripHeader` preserved.
- Existing `TripSectionTabs` (Planning, Memories, Expenses), `DateRail`, `PlanningWorkspace`, and `MembersPanel` unchanged below the cover.

## Acceptance Test Matrix

| Requirement Area | Unit | Integration | E2E | Visual | Platform |
| --- | --- | --- | --- | --- | --- |
| New design tokens in `globals.css` and `tailwind.config.ts` | No | Yes (build) | No | Yes | No |
| Public landing renders and animates the hero CTA | No | Yes (build) | Yes (Playwright) | Yes | Yes (360, 390, 768, 1024, 1440) |
| Authenticated `/` still redirects to `/trips` | No | No | Yes (Playwright) | No | No |
| Trip card hover and press states | No | No | Yes (Playwright) | Yes | Yes (360, 1024, 1440) |
| Trip card image fallback when `imageUrl` is empty | No | No | Yes (Playwright) | Yes | No |
| Trip cover header renders above planning tabs | No | No | Yes (Playwright) | Yes | Yes (360, 1024, 1440) |
| Cover header carousel collapses to bottom strip on mobile | No | No | Yes (Playwright) | Yes | Yes (360, 390) |
| `prefers-reduced-motion: reduce` disables motion primitives | No | No | Yes (Playwright) | Yes | No |
| No horizontal overflow at 360px, 390px, 768px, 1024px, 1440px | No | No | Yes (Playwright) | Yes | Yes |
| Existing planning, auth, and trips behavior unchanged | Yes (existing) | Yes (existing) | Yes (existing) | No | No |

## File Plan

| Path | Change |
| --- | --- |
| `apps/web/app/globals.css` | Add the new design tokens, motion primitives, and `prefers-reduced-motion` block. |
| `apps/web/tailwind.config.ts` | Extend theme with `forest`, `mint`, `amber`, `cream`, radii, shadows, and the four motion keyframes/animations. |
| `apps/web/components/landing/landing-page.tsx` | Replace composition with the new section order. |
| `apps/web/components/landing/landing-header.tsx` | Sticky transparent header, wordmark, `Sign in`, `Get started`. |
| `apps/web/components/landing/landing-hero.tsx` | New forest hero with glass CTA pill and `Go` button. |
| `apps/web/components/landing/landing-top-destinations.tsx` | New horizontal strip of 6 illustrative destination cards. |
| `apps/web/components/landing/landing-features.tsx` | Refresh icon badge background to `forest-700`. |
| `apps/web/components/landing/landing-how-it-works.tsx` | **Delete** (section removed in this refresh). |
| `apps/web/components/landing/landing-preview.tsx` | **Delete** (section removed in this refresh). |
| `apps/web/components/landing/landing-final-cta.tsx` | Change band background to `forest-700`, keep copy. |
| `apps/web/components/landing/landing-footer.tsx` | Change background to `forest-900`, white text. |
| `apps/web/components/trips/trip-card.tsx` | Refresh card style, info chip, rating badge, hover/press motion. |
| `apps/web/components/trips/trip-cover-header.tsx` | New: cover header for trip detail. |
| `apps/web/app/(app)/trips/[tripId]/page.tsx` | Render `<TripCoverHeader />` above `TripSectionTabs` and `MobileTripHeader`. |
| `apps/web/next.config.ts` | No new patterns needed (Unsplash already allowed). |
| `docs/specs/002-public-landing/spec.md` | Annotate as superseded by `003-visual-refresh-green` for the public landing surface. |
| `docs/specs/003-visual-refresh-green/{spec,plan,tasks,proof}.md` | New spec folder. |
| `docs/stories/epics/E04-rideflow-v1/US-RF-015-visual-refresh-green.md` | New story packet. |
| `docs/TEST_MATRIX.md` | Add US-RF-015 row. |

## Architecture Notes

- The refresh is purely visual and lives at the UI layer of `apps/web`. No new boundary parsers, no new use cases, no new repository types, no new Supabase migrations.
- Existing Supabase touch points (`createSupabaseServerClient`, `mapSupabaseDashboardTrips`, `getSupabasePlanningTripRows`, `listSupabaseMembers`) are unchanged.
- The `DashboardTrip` type in `apps/web/src/application/trips/dashboard-data.ts` and the `mapSupabasePlanningTrip` mapping are unchanged. The trip card and cover header consume the same fields as before.
- The cover header receives a `gallery: string[]` prop. If the data layer does not provide a gallery, the component falls back to a 1-image strip (the cover only) so the visual is not broken for trips without gallery data.
- The `prefers-reduced-motion` block lives in `globals.css` and uses `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; ... } }` as a coarse fallback in addition to per-keyframe opt-outs.

## Open Decisions (None Outstanding)

- Hero source: Unsplash (royalty-free, high-res). The image is hosted under `images.unsplash.com` and already allowed by the existing `next/image` remote pattern.
- Discover tab: not added in this slice (per user clarification).
- Stat cards and price CTA on trip detail: not added in this slice (per user clarification).
- Top destinations strip: illustrative only, uses Unsplash sample images, not wired to real data.

If the visual treatment needs tweaking during implementation (font weight, spacing, or copy tone), the spec stays in force and the change is recorded in `proof.md`.

## Definition Of Ready

This spec is ready for implementation once:

- The user signs off on the spec content.
- The hero image URL is confirmed (default: a forest/jungle Unsplash photo).
- The cover header gallery image source is confirmed (default: 4 sample Unsplash images).

## Definition Of Done

- All RF-001 through RF-055 requirements are implemented.
- The authenticated redirect from `/` to `/trips` is preserved.
- The trip card and `NewTripCard` keep their existing routes, props, and exported names.
- The cover header renders above the existing planning tabs without breaking `MobileTripHeader`, `TripSectionTabs`, `DateRail`, or `PlanningWorkspace`.
- `pnpm --dir apps/web build` passes.
- `pnpm --dir apps/web test` passes with no regressions.
- `pnpm --dir apps/web lint` passes.
- A Playwright spec lands at `apps/web/tests/e2e/visual-refresh.spec.ts` covering: anonymous visitor sees the new hero, the hero CTA animates in, authenticated visitor is redirected from `/` to `/trips`, trip card hover/press state is visible, cover header renders above planning tabs, `prefers-reduced-motion: reduce` disables motion.
- Screenshots at 360px, 768px, 1024px, and 1440px for `/`, `/trips`, and `/trips/[tripId]` are added to `proof.md`.
- `docs/TEST_MATRIX.md` shows US-RF-015 as `in_progress` and links to the story packet.
- `docs/specs/003-visual-refresh-green/proof.md` lists the actual command outputs.

## Harness Delta

- Add a planned story `US-RF-015 Visual Refresh: Forest-Green Travel Aesthetic` with lane `normal`.
- Add a row to `docs/TEST_MATRIX.md` for US-RF-015.
- Create a story packet under `docs/stories/epics/E04-rideflow-v1/US-RF-015-visual-refresh-green.md`.
- Annotate `docs/specs/002-public-landing/spec.md` as superseded for the public landing surface.
- Record a trace after implementation via `scripts/bin/harness-cli trace`.
- If friction is found (e.g. unexpected Tailwind purge of new tokens), record it via `scripts/bin/harness-cli backlog add`.
