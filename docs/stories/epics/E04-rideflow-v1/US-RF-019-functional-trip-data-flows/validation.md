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
- Two trip-level memories with three image assets.
- Two expenses with participants and split shares.

## Commands

```text
pnpm --dir apps/web test
pnpm --dir apps/web build
```

## Acceptance Evidence

- `git diff --check` passed after normalizing edited files.
- Focused WSL test/typecheck attempts were blocked by the local runtime:
  - `./node_modules/.bin/tsc --noEmit` failed with `exec: node: not found`.
  - `./node_modules/.bin/vitest run ...` failed with `exec: node: not found`.
  - Bundled Windows Node fallback could not resolve WSL/UNC pnpm package paths.
- Implementation commits:
  - `ff99e35 feat: add functional trip data schema`
  - `23fe43f feat: add memory and expense domain rules`
  - `0128fa3 feat: add functional trip repositories`
  - `066158c feat: add trip cover and transport flow`
  - `36bd482 feat: wire planning day and stop actions`
  - `5eae830 feat: wire trip memories crud surface`
  - `610df58 feat: wire trip expenses crud flow`