# RideFlow V1 Product UI Design

Date: 2026-06-12
Status: Draft for user review

## Purpose

This document defines the visual product direction for the RideFlow V1 rebuild. It complements the approved planning-core design from 2026-06-11 and narrows the interface around one product promise: help a trip Owner or Planner turn a rough group-trip idea into a clear, time-based itinerary.

The design should feel like a focused planning workspace, not a biker social network or a map demo. It keeps the best identity cues from the first RideFlow app while removing features and visual treatments that made the original feel broad.

## Source Inspiration From RideFlow V1 Legacy

The first RideFlow web app at `https://ride-flow-vercel.vercel.app/#/` uses a dark midnight palette, cyan accents, glass panels, Leaflet maps, AI itinerary creation, expense tracking, community sharing, garage/vehicle management, settings, profile, and route-oriented trip views.

Keep these ideas:

- The RideFlow brand should still feel connected to travel, roads, maps, timing, and motion.
- AI planning should begin from destination, origin, date range, transport style, pace, and notes.
- Place curation should support searching, selecting, pinning, opening maps, and using quick hints.
- Maps should be available as context, but planning remains itinerary-first.
- Expense, memories, and templates should remain visible future modules, not V1 centerpieces.

Reduce or remove these ideas from V1:

- Deep garage and vehicle-maintenance management.
- Social/community feed behavior.
- Heavy neon glassmorphism across the entire app.
- Map-first layouts that hide the timeline.
- Marketing-first landing screens after sign-in.

## Design Positioning

RideFlow V1 should sit between three familiar patterns:

- Apple Calendar: clean day navigation, exact times, calm schedule density.
- Apple/Google Maps: recognizable place cards, map context, route awareness.
- Notion/Linear: structured workspace, command-like actions, clear permission states.

The target visual phrase is: calm planning cockpit for group travel.

## Design Principles

1. Timeline first, map second.
2. Every screen should answer what the trip is, what day is being planned, and what needs attention next.
3. Owner and Planner workflows should feel fast; Viewer screens should feel calm and clearly read-only.
4. AI should produce editable structure, not a magical final answer.
5. Place search should look provider-neutral so seed data, OpenStreetMap, manual entries, and future Google Places share one UI.
6. Mobile should be agenda-first because most mobile usage happens while traveling or quickly checking the plan.
7. Phase 2 modules may be visible as quiet nav entries or disabled previews, but they must not compete with the V1 planning core.

## Visual System

### Color

Use a light neutral workspace as the default theme.

- App background: warm off-white or very light gray.
- Surface: white.
- Primary text: near-black slate.
- Secondary text: muted slate.
- Borders: soft gray.
- Primary accent: RideFlow cyan, used sparingly for active state, key buttons, and route markers.
- Secondary travel accents: green for nature/outdoors, amber for food/time warnings, blue for map/route context.

The legacy midnight/cyan identity should appear in selected moments:

- Auth visual preview.
- Trip cover/hero strip.
- AI draft panel.
- Optional dark mode later.

Avoid full-page purple gradients, heavy bokeh, and overly dark glass dashboards for the core workspace.

### Typography

Use a modern sans typeface such as Geist or Inter.

- Page titles: confident but not oversized.
- Timeline times: tabular or mono-like treatment for quick scanning.
- Place metadata: compact, muted, one or two lines max.
- Buttons and labels: sentence case.

No negative letter spacing. Do not use hero-scale text inside the app workspace.

### Layout Density

RideFlow is a planning tool, so it should be compact enough for real work.

- Cards use radius 8px or less unless the existing design system requires otherwise.
- Avoid nested cards.
- Use panels, dividers, and sticky toolbars instead of floating card stacks.
- The first viewport after login should show usable app content, not explanatory marketing copy.

### Iconography

Use lucide-style line icons for common actions:

- Calendar, MapPin, Search, Sparkles, Users, Lock, Eye, Clock, Route, Plus, MoreHorizontal.
- Icon-only controls require tooltips.
- Primary actions should use icon plus text when the action is not universally obvious.

## Information Architecture

V1 navigation should include these visible app surfaces:

- Trips
- Current Trip Workspace
- Members
- Settings

