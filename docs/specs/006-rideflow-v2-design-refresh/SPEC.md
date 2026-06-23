# RideFlow V2 Design Refresh Spec

## Purpose

Update the authenticated RideFlow app to match the new `design/v2` visual direction while preserving the working data flows and modal-first interactions already implemented.

The new direction is `Modern Explorer`: a premium editorial travel interface with generous whitespace, forest green anchors, sage surfaces, terracotta/orange accents, high-quality travel imagery, and a rugged-but-refined motorcycle touring feel.

## Source Design Files

- `design/v2/rideflow_ui/rideflow_editorial/DESIGN.md`
- `design/v2/rideflow_ui/user_dashboard_rideflow/code.html`
- `design/v2/rideflow_ui/user_dashboard_rideflow/screen.png`
- `design/v2/rideflow_ui/trip_detail_planning_activity_states_sync/code.html`
- `design/v2/rideflow_ui/trip_detail_planning_activity_states_sync/screen.png`
- `design/v2/rideflow_ui/trip_detail_memories_nam_c_t_ti_n_navigation_sync/code.html`
- `design/v2/rideflow_ui/trip_detail_memories_nam_c_t_ti_n_navigation_sync/screen.png`
- `design/v2/rideflow_ui/trip_detail_expenses_nam_c_t_ti_n_annotation_sync/code.html`
- `design/v2/rideflow_ui/trip_detail_expenses_nam_c_t_ti_n_annotation_sync/screen.png`

## Non-Negotiable Functional Constraints

- Do not reintroduce `budget` or `budgetCurrency` fields on trips.
- Preserve the existing Supabase-backed flows:
  - Create trip with cover image.
  - Add day to trip planning.
  - Add, edit, and delete planning activities.
  - Add and delete trip-level memories with one or more images.
  - Add, edit, and delete expenses with payer and participant selection.
- Preserve modal-first interactions:
  - Create trip opens a modal where currently modal based, and `/trips/new` remains usable.
  - Add/edit/delete planning activities use modals.
  - Add/delete memories use modals.
  - Add/edit/delete expenses use modals.
- Do not convert destructive actions to inline-only behavior.
- Do not change database schema unless a visual requirement cannot reasonably be satisfied with existing data.
- Do not add fake persisted data. Static decorative examples are allowed only for clearly non-functional recommendation cards.

## Design System

### Color Tokens

Adopt the v2 editorial palette in Tailwind/theme tokens where possible:

- Background: `#f8faf6`
- Surface lowest: `#ffffff`
- Surface low: `#f2f4f1`
- Surface: `#eceeeb`
- Surface high: `#e7e9e5`
- Surface highest: `#e1e3e0`
- Primary: `#003527`
- Primary container: `#064e3b`
- Primary fixed: `#b0f0d6`
- Secondary: `#416656`
- Secondary container: `#c3ecd7`
- Tertiary/accent: `#4f2000`, `#723100`, `#ff9758`
- Text: `#191c1b`
- Muted text: `#404944`
- Outline: `#707974`
- Outline variant: `#bfc9c3`
- Error: `#ba1a1a`

Use terracotta/orange sparingly for action-needed states, urgency, highlighted route segments, or strong affordances. The dominant feel should stay off-white, forest, sage, and photographic.

### Typography

- Display/headlines: Montserrat.
- Body/labels: Inter.
- Display desktop: 48px / 56px, 700, tight tracking.
- Display mobile: 36px / 44px, 700.
- Headline md: 24px / 32px, 600.
- Headline sm: 20px / 28px, 600.
- Body md: 16px / 24px.
- Body sm: 14px / 20px.
- Label caps: 12px / 16px, 600, uppercase, `0.08em` letter spacing.

### Shape And Surfaces

- Buttons and inputs: 8px radius unless they are primary pill CTAs.
- Cards and image containers: 16px to 24px radius.
- Modals: white/surface-lowest, soft ambient shadow, editorial spacing, preserve current `ActionModal` behavior.
- Avoid nested card-on-card layouts. Use page bands, columns, and individual cards only.

### Photography

