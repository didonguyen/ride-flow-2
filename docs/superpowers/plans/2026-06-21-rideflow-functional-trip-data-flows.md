# RideFlow Functional Trip Data Flows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make RideFlow trip creation, planning, memories, and expenses functional with Supabase-backed data, image support, CRUD, seed records, and verification.

**Architecture:** Keep the existing Next.js App Router, application/domain/repository layering, and editorial UI components. Add focused domain modules for memory and expense rules, extend Supabase repositories and server actions, and keep UI state synchronized by refreshing server data after mutations. Schema changes are additive and protected by RLS.

**Tech Stack:** Next.js 15, React 19, TypeScript, Supabase, Supabase Storage, Vitest, Testing Library, Playwright smoke where available.

---

## File Structure

- Modify `supabase/migrations/202606110001_rideflow_v1_init.sql` only if tests need the baseline contract. Prefer adding a new migration file for additive schema.
- Create `supabase/migrations/202606210001_functional_trip_data_flows.sql` for trip image columns, memory tables, expense tables, RLS, and storage bucket policies.
- Create `supabase/seed.sql` for deterministic local/dev records.
- Modify `apps/web/src/infrastructure/supabase/database.types.ts` manually to include new tables and columns.
- Modify `apps/web/src/infrastructure/supabase/repositories.ts` to add trip image update, day creation, timeline update, memory CRUD, expense CRUD, and storage helpers where a repository abstraction is useful.
- Create `apps/web/src/domain/expenses.ts` for split and balance calculations.
- Create `apps/web/src/domain/memories.ts` for memory validation.
- Create `apps/web/src/application/trips/memory-actions.ts` and `apps/web/src/application/trips/expense-actions.ts` for server-action parsing.
- Modify `apps/web/src/application/trips/types.ts`, `create-trip.ts`, and `create-trip-action.ts` for cover image and transport.
- Modify `apps/web/src/application/trips/supabase-planning-data.ts` and `planning-workspace-state.ts` for all-day planning state.
- Modify `apps/web/app/(app)/trips/[tripId]/page.tsx`, `memories/page.tsx`, and `expenses/page.tsx` to load real data and pass actions.
- Modify `apps/web/components/trips/create-trip-panel.tsx`, `planning-surface.tsx`, `memories-surface.tsx`, and `expenses-surface.tsx`.
- Add focused tests under `apps/web/tests/domain`, `apps/web/tests/application`, `apps/web/tests/components`, and `apps/web/tests/infrastructure`.

## Task 1: Schema Contract And Migration

**Files:**
- Create: `supabase/migrations/202606210001_functional_trip_data_flows.sql`
- Modify: `apps/web/tests/infrastructure/schema-contract.test.ts`
- Modify: `apps/web/src/infrastructure/supabase/database.types.ts`

- [ ] **Step 1: Write failing schema contract tests**

Add assertions that the schema contains:

```ts
expect(schema).toContain("cover_image_url text");
expect(schema).toContain("cover_image_path text");
expect(schema).toContain("transport text not null default 'Motorcycle'");
expect(schema).toContain("create table public.memory_entries");
expect(schema).toContain("create table public.memory_assets");
expect(schema).toContain("create table public.expense_entries");
expect(schema).toContain("create table public.expense_participants");
expect(schema).not.toContain("budget_currency");
```

- [ ] **Step 2: Run schema test to verify it fails**

Run: `pnpm --dir apps/web test tests/infrastructure/schema-contract.test.ts`

Expected: fails because the new migration/table SQL does not exist yet.

- [ ] **Step 3: Add additive migration**

Create SQL with:

```sql
alter table public.trips
  add column if not exists cover_image_url text,
  add column if not exists cover_image_path text,
  add column if not exists transport text not null default 'Motorcycle';

create table if not exists public.memory_entries (...);
create table if not exists public.memory_assets (...);
create table if not exists public.expense_entries (...);
create table if not exists public.expense_participants (...);

alter table public.memory_entries enable row level security;
alter table public.memory_assets enable row level security;
alter table public.expense_entries enable row level security;
alter table public.expense_participants enable row level security;
```

Add RLS policies matching the approved spec. Add `touch_updated_at` triggers for mutable tables. Add storage bucket insert and `storage.objects` policies for `rideflow-trip-images`.

- [ ] **Step 4: Update manual database TypeScript types**

Add new trip fields, tables, and insert/update types to `database.types.ts`.

- [ ] **Step 5: Run schema test to verify it passes**

Run: `pnpm --dir apps/web test tests/infrastructure/schema-contract.test.ts`

Expected: passes.

## Task 2: Domain Rules For Memories And Expenses

**Files:**
- Create: `apps/web/src/domain/memories.ts`
- Create: `apps/web/src/domain/expenses.ts`
- Create: `apps/web/tests/domain/memories.test.ts`
- Create: `apps/web/tests/domain/expenses.test.ts`

- [ ] **Step 1: Write failing memory validation tests**