V1 can show these phase 2 placeholders only as low-emphasis future modules:

- Expenses
- Memories
- Templates

The default signed-in destination is `Trips`, not a landing page.

## Screen Inventory

The Stitch-style design board should include the following screens and states.

### 1. Sign Up

Purpose: convert a new user while immediately showing what RideFlow helps them build.

Desktop layout:

- Left side: sign-up form.
- Right side: live preview of a sample "Da Nang Food Trip" itinerary.
- Preview includes a trip title, day tabs, two to three timeline items, a mini map strip, and one AI suggestion card.

Mobile layout:

- Form first.
- Preview collapses below the form as a small trip card.

States:

- Empty fields.
- Loading submit.
- Validation error.
- Existing account prompt.

### 2. Sign In

Purpose: fast account access.

Desktop layout mirrors sign-up but uses a smaller trip preview. The focus is returning to the workspace.

States:

- Invalid credentials.
- Forgot password link placeholder.
- Invite-link context, if the user arrived from an invite.

### 3. Trips Dashboard

Purpose: choose or create a trip.

Layout:

- Top bar with RideFlow mark, search, profile, and create trip button.
- Main section with active trips first.
- Trip cards show destination, date range, members, planning progress, next unresolved day, and role badge.
- Empty state shows one clear create-trip call to action.

Card content:

- Trip name.
- Destination.
- Date range.
- Owner/Planner/Viewer badge.
- Last updated.
- Mini day progress indicator.

### 4. Create Trip

Purpose: collect minimum required trip data and optionally seed an AI draft after creation.

Fields:

- Trip name.
- Main destination.
- Start date.
- End date.
- Optional origin.
- Optional travel style or pace.

Behavior:

- Creating a trip only creates the trip and trip days.
- AI draft is offered after creation, not forced inside the form.

### 5. Trip Workspace

Purpose: the main planning screen.

Desktop layout uses three columns:

- Left rail: trip switcher, day list, members summary, phase 2 nav placeholders.
- Center: selected day agenda/timeline.
- Right panel: contextual inspector that can show place search, selected item details, AI draft, members, or map context.

Top workspace bar:

- Trip name and destination.
- Date range.
- Role badge.
- Sync status.
- Invite button for Owner.
- Generate draft button for Owner/Planner.

Center timeline:

- Day heading.
- Time ruler.
- Timeline items sorted by start time.
- Add-item affordance between time blocks.
- Empty day prompt with "Add stop" and "Ask AI for draft".

Timeline item card:

- Start time.
- Duration.
- Title.
- Place name and address.
- Small category chip.
- Notes preview.
- Drag handle for editable users.
- Read-only lock treatment for Viewers.

### 6. Selected Timeline Item Inspector

Purpose: edit one itinerary item without losing the day context.

Inspector fields:

- Title.
- Start time.
- Duration.
- Place snapshot.
- Notes.
- Delete action.

Behavior:

- Owner/Planner can edit.
- Viewer sees read-only details and open-map actions.
- Unsaved changes show clear save/cancel controls.

### 7. Place Search Panel

Purpose: find or create a place and pin it to a timeline item.

Layout:

- Search input at top.
- Provider-neutral results list.
- Result cards show name, category, address, source badge, and map/open-link action.
- Manual place fallback is always visible when there are no good results.
- Saved candidates can be pinned later.

Sources:

- Seed
- OpenStreetMap
- Manual
- Google later

States:

- Empty query with quick hints.
- Loading.
- Results.
- No results with manual fallback.
- Provider error with graceful retry.

### 8. AI Draft Panel

Purpose: generate an editable skeleton itinerary.

Layout:

- Prompt field with lightweight chips such as food focused, family friendly, slow pace, photo spots.
- Draft preview grouped by day.
- Each suggested item shows confidence/source notes when available.
- Apply choices: append or replace.

Rules:

- AI output never overwrites existing timeline items without explicit replace confirmation.
- Invalid draft items are shown as review-needed instead of silently applied.
- Failure keeps the trip usable.

### 9. Members And Permissions

Purpose: manage collaboration without turning V1 into a full organization system.

Layout:

