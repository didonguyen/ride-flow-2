# RideFlow V1 Product UI Design

Date: 2026-06-12
Updated: 2026-06-13
Status: Revised from user-provided visual screens

## Purpose

This document defines the visual product direction for the RideFlow V1 rebuild. It complements the approved planning-core design from 2026-06-11 and narrows the interface around one product promise: help a trip Owner or Planner turn a rough group-trip idea into a clear, time-based itinerary.

The design should feel like a focused planning workspace, not a biker social network or a map demo. It keeps the best identity cues from the first RideFlow app while removing features and visual treatments that made the original feel broad.

## User-Provided Visual Reference Screens

The 2026-06-13 design update is based on the user's edited RideFlow assets now copied into the project:

- `docs/design/RideFlow_logo.png`
- `docs/design/RideFlow_Dashboard.png`
- `docs/design/Planning.png`
- `docs/design/Memories.png`
- `docs/design/Expenses.png`

These screens are now the primary visual reference for the RideFlow UI direction. Future mockups and implementation should preserve their structure, density, brand treatment, and core interaction model unless the user explicitly approves a change.

### Visual Reference Summary

The updated design direction has four visible product surfaces:

1. Dashboard: image-led trip cards and a clear new-trip entry point.
2. Planning: itinerary-first trip planning with a route map beside the agenda.
3. Memories: travel album and journal view with photo collage treatment.
4. Expenses: trip expense breakdown with transaction history.

Planning remains the V1 core workflow. Memories and Expenses are allowed to appear as top-level surfaces in the design system and navigation, but implementation can still phase them after the planning core if needed.

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
- Wanderlog: practical trip dashboard, day itinerary, and map-adjacent planning.
- Polarsteps: emotionally rich trip memories, travel album rhythm, and visual journey recap.

The target visual phrase is: image-led travel workspace with a calm planning cockpit at its center.

## Design Principles

1. Timeline and route planning first; map context stays visible but does not replace the itinerary.
2. Every screen should answer what the trip is, what day is being planned, and what needs attention next.
3. Owner and Planner workflows should feel fast; Viewer screens should feel calm and clearly read-only.
4. AI should produce editable structure, not a magical final answer.
5. Place search should look provider-neutral so seed data, OpenStreetMap, manual entries, and future Google Places share one UI.
6. Mobile should be agenda-first because most mobile usage happens while traveling or quickly checking the plan.
7. Memories and Expenses may be visible as first-class design surfaces, but they must not compete with Planning as the first implementation priority.

## Visual System

### Color

Use a light neutral workspace as the default theme.

- App background: very light cool gray.
- Surface: white.
- Primary text: near-black slate.
- Secondary text: muted slate.
- Borders: soft gray with subtle elevation.
- Primary accent: deep teal, used for selected sidebar items, segmented tabs, primary buttons, date rail, and route markers.
- Secondary travel accents: mint/teal for food and transport categories, red for stay/lodging, amber for activities and warnings, light blue for maps and water.

The legacy midnight/cyan identity should appear in selected moments:

- Auth visual preview.
- Trip date rail and planning header.
- AI draft panel.
- Optional dark mode later.

Avoid full-page purple gradients, heavy bokeh, and overly dark glass dashboards for the core workspace.

### Brand Mark

Use the black RideFlow motorcycle wordmark from `docs/design/RideFlow_logo.png` as the main brand asset.

Logo usage:

- Prefer the black logo on white or very light gray backgrounds.
- Place the logo at the top of the left sidebar.
- Keep generous whitespace around the logo; do not crowd it with navigation.
- Do not recolor the logo by default.
- When a compact mark is needed, derive it from the motorcycle/wordmark silhouette only after a separate approved asset pass.

### Typography

Use a modern sans typeface such as Geist or Inter for app chrome and product UI.

- Page titles: confident but not oversized.
- Timeline times: tabular or mono-like treatment for quick scanning.
- Place metadata: compact, muted, one or two lines max.
- Buttons and labels: sentence case.
- Memories journal copy may use a handwriting-style font only inside the album/journal content area.

