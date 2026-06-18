# Modal-First UI/UX Redesign Tasks

Atomic task table mapping: spec RF -> file -> proof.

| # | Story | Spec Ref | Title | Files (key) | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | US-RF-016 | RF-001 | Add shared button primitive | `apps/web/components/ui/button.tsx`, `apps/web/src/lib/utils.ts` | done | `tests/components/ui-primitives.test.tsx` |
| 2 | US-RF-016 | RF-001 | Add shared input, label, alert, card primitives | `apps/web/components/ui/{input,label,alert,card}.tsx` | done | `tests/components/ui-primitives.test.tsx` |
| 3 | US-RF-016 | RF-001, RF-005 | Add shared responsive dialog primitive | `apps/web/components/ui/dialog.tsx` | done | `tests/components/ui-primitives.test.tsx` |
| 4 | US-RF-016 | RF-002 | Extract shared auth panel | `apps/web/components/auth/auth-panel.tsx` | done | `tests/components/auth-panel.test.tsx` |
| 5 | US-RF-016 | RF-002 | Migrate fallback sign-in/sign-up pages | `apps/web/app/(auth)/sign-in/page.tsx`, `apps/web/app/(auth)/sign-up/page.tsx` | done | E2E fallback tests in `tests/e2e/modal-first-ui.spec.ts` |
| 6 | US-RF-016 | RF-002 | Add landing auth modal controller | `apps/web/components/auth/auth-modal-controller.tsx`, `apps/web/components/landing/landing-header.tsx`, `apps/web/components/landing/landing-cta-trigger.tsx` | done | E2E modal-first tests + updated `tests/e2e/landing.spec.ts` |
| 7 | US-RF-016 | RF-003 | Extract create-trip panel | `apps/web/components/trips/create-trip-panel.tsx` | done | `tests/components/create-trip-panel.test.tsx` |
| 8 | US-RF-016 | RF-003 | Migrate `/trips/new` fallback page | `apps/web/app/(app)/trips/new/page.tsx` | done | E2E fallback test in `tests/e2e/modal-first-ui.spec.ts` |
| 9 | US-RF-016 | RF-003 | Add dashboard create-trip modal | `apps/web/app/(app)/trips/page.tsx`, `apps/web/components/trips/create-trip-modal.tsx`, `apps/web/components/trips/create-trip-modal-controller.tsx`, `apps/web/components/trips/dashboard-create-trip-button.tsx` | done | E2E modal-first tests |
| 10 | US-RF-016 | RF-004 | Apply shared primitives across dashboard and shell | `apps/web/components/app/app-shell.tsx`, `apps/web/components/trips/*` | done | forest-700 active-state, no `bg-[#004853]` left in shell |
| 11 | US-RF-016 | RF-004 | Remove primary `sky-*` styling from primary flows | `apps/web/components/auth/*`, `apps/web/components/trips/*`, fallback pages | done | `grep` for `sky-` in `apps/web/components/auth` and `apps/web/components/trips` returns no results |
| 12 | US-RF-016 | RF-005 | Add modal-first e2e suite | `apps/web/tests/e2e/modal-first-ui.spec.ts`, `apps/web/tests/e2e/landing.spec.ts` | done | E2E suite written; runner blocked on Playwright browser availability (see proof.md) |
| 13 | US-RF-016 | Validation | Run build, lint, unit, and e2e proof | command output | partial | build/lint/unit pass; e2e blocked on browser availability (see proof.md) |
| 14 | US-RF-016 | Harness | Update story, matrix, trace, and decision rows | `docs/stories/epics/E04-rideflow-v1/US-RF-016-modal-first-ui-ux-redesign/*`, Harness CLI | done | `US-RF-016` updated to `in_progress`, decision `0008-modal-first-shadcn-style-ui.md` recorded, trace pending |
