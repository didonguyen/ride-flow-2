# Modal-First UI/UX Redesign: Implementation Plan

**Spec:** `docs/specs/004-modal-first-ui-ux-redesign/spec.md`
**Lane:** high-risk (hard gate: auth; risk flags: existing behavior, public contracts, cross-platform, weak proof)
**Primary surface:** `apps/web`

## Architecture Decisions

- **Shared primitives first.** Build shadcn-like primitives under `apps/web/components/ui/` before redesigning surfaces. This creates one consistent API for buttons, inputs, labels, cards, alerts, and dialogs.
- **Radix Dialog, no new library.** The repo already depends on `@radix-ui/react-dialog`, `@radix-ui/react-slot`, `class-variance-authority`, `tailwind-merge`, and `lucide-react`. Use those directly instead of adding a component package.
- **Panels shared by modal and fallback routes.** Auth and create-trip forms become reusable panel components. Modal flows and fallback pages render the same form body so validation, accessibility, and copy cannot drift.
- **Behavior preservation.** Existing server actions, redirect normalizer, Supabase profile creation, trip creation use case, auth gates, and route fallbacks remain intact.
- **Progressive enhancement.** Modals are the primary JavaScript-enabled UX. `/sign-in`, `/sign-up`, and `/trips/new` stay as reliable fallback URLs.

## File-by-File Plan

### 1. Shared UI primitives

Create:

- `apps/web/components/ui/button.tsx`
- `apps/web/components/ui/input.tsx`
- `apps/web/components/ui/label.tsx`
- `apps/web/components/ui/card.tsx`
- `apps/web/components/ui/alert.tsx`
- `apps/web/components/ui/dialog.tsx`

Modify:

- `apps/web/app/globals.css`
- `apps/web/tailwind.config.ts` if tokens or animation helpers are missing.

Responsibilities:

- Keep component APIs close to shadcn conventions.
- Use RideFlow forest/mint tokens as the primary theme.
- Keep controls compact, accessible, and predictable.

### 2. Auth panel extraction

Create:

- `apps/web/components/auth/auth-panel.tsx`
- `apps/web/components/auth/auth-modal.tsx`

Modify:

- `apps/web/components/auth/auth-form.tsx`
- `apps/web/app/(auth)/sign-in/page.tsx`
- `apps/web/app/(auth)/sign-up/page.tsx`
- `apps/web/components/landing/landing-header.tsx`
- `apps/web/components/landing/landing-page.tsx` if a client wrapper is needed.

Responsibilities:

- Share the same fields between modal and fallback routes.
- Preserve `next=/trips` and existing server actions.
- Allow sign-in/sign-up switching inside a modal without navigation.
- Keep fallback links for no-JavaScript and direct route usage.

### 3. Create-trip panel extraction

Create:

- `apps/web/components/trips/create-trip-panel.tsx`
- `apps/web/components/trips/create-trip-modal.tsx`

Modify:

- `apps/web/components/trips/new-trip-form.tsx`
- `apps/web/components/trips/trip-card.tsx`
- `apps/web/app/(app)/trips/page.tsx`
- `apps/web/app/(app)/trips/new/page.tsx`

Responsibilities:

- Share one create-trip body between modal and fallback page.
- Keep fields and action names unchanged.
- Render validation errors in the panel.
- Preserve redirect to `/trips/{tripId}` after success.

### 4. App-wide polish

Modify:

- `apps/web/components/app/app-shell.tsx`
- `apps/web/components/landing/*`
- `apps/web/components/trips/trip-card.tsx`
- Existing planning shell components only where shared focus, button, input, or card standards apply without changing feature behavior.

Responsibilities:

- Replace one-off button/input/card styles with shared primitives.
- Remove old primary `sky-*` styling from primary flows.
- Preserve the image-led forest-green aesthetic from `003-visual-refresh-green`.

### 5. Tests and proof

Create or modify:

- `apps/web/tests/application/auth-actions.test.ts`
- `apps/web/tests/application/create-trip-action.test.ts`
- `apps/web/tests/e2e/modal-first-ui.spec.ts`
- `docs/specs/004-modal-first-ui-ux-redesign/proof.md`
- `docs/stories/epics/E04-rideflow-v1/US-RF-016-modal-first-ui-ux-redesign/validation.md`

Required commands:

```bash
pnpm --dir apps/web test
pnpm --dir apps/web lint
pnpm --dir apps/web build
pnpm --dir apps/web test:e2e -- modal-first-ui.spec.ts
```

## Implementation Phases

1. Write failing tests for shared primitives, auth fallback rendering, and create-trip fallback rendering.
2. Add UI primitives and make tests pass.
3. Extract auth panel and preserve fallback routes.
4. Add landing auth modal and e2e tests for modal open, close, switch, and submit.
5. Extract create-trip panel and preserve `/trips/new`.
6. Add dashboard create-trip modal and e2e tests.
7. Apply app-wide polish using shared primitives.
8. Run full validation and capture screenshots.
9. Update Harness story status, proof, matrix, and trace.

## Stop Conditions

Pause before implementation if:

- Auth redirect behavior would need to change.
- Server actions cannot show modal errors without changing redirect semantics.
- Trip creation requires a new API route.
- Any RLS, schema, session, or permission behavior needs to change.
- A new dependency is required.