No negative letter spacing. Do not use hero-scale text inside the app workspace.

### Layout Density

RideFlow is a planning tool with travel media moments, so it should be compact enough for real work while still letting destination imagery carry the dashboard and memories surfaces.

- Navigation and utility panels use restrained radius.
- Image trip cards may use medium rounded corners to match the supplied dashboard screen.
- Itinerary item cards use compact rounded corners and visible media thumbnails.
- Avoid nested cards.
- Use panels, dividers, sticky sidebars, and segmented top tabs instead of floating card stacks.
- The first viewport after login should show usable app content, not explanatory marketing copy.

### Iconography

Use lucide-style line icons for common actions:

- Dashboard grid, Map, PlusCircle, Compass, Settings, Calendar, MapPin, Search, Sparkles, Users, Lock, Eye, Clock, Route, Download, MoreHorizontal.
- Icon-only controls require tooltips.
- Primary actions should use icon plus text when the action is not universally obvious.

## Information Architecture

V1 navigation should include these visible app surfaces:

- Left sidebar:
  - RideFlow logo
  - Dashboard
  - Trips
  - New Trip
  - Explore
  - User profile block
  - Settings
- Trip-level top segmented navigation:
  - Planning
  - Memories
  - Expenses

Planning is the default trip tab. Memories and Expenses can ship later, but the design system treats them as real tabs so the product feels like a complete trip workspace.

The default signed-in destination is `Trips`, not a landing page.

## Screen Inventory

The Stitch-style design board should include the following screens and states. The user-provided dashboard, planning, memories, and expenses screens are stronger source material than the earlier generic board requirements.

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

- Fixed left sidebar with the RideFlow motorcycle logo at the top.
- Main page title: `Trips Dashboard`.
- Section title: `Recent Trips`.
- Image-led trip cards in a multi-column grid.
- Cards use large destination photos with a white information panel overlaid near the bottom.
- The first row should include examples like `Da Nang Trip`, `Japan Spring Escape`, and `Bali Surf & Chill`.
- A dashed-outline new-trip card appears below the recent trips with plus icon and `Bắt đầu chuyến đi mới`.
- User profile and Settings sit at the bottom of the sidebar.

Card content:

- Trip name.
- Destination.
- Date range.
- Optional role/progress metadata may be added later, but it should not clutter the image-first card treatment.

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

Desktop layout uses a sidebar plus split planning canvas:

- Left sidebar: RideFlow logo, Dashboard, Trips, New Trip, Explore, profile, Settings.
- Top segmented tab: Planning, Memories, Expenses.
- Planning header/date rail: deep teal band with day cards and weather. Active day is white; inactive days are translucent teal panels.
- Center-left agenda column: numbered timeline with a vertical dotted line, stop number circles, and itinerary cards.
- Center-right map column: large map preview with route line and numbered pins, visible beside the itinerary.

Planning header:

- Previous/next round arrow controls flank the date rail.
- Day cards show day label, date, and weather, for example `DAY 1`, `Sat, Oct 26`, `72°F`.
- The teal header anchors the route/planning identity.

Agenda items:

- Cards include time, title, description, optional rating, directions link, and a right-side image thumbnail.
- Stop numbers align to the vertical itinerary line.
- Example item types include flight, hotel, dinner, activity, and local stops.
- The map remains visually secondary to the itinerary because the agenda column carries the editable plan.

Timeline item card:

- Start time.
- Duration.
- Title.
- Place name and address.
- Small category chip.
- Notes preview.
- Drag handle for editable users.
- Read-only lock treatment for Viewers.
- Destination image thumbnail.

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

### 12. Memories

Purpose: turn a completed or in-progress trip into an emotionally rich album.

Layout:

