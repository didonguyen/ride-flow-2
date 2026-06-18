# Exec Plan

## Goal

Redesign RideFlow's current working UI/UX around shared shadcn-like primitives and modal-first auth/create-trip flows while preserving existing behavior.

## Scope

In scope:

- Shared UI primitives.
- Shared modal wrapper.
- Landing auth modals.
- Dashboard create-trip modal.
- Fallback route visual migration.
- App-wide polish using primary RideFlow tokens.
- Unit, integration, e2e, and visual proof.

Out of scope:

- Auth provider changes.
- Schema, RLS, or permission changes.
- Trip creation field or validation changes.
- Removing fallback routes.

## Risk Classification

Risk flags:

- Auth.
- Existing behavior.
- Public contracts.
- Cross-platform.
- Weak proof.

Hard gates:

- Auth.

Lane: high-risk.

## Work Phases

1. Discovery.
2. Shared design-system foundation.
3. Auth modal and fallback route migration.
4. Create-trip modal and fallback route migration.
5. App-wide polish.
6. Verification.
7. Harness update.

## Stop Conditions

Pause for human confirmation if:

- Auth redirect semantics need to change.
- Modal errors require replacing server actions with client fetch or new API routes.
- RLS, schema, or permission behavior needs to change.
- A new dependency is required.
- Validation requirements need to be weakened.
