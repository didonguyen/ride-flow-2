# Feature Specification: RideFlow V1 Rebuild

**Feature ID:** 001-rideflow-v1
**Status:** Draft for implementation planning
**Created:** 2026-06-13
**Owner:** RideFlow product rebuild
**Primary implementation surface:** `apps/web`

## Source Material

This specification consolidates the accepted product and visual direction from:

- `docs/product/rideflow-v1.md`
- `docs/superpowers/specs/2026-06-11-rideflow-v1-planning-core-design.md`
- `docs/superpowers/specs/2026-06-12-rideflow-v1-ui-design.md`
- `plan.md` (same folder)
- `publics/design/RideFlow_logo.png`
- `publics/design/RideFlow_Dashboard.png`
- `publics/design/Planning.png`
- `publics/design/Memories.png`
- `publics/design/Expenses.png`

If this specification conflicts with an older document, this file wins for implementation planning unless the user explicitly chooses another source.

## Product Summary

RideFlow V1 is a responsive web app for collaborative group trip planning. It helps a trip Owner or delegated Planner create a trip, invite members, build a day-by-day itinerary, search or manually add places, pin place snapshots to the timeline, and optionally generate an editable AI itinerary draft.

The redesigned product should feel like an image-led travel workspace with a calm planning cockpit at the center. The Planning tab is the first implementation priority. Dashboard, Memories, and Expenses are part of the approved visual direction, but full Memories and Expenses behavior may be phased after Planning is solid.

## Spec-Driven Delivery Model

RideFlow should be managed with a spec-driven workflow:

1. `spec.md`: product behavior, screen contracts, requirements, and proof expectations.
2. `plan.md`: implementation architecture, file ownership, task order, and technical decisions.
3. `tasks.md`: small executable tasks with acceptance checks and commit boundaries.
4. `proof.md`: validation evidence, screenshots, test output, and known gaps.

Each major feature below can become its own child spec when implementation needs more detail:

- `001-auth-and-invites`
- `002-dashboard-and-create-trip`
- `003-planning-workspace`
- `004-place-search`
- `005-ai-draft`
- `006-realtime-sync`
- `007-mobile-agenda`
- `008-memories-surface`
- `009-expenses-surface`

## Goals

### G-001 Planning Core

Users can create a trip, generate trip days, and build a time-based itinerary.

### G-002 Collaboration

Owners can invite members and assign Owner, Planner, or Viewer roles. Owner and Planner can edit the plan. Viewer can only read.

### G-003 Provider-Neutral Places

Place search works with seed data, OpenStreetMap-compatible results, and manual fallback now, while preserving a future path to Google Places.

### G-004 Editable AI Draft

AI helps create an initial itinerary skeleton but never overwrites user work without explicit confirmation.

### G-005 Approved Visual Direction

The app follows the user-provided design references: sidebar app shell, image-led dashboard cards, teal planning date rail, agenda-plus-map planning canvas, album-like Memories, and clean Expenses breakdown.

### G-006 Feature Management

The project can be sliced into feature specs, plans, tasks, tests, and screenshots without losing the product contract.

## Non-Goals

### NG-001

RideFlow V1 does not implement a public social feed or community marketplace.

### NG-002

RideFlow V1 does not implement garage, vehicle maintenance, or biker profile management.

### NG-003

RideFlow V1 does not depend on Google Places. The UI and data model must remain compatible with a future Google Places adapter.

### NG-004

RideFlow V1 does not implement full multiplayer editing such as live cursors, item locks, or conflict prompts.

### NG-005

RideFlow V1 does not require full Memories and Expenses transactional behavior before the Planning workflow is complete. Their approved visual surfaces may ship as shells or demo-backed surfaces first.

## User Roles

### Owner

The Owner is the user who creates or owns the trip.

Owner can:

- Edit trip metadata.
- Invite members.
- Remove members.
- Change Planner and Viewer roles.
- Create, edit, move, and delete timeline items.
- Search places and pin them to itinerary items.
- Generate, preview, and apply AI drafts.
- Delete the trip.

