# US-RF-005 Timeline CRUD + Drag

## Status

planned

## Lane

normal

## Product Contract

The Owner and Planner can create, edit, drag (snapping to a 15-minute grid), and
delete timeline items that belong to a trip day. An item carries a start time,
duration, title, notes, and place snapshot. The Viewer cannot mutate. Items render
in chronological order.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 005 (timeline part) + RF-005, RF-006, RF-007)
- `docs/specs/001-rideflow-v1/plan.md` (Task 9, 10, 12)
- `docs/specs/001-rideflow-v1/tasks.md` (rows 9-9.1, 10-10.3, 12)

## Acceptance Criteria

- `addTimelineItemUseCase`:
  - Rejects when the actor is a viewer with `timeline_mutation_forbidden`
  - Rejects an empty title with `timeline_title_required`
  - Rejects an invalid time format with `timeline_time_invalid`
  - Rejects a non-positive duration with `timeline_duration_invalid`
  - Calls `repository.addItem(...)` with the validated item
- `moveTimelineItemUseCase`:
  - Rejects when the actor is a viewer
  - Snaps `minutesSinceMidnight` to the 15-minute grid via `snapMinutesToTimeline`
  - Converts to `HH:mm` via `minutesToTime`
  - Calls `repository.moveItem({itemId, startTime})`
- `deleteTimelineItemUseCase`: checks the role, then calls the repository.
- UI: `TimelineDay` sorts by `timeToMinutes` and renders a `TimelineItemCard` with an
  Edit button when `canEdit` is true.
- UI: `DraggableTimeline` (Task 12) uses `@dnd-kit/core` with `pixelsPerHour=80`, and
  snaps minutes via `pixelDeltaToTimelineMinutes`.
- DB: `timeline_items` carries the full column set (`start_time`, `duration_minutes`,
  `title`, `notes`, `place_source`, `place_source_id`, `place_name`, `place_address`,
  `place_lat`, `place_lng`, `place_external_url`, `updated_by`).

## Design Notes

- The domain rule `validateTimelineItemDraft` from `domain/timeline.ts` uses the time
  pattern `^([01]\d|2[0-3]):([0-5]\d)$`.
- `snapMinutesToTimeline` clamps to the 0..1439 range and rounds to a multiple of 15.
- Drag math: `pixelDeltaToTimelineMinutes({originalMinutes, deltaY, pixelsPerHour})`
  converts pixels to minutes and snaps.
- Item render order: ascending `timeToMinutes`; ordering stays stable across edits.
- RLS in the DB: `timeline_items_insert_planners`, `_update_planners`, `_delete_planners`
  (owner + planner); the viewer is rejected at the DB.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `pnpm --dir apps/web test tests/application/timeline-use-cases` → 8 pass (use cases) |
| Unit | `pnpm --dir apps/web test tests/application/timeline-view` → 1 pass (render order) — **planned** |
| Unit | `pnpm --dir apps/web test tests/application/drag-time` → 1 pass (drag math) — **planned** |
| Integration | `pnpm --dir apps/web test tests/infrastructure/schema-contract` → 5 pass (covers `timeline_items`) |
| E2E | Not run; planned in US-RF-009 (drag interaction flow) |
| Platform | `pnpm build` (CI evidence from `d3f8639`, `f385f5a`) |
| Release | Not applicable |

## Harness Delta

- No change to Harness.

## Evidence (partial)

- `apps/web/src/application/timeline/{types,add-item,move-item,delete-item}.ts` exist
- Use-case tests: 8 pass (proof.md "Timeline Use Cases")
- Git: `d3f8639 feat: add timeline use cases`, `f385f5a fix:` (move-item patch)
- **Open merge**: the `codex/rideflow-v1-app-shell-dashboard` worktree carries
  `f07bb76 feat:add-rideflow-timeline-inspector`, `6bc74be feat:add-rideflow-planning-shell`,
  and `923c204 feat: wire rideflow planning core` — none are merged into main yet.
- UI components plus the drag layer (`components/timeline/*`, Task 10 and 12) have not
  been committed; re-verify tests when they land.

## Open follow-up

- Wire the 3 use cases into the Supabase repository (same pattern as `createTripAction`).
- Implement `apps/web/components/timeline/{timeline-day,timeline-item-card,timeline-item-form,draggable-timeline}.tsx`
  (Task 10 + 12).
- Build the trip detail page `apps/web/app/(app)/trips/[tripId]/page.tsx` using
  `TimelineDay` and the form.
- E2E test that drags an item by 30 minutes and verifies the 15-minute snap.