Cover title-only, content-only, image-only, mixed, and fully empty memory drafts.

- [ ] **Step 2: Run memory tests to verify they fail**

Run: `pnpm --dir apps/web test tests/domain/memories.test.ts`

Expected: module not found or function not defined.

- [ ] **Step 3: Implement memory validation**

Expose `validateMemoryDraft({ title, content, imageCount })` returning existing `Result` style errors: `memory_empty`.

- [ ] **Step 4: Write failing expense split and balance tests**

Cover equal split with remainder cents, single participant, no participants, and member balance aggregation.

- [ ] **Step 5: Run expense tests to verify they fail**

Run: `pnpm --dir apps/web test tests/domain/expenses.test.ts`

Expected: module not found or function not defined.

- [ ] **Step 6: Implement expense domain helpers**

Expose:

```ts
splitExpenseEqually({ amount, participantIds }): Array<{ memberId: string; shareAmount: number }>
calculateExpenseBalances({ members, expenses }): Array<{ memberId: string; amount: number; tone: "gets" | "owes" }>
```

- [ ] **Step 7: Run domain tests**

Run: `pnpm --dir apps/web test tests/domain/memories.test.ts tests/domain/expenses.test.ts`

Expected: passes.

## Task 3: Application Types And Supabase Repositories

**Files:**
- Modify: `apps/web/src/application/trips/types.ts`
- Modify: `apps/web/src/infrastructure/supabase/repositories.ts`
- Create: `apps/web/tests/infrastructure/supabase-memory-expense-repositories.test.ts`
- Modify: `apps/web/tests/infrastructure/supabase-repositories.test.ts`

- [ ] **Step 1: Write failing repository tests**

Use existing fake Supabase query patterns to verify:

- `createTripWithDays` sends `cover_image_url`, `cover_image_path`, and `transport`.
- memory repository inserts entries and assets.
- expense repository inserts expense and participant shares.
- expense update replaces participant shares.
- timeline repository can update title, notes, time, and place columns.

- [ ] **Step 2: Run repository tests to verify they fail**

Run: `pnpm --dir apps/web test tests/infrastructure/supabase-memory-expense-repositories.test.ts tests/infrastructure/supabase-repositories.test.ts`

Expected: missing methods or missing payload fields.

- [ ] **Step 3: Implement repository interfaces and methods**

Add focused repository types and concrete functions:

- `createSupabaseMemoryRepository`
- `createSupabaseExpenseRepository`
- `createSupabaseTripDayRepository`
- extend `createSupabaseTimelineRepository`

- [ ] **Step 4: Run repository tests**

Run: `pnpm --dir apps/web test tests/infrastructure/supabase-memory-expense-repositories.test.ts tests/infrastructure/supabase-repositories.test.ts`

Expected: passes.

## Task 4: Create Trip Cover Image And Transport

**Files:**
- Modify: `apps/web/src/application/trips/types.ts`
- Modify: `apps/web/src/application/trips/create-trip.ts`
- Modify: `apps/web/src/application/trips/create-trip-action.ts`
- Modify: `apps/web/src/application/trips/create-trip-action-server.ts`
- Modify: `apps/web/components/trips/create-trip-panel.tsx`
- Modify: `apps/web/tests/application/create-trip.test.ts`
- Modify: `apps/web/tests/application/create-trip-action.test.ts`
- Modify: `apps/web/tests/components/create-trip-panel.test.tsx`

- [ ] **Step 1: Write failing tests**

Assert create-trip input accepts `transport`, never accepts budget fields, and the panel renders transport and cover image inputs with no budget inputs.

- [ ] **Step 2: Run focused tests to verify they fail**

Run: `pnpm --dir apps/web test tests/application/create-trip.test.ts tests/application/create-trip-action.test.ts tests/components/create-trip-panel.test.tsx`

Expected: fails on missing transport/cover fields.

- [ ] **Step 3: Implement create trip fields**

Parse `transport` and `coverImage` from `FormData`. Persist transport. For cover upload, generate a storage path under `trips/<tripId>/<userId>/cover-<uuid>.<ext>` and update trip image fields after trip creation.

- [ ] **Step 4: Run focused tests**

Run: `pnpm --dir apps/web test tests/application/create-trip.test.ts tests/application/create-trip-action.test.ts tests/components/create-trip-panel.test.tsx`

Expected: passes.

## Task 5: Persist Planning Day And Stop Actions

**Files:**
- Modify: `apps/web/src/application/trips/planning-workspace-state.ts`
- Modify: `apps/web/src/application/trips/supabase-planning-data.ts`
- Create: `apps/web/src/application/trips/planning-actions.ts`
- Modify: `apps/web/components/planning/date-rail.tsx`
- Modify: `apps/web/components/planning/planning-workspace.tsx`
- Modify: `apps/web/components/trips/planning-surface.tsx`
- Modify: `apps/web/tests/application/planning-workspace-state.test.ts`
- Modify: `apps/web/tests/application/supabase-planning-data.test.ts`
- Modify: `apps/web/tests/components/trips/planning-surface.test.tsx`

