# US-RF-002 Auth & Supabase Foundation

## Status

implemented

## Lane

high-risk

## Product Contract

Supabase Postgres + Auth + RLS form the durable layer for ride-flow. The auth shell
exposes `/sign-in` and `/sign-up` with server actions, environment parsing through
Zod, Supabase clients (browser + server) wired via `@supabase/ssr`. RLS policies
enforce trip membership and role at the database, not only at the UI.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 002 + RF-001 + SR-001..SR-008)
- `docs/specs/001-rideflow-v1/plan.md` (Task 5, 6)
- `docs/specs/001-rideflow-v1/tasks.md` (rows 5-6)
- `supabase/migrations/202606110001_rideflow_v1_init.sql`

## Acceptance Criteria

- Migration `202606110001_rideflow_v1_init.sql` covers all tables: `profiles`, `trips`,
  `trip_members`, `trip_days`, `timeline_items`, `ai_draft_runs`, with RLS enabled and a
  policy per table that matches the permission matrix.
- Helper SQL: `is_trip_member(trip_id, roles[])` declared `security definer`.
- `accept_trip_invite(trip_id)` RPC transitions pending → accepted when the current
  user matches the invited email.
- `apps/web/src/infrastructure/supabase/{client,server,database.types}.ts` exist.
- `apps/web/src/application/auth/actions.ts` exposes `signInAction`, `signUpAction` with
  a redirect normalizer that only accepts paths starting with `/` (never `//`).
- `apps/web/app/(auth)/{sign-in,sign-up}/page.tsx` provide email/password forms.
- Env schema (Zod) parses `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `OPENAI_API_KEY?`, `OPENAI_MODEL`, `OSM_NOMINATIM_BASE_URL`.

## Design Notes

- Commands: `supabase start`, `supabase db reset`, `pnpm --dir apps/web test tests/infrastructure/schema-contract`.
- Use `@supabase/ssr` for both browser and server clients (cookie-based session).
- RLS: `is_trip_member(target_trip_id, allowed_roles[])` drives SELECT; INSERT/UPDATE/DELETE
  are role-scoped — owner-only for trips/members mutations, owner+planner for timeline_items
  mutations.
- `accept_trip_invite` is a regular RPC, not service role, since it only needs the current
  user to match the email.
- Auth layer uses server actions, not client-side fetch.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `pnpm --dir apps/web test tests/infrastructure/schema-contract` → 5 pass |
| Integration | `pnpm --dir apps/web test tests/application/auth-actions` → 4 pass |
| E2E | Not run; planned in US-RF-009 (auth flow + protected page) |
| Platform | Supabase local stack + `supabase db reset` (CI only; local CLI not in PATH) |
| Release | Not applicable |

## Harness Delta

- No change to Harness policy. Migration SQL is ride-flow product data; it does not touch
  the Harness `scripts/schema/00*` schema.

## Evidence

- Migration file: `supabase/migrations/202606110001_rideflow_v1_init.sql` (290 lines, contains 6 tables + 13 RLS policies)
- `apps/web/src/infrastructure/supabase/{client,server,database.types}.ts` present
- `apps/web/src/application/auth/actions.ts` exposes `signInAction`, `signUpAction`, `normalizeAuthRedirect`
- Tests: 5 schema-contract pass, 4 auth-actions pass (proof.md "Supabase Schema + Auth Shell")
- Git: `86568d7` (schema), `a1dbf03` (harden), `ab70915` (auth shell), `59a786b` (gitignore)
- **Open merge**: worktree `codex/rideflow-v1-app-shell-dashboard` carries `363da1b chore:provision-rideflow-v2-supabase`
  and `923c204 feat: wire rideflow planning core` that have not merged into main. Re-verify
  RLS + Auth after that merge.

## Risk gates (high-risk)

- Auth (RF-001, SR-001, SR-004)
- Data model + migration
- RLS as durable enforcement
- Permission matrix in DB (not just UI)

Requires human confirmation before changing the permission matrix, RLS policy shape,
or any schema column.