- Same left sidebar and top segmented tab shell as Planning.
- Active top tab: `Memories`.
- Page title format: `Day 32 - Ella, Sri Lanka`.
- Primary content is a two-column album spread inside a white paper-like surface.
- Left page includes location pin card, coordinates, destination label, handwritten-style journal text, day/weather/altitude footer, stamped day marker, and a large travel photo.
- Right page uses a collage of travel photos with slight rotation, white photo borders, tape overlays, and soft shadows.
- Primary action: `Export as PDF Album`.

Visual rules:

- Memories may use a warmer, more editorial rhythm than Planning.
- The album should feel like a printable travel book, not a social feed.
- Use handwriting typography only for journal body copy; keep navigation and buttons in the main app sans-serif.

### 13. Expenses

Purpose: summarize and audit trip spending without overtaking the planning workflow.

Layout:

- Same app shell and top segmented tab shell as Planning.
- Active top tab: `Expenses`.
- Page title format: `Trip Expense Manager: Da Nang`.
- Main sections:
  - `Expense Breakdown` card with donut chart and total in the center.
  - Legend with categories such as Food, Stay, Transport, Activities.
  - `Transaction History` table with date, category, description, and amount.
- Category icons use soft colored square backgrounds.

Visual rules:

- Expenses should be clean and financial, but still part of the travel app.
- Avoid heavy analytics dashboards.
- Use donut chart and table as the primary pattern.

## Component Inventory

Primary components:

- `AppShell`
- `SidebarNav`
- `TopTripTabs`
- `AuthPreviewTrip`
- `TripsDashboard`
- `TripCard`
- `NewTripCard`
- `CreateTripForm`
- `TripWorkspaceShell`
- `PlanningDateRail`
- `TimelineDay`
- `TimelineItemCard`
- `TimelineItemInspector`
- `RouteMapPanel`
- `PlaceSearchPanel`
- `PlaceResultCard`
- `ManualPlaceForm`
- `AiDraftPanel`
- `MembersPanel`
- `MemoriesAlbum`
- `JournalPage`
- `PhotoCollage`
- `ExpensesBreakdown`
- `TransactionHistory`
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
11. Memories album
12. Expenses manager
13. Empty/error/access states

The board should be high fidelity enough to judge layout, density, visual tone, navigation, route planning, trip memory, and expense summary. It does not need real backend data.

Use the supplied user screens as direct visual references:

- Dashboard should preserve the image-led card grid and left sidebar.
- Planning should preserve the teal date rail, itinerary-plus-map split, numbered vertical timeline, and thumbnail itinerary cards.
- Memories should preserve the album/journal spread, collage photos, and PDF export action.
- Expenses should preserve the donut breakdown and transaction table.

## Future Extension Slots

Templates should remain a future module. Memories and Expenses now have approved visual direction and may appear in navigation, but implementation can still defer their full behavior until after the planning core.

When these modules return:

- Expenses should attach to trip members and timeline items where useful.
- Memories should attach to timeline days/items and render as a trip journal.
- Templates should export/import a curated trip plan, not user-private member data.

## Validation Expectations

Before implementing the visual redesign, proof should include:

- Static review against this spec.
- Static review against the five user-provided reference images.
- Desktop screenshot of the design board or implemented pages.
- Mobile screenshot of the agenda state.
- Basic responsive check for no clipping or overlap.
- Accessibility spot check for form labels, button names, focus states, and read-only role messaging.

## Open Decisions Closed By This Spec

- Default app style is light neutral workspace, not full dark neon.
- The RideFlow motorcycle wordmark is the primary logo.
- Deep teal is the primary interaction and route accent.
- V1 planning uses an itinerary-plus-map split, not a map-only experience.
- Garage and community-feed concepts are removed from V1 navigation.
- Memories and Expenses have visible design surfaces; Templates remains phase 2.
- AI draft is a structured panel inside planning, not the primary navigation.

## Implementation Boundary

This document does not authorize changing the app UI yet. It defines the design to review. After user approval, the next step is an implementation plan for either:

- a standalone `/design` mockup route for visual approval, or
- the actual product UI redesign across existing V1 routes.