### Planner

Planner is a delegated collaborator.

Planner can:

- View trip metadata.
- Create, edit, move, and delete timeline items.
- Search places and pin them to itinerary items.
- Generate, preview, and apply AI drafts.
- View members.

Planner cannot:

- Invite members.
- Remove members.
- Change roles.
- Delete the trip.

### Viewer

Viewer is a read-only trip member.

Viewer can:

- View trip metadata.
- View itinerary.
- View place details and open map links.
- View members.

Viewer cannot:

- Mutate trip data.
- Search and pin places into the trip.
- Generate AI drafts.
- Manage members.

## Core User Journeys

### J-001 Sign Up And Land In Dashboard

1. A new user opens RideFlow.
2. The user signs up with email and password.
3. RideFlow creates a user profile.
4. RideFlow shows the dashboard with empty or sample trip state.
5. The user sees a clear `Create trip` path.

Acceptance:

- The user can complete sign-up from `/sign-up`.
- Invalid form input is shown inline.
- After success, the user can reach the trip dashboard.

### J-002 Create A Trip

1. Owner opens `Create trip`.
2. Owner enters trip name, destination, start date, and end date.
3. Owner may add origin and pace.
4. RideFlow validates the date range.
5. RideFlow creates the trip and one trip day per calendar date.
6. Owner lands in the Planning tab for the new trip.

Acceptance:

- End date before start date is rejected.
- A three-day trip creates exactly three trip day records.
- Created trip appears in the Dashboard.

### J-003 Build A Planning Timeline

1. Owner or Planner opens a trip.
2. User selects a day from the date rail.
3. User adds a timeline item.
4. User edits start time, duration, title, notes, and place snapshot.
5. User saves the item.
6. Item appears in chronological order.

Acceptance:

- Invalid times and non-positive durations are rejected.
- Timeline item belongs to a trip day from the same trip.
- Timeline card matches the approved planning visual direction.

### J-004 Search And Pin A Place

1. Owner or Planner opens Place Search.
2. User searches with a query such as `coffee Da Nang`.
3. RideFlow returns seed, OSM, or manual results using one normalized result shape.
4. User selects a result.
5. User pins the place into a new or selected timeline item.

Acceptance:

- Search UI shows source badges: `Seed`, `OSM`, or `Manual`.
- No-result state offers manual place fallback.
- Pinned item stores a snapshot so provider changes do not break old trips.

### J-005 Invite Members And Enforce Roles

1. Owner opens Members.
2. Owner invites a member by email.
3. Owner assigns Planner or Viewer.
4. Invited user accepts invite.
5. RideFlow enforces role permissions in UI and backend.

Acceptance:

- Owner can invite and change roles.
- Planner can view members but not manage roles.
- Viewer sees read-only UI.
- Backend/database rejects unauthorized mutations.

### J-006 Generate And Apply AI Draft

1. Owner or Planner opens AI Draft.
2. User optionally adds preferences such as `food focused` or `slow pace`.
3. RideFlow generates a structured draft grouped by day.
4. RideFlow validates the draft.
5. User previews the draft.
6. User applies it as append or replace.

Acceptance:

- Existing timeline is never overwritten without explicit replace confirmation.
- Invalid draft items are rejected or shown as review-needed.
- AI failure does not block manual planning.

### J-007 View Mobile Agenda

1. Member opens a trip on mobile.
2. User sees today's agenda first.
3. User can switch days horizontally.
4. Owner or Planner can make simple edits through bottom sheets.
5. Viewer sees read-only states.

Acceptance:

- No horizontal overflow on common mobile widths.
- Primary agenda content is visible before map controls.
- Bottom sheets do not cover save/cancel controls.

### J-008 Review Memories Surface

1. User opens Memories tab.
2. RideFlow shows the album/journal surface following `publics/design/Memories.png`.
3. User sees a PDF export action.

