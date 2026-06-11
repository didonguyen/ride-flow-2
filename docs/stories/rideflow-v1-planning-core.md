# RideFlow V1 Planning Core

Lane: high-risk

## Summary

Build the first RideFlow product slice in this repo: collaborative trip planning with auth, roles, timeline editing, place search, near-realtime sync, and AI draft generation.

## Product Docs

- `docs/product/rideflow-v1.md`
- `docs/superpowers/specs/2026-06-11-rideflow-v1-planning-core-design.md`

## Acceptance Criteria

- A user can sign up, sign in, and create a trip.
- A trip creates one day per date in the selected date range.
- An Owner can invite members and assign Owner, Planner, or Viewer access.
- Owner and Planner can create, edit, drag, and delete timeline items.
- Viewer cannot mutate planning data.
- Owner and Planner can search places from seed data, OpenStreetMap, and manual fallback.
- Pinned places persist as timeline item snapshots.
- Owner and Planner can generate, preview, and apply an AI draft.
- Open trip pages receive near-realtime timeline updates.
- The app passes unit, integration, and E2E happy-path tests.

## Proof

- Unit: `pnpm --dir apps/web test tests/domain`
- Integration: `pnpm --dir apps/web test tests/application tests/infrastructure`
- E2E: `pnpm --dir apps/web test:e2e`
- Build: `pnpm build`