- [ ] **Step 1: Write failing planning tests**

Assert selecting a day changes visible agenda, add day appends next date, and update/delete/move callbacks are invoked with server action payloads.

- [ ] **Step 2: Run planning tests to verify they fail**

Run: `pnpm --dir apps/web test tests/application/planning-workspace-state.test.ts tests/application/supabase-planning-data.test.ts tests/components/trips/planning-surface.test.tsx`

Expected: fails because state only includes selected first day and no action wiring.

- [ ] **Step 3: Implement planning state and actions**

Keep all timeline items in workspace state, derive selected-day agenda, and call server actions for add/update/move/delete/pin/add-day before `router.refresh()`.

- [ ] **Step 4: Run planning tests**

Run: `pnpm --dir apps/web test tests/application/planning-workspace-state.test.ts tests/application/supabase-planning-data.test.ts tests/components/trips/planning-surface.test.tsx`

Expected: passes.

## Task 6: Memories CRUD UI And Actions

**Files:**
- Create: `apps/web/src/application/trips/memories-actions.ts`
- Modify: `apps/web/src/application/trips/memories-data.ts`
- Modify: `apps/web/app/(app)/trips/[tripId]/memories/page.tsx`
- Modify: `apps/web/components/trips/memories-surface.tsx`
- Modify: `apps/web/tests/components/trips/memories-surface.test.tsx`
- Create: `apps/web/tests/application/memories-actions.test.ts`

- [ ] **Step 1: Write failing memories tests**

Assert the day rail is absent, add memory form accepts title/content/images, empty submission shows validation error, and delete button calls the expected action.

- [ ] **Step 2: Run memories tests to verify they fail**

Run: `pnpm --dir apps/web test tests/application/memories-actions.test.ts tests/components/trips/memories-surface.test.tsx`

Expected: fails because current UI is fixture/timeline-only.

- [ ] **Step 3: Implement memory actions and UI**

Load Supabase memory rows, render trip-level cards, add a form with `multiple` image input, upload files through server action, and delete memory records.

- [ ] **Step 4: Run memories tests**

Run: `pnpm --dir apps/web test tests/application/memories-actions.test.ts tests/components/trips/memories-surface.test.tsx`

Expected: passes.

## Task 7: Expenses CRUD UI And Actions

**Files:**
- Create: `apps/web/src/application/trips/expense-actions.ts`
- Modify: `apps/web/src/application/trips/expenses-data.ts`
- Modify: `apps/web/app/(app)/trips/[tripId]/expenses/page.tsx`
- Modify: `apps/web/components/trips/expenses-surface.tsx`
- Modify: `apps/web/tests/components/trips/expenses-surface.test.tsx`
- Create: `apps/web/tests/application/expense-actions.test.ts`

- [ ] **Step 1: Write failing expenses tests**

Assert Add Expense opens a real form, paid-by uses trip members, participants are selectable, submit adds visible transaction data, edit opens existing values, and delete removes a transaction. Assert no trip budget UI exists.

- [ ] **Step 2: Run expenses tests to verify they fail**

Run: `pnpm --dir apps/web test tests/application/expense-actions.test.ts tests/components/trips/expenses-surface.test.tsx`

Expected: fails because current UI only toggles confirmations.

- [ ] **Step 3: Implement expense actions and UI**

Load expenses and members from Supabase, compute summaries with domain helpers, wire add/edit/delete forms, and keep Settle all as non-payment feedback.

- [ ] **Step 4: Run expenses tests**

Run: `pnpm --dir apps/web test tests/application/expense-actions.test.ts tests/components/trips/expenses-surface.test.tsx`

Expected: passes.

## Task 8: Seed Data, Full Test Run, Build, Harness Trace

**Files:**
- Create: `supabase/seed.sql`
- Modify: `docs/stories/epics/E04-rideflow-v1/US-RF-019-functional-trip-data-flows/validation.md`

- [ ] **Step 1: Add local/dev seed SQL**

Seed deterministic profiles, trip, members, days, timeline items, memories,
assets, expenses, and participants. Do not include trip budget fields.

- [ ] **Step 2: Run full test suite**

Run: `pnpm --dir apps/web test`

Expected: all tests pass.

- [ ] **Step 3: Run build**

Run: `pnpm --dir apps/web build`

Expected: build exits 0.

- [ ] **Step 4: Update Harness story proof**

Run:

```bash
./scripts/bin/harness-cli story update --id US-RF-019 --status implemented --unit 1 --integration 1 --e2e 0 --platform 1
```

- [ ] **Step 5: Record trace**

Run:

```bash
./scripts/bin/harness-cli trace --story US-RF-019 --summary "Implemented functional RideFlow trip data flows" --outcome "Trip creation, planning, memories, and expenses are Supabase-backed with tests and build proof"
```

