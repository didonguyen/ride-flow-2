# Visual Refresh — Forest-Green Travel Aesthetic: Implementation Plan

**Spec:** `docs/specs/003-visual-refresh-green/spec.md`
**Lane:** normal (3 risk flags: public-contracts, existing-behavior, cross-platform; no hard gates)
**Primary surface:** `apps/web`

## Architecture Decisions

- **Tokens first, components second.** We add all new design tokens to `globals.css` and `tailwind.config.ts` before touching any component. This lets every component consume the same palette and motion primitives without inline color values.
- **Server components, no animation library.** All motion is CSS-driven (Tailwind `animation` + `keyframes`, plus a `prefers-reduced-motion` block). No Framer Motion, no GSAP. The hero CTA rise, the trip card lift, the cover header fade, and the carousel snap are all CSS.
- **One new component, two refreshed components, one refreshed page.** `TripCoverHeader` is the only new component. `TripCard` and `NewTripCard` are refreshed in place. The trip detail page gains one new render line.
- **No new data shape.** The trip card keeps `DashboardTrip`. The cover header takes `{ tripName, destination, coverImageUrl, gallery: string[] }`. The planning trip mapper already exposes `trip.name` and `trip.destination`; we add an optional `gallery` field to the planner data shape with a sensible default.
- **No new routes.** The public landing, trips dashboard, and trip detail routes are unchanged. The authenticated redirect from `/` to `/trips` is preserved.
- **No new Supabase migration.** We do not touch the database, RLS, or auth flows. The Supabase repos are read-only consumers of the same fields.
- **Unsplash reuse.** The existing `next/image` remote pattern from `002-public-landing` already allows `images.unsplash.com`. We do not add new image hosts in this slice.

## File-by-File Plan

### 1. `apps/web/app/globals.css`

Add the new color tokens, motion primitives, and `prefers-reduced-motion` block. Keep the existing teal tokens for the planning date rail and the auth pages.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  /* existing tokens retained */
  --rideflow-bg: #f7f8fa;
  --rideflow-panel: #ffffff;
  --rideflow-text: #101828;
  --rideflow-muted: #667085;
  --rideflow-teal: #004853;
  /* new forest-green palette */
  --rideflow-forest-900: #0B2A1E;
  --rideflow-forest-700: #1B3A2C;
  --rideflow-forest-500: #2C5F3F;
  --rideflow-mint-400: #4FD1C5;
  --rideflow-amber-400: #F5B544;
  --rideflow-cream-50: #FAF7F2;
  --rideflow-ink-900: #0F172A;
  --rideflow-ink-500: #475569;
  --rideflow-line-200: #E7E5E4;
  --rideflow-shadow-card: 0 12px 32px -12px rgba(11, 42, 30, 0.18);
  --rideflow-shadow-card-hover: 0 24px 48px -16px rgba(11, 42, 30, 0.28);
}

/* ...existing body, a, img, ::selection rules... */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 2. `apps/web/tailwind.config.ts`

Extend the theme with the new palette, radii, shadows, and motion primitives.

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          900: "#0B2A1E",
          700: "#1B3A2C",
          500: "#2C5F3F"
        },
        mint: { 400: "#4FD1C5" },
        amber: { 400: "#F5B544" },
        cream: { 50: "#FAF7F2" }
      },
      boxShadow: {
        "rideflow-card": "0 12px 32px -12px rgba(11, 42, 30, 0.18)",
        "rideflow-card-hover": "0 24px 48px -16px rgba(11, 42, 30, 0.28)"
      },
      borderRadius: {
        "4xl": "32px"
      },
      keyframes: {
        "rideflow-card-lift": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        "rideflow-hero-rise": {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "rideflow-cover-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      },
      animation: {
        "rideflow-card-lift": "rideflow-card-lift 200ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        "rideflow-hero-rise": "rideflow-hero-rise 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
        "rideflow-cover-fade": "rideflow-cover-fade 400ms cubic-bezier(0.22, 0.61, 0.36, 1) both"
      }
    }
  },
  plugins: []
};

