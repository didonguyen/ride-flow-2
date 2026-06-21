# RideFlow Functional Trip Data Flows Design

## Status

Approved for specification by the user on 2026-06-21, with one explicit
constraint: trip creation must not collect or store trip budget or budget
currency.

## Goal

Turn the existing RideFlow UI surfaces into working product flows backed by
Supabase data. The first complete vertical slice covers creating a trip with a
cover image, planning across trip days, adding shared trip memories, and basic
expense CRUD with participant shares.

## Product Scope

In scope:

- Create a trip with name, destination, date range, transport, and cover image.
- Generate one trip day per date in the trip date range.
- Add additional planning days after trip creation.
- Add, edit, delete, drag, and pin places on planning timeline items, persisted
  to Supabase.
- Add shared trip memories with optional title, optional content, and one or
  more images.
- Add, edit, and delete expenses.
- Select the trip member who paid for an expense.
- Select which trip members joined each expense.
- Split an expense equally across selected participants by default.
- Seed deterministic local/dev records for full-flow testing.

Out of scope:

- Trip budget fields or trip budget currency fields.
- Real payment settlement.
- Per-day memory grouping.
- Advanced memory timeline behavior.
- Custom unequal expense shares in the first pass.
- Multi-currency exchange-rate logic.
- Production-grade PDF export.

## Current Behavior

Trip creation already writes basic trip rows, owner membership, and trip days to
Supabase. The existing form only captures name, destination, start date, and end
date. Planning renders a strong UI, but selecting days and mutating timeline
items is mostly local state. Memories and expenses are polished surfaces backed
by fixture data and temporary toggles rather than real persistence.

## Target Behavior

An authenticated owner can create a trip, including a cover image. The app
creates trip days, redirects to the trip planning page, and shows the new cover
image in the trip header. The planning workspace lets owners and planners select
each day, add stops, edit stop details, delete stops, drag stops to change time,
and pin a place; these changes persist to Supabase.

The memories page becomes a trip-level album/journal. It does not show memories
by day. Users add one memory at a time with optional text and multiple images.
The expenses page becomes a basic expense ledger. Users add expenses, choose who
paid, choose who joined, and can edit or delete records. Summaries derive from
stored expense entries and participants.

## Data Model

### Existing tables used

- `profiles`
- `trips`
- `trip_members`
- `trip_days`
- `timeline_items`

### Trips changes

Add columns:

- `cover_image_url text`
- `cover_image_path text`
- `transport text not null default 'Motorcycle'`

Do not add trip budget columns.

### Memories tables

`memory_entries`

- `id uuid primary key default gen_random_uuid()`
- `trip_id uuid not null references public.trips(id) on delete cascade`
- `created_by uuid not null references public.profiles(id)`
- `title text not null default ''`
- `content text not null default ''`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Rules:

- At least one of title, content, or image asset must be present at the
  application boundary.
- Memories are trip-level records; no `trip_day_id` is needed.

`memory_assets`

- `id uuid primary key default gen_random_uuid()`
- `memory_entry_id uuid not null references public.memory_entries(id) on delete cascade`
- `trip_id uuid not null references public.trips(id) on delete cascade`
- `uploaded_by uuid not null references public.profiles(id)`
- `image_url text not null`
- `image_path text not null`
- `alt_text text not null default ''`
- `sort_order integer not null default 0`
- `created_at timestamptz not null default now()`

Rules:

- `trip_id` is duplicated for RLS and query simplicity.
- Assets are ordered by `sort_order`, then `created_at`.

### Expenses tables

`expense_entries`

