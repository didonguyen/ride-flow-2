# Public Landing Page Implementation Plan

**Spec:** `docs/specs/002-public-landing/spec.md`
**Lane:** normal
**Primary surface:** `apps/web`

## Architecture Decisions

- **Server component.** `apps/web/app/page.tsx` is a server component. It reads the Supabase session via `createSupabaseServerClient` and either calls `redirect("/trips")` (signed-in) or renders `<LandingPage />` (anonymous). No client state, no `'use client'`, no animation libraries.
- **Composability.** Each section is its own component under `apps/web/components/landing/`. They are all server components and accept only static props (no callbacks). The page is composed top-to-bottom in `LandingPage`.
- **Sticky transparent header.** Implemented as a normal `<header>` with `sticky top-0 z-30` and `backdrop-blur` plus `bg-white/70` after scroll. Because the page has no scroll listener, the simpler approach is to use a fully transparent header on the hero and switch to `bg-white/80 backdrop-blur` on subsequent sections using a sticky-offset CSS trick. We will use a static `bg-white/90 backdrop-blur` for simplicity and to keep the spec simple; the hero text remains legible because the hero copy sits on the dark overlay, not on the white header.
- **`next/image` for the hero.** The hero background uses `next/image` with `fill`, `priority`, `sizes="100vw"`, and a remote pattern. The dark gradient overlay is a separate absolutely positioned `<div>`.
- **Wordmark reuse.** The header and footer both reference the existing `publics/design/RideFlow_logo.png`. No new asset is added in this slice.
- **Dashboard preview.** We embed `publics/design/RideFlow_Dashboard.png` via `next/image` (which already lives under `public/` and is statically served by Next). The `next/image` `<Image>` is used for intrinsic sizing and CLS safety.
- **Typed routes.** CTA links use the existing `Route` import pattern (`/sign-up as Route`, `/sign-in as Route`) so the change is compatible with `next.config.ts` `typedRoutes: true`.

## File-by-File Plan

### 1. `apps/web/app/page.tsx`

Replace:

```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/trips");
}
```

With a session-aware version that delegates to `<LandingPage />` when anonymous.

```tsx
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/trips");
  }

  return <LandingPage />;
}
```

### 2. `apps/web/components/landing/landing-page.tsx`

Top-level composition. Renders header, hero, features, how-it-works, preview, final CTA, footer in that order.

### 3. `apps/web/components/landing/landing-header.tsx`

- Sticky top header, `z-30`, white background with backdrop blur.
- Left: wordmark image linking to `/`.
- Right: `Sign in` link (text button) and `Get started` solid teal button.
- Height: `h-16` mobile, `h-20` desktop.

### 4. `apps/web/components/landing/landing-hero.tsx`

- Full-bleed section, min height `min-h-[640px]` on desktop, `min-h-[560px]` on mobile.
- `next/image` background fills the section.
- Dark gradient overlay covers the image.
- Centered content with white headline, white subheadline, primary and secondary CTAs.
- All copy matches spec FR-017, FR-018, FR-020, FR-021.

### 5. `apps/web/components/landing/landing-features.tsx`

- Section heading + subheading.
- Grid `1 col → 2 col (md) → 4 col (lg)`.
- Four cards; each is a `<div>` with rounded border, padding, a teal icon badge (lucide-react icons: `CalendarDays`, `MapPin`, `Sparkles`, `Users`).
- Body copy matches FR-026 through FR-029.

### 6. `apps/web/components/landing/landing-how-it-works.tsx`

- Section heading.
- Grid `1 col → 3 col (md)`.
- Each step: teal filled circle with white number, bold title, short description.
- Copy matches FR-034 through FR-036.

### 7. `apps/web/components/landing/landing-preview.tsx`

- Section heading.
- Centered image of `publics/design/RideFlow_Dashboard.png` inside a rounded card with shadow and small caption.
- Cap width with `max-w-5xl`.

### 8. `apps/web/components/landing/landing-final-cta.tsx`

- Solid teal band, white text.
- Headline + single white `Get started` button.
- Padding `py-20`.

### 9. `apps/web/components/landing/landing-footer.tsx`

- White background, border-top.
- Wordmark + copyright + `Sign in` link.
- Padding `py-10`.

### 10. `apps/web/next.config.ts`

Add the Unsplash remote pattern:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
```

### 11. Story packet

Create `docs/stories/epics/E04-rideflow-v1/US-RF-014-public-landing.md` from the story template, with:

- Status: planned → in_progress once code lands.
- Lane: normal.
- Acceptance criteria: every RF-001 through RF-063 requirement IDs.
- Validation: build, unit tests, Playwright smoke spec.

### 12. Test matrix

Add a row to `docs/TEST_MATRIX.md`:

```
| US-RF-014 Public Landing | `/` marketing page, anon redirect preserved | yes (Playwright) | yes (next/image build) | required | not run | planned | spec at docs/specs/002-public-landing/spec.md |
```

## Validation Commands

```bash
# Build
pnpm --dir apps/web build

# Existing tests must stay green
pnpm --dir apps/web test

# Lint
pnpm --dir apps/web lint

# Story verification command will be:
# pnpm --dir apps/web test:e2e -- landing.spec.ts
```

## Story Verification

`scripts/bin/harness-cli story update --id US-RF-014 --verify "pnpm --dir apps/web test:e2e -- landing.spec.ts"`.

Once the Playwright spec is in place and the E2E command is set, `story verify US-RF-014` runs the E2E smoke test.

## Risk Notes

- **`next/image` remote pattern.** Unsplash hotlinking is allowed, but Next will refuse to optimize the image without `images.remotePatterns`. We add the pattern explicitly.
- **Session detection cost.** `createSupabaseServerClient` is called once per anonymous request. This is a single Supabase auth probe; it does not hit the database.
- **No new auth surface.** We do not touch `/sign-in`, `/sign-up`, the action handlers, or any Supabase migration. The `redirect` path is preserved.
- **Tailwind tokens.** We reuse the existing teal `#004853` color and the body Inter stack. No new Tailwind plugin is required.
- **No animation library.** Sticky header is the only dynamic behavior. Sections are static.

## Commit Boundary

Single feature branch and one or two commits. Suggested boundaries:

1. `feat(landing): add public landing page, route gate, and hero background image`
2. `docs(specs): add US-RF-014 public landing slice and E2E smoke spec` (if split)

## Done Checklist

- [ ] Spec and plan reviewed.
- [ ] Story packet created and added to matrix.
- [ ] All RF-001 through RF-063 requirements implemented.
- [ ] Build passes.
- [ ] Existing unit and integration tests still pass.
- [ ] Playwright smoke spec passes locally.
- [ ] Screenshots at 1440px and 360px captured in `proof.md`.
- [ ] Trace recorded.
- [ ] `git status --short` clean except intentional changes.