export default config;
```

### 3. `apps/web/components/landing/landing-page.tsx`

Replace the composition. New order: `LandingHeader`, `LandingHero`, `LandingTopDestinations`, `LandingFeatures`, `LandingFinalCta`, `LandingFooter`. `LandingHowItWorks` and `LandingPreview` are removed.

```tsx
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingTopDestinations } from "@/components/landing/landing-top-destinations";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingFinalCta } from "@/components/landing/landing-final-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50 text-slate-950">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingTopDestinations />
        <LandingFeatures />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
```

### 4. `apps/web/components/landing/landing-header.tsx`

Sticky transparent header on the hero, white with backdrop blur after scroll. The hero text stays legible because the hero copy sits on the dark gradient, not on the header. Wordmark height `h-10` mobile, `h-12` desktop.

### 5. `apps/web/components/landing/landing-hero.tsx`

Full-bleed `min-h-[100svh]` mobile / `min-h-[720px]` desktop. Background: forest gradient + Unsplash jungle photo via `next/image` with `priority`, `fill`, `sizes="100vw"`. Headline: `Explore Your Favorite Journey`. Subheadline: `Let's Make Our Life Better`. Below the copy, a glass pill card with `bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-2 py-2 pr-6` containing a circular white `Go` button (`h-14 w-14 rounded-full bg-white text-forest-900 shadow-xl flex items-center justify-center`) with a `ChevronsUp` icon from `lucide-react`. The pill animates in with `animate-rideflow-hero-rise`.

### 6. `apps/web/components/landing/landing-top-destinations.tsx`

New component. Section heading `Top destinations right now`. Horizontal scroll strip of 6 cards: `[ { name, country, imageUrl, rating } ]`. Each card is `flex-shrink-0 w-44 sm:w-52 rounded-2xl overflow-hidden bg-white shadow-rideflow-card`. The image is `h-32 w-full object-cover`. The body has the name (`text-sm font-extrabold`), country (`text-xs text-slate-500`), and a star rating (`text-amber-400`). Uses sample Unsplash images; no data wiring.

### 7. `apps/web/components/landing/landing-features.tsx`

Reuse the four feature cards from `002-public-landing`. Change the icon badge background from `bg-[#004853]` to `bg-forest-700`. Section heading and copy unchanged.

### 8. `apps/web/components/landing/landing-how-it-works.tsx` and `landing-preview.tsx`

Delete. These sections are removed in this refresh.

### 9. `apps/web/components/landing/landing-final-cta.tsx`

Change band background from `bg-[#004853]` to `bg-forest-700`. Headline and CTA button unchanged.

### 10. `apps/web/components/landing/landing-footer.tsx`

Change background to `bg-forest-900`. Text becomes `text-white/80`. `Sign in` link becomes `text-white`. Wordmark height `h-12`. Copyright: `© 2026 RideFlow. All rights reserved.`

### 11. `apps/web/components/trips/trip-card.tsx`

Refresh the card to match FR-021 through FR-029.

```tsx
import Link from "next/link";
import type { Route } from "next";
import { PlusCircle, Star } from "lucide-react";
import type { DashboardTrip } from "@/src/application/trips/dashboard-data";
import { dashboardCreateTripCta } from "@/src/application/trips/dashboard-data";

type TripCardProps = { trip: DashboardTrip };

export function TripCard({ trip }: TripCardProps) {
  return (
    <Link
      aria-label={`Open ${trip.name}`}
      className="group relative flex min-h-[28rem] overflow-hidden rounded-3xl shadow-rideflow-card ring-1 ring-black/5 transition duration-200 ease-out hover:-translate-y-1 hover:shadow-rideflow-card-hover focus:outline-none focus:ring-4 focus:ring-mint-400/40 sm:min-h-[34rem]"
      href={`/trips/${trip.id}` as Route}
      style={
        trip.imageUrl
          ? {
              backgroundImage: `linear-gradient(180deg, rgba(11, 42, 30, 0) 50%, rgba(11, 42, 30, 0.35) 100%), url(${trip.imageUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover"
            }
          : undefined
      }
    >
      {!trip.imageUrl ? (
        <div className="absolute inset-0 bg-gradient-to-br from-forest-700 to-forest-900" />
      ) : null}
      <span className="sr-only">{trip.imageAlt}</span>
      <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-mint-400 px-3 py-1.5 text-xs font-extrabold text-forest-900 shadow-md">
        <Star aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" fill="currentColor" />
        <span aria-label={`Rated ${trip.rating ?? 0} out of 5`}>{trip.rating ?? "—"}</span>
      </div>
      <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white px-5 py-5 shadow-lg shadow-slate-950/10 sm:inset-x-5 sm:bottom-5 sm:px-6">
        <h3 className="text-xl font-extrabold tracking-[-0.02em] text-slate-950">
          {trip.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-500">{trip.destination}</p>
        <p className="mt-1 text-xs font-medium text-slate-400">{trip.dateRange}</p>
      </div>
    </Link>
  );
}