- `id uuid primary key default gen_random_uuid()`
- `trip_id uuid not null references public.trips(id) on delete cascade`
- `title text not null`
- `amount numeric(12,2) not null check (amount > 0)`
- `currency text not null default 'VND'`
- `category text not null`
- `paid_by_member_id uuid not null references public.trip_members(id)`
- `expense_date date not null`
- `notes text not null default ''`
- `created_by uuid not null references public.profiles(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Rules:

- `currency` belongs to each expense, not the trip.
- `paid_by_member_id` must be a member of the same trip at the application
  boundary.

`expense_participants`

- `id uuid primary key default gen_random_uuid()`
- `expense_id uuid not null references public.expense_entries(id) on delete cascade`
- `trip_id uuid not null references public.trips(id) on delete cascade`
- `trip_member_id uuid not null references public.trip_members(id)`
- `share_amount numeric(12,2) not null check (share_amount >= 0)`
- `created_at timestamptz not null default now()`
- unique `(expense_id, trip_member_id)`

Rules:

- The first pass splits equally across selected participants.
- The sum of participant shares should equal the expense amount after rounding
  to two decimals.

## Storage

Create one Supabase Storage bucket for trip images:

- Bucket id: `rideflow-trip-images`
- Objects are stored under `trips/<tripId>/<userId>/<uuid>.<ext>`.
- Trip cover images and memory images share the bucket.

Storage policies:

- Trip members can read objects for their trip.
- Owners and planners can upload objects for their trip.
- Owners and planners can update/delete objects they uploaded.

The implementation should follow Supabase Storage RLS requirements: upload
requires `INSERT`; upsert requires `SELECT` and `UPDATE`.

## RLS And Authorization

Enable RLS on all new public tables.

Policies:

- Trip members with owner, planner, or viewer role can select memories,
  memory assets, expenses, and expense participants.
- Owners and planners can insert, update, and delete memory entries and memory
  assets.
- Owners and planners can insert, update, and delete expense entries and
  expense participants.
- Viewers remain read-only.

Server actions must call `auth.getUser()` and must not rely on user-editable
metadata for authorization decisions.

## Application Flow

### Create Trip

1. User submits the create trip form.
2. Server action validates name, destination, start date, end date, and optional
   transport.
3. Server action creates the trip row, accepted owner member row, and trip day
   rows.
4. If a cover image is present, the server uploads it to Storage and stores the
   resulting path and URL on the trip.
5. User is redirected to `/trips/:tripId`.

### Planning

1. Page loader fetches trip, days, and all timeline items for the selected trip.
2. Day rail selection changes the selected day and filters the timeline.
3. Add day creates the next sequential `trip_days` row and extends
   `trips.end_date`.
4. Add stop creates a `timeline_items` row for the selected day.
5. Edit stop updates title, time, category-derived notes/status data, notes, and
   place snapshot fields.
6. Drag stop updates `start_time`.
7. Delete stop removes the timeline item.
8. Pin place updates the place snapshot columns on the selected item.

### Memories

1. Page loader fetches trip-level memory entries with assets.
2. Add Memory opens a form.
3. User can provide title, content, and one or more image files.
4. Server action creates a memory entry and uploads image files.
5. Memory grid refreshes and shows the new album entry.
6. Delete memory removes the entry and its asset metadata.

### Expenses

1. Page loader fetches expense entries, participants, and trip members.
2. Add Expense opens a form.
3. User enters title, amount, currency, category, date, notes, paid-by member,
   and joined members.
4. Server action creates the expense entry and participant shares.
5. Edit Expense updates the row and replaces participant shares.
6. Delete Expense removes the row and participant shares.
7. UI recomputes total spent, category breakdown, recent expenses, per-person
   average, and member balances from fetched data.

## UI Impact

Create Trip:

- Add cover image file input and transport input/select to the current form.
- Keep the modal-first styling.
- Do not add budget inputs.

Planning:

- Keep the current editorial planning layout.
- Make day rail buttons interactive.
- Add a compact Add Day control near the day rail or planning toolbar.
- Keep existing buttons: Find places, AI draft, Add stop, plus inspector edit
  and delete controls.
- Disable mutation controls for viewers.

Memories:

- Remove the memories day rail.
- Keep the album/journal visual direction.
- Add a form/modal for title, content, and multi-image upload.
- Show empty state when no memories exist.

Expenses:

- Keep the summary cards, category usage visual area, recent expenses,
  settlement, member balances, and insight card structure where possible.
- The category usage section summarizes recorded expense categories, not a trip
  budget.
- Add expense form supports paid-by and participants.
- Add edit/delete buttons on each transaction row.
- Keep Settle all as non-payment feedback only.

## Seed Data

Add deterministic local/dev seed records:

- One owner profile and at least three member/invite records.
- One trip with cover image URL/path and three days.
- Multiple timeline items across all days.
- Three memory entries with one to three assets each.
- Five or six expenses across at least four categories.
- Expense participants covering different member combinations.

The seed must be safe for local/dev use and not run automatically in production.

## Testing Strategy

Unit tests:

- Trip create validation excludes budget fields.
- Date/day generation and add-day date extension.
- Expense equal split and rounding.
- Expense balance calculation.
- Memory validation accepts title-only, content-only, image-only, or mixed
  entries and rejects fully empty submissions.

Integration tests:

- Schema contract includes new trip columns and new tables.
- Supabase repository tests cover memory CRUD.
- Supabase repository tests cover expense CRUD with participants.
- Planning repository tests cover add/update/move/delete timeline persistence.

Component tests:

- Create trip form renders cover image and transport, and no budget fields.
- Planning day rail selection changes visible stops.
- Memories add form renders and submits expected fields.
- Expenses add/edit/delete flow updates visible transaction rows.

E2E or browser smoke:

- Create a trip with image.
- Add a planning day and stop.
- Add a memory with images.
- Add, edit, and delete an expense.

Platform:

- `pnpm --dir apps/web test`
- `pnpm --dir apps/web build`

## Acceptance Criteria

- A logged-in user can create a new trip with full required trip information
  and a cover image.
- Newly created trips have generated day rows.
- Planning can select trip days and persist stop CRUD actions.
- Planning can add an extra day to a trip.
- Memories can store trip-level memory entries with multiple images.
- Expenses can add, edit, and delete records.
- Expenses can assign a paid-by member and joined participants.
- Expense summaries derive from stored records.
- The UI does not expose trip budget or trip budget currency fields.
- Seed data supports testing the full flow without hand-building every record.

## Alternatives Considered

1. Keep memories and expenses fixture-backed. Rejected because the request asks
   for functional data and CRUD.
2. Rewrite the UI around simpler forms. Rejected because the request asks to
   follow the existing design and page buttons.
3. Add trip-level budget. Rejected by explicit user correction.