Acceptance:

- Memories can initially be static or demo-backed.
- The surface must not look like a social feed.
- Full upload/storage behavior is a later feature unless explicitly planned.

### J-009 Review Expenses Surface

1. User opens Expenses tab.
2. RideFlow shows a trip expense breakdown following `publics/design/Expenses.png`.
3. User sees a donut chart and transaction history.

Acceptance:

- Expenses can initially be static or demo-backed.
- Full settlement behavior is a later feature unless explicitly planned.
- The surface must not hide or replace Planning as the primary workflow.

## Feature Requirements

### RF-001 Auth

- FR-001: The app shall provide `/sign-up` and `/sign-in` routes.
- FR-002: Sign-up shall collect email and password.
- FR-003: Sign-in shall collect email and password.
- FR-004: Auth forms shall show inline validation errors.
- FR-005: Auth routes shall support invite-link context later without redesigning the form shell.
- FR-006: Auth visual treatment shall include RideFlow identity and a trip preview.

### RF-002 App Shell And Navigation

- FR-007: Signed-in app routes shall use a persistent left sidebar on desktop.
- FR-008: Sidebar shall show RideFlow logo from `publics/design/RideFlow_logo.png`.
- FR-009: Sidebar shall include Dashboard, Trips, New Trip, Explore, profile, and Settings.
- FR-010: Trip detail routes shall show top segmented tabs: Planning, Memories, Expenses.
- FR-011: Planning shall be the default selected trip tab.
- FR-012: Navigation shall remain usable on mobile through a compact menu or bottom navigation.

### RF-003 Dashboard

- FR-013: Dashboard shall show `Trips Dashboard` title.
- FR-014: Dashboard shall show recent trip cards.
- FR-015: Trip cards shall be image-led with destination photo and overlaid white information panel.
- FR-016: Dashboard shall include a dashed-outline new-trip card with `Bat dau chuyen di moi` or localized equivalent.
- FR-017: Empty dashboard shall show a create-trip call to action.
- FR-018: Dashboard cards shall show trip name, destination, and date range.

### RF-004 Create Trip

- FR-019: Create Trip shall require trip name, destination, start date, and end date.
- FR-020: Create Trip may collect origin and pace.
- FR-021: End date before start date shall be invalid.
- FR-022: On valid create, the system shall create one trip day per date in range.
- FR-023: Owner shall become an accepted trip member with role `owner`.
- FR-024: After create, user shall land on the trip Planning tab.

### RF-005 Planning Workspace

- FR-025: Planning screen shall use a sidebar plus split planning canvas on desktop.
- FR-026: Planning screen shall show a deep teal date rail.
- FR-027: Date rail shall show day label, date, and optional weather placeholder.
- FR-028: Active day shall be visually distinct.
- FR-029: Planning screen shall show agenda/timeline left of route map on desktop.
- FR-030: Route map shall show route line and numbered pins when coordinates exist.
- FR-031: Map shall not be the only way to understand the plan.

### RF-006 Timeline Items

- FR-032: Timeline item shall include start time, duration, title, notes, and place snapshot fields.
- FR-033: Timeline item shall belong to exactly one trip day.
- FR-034: Timeline item shall belong to the same trip as its trip day.
- FR-035: Duration shall be a positive number of minutes.
- FR-036: Items shall be displayed in start-time order.
- FR-037: Owner and Planner shall create timeline items.
- FR-038: Owner and Planner shall edit timeline items.
- FR-039: Owner and Planner shall move timeline items.
- FR-040: Owner and Planner shall delete timeline items.
- FR-041: Viewer shall not mutate timeline items.
- FR-042: Timeline cards shall include destination image thumbnail when available.

### RF-007 Timeline Inspector

- FR-043: Selecting a timeline item shall open an inspector or equivalent editing surface.
- FR-044: Inspector shall expose title, start time, duration, place, and notes.
- FR-045: Owner and Planner inspector shall show save/cancel controls.
- FR-046: Viewer inspector shall show read-only details and open-map action.
- FR-047: Unsaved changes shall not silently discard without user action.

