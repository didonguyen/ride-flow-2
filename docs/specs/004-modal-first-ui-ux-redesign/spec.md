# Feature Specification: Modal-First UI/UX Redesign

**Feature ID:** 004-modal-first-ui-ux-redesign
**Status:** Draft, awaiting sign-off
**Created:** 2026-06-18
**Owner:** RideFlow product
**Primary implementation surface:** `apps/web`
**Source story:** `US-RF-016 Modal-First UI/UX Redesign` (planned, intake #6, lane: high-risk)
**Extends:** `docs/specs/001-rideflow-v1/spec.md`, `docs/specs/003-visual-refresh-green/spec.md`
**Supersedes visual direction of:** current standalone auth pages and standalone create-trip page as primary user journeys. The routes remain as fallback and deep-link surfaces.

## Source Material

- User prompt (2026-06-18): redesign the current working UI and UX strongly, keep current flows, show login and signup in modals on the home page instead of navigating, create a reusable modal based on a shadcn-like standard, open new-trip creation in a modal, apply shared shadcn-style components while preserving the primary color, and allow wireframe changes when better.
- `docs/product/rideflow-v1.md` (product contract).
- `docs/stories/epics/E04-rideflow-v1/US-RF-002-auth-supabase.md` (auth foundation).
- `docs/stories/epics/E04-rideflow-v1/US-RF-003-create-trip.md` (create-trip flow).
- `docs/stories/epics/E04-rideflow-v1/US-RF-015-visual-refresh-green.md` (current visual refresh contract).
- Existing files reviewed: `apps/web/app/page.tsx`, `apps/web/components/landing/landing-header.tsx`, `apps/web/components/auth/auth-form.tsx`, `apps/web/app/(auth)/sign-in/page.tsx`, `apps/web/app/(auth)/sign-up/page.tsx`, `apps/web/app/(app)/trips/page.tsx`, `apps/web/app/(app)/trips/new/page.tsx`, `apps/web/components/trips/new-trip-form.tsx`, `apps/web/components/trips/trip-card.tsx`, `apps/web/app/globals.css`, `apps/web/package.json`.

## Scope

This spec changes the primary UX for existing working features. It does not add new auth providers, database schema, permissions, or trip creation rules.

In scope:

- A shared shadcn-like design system layer for buttons, inputs, labels, form messages, cards, and dialog/modal surfaces.
- A shared modal wrapper based on the existing `@radix-ui/react-dialog` dependency and RideFlow tokens.
- Landing header actions that open sign-in and sign-up modals on `/` without route navigation.
- Auth modal content that reuses the existing `signInAction`, `signUpAction`, `normalizeAuthRedirect`, error handling, and `next=/trips` redirect contract.
- `/sign-in` and `/sign-up` retained as fallback routes, but visually migrated to the same shared auth panel.
- `/trips` create-trip CTA opens a modal instead of navigating to `/trips/new` for the normal dashboard flow.
- `/trips/new` retained as fallback and no-JavaScript/deep-link route, but visually migrated to the same shared create-trip panel.
- A stronger app-wide UI/UX refresh across landing, auth, trips dashboard, trip creation, and existing shell components that preserves the forest/primary palette introduced in `003-visual-refresh-green`.
- Focus management, keyboard close, accessible labels, scroll locking, mobile sheet-like layout, and responsive screenshots.

Out of scope:

- New Supabase auth method, OAuth, password reset, email verification UX, or session persistence changes.
- RLS, table, migration, role, or authorization changes.
- Changing trip creation fields or validation rules.
- Removing `/sign-in`, `/sign-up`, or `/trips/new`.
- Building new Memories, Expenses, AI, Members, or Place Search behavior.
- Introducing a new component library package beyond the already installed Radix primitives, `class-variance-authority`, `tailwind-merge`, and `lucide-react`.
- Dark mode.

## Product Summary

RideFlow V1 already supports email/password auth, an authenticated trips dashboard, and trip creation. The current UX moves users to standalone pages for sign in, sign up, and new trip creation. That navigation is functional, but it breaks the feeling of a modern planning workspace: anonymous visitors lose the landing context, and authenticated users leave the dashboard just to create a trip.

This redesign makes modal interaction the primary path. Visitors stay on the home page while authenticating. Authenticated users stay on the trips dashboard while creating a trip. The same server actions and redirect contracts remain in place, so the product behavior is preserved while the interaction model becomes faster and more polished.

## Goals

- **G-001 Modal-first auth.** Landing page `Sign in` and `Get started` actions open accessible modals on `/`.
- **G-002 Modal-first trip creation.** Dashboard `New trip` opens an accessible modal on `/trips`.
- **G-003 Shared component standard.** Buttons, inputs, labels, field errors, cards, and dialogs use one shadcn-like API and one token system.
- **G-004 Preserve primary color.** Existing RideFlow primary identity remains forest/mint based; old `slate/sky` auth and form styling is removed from primary flows.
- **G-005 Keep current behavior.** Existing server actions, validation errors, redirect normalizer, auth gates, and trip creation use case stay intact.
- **G-006 Better responsive UX.** Modals behave like centered dialogs on desktop and bottom sheets on mobile without text clipping or horizontal overflow.
- **G-007 Clear proof.** Unit, integration, e2e, and visual proof cover both modal primary paths and fallback routes.

## Non-Goals

- **NG-001** No schema changes.
- **NG-002** No permission matrix changes.
- **NG-003** No new route contract except optional query-param state for opening modals.
- **NG-004** No new payment, invite, AI, map, or place-search behavior.
- **NG-005** No dependency on shadcn CLI at runtime. The implementation may follow shadcn patterns manually using the dependencies already present.

## User Roles

| Surface | Anonymous | Authenticated | Notes |
| --- | --- | --- | --- |
| `/` | Sees landing and can open sign-in/sign-up modals. | Redirected to `/trips`. | Existing authenticated redirect remains. |
| `/sign-in` | Sees fallback sign-in page using shared auth panel. | May be redirected by the action after success. | Kept for deep links and error redirects. |
| `/sign-up` | Sees fallback sign-up page using shared auth panel. | May be redirected by the action after success. | Kept for deep links and error redirects. |
| `/trips` | Redirected to `/sign-in?next=/trips`. | Sees trips dashboard and can open create-trip modal. | Existing auth gate remains. |
| `/trips/new` | Redirected to `/sign-in?next=/trips/new`. | Sees fallback create-trip page using shared create-trip panel. | Kept for no-JS/deep-link fallback. |

## UX Contract

### Auth Modal Behavior

1. Anonymous visitor opens `/`.
2. Visitor clicks `Sign in`.
3. A modal opens over the landing page without navigating away from `/`.
4. Focus moves to the email field.
5. Visitor can close with `Esc`, close button, or overlay click.
6. Visitor can switch to sign-up inside the modal without leaving the landing page.
7. Submitting the form calls the existing server action.
8. On success, the user lands at `/trips`.
9. On error, the fallback route behavior still works and the same message is shown in the shared auth panel.

### Sign-Up Modal Behavior

1. Anonymous visitor opens `/`.
2. Visitor clicks `Get started`.
3. A sign-up modal opens over the landing page.
4. Focus moves to the email field.
5. The footer allows switching to sign in in the same modal.
6. Submitting the form calls `signUpAction`.
7. The `next` hidden field remains `/trips`.

### Create-Trip Modal Behavior

1. Authenticated user opens `/trips`.
2. User clicks the `New trip` CTA.
3. A create-trip modal opens on the dashboard without navigating away.
4. Focus moves to `Trip name`.
5. The form fields remain `name`, `destination`, `startDate`, and `endDate`.
6. Submitting the form calls the same create-trip action path used by `/trips/new`.
7. On success, the user is redirected to `/trips/{tripId}`.
8. On validation error, the message renders inside the modal and the user remains in context.
9. `/trips/new` remains available and renders the same panel full-page.

## Visual Contract

- The primary palette remains forest/mint:
  - `forest-900`: primary dark surface.
  - `forest-700`: primary button and modal accent.
  - `forest-500`: hover/focus supporting tone.
  - `mint-400`: focus ring, accent badges, selected control state.
  - `cream-50`: calm background.
- Dialog radius follows shadcn scale: `rounded-lg` for dialog shell, `rounded-md` for controls.
- Cards use `rounded-lg` unless an existing image-led travel card intentionally uses `rounded-3xl`.
- Form controls use 40px minimum height, clear focus rings, and `aria-invalid` styling.
- Buttons use variants: `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`.
- Icon buttons use lucide icons with accessible labels and no visible helper text.
- Modal layout:
  - Desktop: centered dialog, max width 440px for auth, 640px for create trip.
  - Mobile: bottom sheet style with rounded top corners, full width, max height `calc(100svh - 24px)`, internal scroll.
- Error messages use `role="alert"` and do not shift layout excessively.

## Feature Requirements

### RF-001 Shared UI Foundation

- FR-001: Create shared UI primitives under `apps/web/components/ui/`.
- FR-002: `button.tsx` uses `class-variance-authority`, `cn`, and `@radix-ui/react-slot`.
- FR-003: `input.tsx`, `label.tsx`, `card.tsx`, `alert.tsx`, and `dialog.tsx` expose shadcn-like APIs.
- FR-004: `dialog.tsx` wraps `@radix-ui/react-dialog` and includes overlay, content, header, footer, title, description, close button, and responsive mobile behavior.
- FR-005: No component hardcodes `sky-*` as primary interaction color after this redesign.

### RF-002 Auth Modal Composition

- FR-006: Extract reusable auth panel content so modal and fallback pages share the same fields, submit buttons, errors, footer switching, and hidden `next` field.
- FR-007: Landing `Sign in` opens sign-in modal on `/`.
- FR-008: Landing `Get started` opens sign-up modal on `/`.
- FR-009: Switching between sign-in and sign-up inside the modal does not navigate.
- FR-010: Fallback `/sign-in` and `/sign-up` routes still render and submit successfully.
- FR-011: Existing `normalizeAuthRedirect` protection against unsafe redirects is preserved.
- FR-012: Error state from the existing `error` search param renders in the shared auth panel on fallback pages.

### RF-003 Create-Trip Modal Composition

- FR-013: Extract reusable create-trip panel content shared by `/trips` modal and `/trips/new` fallback page.
- FR-014: `NewTripCard` becomes a modal trigger in the authenticated dashboard primary flow.
- FR-015: `/trips/new` route remains as a fallback page and uses the same panel.
- FR-016: Create-trip validation errors render inside the panel using shared alert/form-message primitives.
- FR-017: The action still ensures a Supabase profile, creates trip days, inserts owner membership, and redirects to `/trips/{tripId}` on success.

### RF-004 App-Wide UX Refresh

- FR-018: Landing, auth, trips dashboard, and create-trip surfaces use the shared component primitives where appropriate.
- FR-019: Existing image-led trip cards remain compatible with the new shared button/card primitives.
- FR-020: The app shell keeps current navigation semantics but receives consistent spacing, focus, and active-state styling.
- FR-021: Primary CTAs use forest/mint tokens, not slate/sky defaults.
- FR-022: Text sizes fit at 360px, 768px, 1024px, and 1440px without overlap.

### RF-005 Accessibility And Platform

- FR-023: Dialogs trap focus while open and restore focus to the trigger on close.
- FR-024: `Esc` closes each modal.
- FR-025: Close buttons have accessible names.
- FR-026: Inputs have labels linked by `htmlFor`.
- FR-027: Alerts use `role="alert"`.
- FR-028: Reduced motion users do not receive large entrance animations.
- FR-029: No horizontal overflow appears at 360px.

## Validation Expectations

| Layer | Required proof |
| --- | --- |
| Unit | Component utility/variant tests for button and form rendering where practical. Existing auth and create-trip tests remain passing. |
| Integration | `auth-actions`, `create-trip-action`, and Supabase repository tests remain passing. |
| E2E | Playwright covers landing auth modals, modal switching, fallback auth pages, dashboard create-trip modal, fallback `/trips/new`, and mobile layout. |
| Platform | `pnpm --dir apps/web build`, `pnpm --dir apps/web test`, `pnpm --dir apps/web lint`, and targeted Playwright pass. |
| Visual | Screenshots at 360px, 768px, 1024px, and 1440px for `/`, auth modal, `/trips`, create-trip modal, and `/trips/new`. |

## Rollout Plan

1. Add shared UI primitives and token cleanup.
2. Extract auth panel and migrate fallback auth pages to shared UI.
3. Add landing auth modal shell and modal state controller.
4. Extract create-trip panel and migrate `/trips/new`.
5. Add dashboard create-trip modal.
6. Apply consistent UI primitives across dashboard and app shell.
7. Add unit/integration/e2e proof.
8. Capture screenshots and update story proof.

## Open Decisions

- Whether modal open state should be reflected in query params such as `/?auth=sign-in` for shareable links. Default for this spec: no query state in the primary flow; fallback routes handle deep links.
- Whether form submission errors in modal flows should redirect back to fallback routes or return inline state. Default for implementation planning: preserve current server-action redirects first, then add inline modal errors only if it does not weaken server action safety.
