# Validation

## Proof Strategy

Use TDD for domain/application behavior, then verify integration and rendering
with the existing Vitest suite. Run a build before claiming completion.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Trip create validation excludes budget fields; expense split and balance calculation; memory empty-submission validation; add-day date extension. |
| Integration | Schema contract for new columns/tables; Supabase repository memory CRUD; Supabase repository expense CRUD; planning timeline persistence. |
| E2E | Browser smoke for create trip, add planning day/stop, add memory with images, add/edit/delete expense when host browser support is available. |
| Platform | `pnpm --dir apps/web test`; `pnpm --dir apps/web build`. |
| Performance | No dedicated performance proof for this story. |
| Logs/Audit | Harness trace records files changed, commands run, and friction. |

## Fixtures

- Owner user/profile.
- Three additional trip members or invites.
- One seeded trip with cover image.
- Three trip days.
- Timeline items across multiple days.
- Three memories with image assets.
- Five or six expenses with participants.

## Commands

```text
pnpm --dir apps/web test
pnpm --dir apps/web build
```

## Acceptance Evidence

To be filled after implementation and verification.