### RF-008 Place Search

- FR-048: Place search shall go through a provider boundary.
- FR-049: V1 shall support seed data provider.
- FR-050: V1 shall support OpenStreetMap-compatible provider or adapter.
- FR-051: V1 shall support manual place fallback.
- FR-052: Search results shall normalize to one `PlaceSearchResult` shape.
- FR-053: Result cards shall show name, category, address, source badge, and pin action.
- FR-054: No-result state shall offer manual place entry.
- FR-055: Provider failure shall show retry and manual fallback.
- FR-056: Pinning a place shall store a snapshot on the timeline item.
- FR-057: Existing trips shall remain readable if providers change later.

### RF-009 Members And Roles

- FR-058: Owner shall invite a member by email.
- FR-059: Invite shall support `pending` and `accepted` states.
- FR-060: Owner shall assign Planner or Viewer role at invite time.
- FR-061: Owner shall change Planner and Viewer roles.
- FR-062: Owner shall remove members.
- FR-063: Planner shall not manage members.
- FR-064: Viewer shall not manage members.
- FR-065: Role restrictions shall be enforced in UI and backend/database.

### RF-010 AI Draft

- FR-066: AI Draft shall be available to Owner and Planner.
- FR-067: Viewer shall not generate AI drafts.
- FR-068: Draft input shall use trip destination, date range, and optional preferences.
- FR-069: Draft output shall be structured by trip day.
- FR-070: Draft output shall be parsed and validated before preview.
- FR-071: Draft preview shall be visible before apply.
- FR-072: Applying to non-empty timeline shall require append or replace choice.
- FR-073: Replace shall require explicit confirmation.
- FR-074: AI provider shall be replaceable through a provider boundary.
- FR-075: AI failure shall leave manual planning usable.

### RF-011 Realtime Sync

- FR-076: Timeline updates shall sync to other open clients within a short delay.
- FR-077: Supabase Realtime is the preferred implementation.
- FR-078: Lightweight polling is acceptable as fallback for selected screens.
- FR-079: Conflict policy shall be last valid write wins.
- FR-080: UI shall show disconnected or reconnecting state when sync is unavailable.

### RF-012 Mobile Agenda

- FR-081: Mobile trip view shall prioritize agenda content.
- FR-082: Mobile shall show sticky trip header.
- FR-083: Mobile shall show horizontal day picker.
- FR-084: Mobile edit surfaces shall use bottom sheets or compact forms.
- FR-085: Mobile place details shall open without hiding primary save/cancel actions.
- FR-086: Mobile layout shall avoid horizontal overflow at 360px width.

### RF-013 Memories Surface

- FR-087: Memories tab shall follow `publics/design/Memories.png`.
- FR-088: Memories shall use album/journal layout, not social feed layout.
- FR-089: Memories shall include PDF export action.
- FR-090: Memories full upload/storage behavior shall be behind a separate implementation spec.

### RF-014 Expenses Surface

- FR-091: Expenses tab shall follow `publics/design/Expenses.png`.
- FR-092: Expenses shall show breakdown donut chart.
- FR-093: Expenses shall show transaction history table.
- FR-094: Expenses full settlement behavior shall be behind a separate implementation spec.

### RF-015 Error, Empty, And Access States

- FR-095: App shall include not-signed-in state.
- FR-096: App shall include trip-not-found state.
- FR-097: App shall include empty dashboard state.
- FR-098: App shall include empty day state.
- FR-099: App shall include place search failure state.
- FR-100: App shall include AI failure state.
- FR-101: App shall include Viewer read-only state.
- FR-102: Each state shall provide one useful next action when possible.

## Key Entities

### Profile

Represents a signed-in user.

Fields:

- `id`
- `email`
- `display_name`
- `created_at`

### Trip

Represents a group trip.

