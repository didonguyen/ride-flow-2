# RideFlow Planning MVP Spec (input)

> Original product spec for the Planning page MVP. Kept here so future
> stories can trace back to the user-provided intent. The living contract
> lives in `docs/product/rideflow-v1.md` and story packets in
> `docs/stories/epics/E04-rideflow-v1/US-RF-021/`.

## Sections captured from the original spec

1. Product direction — Trip → Days → Stops → Options, with one pinned
   option per stop and n backups.
2. Decisions locked — drag & drop, AI + Google Places + Manual option
   sources, `action_needed` / `pinned` only, Owner + Planner mutation
   rights, route overview placeholder, no transport type selector.
3. Planning page layout — 3-column layout: Day Navigator | Timeline |
   Context Panel.
4. Day Navigator — list of days with `Add Day` action.
5. Timeline Planner — ordered stop list with empty state.
6. Stop Card — three variants: action needed, pinned, read-only.
7. Stop Status — `action_needed` | `pinned` only.
8. Option Logic — one pinned, n backups, candidate before pin.
9. Option Sources — `ai` | `google_places` | `manual`.
10. Option Card Spec — candidate / backup / pinned variants.
11. Backup Options — collapsed by default, sortable by manual order /
    rating / distance.
12. Drag & Drop — same-day and cross-day reorder, revert on failure.
13. Add Stop / Edit Stop / Delete Stop flows.
14. Route Overview Panel — placeholder text + map area.
15. AI Suggestions Panel — only suggests, never auto-pins.
16. Permissions — Owner / Planner edit, Member / Viewer read-only.
17. Data Model — `trips`, `trip_days`, `trip_stops`, `stop_options`,
    `trip_members`.
18. Core Service Functions — use cases listed in the spec.
19. UI Components — list of expected components.
20. MVP Acceptance Criteria — Day, Stop, Options, Backup, D&D, Route
    Overview, Permissions.
21. Build Priority — Phase 1 MVP (covered by US-RF-021), Phase 2 smart
    options, Phase 3 route intelligence.

## Phase 1 scope (implemented in US-RF-021)

- Day navigator and timeline layout.
- Stop + Option domain types and validation.
- Pin / unpin / remove use cases with role enforcement.
- Manual / AI / Google Places use case entry points (the providers are
  still injected, real Google Places call lands in Phase 2).
- Drag-and-drop reorder workspace state with cross-day support.
- Route Overview panel placeholder + AI Suggestion panel shell.
- New migration `202606230001_stop_options_phase1.sql` for `trip_stops`
  and `stop_options` tables.
- New route `/trips/[tripId]/planning-v2` rendering the new surface
  from the existing demo trip data via a legacy-to-stops adapter.

## Out of scope (Phase 2 / Phase 3)

- Real Google Places provider call.
- Real AI option generation that calls OpenAI.
- Google Maps embed on the Route Overview panel.
- Server actions wired to the new repositories (the new repositories
  exist; the server actions that bind them to forms land in Phase 2).
- Replacing the legacy `PlanningSurface` for trips that have only
  `timeline_items` data. The V1 surface stays the primary surface
  until Phase 2 migrates data.