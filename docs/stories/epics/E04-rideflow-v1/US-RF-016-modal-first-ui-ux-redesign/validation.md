# Validation

## Proof Strategy

Prove that modal-first flows work without weakening existing auth and trip creation behavior. Keep fallback routes verified so direct links and error redirects remain safe.

## Test Plan

| Layer | Cases |
| --- | --- |
| Unit | Button/input/dialog rendering where practical; existing auth and create-trip tests still pass. |
| Integration | `auth-actions`, `create-trip-action`, Supabase repository tests still pass. |
| E2E | Landing sign-in modal, landing sign-up modal, modal switching, close/focus restore, fallback auth pages, dashboard create-trip modal, fallback `/trips/new`, mobile no-overflow. |
| Platform | Next build, lint, unit tests, targeted Playwright. |
| Performance | No new animation library or large dependency. |
| Logs/Audit | No new audit behavior. |

## Fixtures

- Anonymous browser context for `/`, `/sign-in`, and `/sign-up`.
- Authenticated browser context for `/trips` and `/trips/new`.
- Existing Supabase local or mocked auth/session setup used by current e2e harness.

## Commands

```bash
pnpm --dir apps/web test
pnpm --dir apps/web lint
pnpm --dir apps/web build
pnpm --dir apps/web test:e2e -- modal-first-ui.spec.ts
```

## Acceptance Evidence

Add results after implementation.
