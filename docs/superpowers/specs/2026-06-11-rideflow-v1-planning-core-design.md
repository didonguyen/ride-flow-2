# RideFlow V1 Planning Core Design

Date: 2026-06-11
Status: Approved for implementation planning

## Product Intent

RideFlow is a collaborative trip-planning app for group leaders and delegated planners. V1 focuses on the planning core: creating a trip, inviting collaborators, searching or entering places, pinning places into a time-based itinerary, and using AI to generate an editable first draft.

The rebuild deliberately narrows the product. V1 should prove that RideFlow can make group trip planning feel structured, fast, and collaborative before adding money settlement, memories, templates, or public sharing.

## V1 Core Loop

1. A user signs up or signs in with email and password.
2. An Owner creates a trip with name, main destination, start date, and end date.
3. RideFlow creates trip days from the selected date range.
4. The Owner invites members and assigns each one Owner, Planner, or Viewer access.
5. Owners and Planners build each day on a time-based timeline.
6. Owners and Planners search for places, manually enter places, and pin place snapshots into the itinerary.
7. Owners and Planners can generate an AI draft after the trip exists, preview it, and apply it to the timeline.
8. Other open clients receive near-realtime timeline updates after a few seconds.
9. Desktop users get the richest planning workflow; mobile and tablet users can view, edit, and perform simplified touch dragging.

## Out Of Scope For V1

- Expense tracking and settlement.
- Photo or memory timeline.
- Trip template export and import.
- Public sharing, marketplace, or discovery.
- Map-first planning.
- Full realtime multiplayer features such as live cursors, soft locks, or conflict prompts.
- Advanced activity history.
- Custom per-user permission switches.

These are phase 2+ product areas. They should not shape the V1 schema or UI beyond leaving clean extension points.

## Roles And Permissions

Permissions are scoped per trip. V1 has no organization or workspace layer.

### Owner

- Create and edit trip metadata.
- Invite and remove members.
- Change Planner and Viewer roles.
- Create, edit, move, and delete timeline items.
- Search places and pin places to the itinerary.
- Generate and apply AI drafts.
- Delete the trip.

### Planner

- View the trip.
- Create, edit, move, and delete timeline items.
- Search places and pin places to the itinerary.
- Generate and apply AI drafts.
- Cannot invite or remove members.
- Cannot change member roles.
- Cannot delete the trip.

### Viewer

- View the trip and itinerary.
- Cannot edit timeline items.
- Cannot search and pin places into the trip.
- Cannot generate AI drafts.
- Cannot manage members.

Permission checks must exist in the UI and in the backend/database layer. Hiding controls in the interface is not sufficient enforcement.

## Invite Flow

The Owner invites a member by email.

If the invited email belongs to an existing account, the invited user can accept the invite and access the trip with the assigned role. If the email does not belong to an account yet, the invite link should lead the user through sign-up and then attach them to the trip.

V1 should support invite states: pending and accepted.

## Timeline UX

The main trip screen is timeline-first.

Each trip has multiple trip days. Each day has timeline items ordered by time.

Each timeline item contains:

- start time
- title
- place snapshot
- duration
- notes

Desktop behavior:

- The planner can switch days from the trip page.
- The day view shows a time-based vertical timeline.
- The planner can drag an item along the time axis to update its start time.
- The planner can use a form or sheet to edit title, place, duration, and notes.
- Place search opens as a secondary panel.
- Map viewing is optional and secondary, usually through a map preview or external map link.

Mobile and tablet behavior:

- The itinerary remains time-based.
- Touch drag is supported, but with simpler interaction than desktop.
- Editing uses a bottom sheet or similarly compact form.
- The app stays usable for viewing and small changes while traveling.

## Collaboration Model

V1 uses near-realtime collaboration, not full multiplayer editing.

When an Owner or Planner changes the timeline, other users viewing the trip should receive the updated itinerary after a short delay. Supabase Realtime is the preferred implementation path, with lightweight polling as an acceptable fallback if a specific screen needs it.

Conflict behavior is last write wins. The most recent valid update becomes the source of truth. V1 will not implement live cursors, soft locks, or conflict resolution prompts.

## Place Search

The app should be designed as if Google Places may be used later, but V1 must not depend on Google Places because API access is currently unavailable for the target context.

All place search calls go through a provider boundary:

```ts
interface PlaceSearchProvider {
  searchPlaces(query: string, options: PlaceSearchOptions): Promise<PlaceSearchResult[]>;
  getPlaceDetails(placeId: string): Promise<PlaceDetails | null>;
}
```

V1 uses a hybrid provider:

- Seed dataset for popular Vietnam destinations and demo stability.
- OpenStreetMap-compatible adapter for broader real-world search.
- Manual place fallback for names, addresses, coordinates, or Google Maps links that are not found by search.

Place results should use a Google-Places-friendly shape:

```ts
type PlaceSearchResult = {
  id: string;
  source: "seed" | "osm" | "manual" | "google";
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  category?: string;
  externalUrl?: string;
  metadata?: Record<string, unknown>;
};
```

When a place is pinned to a timeline item, RideFlow stores a snapshot of the fields needed for the itinerary. Existing trips must continue to work if the provider changes later.

## AI Draft

AI draft generation is optional and happens after a trip has already been created.

Flow:

1. Owner or Planner opens a trip.
2. User clicks Generate draft.
3. App uses trip destination, start date, and end date.
4. User may add a short preference prompt such as "food focused", "family with children", or "low travel intensity".
5. AI returns a structured draft grouped by trip day.
6. App validates the draft before display.
7. User previews the draft.
8. User applies the draft as append or replace if the timeline already has items.

AI output must not overwrite existing timeline items without explicit user confirmation. If AI generation fails, the trip remains fully usable.

AI generation should use a provider boundary:

```ts
interface ItineraryDraftProvider {
  generateDraft(input: ItineraryDraftInput): Promise<ItineraryDraft>;
}
```

This allows a mock or local provider during early development and an OpenAI-backed provider later.

## Recommended Tech Stack

- Next.js App Router with TypeScript for the responsive web app.
- Supabase Auth for email/password authentication and invite support.
- Supabase Postgres for trips, members, roles, timeline items, place snapshots, and draft runs.
- Supabase Realtime for near-realtime timeline updates.
- Supabase Row Level Security for trip-scoped role enforcement.
- Tailwind CSS and shadcn/ui for the UI system.
- Vercel for deployment.

The design is based on current official documentation for Next.js, Supabase, and Vercel checked during brainstorming on 2026-06-11.

## Architecture

The application should keep product rules independent from provider details.

Suggested layers:

- domain: roles, permissions, trip date range rules, timeline item validation, place snapshot types.
- application: create trip, invite member, update member role, create timeline item, move timeline item, apply AI draft.
- infrastructure: Supabase clients, database queries, OpenStreetMap adapter, seed place dataset, AI provider implementation.
- interface/app: Next.js routes, server actions or route handlers, UI components, forms, drag interactions.

Planning logic must not depend directly on Google Places, OpenAI, or a raw Supabase client. External services enter through provider adapters or repository-style boundaries.

Unknown external input must be parsed before entering application or domain code. This includes auth/session claims, route params, request bodies, AI responses, OSM responses, and manual place input.

## Data Model

V1 needs these primary records.

### profiles

- id
- email
- display_name
- created_at

### trips

- id
- name
- destination
- start_date
- end_date
- owner_id
- created_at
- updated_at

### trip_members

- id
- trip_id
- user_id
- invited_email
- role: owner, planner, viewer
- invite_status: pending, accepted
- created_at
- accepted_at

### trip_days

- id
- trip_id
- date
- day_index

### timeline_items

- id
- trip_id
- trip_day_id
- start_time
- duration_minutes
- title
- notes
- place_source
- place_source_id
- place_name
- place_address
- place_lat
- place_lng
- place_external_url
- updated_by
- created_at
- updated_at

### ai_draft_runs

- id
- trip_id
- requested_by
- prompt
- status
- validated_summary
- raw_response
- created_at

Seed place data may start as a versioned file or a database table. The first implementation plan should choose the smallest option that supports search tests and easy replacement.

## Validation Rules

- Trip end date must not be before start date.
- Trip date range creates one trip day per calendar day.
- A timeline item must belong to a trip day from the same trip.
- A timeline item start time must be valid for its trip day.
- Duration must be a positive number of minutes.
- Owner and Planner can create, edit, move, and delete timeline items.
- Viewer can only read trip and timeline data.
- Only Owner can manage members and delete the trip.
- AI draft output must parse into valid draft items before it can be applied.
- Applying an AI draft to a non-empty timeline requires an explicit append or replace choice.

## Testing And Proof

Expected proof for V1:

- Unit tests for date range generation, role permissions, timeline item validation, place result normalization, and AI draft validation.
- Integration tests for create trip, invite member, update member role, add timeline item, move timeline item, delete timeline item, search place, pin place, generate draft, and apply draft.
- End-to-end happy path covering sign in, create trip, invite planner, open trip, search place, pin place, drag to change time, and observe the updated itinerary.
- Responsive checks for desktop planning and mobile timeline editing.

## Milestones

1. Foundation: scaffold Next.js/Supabase app, auth shell, layout, environment handling, and test setup.
2. Trip Core: create/list/view trips, generate trip days from date range, and introduce the member model.
3. Roles And Invites: implement Owner/Planner/Viewer permission checks, invite flow, and RLS/backend enforcement.
4. Timeline Core: create/edit/delete timeline items, validate items, and build the responsive timeline view.
5. Place Search: add seed dataset, OpenStreetMap adapter, manual fallback, and place snapshot pinning.
6. Drag Timeline: implement desktop time-axis drag and simplified mobile touch drag.
7. Near-Realtime Sync: subscribe to timeline updates and confirm last-write-wins behavior.
8. AI Draft: generate draft preview, validate output, and apply with append or replace.
9. Hardening: add loading, empty, error, and access-denied states; complete tests; prepare deployment.

## Phase 2 Candidates

- Expense tracking and end-of-trip settlement.
- Photo memory timeline.
- Export/import trip templates.
- Public sharing or marketplace for attractive trip plans.
- Richer map planning.
- Activity log, soft locks, and better conflict handling.
- Advanced AI planning controls.

## Operational Notes

This repo currently contains the Harness shell and no RideFlow application code. The RideFlow product contract begins with this design.

During context exploration, the documented Harness CLI binary was not present at `scripts/bin/harness-cli`, so the matrix query could not be run. Before implementation starts, the project should either restore the Harness CLI binary or document the replacement command path.
