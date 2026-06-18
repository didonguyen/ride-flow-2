# 0008 Modal-First Shadcn-Style UI

Date: 2026-06-18

## Status

Proposed

## Context

RideFlow's current auth and create-trip flows are functional but route-first. Users leave the landing page to sign in or sign up, and authenticated users leave the dashboard to create a trip. The UI also mixes older slate/sky form styling with the newer forest/mint RideFlow identity.

The product needs a modern interaction model while preserving current auth, trip creation, route, and Supabase behavior.

## Decision

Adopt a modal-first UI pattern for the primary auth and create-trip flows, backed by shared shadcn-like primitives built in the repo.

- Use existing Radix and utility dependencies instead of adding a new component package.
- Keep `/sign-in`, `/sign-up`, and `/trips/new` as fallback routes.
- Share form panels between modal and fallback routes.
- Preserve RideFlow forest/mint as the primary color system.

## Alternatives Considered

1. Keep standalone pages only.
2. Install generated shadcn components through the CLI.
3. Replace server actions with new client-side API routes for all modal submissions.

## Consequences

Positive:

- Faster primary UX.
- Consistent component API.
- Better accessibility through Radix Dialog.
- Fallback routes remain reliable.

Tradeoffs:

- Modal state adds client-side composition around existing server actions.
- Inline modal errors may need careful handling to avoid changing auth redirect semantics.

## Follow-Up

- Implement `US-RF-016 Modal-First UI/UX Redesign`.
- Verify both modal primary paths and fallback routes before marking the story implemented.