Fields:

- `id`
- `name`
- `destination`
- `origin`
- `start_date`
- `end_date`
- `pace`
- `owner_id`
- `created_at`
- `updated_at`

Required invariants:

- `end_date >= start_date`
- `owner_id` references the creating user
- date range creates one `TripDay` per date

### TripMember

Represents a user's access to a trip.

Fields:

- `id`
- `trip_id`
- `user_id`
- `invited_email`
- `role`
- `invite_status`
- `created_at`
- `accepted_at`

Allowed values:

- `role`: `owner`, `planner`, `viewer`
- `invite_status`: `pending`, `accepted`

Required invariants:

- Each trip has at least one Owner.
- Owner can manage members.
- Planner and Viewer cannot manage members.

### TripDay

Represents one calendar day in a trip.

Fields:

- `id`
- `trip_id`
- `date`
- `day_index`

Required invariants:

- `day_index` starts at 1.
- `date` is inside trip date range.
- One trip cannot have duplicate dates.

### TimelineItem

Represents one scheduled item in a trip day.

Fields:

- `id`
- `trip_id`
- `trip_day_id`
- `start_time`
- `duration_minutes`
- `title`
- `notes`
- `place_source`
- `place_source_id`
- `place_name`
- `place_address`
- `place_lat`
- `place_lng`
- `place_external_url`
- `place_image_url`
- `updated_by`
- `created_at`
- `updated_at`

Required invariants:

- `trip_day_id` belongs to the same `trip_id`.
- `duration_minutes > 0`.
- `start_time` is valid for the selected day.
- Place fields are snapshots, not live provider references.

### PlaceSearchResult

Represents a provider-neutral place result.

Fields:

- `id`
- `source`
- `name`
- `address`
- `lat`
- `lng`
- `category`
- `externalUrl`
- `imageUrl`
- `metadata`

Allowed `source` values:

- `seed`
- `osm`
- `manual`
- `google`

### AiDraftRun

Represents one AI draft generation attempt.

Fields:

- `id`
- `trip_id`
- `requested_by`
- `prompt`
- `status`
- `validated_summary`
- `raw_response`
- `created_at`

Allowed `status` values:

- `pending`
- `succeeded`
- `failed`
- `applied`

### MemoryEntry

Future entity for Memories behavior. V1 design may show demo-backed content before this is implemented.

Likely fields:

- `id`
- `trip_id`
- `trip_day_id`
- `timeline_item_id`
- `caption`
- `photo_url`
- `created_by`
- `created_at`

### ExpenseEntry

Future entity for Expenses behavior. V1 design may show demo-backed content before settlement is implemented.

Likely fields:

- `id`
- `trip_id`
- `paid_by_member_id`
- `category`
- `description`
- `amount`
- `currency`
- `spent_at`
- `created_at`

## Permission Matrix

| Capability | Owner | Planner | Viewer |
| --- | --- | --- | --- |
| View trip | Yes | Yes | Yes |
| Edit trip metadata | Yes | No | No |
| Delete trip | Yes | No | No |
| Invite member | Yes | No | No |
| Remove member | Yes | No | No |
| Change role | Yes | No | No |
| View members | Yes | Yes | Yes |
| Create timeline item | Yes | Yes | No |
| Edit timeline item | Yes | Yes | No |
| Move timeline item | Yes | Yes | No |
| Delete timeline item | Yes | Yes | No |
| Search place for pinning | Yes | Yes | No |
| Pin place | Yes | Yes | No |
| Generate AI draft | Yes | Yes | No |
| Apply AI draft | Yes | Yes | No |
| View Memories | Yes | Yes | Yes |
| View Expenses | Yes | Yes | Yes |

## Provider Contracts

### Place Search Provider

