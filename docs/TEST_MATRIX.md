# Test Matrix

This file maps product behavior to proof.

RideFlow V1 product behavior is defined in the product contract and should stay
mapped to explicit proof expectations here. Do not mark a row implemented until
tests or validation evidence exist.

## Status Values

| Status | Meaning |
| --- | --- |
| planned | Accepted as intended behavior, not implemented |
| in_progress | Actively being built |
| implemented | Implemented and proof exists |
| changed | Contract changed after earlier implementation |
| retired | No longer part of the product contract |

## Matrix

| Story | Contract | Unit | Integration | E2E | Platform | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RideFlow V1 planning core | Auth, trip creation, roles, timeline, place search, AI draft, realtime sync. Required combined proof command: `pnpm --dir apps/web test && pnpm --dir apps/web test:e2e && pnpm build` | yes | yes | required | not required for browser-only V1 | planned | Domain tests and build passed in temp verification during Task 3 for early tasks; full V1 integration and E2E proof pending. |

## Evidence Rules

- Unit proof covers pure domain and application rules.
- Integration proof covers backend enforcement, data integrity, provider
  behavior, jobs, or service contracts.
- E2E proof covers user-visible browser flows.
- Platform proof covers only shell, deployment, mobile, desktop, or runtime
  behavior that cannot be proven in lower layers.
- A story can be implemented without every proof column if the story packet
  explains why.