export function NewTripCard() {
  return (
    <Link
      className="flex min-h-[27rem] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-forest-500/40 bg-white text-center transition hover:border-forest-500 hover:bg-cream-50 focus:outline-none focus:ring-4 focus:ring-mint-400/40 sm:min-h-[34rem]"
      href={"/trips/new" as Route}
    >
      <PlusCircle aria-hidden="true" className="h-16 w-16 text-slate-400" strokeWidth={1.8} />
      <h3 className="mt-8 text-2xl font-extrabold tracking-[-0.02em] text-slate-500">
        {dashboardCreateTripCta.title}
      </h3>
      <p className="mt-5 text-lg font-medium text-slate-400">
        {dashboardCreateTripCta.subtitle}
      </p>
    </Link>
  );
}
```

If `DashboardTrip` does not currently include a `rating` field, we add it as an optional `rating?: number` to keep the data shape additive. No migration required.

### 12. `apps/web/components/trips/trip-cover-header.tsx`

New component.

```tsx
import Image from "next/image";
import { MapPin } from "lucide-react";

type TripCoverHeaderProps = {
  tripName: string;
  destination: string;
  coverImageUrl: string;
  gallery?: string[];
};

export function TripCoverHeader({
  tripName,
  destination,
  coverImageUrl,
  gallery = []
}: TripCoverHeaderProps) {
  const thumbs = (gallery.length > 0 ? gallery : [coverImageUrl]).slice(0, 4);
  return (
    <section className="relative -mx-5 -mt-8 h-[60svh] overflow-hidden bg-forest-900 sm:-mx-8 lg:-mx-12 lg:h-[480px]">
      <Image
        src={coverImageUrl}
        alt={`Cover photo for ${tripName}`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/95 via-forest-900/40 to-transparent" />
      <div className="absolute inset-x-5 bottom-6 z-10 sm:inset-x-8 lg:inset-x-12 lg:bottom-10">
        <h1 className="text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl">
          {tripName}
        </h1>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-white/85 sm:text-base">
          <MapPin aria-hidden="true" className="h-4 w-4" />
          {destination}
        </p>
      </div>
      <div className="absolute bottom-6 right-5 z-10 flex max-w-[55%] gap-2 overflow-x-auto scroll-smooth sm:right-8 lg:right-12 lg:bottom-10 lg:max-w-none lg:flex-col">
        {thumbs.map((src, i) => (
          <div
            key={src}
            className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/70 lg:h-20 lg:w-20 ${i === 0 ? "ring-white" : ""}`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
```

### 13. `apps/web/app/(app)/trips/[tripId]/page.tsx`

Add a single line above `MobileTripHeader`:

```tsx
<TripCoverHeader
  tripName={data.trip.name}
  destination={data.trip.destination ?? data.destination}
  coverImageUrl={data.coverImageUrl ?? "/design/cover-default.jpg"}
  gallery={data.gallery ?? []}
/>
```

We extend the `TripData` shape with two optional fields (`coverImageUrl?: string`, `gallery?: string[]`) populated by `getTripData` from a new helper in `apps/web/src/application/trips/planning-data.ts` (or by falling back to defaults). The defaults are a single cover image and an empty gallery; the component handles both cases.

### 14. `apps/web/next.config.ts`

No change. The Unsplash remote pattern from `002-public-landing` is reused. We do not add new image hosts.

### 15. Story packet and matrix

- Create `docs/stories/epics/E04-rideflow-v1/US-RF-015-visual-refresh-green.md`.
- Add a row to `docs/TEST_MATRIX.md` for US-RF-015.

### 16. Annotation

Add a one-line note to the top of `docs/specs/002-public-landing/spec.md` indicating that the public landing surface is now governed by `docs/specs/003-visual-refresh-green/spec.md`.

## Validation Commands

```bash
pnpm --dir apps/web build
pnpm --dir apps/web test
pnpm --dir apps/web lint
pnpm --dir apps/web test:e2e -- visual-refresh.spec.ts
```

## Story Verification

```bash
scripts/bin/harness-cli story update --id US-RF-015 --verify "pnpm --dir apps/web test:e2e -- visual-refresh.spec.ts"
```

## Risk Notes

- **Tailwind purge.** New color tokens must be referenced as full class names (`bg-forest-700`, `text-mint-400`) somewhere in the content tree or they will be purged. We reference them in `LandingHero`, `LandingFinalCta`, `LandingFooter`, `TripCard`, `NewTripCard`, and `TripCoverHeader`, so all tokens are exercised.
- **Hero LCP.** The hero image is `priority`. The CTA pill animation is `both` (start state set before mount) to avoid a flash of unanimated content. The hero copy sits on the gradient, not on the image, so LCP is not text-image dependent.
- **Cover header LCP.** The cover image is `priority`. The existing `MobileTripHeader` is rendered below the cover, so the cover is the LCP candidate on trip detail.
- **Auth redirect preserved.** `apps/web/app/page.tsx` is unchanged. The existing `redirect("/trips")` for authenticated users is preserved.
- **Trip card data shape.** `DashboardTrip` does not currently include `rating`. We add it as optional and use the `?? "—"` fallback. The data layer can be extended in a later slice to populate real ratings.
- **Gallery fallback.** If a trip has no gallery, the cover header renders a single thumbnail (the cover) so the visual is never empty.
- **No animation library.** All motion is CSS. The hero CTA uses `animate-rideflow-hero-rise`. The trip card uses `hover:-translate-y-1 transition duration-200 ease-out`. The cover header overlay uses `animate-rideflow-cover-fade`.
- **Reduced motion.** The `prefers-reduced-motion` block in `globals.css` neutralizes all four primitives, and the per-keyframe opt-outs ensure the hero CTA does not flash into view at 1ms.

## Commit Boundary

Two feature commits:

1. `feat(web): add forest-green design tokens, hero CTA rise, trip card refresh, and trip cover header`
2. `docs(specs): add US-RF-015 visual refresh slice and Playwright spec`

A third optional commit can split the cover header if the diff is large.

## Done Checklist

- [ ] Tokens added to `globals.css` and `tailwind.config.ts`.
- [ ] Landing re-composed with the new sections.
- [ ] `LandingHero` matches FR-011 through FR-014.
- [ ] `LandingTopDestinations` matches FR-014.
- [ ] `LandingFeatures` icon badge background changed to `forest-700`.
- [ ] `LandingFinalCta` and `LandingFooter` match FR-016 and FR-017.
- [ ] `LandingHowItWorks` and `LandingPreview` deleted.
- [ ] `TripCard` and `NewTripCard` match FR-021 through FR-029.
- [ ] `TripCoverHeader` matches FR-030 through FR-038.
- [ ] Trip detail page renders the cover header above planning tabs.
- [ ] All four motion primitives work and respect `prefers-reduced-motion`.
- [ ] Build passes.
- [ ] Unit, integration, lint pass.
- [ ] Playwright spec passes locally.
- [ ] Screenshots at 360px, 768px, 1024px, 1440px captured in `proof.md`.
- [ ] Trace recorded.
- [ ] `git status --short` clean except intentional changes.