```ts
export type PlaceSource = "seed" | "osm" | "manual" | "google";

export type PlaceSearchOptions = {
  tripId?: string;
  destination?: string;
  near?: {
    lat: number;
    lng: number;
  };
  limit?: number;
};

export type PlaceSearchResult = {
  id: string;
  source: PlaceSource;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  category?: string;
  externalUrl?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
};

export interface PlaceSearchProvider {
  searchPlaces(
    query: string,
    options: PlaceSearchOptions
  ): Promise<PlaceSearchResult[]>;
  getPlaceDetails(placeId: string): Promise<PlaceSearchResult | null>;
}
```

### Itinerary Draft Provider

```ts
export type ItineraryDraftInput = {
  tripId: string;
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  pace?: "slow" | "balanced" | "fast";
  preferencePrompt?: string;
};

export type ItineraryDraftItem = {
  dayIndex: number;
  startTime: string;
  durationMinutes: number;
  title: string;
  notes?: string;
  placeName?: string;
  placeAddress?: string;
  category?: string;
};

export type ItineraryDraft = {
  summary: string;
  items: ItineraryDraftItem[];
};

export interface ItineraryDraftProvider {
  generateDraft(input: ItineraryDraftInput): Promise<ItineraryDraft>;
}
```

## Screen Contracts

### SC-001 Auth

Routes:

- `/sign-up`
- `/sign-in`

Must include:

- RideFlow brand.
- Email field.
- Password field.
- Primary CTA.
- Trip preview surface.
- Inline validation.

### SC-002 Dashboard

Route:

- `/trips`

Must include:

- Sidebar.
- `Trips Dashboard` title.
- Recent trip card grid.
- New trip card.
- User profile block.

Visual reference:

- `publics/design/RideFlow_Dashboard.png`

### SC-003 Create Trip

Route:

- `/trips/new`

Must include:

- Required fields: name, destination, start date, end date.
- Optional fields: origin, pace.
- Validation summary.
- Create CTA.

### SC-004 Planning

Route:

- `/trips/[tripId]`

Default tab:

- Planning

Must include:

- Sidebar.
- Trip tabs: Planning, Memories, Expenses.
- Teal date rail.
- Timeline agenda.
- Route map panel.
- Add item action.
- Place search entry point.
- AI draft entry point.
- Members entry point.

Visual reference:

- `publics/design/Planning.png`

### SC-005 Place Search

Surface:

- Right panel, drawer, modal, or route sub-state inside Planning.

Must include:

- Query input.
- Quick hints.
- Result list.
- Source badges.
- Pin action.
- Manual fallback.
- Error retry.

### SC-006 AI Draft

Surface:

- Right panel, drawer, modal, or route sub-state inside Planning.

Must include:

- Preference prompt.
- Suggestion chips.
- Generate CTA.
- Draft preview.
- Append action.
- Replace action with confirmation.
- Failure state.

### SC-007 Members

Surface:

- Trip panel or tab sub-state.

Must include:

- Member list.
- Role badges.
- Pending invite state.
- Invite action for Owner.
- Read-only state for Planner and Viewer.

### SC-008 Mobile Agenda

Viewport:

- 360px to 430px wide.

Must include:

- Sticky trip header.
- Day picker.
- Agenda list.
- Primary actions reachable without horizontal scroll.
- Bottom sheet edit pattern.

### SC-009 Memories

Tab:

- Memories

Must include:

- Album/journal spread.
- Photo collage.
- Location/day metadata.
- PDF export action.

Visual reference:

- `publics/design/Memories.png`

### SC-010 Expenses

Tab:

- Expenses

Must include:

- Expense breakdown donut chart.
- Category legend.
- Transaction table.

Visual reference:

- `publics/design/Expenses.png`

## Data And Security Requirements

- SR-001: Supabase Auth is the auth system.
- SR-002: Supabase Postgres stores trip, member, day, timeline, place snapshot, and AI draft records.
- SR-003: Row Level Security shall enforce trip membership.
- SR-004: Viewer write attempts shall be rejected by the database/backend.
- SR-005: Planner member-management attempts shall be rejected by the database/backend.
- SR-006: Unknown request data shall be parsed before entering application/domain code.
- SR-007: AI and OSM/provider responses shall be parsed before becoming timeline data.
- SR-008: Secrets shall be read from environment variables and never committed.

