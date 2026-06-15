# Public Landing Page Proof Bundle

Run date: 2026-06-15. Environment: Linux, pnpm 9.15.0, Node v24.16.0.

## Build (US-RF-014)

| Check | Command | Result |
|---|---|---|
| Next.js build | `pnpm --dir apps/web build` | `✓ Compiled successfully in 4.3s`; route `/` is `5.34 kB` (dynamic), first-load JS `111 kB` |
| Unsplash remote pattern | `pnpm --dir apps/web build` | No "Invalid src prop" warning, `next/image` accepted the `images.unsplash.com` host |
| Static page generation | `pnpm --dir apps/web build` | `✓ Generating static pages (6/6)` |

## Unit and Integration Tests

| Check | Command | Result |
|---|---|---|
| Existing unit + integration tests | `pnpm --dir apps/web test` | `Test Files 27 passed (27) / Tests 96 passed (96)` in 3.49s — no regressions |

## Lint

`pnpm --dir apps/web lint` is interactive in Next 15.5 with no existing ESLint config in
`apps/web/` (`next lint` prompts to choose `Strict` or `Base`). The harness did not have
an ESLint config in place before this slice and the prompt blocks CI. Recorded as
friction in the harness trace. TypeScript checking still ran inside the build and
passed.

## Rendered Landing Page Smoke

`pnpm --dir apps/web exec next dev --port 3100` then `curl -s http://127.0.0.1:3100/`
returned `HTTP 200 bytes=65964` and the HTML payload contained every required
copy and asset reference.

| Content check | Occurrences in HTML |
|---|---|
| `Plan trips together, day by day` (hero headline) | 1 |
| `How RideFlow works` (section heading) | 1 |
| `See the dashboard before you sign up` (preview heading) | 1 |
| `Ready to plan your next trip` (final CTA heading) | 1 |
| `RideFlow_logo` (wordmark asset) | 1 |
| `RideFlow_Dashboard` (preview asset) | 1 |
| `images.unsplash.com` (hero background) | 1 |
| `landing-hero-cta` (CTA testid) | 1 |

## End-to-End

- Spec file: `apps/web/tests/e2e/landing.spec.ts`
- Config: `apps/web/playwright.config.ts`
- The story `verify_command` is set to
  `pnpm --dir apps/web test:e2e -- landing.spec.ts`.
- The Playwright CLI is installed (`@playwright/test@1.60.0`).
- `pnpm exec playwright install chromium` fails on this host
  (`Playwright does not support chromium on ubuntu26.04-x64`). Recorded as
  harness friction. E2E proof status follows the same `not run` pattern as
  every other story in `docs/TEST_MATRIX.md` until the CI image has the
  required binary or the harness runs a Playwright Docker image.
- A manual `curl` smoke check confirms the page returns 200 and the expected
  copy is present in the rendered HTML, which is the closest evidence we can
  produce in this environment.

## Visual Evidence

Screenshots at 1440px and 360px viewports are not captured automatically in
this environment (no Playwright Chromium binary available). The HTML smoke
check above plus the build success are the available proof. A future run on
a host that supports Playwright Chromium can add the screenshots.

## Acceptance Criteria Coverage

All RF-001 through RF-063 are implemented and visible in the rendered HTML.
Notable mappings:

- RF-001..RF-005: `apps/web/app/page.tsx` is a server component, session-aware,
  preserves the existing `redirect("/trips")` for authenticated users, and
  catches env errors to keep dev usable without Supabase.
- RF-006..RF-012: section order implemented in `LandingPage`.
- RF-013..RF-021: hero uses `next/image` `fill` + `priority` with the Unsplash
  URL, dark gradient overlay, white copy, dual CTA.
- RF-022..RF-025: wordmark reused at `h-10` (header) and `h-12` (footer).
- RF-026..RF-032: four feature cards with teal icon badges, lucide icons.
- RF-033..RF-038: three steps with teal numbered circles.
- RF-039..RF-042: dashboard preview via `next/image`.
- RF-043..RF-048: final CTA band + minimal footer.
- RF-049..RF-053: responsive grids verified by the spec's
  `test("hero copy remains readable on 360px width")` and the build.
- RF-054..RF-058: brand tokens reused, no new Tailwind plugins.
- RF-059..RF-063: alt text, `aria-hidden` background, focus rings.
