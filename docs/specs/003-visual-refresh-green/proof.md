# Visual Refresh — Proof

**Spec:** `docs/specs/003-visual-refresh-green/spec.md`
**Plan:** `docs/specs/003-visual-refresh-green/plan.md`
**Tasks:** `docs/specs/003-visual-refresh-green/tasks.md`
**Story:** `docs/stories/epics/E04-rideflow-v1/US-RF-015-visual-refresh-green.md`
**Status:** implemented (2026-06-15) + polish pass (2026-06-15)

This file is the validation evidence bundle for US-RF-015.

## Evidence

### Build

```bash
pnpm --dir apps/web build
```

Result: pass.

```
Route (app)                                 Size  First Load JS
┌ ƒ /                                      174 B         111 kB
├ ○ /_not-found                            991 B         103 kB
├ ƒ /api/ai/draft                          127 B         102 kB
├ ƒ /api/places/search                     127 B         102 kB
├ ƒ /sign-in                               162 B         106 kB
├ ƒ /sign-up                               162 B         106 kB
├ ƒ /trips                                 167 B         106 kB
├ ƒ /trips/[tripId]                      86.6 kB         197 kB
├ ƒ /trips/[tripId]/expenses               167 B         106 kB
├ ƒ /trips/[tripId]/memories               167 B         106 kB
└ ○ /trips/new                             677 B         106 kB
```

- `/` reuses the existing landing composition. Bundle size unchanged.
- `/trips/[tripId]` grew from 167 B to 86.6 kB because of the new `TripCoverHeader` and gallery.

### Lint

```bash
pnpm --dir apps/web lint
```

Result: pass. Pre-existing `<img>` warnings in `app-shell.tsx` and `memories-surface.tsx` remain; they are not from this slice. No errors. The pre-existing `react/display-name` error in `members-panel.tsx` was fixed (one-line name refactor) as a blocker for the build's lint pass.

### Unit And Integration Tests

```bash
pnpm --dir apps/web test
```

Result: 96/96 pass.

```
Test Files  27 passed (27)
     Tests  96 passed (96)
  Duration  3.42s
```

### Dev Server Smoke

```bash
pnpm --dir apps/web dev
curl -s -o /tmp/landing.html -w "%{http_code}\n" http://localhost:3000/
curl -s -o /tmp/trip.html    -w "%{http_code}\n" http://localhost:3000/trips/da-nang
```

Result:

- `/`: 200, 112486 bytes
- `/trips/da-nang` (seed path, anonymous): 200, 135126 bytes
- `/trips` (anonymous): 307 redirect to `/sign-in?next=/trips` (preserved)

The new landing HTML contains the expected new copy and tokens:

- `Explore Your` / `Favorite Journey`
- `Let's Make Our Life Better`
- `Go` (CTA pill)
- `forest-900`, `mint-400`, `rideflow-hero-rise`

### Polish Pass (post-implementation)

After the initial implementation, the following refinements landed:

- **Hero photo swapped** from `photo-1502602898657-3e91760cbb34` (Eiffel Tower at night, did not match the travel-jungle aesthetic) to `photo-1441974231531-c6227db76b6e` (forest/jungle canopy) in `apps/web/components/landing/landing-hero.tsx`. The new photo renders with `priority` and `next/image` `fill`.
- **Hero copy centered** vertically on all viewports; pill stays anchored to the bottom. The hero now has a third gradient layer on the bottom half so the glass pill and its white text stay legible against the photo.
- **CTA pill hover** gets a subtle `scale-[1.02]` plus a `+1` background opacity bump.
- **Top destinations cards** get a `hover:-translate-y-1` lift matching the trip card.
- **Landing features cards** get a `hover:-translate-y-1` lift plus a forest-500/30 border on hover.
- **Top destinations section** animates in with `animate-rideflow-cover-fade` on first paint.

Final HTML check confirms all tokens are present:

- `forest-500`, `forest-700`, `forest-900`, `mint-400`, `amber-400`, `cream-50`
- `rideflow-hero-rise`, `rideflow-cover-fade`
- Hero photo `photo-1441974231531-c6227db76b6e`
- Cover header renders with `Da Nang Trip` and `rideflow-cover-fade`

The new trip detail HTML contains the new cover header:

- `Da Nang Trip` (h1)
- `Da Nang, Vietnam` (destination)
- `Cover photo` (alt text)
- `forest-900`, `rideflow-cover-fade`, `ring-white`

### Playwright E2E

```bash
pnpm --dir apps/web test:e2e -- visual-refresh.spec.ts
```

Status: spec landed at `apps/web/tests/e2e/visual-refresh.spec.ts`. The `landing.spec.ts` was also updated for the new hero copy. E2E run is blocked because Playwright chromium is unsupported on this host (`Playwright does not support chromium on ubuntu26.04-x64`). The spec exists as a smoke contract for future environments that can run the browser. The matrix row mirrors the same pattern used for US-RF-014.

The updated `landing.spec.ts` covers:

- Anonymous hero copy visible
- Hero CTA animates in (`rideflow-hero-rise`)
- Hero CTA navigates to `/sign-up?next=/trips`
- Final CTA navigates to `/sign-up?next=/trips`
- Header `Sign in` navigates to `/sign-in?next=/trips`
- 360px width has no horizontal overflow

The new `visual-refresh.spec.ts` covers the trip cover header at the smoke level. The full visual matrix (mobile + desktop, all trip-card states) is recorded in the spec; it is blocked by the same host limit.

### Visual Screenshots

Screenshots at 360px, 768px, 1024px, and 1440px for `/`, `/trips`, and `/trips/[tripId]` are deferred because the headless browser is unavailable on this host. They will be captured in a follow-up environment that supports Playwright. The HTML smoke above confirms the new content and tokens are present at the markup level.

## Story Verification

```bash
scripts/bin/harness-cli story update --id US-RF-015 \
  --status implemented \
  --unit 1 --integration 1 --e2e 0 --platform 0 \
  --verify "pnpm --dir apps/web test:e2e -- visual-refresh.spec.ts"
```

`story verify US-RF-015` will pass once the host supports Playwright chromium. Today the verify command itself runs but the browser install fails, so the e2e proof is recorded as `no` with the same host-limit reason as US-RF-014.

## Friction Log

- `playwright install chromium` and `playwright install webkit` both fail on this host: `Playwright does not support chromium on ubuntu26.04-x64` (and same for webkit). The E2E spec is in place and will run in a supported environment. `apt-get install chromium-browser` is blocked by sandbox (`/var/lib/dpkg/lock-frontend` is not writable). `puppeteer` install also fails because it depends on a downloadable browser. There is no system Chrome/Firefox/Chromium on the host. Screenshots are documented as deferred.
- `next lint` is deprecated in Next 15 and prompted for an interactive config. We added `apps/web/.eslintrc.json` with `extends: next/core-web-vitals` so `pnpm lint` runs non-interactively. This surfaced a pre-existing `react/display-name` error in `members-panel.tsx:136`; refactored that one function into a named function. Build now passes with lint.
- The first hero photo (`photo-1502602898657-3e91760cbb34`, Eiffel Tower at night) was the wrong aesthetic for a forest-green travel app. Swapped to `photo-1441974231531-c6227db76b6e` (forest canopy). Logged in the polish pass above.
- Tailwind purging was a non-issue because the new tokens (`forest-900/700/500`, `mint-400`, `amber-400`, `cream-50`, `shadow-rideflow-card*`, animations) are all referenced by string in the new components.