## UX State Requirements

- UX-001: Loading states shall appear for auth submit, trip create, search, draft generation, and save.
- UX-002: Empty states shall appear for no trips, no timeline items, no search results, and no members besides owner.
- UX-003: Error states shall include one useful next action.
- UX-004: Viewer read-only state shall explain why controls are disabled.
- UX-005: Realtime disconnected state shall not block local reading.
- UX-006: Mobile bottom sheets shall be dismissible and keyboard-safe.
- UX-007: Form controls shall have labels and accessible names.
- UX-008: Icon-only controls shall have tooltips or accessible labels.

## Visual Requirements

- VR-001: Default app theme is light neutral, not full dark neon.
- VR-002: Primary accent is deep teal.
- VR-003: RideFlow motorcycle wordmark is the primary logo.
- VR-004: Dashboard cards are image-led.
- VR-005: Planning uses teal date rail and itinerary-plus-map split.
- VR-006: Timeline cards include stop number, time, title, metadata, and optional image.
- VR-007: Memories uses album/journal treatment.
- VR-008: Expenses uses clean chart plus table treatment.
- VR-009: No Garage or Community feed appears in V1 navigation.
- VR-010: Layout must avoid clipping, overlap, and horizontal overflow on desktop and mobile.

## Acceptance Test Matrix

| Requirement Area | Unit | Integration | E2E | Visual |
| --- | --- | --- | --- | --- |
| Auth forms | Yes | Yes | Yes | Yes |
| Create trip/date generation | Yes | Yes | Yes | No |
| Role permissions | Yes | Yes | Yes | Yes |
| Timeline validation | Yes | Yes | Yes | Yes |
| Place normalization | Yes | Yes | Yes | Yes |
| Manual place fallback | Yes | Yes | Yes | Yes |
| AI draft validation | Yes | Yes | Yes | Yes |
| Append/replace draft | Yes | Yes | Yes | Yes |
| Realtime sync | No | Yes | Yes | Yes |
| Dashboard visual | No | No | Yes | Yes |
| Planning visual | No | No | Yes | Yes |
| Mobile agenda | No | No | Yes | Yes |
| Memories shell | No | No | Yes | Yes |
| Expenses shell | No | No | Yes | Yes |

## Definition Of Ready

A feature slice is ready for implementation when:

- It maps to one or more requirement IDs in this spec.
- It has a clear user journey or screen contract.
- It identifies affected files.
- It states whether it touches auth, roles, data model, provider adapters, UI only, or tests only.
- It has an acceptance test command or visual proof expectation.

## Definition Of Done

A feature slice is done when:

- Requirements linked to the slice are implemented.
- Unit or integration tests cover product rules.
- UI states required by this spec are visible.
- Permission enforcement exists outside the UI for protected mutations.
- Visual output is checked against the relevant reference image or accepted mockup.
- Mobile layout is checked for the affected screen.
- `git status --short` is clean except intentionally ignored local artifacts.
- Known blockers are documented in the proof notes.

## Recommended Implementation Slices

### Slice 001: Stabilize Foundation

Scope:

- Restore local Node/pnpm workflow.
- Confirm root workspace scripts.
- Confirm Vitest can run on main.
- Update docs if setup differs.

Requirement IDs:

- SR-008
- Definition Of Done support

Proof:

- `pnpm test`
- `pnpm build` when environment is available

### Slice 002: Visual App Shell And Dashboard

Scope:

- Sidebar navigation.
- RideFlow logo.
- Dashboard trip cards.
- New trip card.

Requirement IDs:

- FR-007 through FR-018
- VR-001 through VR-004
- SC-002

Proof:

- Desktop screenshot compared to `publics/design/RideFlow_Dashboard.png`.
- Mobile dashboard screenshot.

