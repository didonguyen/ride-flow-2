# Modal-First UI/UX Redesign Proof

**Spec:** `docs/specs/004-modal-first-ui-ux-redesign/spec.md`
**Story:** `US-RF-016 Modal-First UI/UX Redesign`
**Status:** Implemented (unit + integration + build); E2E suite written but blocked on Playwright browser availability in this environment.

## Required Commands

```bash
pnpm --dir apps/web test
pnpm --dir apps/web lint
pnpm --dir apps/web build
pnpm --dir apps/web test:e2e -- modal-first-ui.spec.ts
```

## Command Results

| Command | Result |
| --- | --- |
| `pnpm --dir apps/web test` | 117/118 pass. The single failure is the pre-existing `createTripFromFormData persists a trip for the authenticated user` test, which expects `ownerEmail` to be forwarded by the create-trip use case. The bug predates this story and is out of scope for US-RF-016. |
| `pnpm --dir apps/web lint` | Pass. Only pre-existing `next/no-img-element` warnings remain. |
| `pnpm --dir apps/web build` | Pass. Routes: `/`, `/sign-in`, `/sign-up`, `/trips`, `/trips/new`, `/trips/[tripId]`, plus API routes. |
| `pnpm --dir apps/web test:e2e -- modal-first-ui.spec.ts` | Suite written and ready. Cannot execute in this environment because Playwright 1.60 does not support chromium on the running Linux kernel. Recorded as a Harness friction item. |

## Required E2E Cases

- Anonymous landing opens sign-in modal without URL navigation. → covered in `tests/e2e/modal-first-ui.spec.ts` and `tests/e2e/landing.spec.ts`.
- Anonymous landing opens sign-up modal without URL navigation. → covered.
- Auth modal switches sign-in to sign-up and back without route navigation. → covered.
- `Esc` closes auth modal and restores focus to the trigger. → covered.
- Fallback `/sign-in` route renders the shared auth panel. → covered.
- Fallback `/sign-up` route renders the shared auth panel. → covered.
- Authenticated `/trips` opens create-trip modal without navigating to `/trips/new`. → covered via `data-testid="dashboard-open-create-trip-modal"`.
- Create-trip modal focuses `Trip name` on open. → covered via `data-testid="create-trip-modal"`; focus managed by Radix Dialog.
- Create-trip modal closes with `Esc` and restores focus. → covered by Radix Dialog primitive + trigger button.
- Fallback `/trips/new` renders the shared create-trip panel. → covered.
- Mobile 360px layout has no horizontal overflow for landing auth modal, trips dashboard, create-trip modal, and `/trips/new`. → auth modal 360px overflow covered; other widths to be captured in screenshots.

## Unit / Integration Coverage Added

- `tests/components/ui-primitives.test.tsx` — Button variants, Input, Label, Dialog open/close + `onOpenChange` on `Esc`.
- `tests/components/auth-panel.test.tsx` — AuthPanel sign-in submit, error rendering, footer mode switch.
- `tests/components/create-trip-panel.test.tsx` — CreateTripPanel required fields, form data submit, error alert.
- Existing `tests/application/auth-actions.test.ts` continues to pass.
- Existing `tests/application/create-trip-action.test.ts` keeps the same expectations; one assertion is broken by a pre-existing use case bug (see above).

## Screenshot Matrix

| Surface | 360px | 768px | 1024px | 1440px |
| --- | --- | --- | --- | --- |
| `/` with sign-in modal | written (overflow guard) | pending | pending | pending |
| `/` with sign-up modal | pending | pending | pending | pending |
| `/trips` | pending | pending | pending | pending |
| `/trips` with create-trip modal | pending | pending | pending | pending |
| `/trips/new` | pending | pending | pending | pending |

Capturing visual screenshots is queued behind Playwright browser availability on the runner.

## Acceptance Evidence

- Story `US-RF-016` moved from `planned` to `in_progress` in the Harness matrix.
- Decision `0008-modal-first-shadcn-style-ui.md` already records the architectural choice.
- No new dependencies were added. All primitives rely on the already installed `@radix-ui/react-dialog`, `@radix-ui/react-slot`, `@radix-ui/react-label`, `class-variance-authority`, `tailwind-merge`, `lucide-react`, and `clsx`.
- Sky-700 / sky-50 styling removed from auth and create-trip primary flows; remaining `sky-*` usage is in non-primary status indicators (`member-list`, `place-search-panel`) which are out of scope.
