# Overview

## Current Behavior

RideFlow has working email/password auth and trip creation. Anonymous users on the landing page click `Sign in` or `Get started` and navigate to `/sign-in` or `/sign-up`. Authenticated users on `/trips` click the new-trip card and navigate to `/trips/new`.

The current forms use local slate/sky styling instead of the newer forest/mint RideFlow visual language. There is no shared modal abstraction or shadcn-like primitive layer.

## Target Behavior

Auth and create-trip become modal-first flows while preserving fallback routes and existing server actions.

- `/` opens sign-in and sign-up modals without route navigation.
- `/trips` opens create-trip in a modal without route navigation.
- `/sign-in`, `/sign-up`, and `/trips/new` remain available fallback routes.
- Shared UI primitives provide the design standard for controls and modal surfaces.
- Primary colors remain RideFlow forest/mint.

## Affected Users

- Anonymous visitors signing in or signing up from the landing page.
- Authenticated Owners creating a trip from the dashboard.
- Keyboard and mobile users who need accessible dialog behavior.

## Affected Product Docs

- `docs/product/rideflow-v1.md`
- `docs/specs/004-modal-first-ui-ux-redesign/spec.md`
- `docs/specs/004-modal-first-ui-ux-redesign/plan.md`
- `docs/specs/004-modal-first-ui-ux-redesign/tasks.md`
- `docs/specs/004-modal-first-ui-ux-redesign/proof.md`

## Non-Goals

- No auth provider changes.
- No schema, RLS, or permission changes.
- No new trip fields or trip creation rules.
- No removal of fallback auth or create-trip routes.