### Slice 003: Create Trip Flow

Scope:

- Create trip form.
- Trip date validation.
- Trip day generation.
- Owner membership.

Requirement IDs:

- FR-019 through FR-024
- J-002

Proof:

- Unit tests for date range.
- Integration test for create trip.
- E2E create trip happy path.

### Slice 004: Planning Workspace Shell

Scope:

- Trip tabs.
- Teal date rail.
- Agenda-plus-map split.
- Empty day state.

Requirement IDs:

- FR-025 through FR-031
- FR-095 through FR-102
- SC-004
- VR-005

Proof:

- Desktop screenshot compared to `publics/design/Planning.png`.
- Empty day screenshot.

### Slice 005: Timeline CRUD

Scope:

- Add, edit, move, delete timeline items.
- Timeline inspector.
- Viewer read-only enforcement.

Requirement IDs:

- FR-032 through FR-047
- Permission matrix timeline rows

Proof:

- Unit tests for timeline validation.
- Integration tests for timeline use cases.
- E2E edit item flow.

### Slice 006: Place Search And Pinning

Scope:

- Seed provider.
- OSM provider boundary.
- Manual fallback.
- Pin place snapshot.

Requirement IDs:

- FR-048 through FR-057
- Provider contracts

Proof:

- Unit tests for normalization.
- Integration test for search and pin.
- Visual proof of result states.

### Slice 007: Members And Invites

Scope:

- Member list.
- Invite by email.
- Role update.
- Permission enforcement.

Requirement IDs:

- FR-058 through FR-065
- J-005

Proof:

- Unit tests for permissions.
- Integration tests for invite and role update.
- Viewer access-denied visual proof.

### Slice 008: AI Draft

Scope:

- Mock/local AI provider.
- Draft validation.
- Preview.
- Append/replace apply.

Requirement IDs:

- FR-066 through FR-075
- Provider contracts

Proof:

- Unit tests for draft validation.
- Integration tests for append and replace.
- Visual proof of draft preview and failure state.

### Slice 009: Realtime Sync

Scope:

- Timeline subscription.
- Last-write-wins behavior.
- Disconnected status.

Requirement IDs:

- FR-076 through FR-080

Proof:

- Integration or E2E multi-client simulation.
- Visual proof of sync status.

### Slice 010: Mobile Agenda

Scope:

- Mobile trip header.
- Horizontal day picker.
- Bottom sheet editing.

Requirement IDs:

- FR-081 through FR-086
- SC-008

Proof:

- Mobile screenshots at 360px and 430px.
- E2E mobile viewport happy path.

### Slice 011: Memories Shell

Scope:

- Memories tab surface.
- Album/journal layout.
- PDF export CTA placeholder.

Requirement IDs:

- FR-087 through FR-090
- SC-009

Proof:

- Desktop screenshot compared to `publics/design/Memories.png`.
- Mobile fallback screenshot.

### Slice 012: Expenses Shell

Scope:

- Expenses tab surface.
- Donut chart.
- Transaction table.

Requirement IDs:

- FR-091 through FR-094
- SC-010

Proof:

- Desktop screenshot compared to `publics/design/Expenses.png`.
- Mobile fallback screenshot.

## Open Implementation Constraints

- IC-001: Local WSL currently does not expose native `pnpm`; setup must be fixed before reliable test/build proof.
- IC-002: Google Places is not available for V1; do not block on Google API keys.
- IC-003: AI provider may start as mock/local until API credentials and cost policy are approved.
- IC-004: Memories and Expenses have approved visual references but should not delay Planning core.
- IC-005: Worktree cleanup has been completed; future feature branches should start from `main`.

## Change Control

Any change that affects one of these areas must update this spec before implementation:

- role permissions
- data model
- route structure
- provider contracts
- screen inventory
- visual reference sources
- V1 non-goals
- testing/proof expectations

Small copy and visual polish can be handled in implementation plans if they do not change product behavior.