- Use actual trip cover images when available.
- Use existing fallback imagery/assets only when no cover image exists.
- Hero images need a vignette overlay when text sits on top.
- Memory images should remain inspectable and not be overly dark, blurred, or cropped.

## App Shell

### Desktop

Update the authenticated app shell toward the v2 sidebar:

- Fixed left sidebar for desktop.
- Brand block: `The Modern Explorer`.
- User tier block: `Premium Member`.
- Primary navigation:
  - Dashboard
  - My Trips
  - New Trip
- Secondary navigation:
  - Settings
  - Help Center
- Primary CTA: `Upgrade to Pro`.

The navigation can use the existing routes and auth state. Settings/help can remain non-critical links if the app does not yet implement those pages.

### Mobile

- Do not force the desktop sidebar.
- Use compact top navigation and preserve tab accessibility.
- Touch targets should remain comfortable for mobile.

### Top Bar

The top bar should include:

- Current page/trip title.
- Search icon/button.
- Notifications icon/button.
- Account or more menu button.

If the app does not yet support search/notifications, keep these as visual buttons without destructive side effects.

## Dashboard

Source: `user_dashboard_rideflow`.

### Layout

Dashboard should become an editorial overview:

1. Welcome header.
2. Upcoming Adventure hero card.
3. Recent Journeys grid/list.
4. Planning Activity feed.

### Data Mapping

Upcoming Adventure:

- Trip name from the next/upcoming dashboard trip.
- Cover image from `cover_image_url`.
- Date range from trip start/end dates.
- Transport from `transport`.
- Planned percentage from existing progress logic, if present.
- Members from trip members.
- CTA `Continue planning` links to the trip planning/detail route.

Recent Journeys:

- Use existing dashboard trip list.
- Use cover image when available.
- Show status/date/member metadata already available from repositories or view models.
- `View all` goes to the trips list.

Planning Activity:

- Use existing activity/timeline data if available.
- If there is no activity, show a v2-styled empty state.
- Do not persist fake activity records.

## Trip Detail Shared Header

All trip detail tabs should share a v2 hero and tabs area.

### Hero

- Full-width editorial cover image with vignette.
- Large trip name overlay.
- Metadata chips:
  - Date range.
  - Duration or day count.
  - Transport.
- Top actions:
  - Back.
  - Search.
  - Notifications.
  - More/options.

### Tabs

Tabs remain:

- Planning
- Memories
- Expenses

Active tab uses forest green underline or filled sage state. Tabs must remain route-aware and preserve current navigation.

## Planning Page

Source: `trip_detail_planning_activity_states_sync`.

### Layout

Use a three-zone desktop layout:

1. Left day rail.
2. Center activity timeline.
3. Right route/recommendation sidebar.

On mobile, stack day rail, timeline, and sidebar content vertically.

### Day Rail

- Show actual `trip_days` only.
- Add Day button opens the existing Add Day modal.
- After Add Day submit, close the modal and rely on server action/revalidation to show the new persisted day.
- Never create synthetic client-side day ids such as `day-extra-*` for actions.

### Activity Timeline

Each activity should show:

- Time.
- Title.
- Status chip.
- Location/place snapshot when available.
- Notes/description.
- Backup options or action-needed state when data exists.

Status styling:

- Ready/Pinned: sage or primary.
- Confirmed: primary/secondary.
- Action Needed: terracotta/orange.

### Planning Actions

- Add stop opens Add Activity modal.
- Edit stop opens Edit Activity modal.
- Delete stop opens Delete Activity confirmation modal.
- `Pin this`, `View details`, and `Browse Activities` should only mutate data if existing app logic supports them. Otherwise style as non-destructive secondary actions.

### Sidebar

- Route Overview card: distance/duration if available.
- Night alternatives card: use existing fallback/recommendation data until real data exists.
- AI recommendation card: keep current assistant action behavior if present.

## Memories Page

Source: `trip_detail_memories_nam_c_t_ti_n_navigation_sync`.

### Layout

Use a journal timeline plus Trip Vault sidebar.

Main timeline:

- Trip-level memories only, not grouped by day.
- Each memory card shows timestamp, title, body/content, author metadata if available, and image grid.
- Delete icon opens confirmation modal.