- Member list with avatar, email, role, invite state.
- Owner can invite, remove, and change Planner/Viewer roles.
- Planner can view member list but cannot manage.
- Viewer sees who is in the trip.

States:

- Pending invite.
- Accepted member.
- Invite error.
- Access denied for management actions.

### 10. Mobile Trip Agenda

Purpose: make the plan usable while traveling.

Mobile layout:

- Sticky trip header.
- Horizontal day picker.
- Agenda list as primary view.
- Bottom tab or action bar for Timeline, Places, AI, Members.
- Edit forms open in bottom sheets.
- Place details open as bottom sheet with map preview.

Mobile priority:

1. Read today's plan.
2. Add or edit a stop.
3. Search and pin a place.
4. View members and role state.

### 11. Access And Empty States

Required states:

- Not signed in.
- Invite required.
- Viewer read-only.
- Trip not found.
- Empty trip list.
- Empty day.
- Search failed.
- AI failed.
- Realtime disconnected.

Each state should explain the situation in one short sentence and provide one useful next action.

## Component Inventory

Primary components:

- `AppShell`
- `AuthPreviewTrip`
- `TripsDashboard`
- `TripCard`
- `CreateTripForm`
- `TripWorkspaceShell`
- `DayRail`
- `TimelineDay`
- `TimelineItemCard`
- `TimelineItemInspector`
- `PlaceSearchPanel`
- `PlaceResultCard`
- `ManualPlaceForm`
- `AiDraftPanel`
- `MembersPanel`
- `RoleBadge`
- `SyncStatus`
- `MobileAgenda`
- `BottomSheet`

Components should separate product logic from provider implementation. For example, `PlaceSearchPanel` receives normalized place results and does not know whether they came from seed data, OpenStreetMap, manual entry, or Google.

## Interaction Rules

### Timeline Editing

- Clicking a timeline item selects it and opens the inspector.
- Dragging an item on desktop changes start time.
- Mobile drag may be simplified or delayed until the core form edit path is stable.
- Invalid moves are blocked before submit and explained inline.

### Place Pinning

- A user may search first, then pin a result into a new or selected timeline item.
- Pinned places are snapshots.
- Manual places use the same visual treatment as provider results, with a manual source badge.

### Role Restrictions

- Viewer controls are visible as read-only where helpful, not simply missing everywhere.
- Disabled controls should explain that editing requires Owner or Planner access.
- Backend and database permissions remain the source of truth.

### AI Draft

- AI starts from existing trip metadata.
- User can add short preferences.
- Draft preview is reviewable before apply.
- Applying to non-empty timelines requires append or replace.

## Design Board Requirements

The visual board shown to the user should display all major pages together:

1. Sign Up
2. Sign In
3. Trips Dashboard
4. Create Trip
5. Desktop Trip Workspace
6. Selected Item Inspector
7. Place Search
8. AI Draft
9. Members and role states
10. Mobile Agenda
11. Empty/error/access states

The board should be high fidelity enough to judge layout, density, visual tone, and navigation. It does not need real backend data.

## Future Extension Slots

Expense tracking, memories, and templates should appear as future modules only after the planning core feels solid.

When these modules return:

- Expenses should attach to trip members and timeline items where useful.
- Memories should attach to timeline days/items and render as a trip journal.
- Templates should export/import a curated trip plan, not user-private member data.

## Validation Expectations

Before implementing the visual redesign, proof should include:

- Static review against this spec.
- Desktop screenshot of the design board or implemented pages.
- Mobile screenshot of the agenda state.
- Basic responsive check for no clipping or overlap.
- Accessibility spot check for form labels, button names, focus states, and read-only role messaging.

## Open Decisions Closed By This Spec

- Default app style is light neutral workspace, not full dark neon.
- Legacy midnight/cyan identity is retained as accent and preview treatment.
- V1 is timeline-first, not map-first.
- Garage and community-feed concepts are removed from V1 navigation.
- Expenses, memories, and templates remain phase 2 modules.
- AI draft is a structured panel inside planning, not the primary navigation.

## Implementation Boundary

This document does not authorize changing the app UI yet. It defines the design to review. After user approval, the next step is an implementation plan for either:

- a standalone `/design` mockup route for visual approval, or
- the actual product UI redesign across existing V1 routes.