Trip Vault:

- Photos count from memory assets.
- Journal entries count from memory entries.
- Places saved count from timeline/place data if available; otherwise use zero or existing derived value.
- Add Memory button opens the existing Add Memory modal.

### Memory Actions

Add Memory modal:

- Title optional.
- Content optional.
- Multiple images.
- Submit closes modal and revalidates.

Delete Memory modal:

- Confirmation text includes memory title.
- Submit closes modal and revalidates.

## Expenses Page

Source: `trip_detail_expenses_nam_c_t_ti_n_annotation_sync`.

### Budget Language Replacement

The v2 mockup includes `Budget Usage`, but this app must not reintroduce trip budget. Replace that area with `Spending Breakdown`.

Show:

- Total spent.
- Per person.
- Category breakdown as relative share of actual expense total.
- Category rows/progress bars based on real expenses, not budget usage.

### Recent Expenses

Rows show:

- Category icon.
- Title.
- Paid by.
- Date.
- Amount.
- Settlement/status label if derivable.
- Edit icon opens edit modal.
- Delete icon opens delete modal.

### Settlement And Balances

- Keep existing settlement summary and balance calculations.
- `Settle all balances` keeps current behavior/modal/confirmation.
- Member balances use existing `summary.balances` data.

### Expense Actions

Add Expense modal:

- Title.
- Amount.
- Currency.
- Category.
- Date.
- Paid by.
- Notes.
- Participant checkboxes.

Edit Expense modal uses the same fields.

Delete Expense modal confirms deletion.

All submit actions close the modal and rely on server action/revalidation.

## Create Trip

Restyle the create trip modal/page to v2 while preserving the current approved fields:

- Trip name.
- Destination.
- Start date.
- End date.
- Transport.
- Cover image.

Do not add budget fields.

The submit button must continue to use `useFormStatus`, not a local click handler that disables submit before the server action starts.

## Components Likely To Change

- `apps/web/components/trip/trip-app-shell.tsx`
- `apps/web/components/trip/trip-section-tabs.tsx`
- `apps/web/components/trip/trip-cover-header.tsx`
- `apps/web/components/dashboard/*`
- `apps/web/components/trips/create-trip-panel.tsx`
- `apps/web/components/trips/planning-surface.tsx`
- `apps/web/components/trips/memories-surface.tsx`
- `apps/web/components/trips/expenses-surface.tsx`
- Shared UI primitives under `apps/web/components/ui/*` as needed.
- Tailwind/theme configuration and global font setup.

## Implementation Phases

1. Add v2 design tokens and fonts.
2. Update app shell, topbar, and shared trip hero/tabs.
3. Update dashboard layout and cards.
4. Update create trip panel/modal styling.
5. Update planning layout while preserving modal actions.
6. Update memories layout while preserving trip-level memory behavior.
7. Update expenses layout and replace budget language with spending breakdown.
8. Run focused component tests and adjust assertions only where design copy/structure changed.
9. Run browser verification for the main flows.
10. Run production build.

## Verification Plan

Automated checks:

- Focused component tests for create trip, planning, memories, expenses.
- Repository/application tests for trip, memory, expense data flows.
- `next build`.
- `git diff --check`.

Browser flow:

1. Login.
2. Create a trip with cover image.
3. Open planning.
4. Add a day.
5. Add an activity to a real persisted day.
6. Add a memory with one or more images.
7. Reload memories and verify images render.
8. Add an expense with participants.
9. Edit the expense.
10. Delete the expense.
11. Confirm DB state for trip/day/activity/memory/image and deleted expense.

## Acceptance Criteria

- Dashboard visually follows v2 editorial dashboard direction.
- Trip detail header/tabs are consistent across Planning, Memories, Expenses.
- Planning no longer submits synthetic day ids.
- Memories remain trip-level and images render after reload.
- Expenses no longer mention budget usage; they show spending breakdown instead.
- All create/edit/delete workflows still open modals.
- No budget or budget currency fields exist in create trip.
- No new Supabase missing-column/table runtime errors.
- Focused tests pass.
- `next build` passes.
- Real browser flow passes at least once after implementation.
