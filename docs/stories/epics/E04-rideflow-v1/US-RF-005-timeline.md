# US-RF-005 Timeline CRUD + Drag

## Status

implemented

## Lane

normal

## Product Contract

The Owner and Planner can create, edit, drag (snapping to a 15-minute grid), and
delete timeline items that belong to a trip day. An item carries a start time,
duration, title, notes, and place snapshot. The Viewer cannot mutate. Items render
in chronological order after a drag.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 005 (timeline part) + RF-005, RF-006, RF-007)
- `docs/specs/001-rideflow-v1/plan.md` (Task 9, 10, 12)

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
- UI: `ItineraryTimeline` sorts by `timeToMinutes` and renders a `TimelineItemCard` with an
  Edit button when `canEdit` is true.
- UI: `DraggableTimeline` uses `@dnd-kit/core` with `pixelsPerHour=80`, and
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
- `DraggableTimeline` (Task 12) wraps each item in `useDraggable` with a 4px activation
  distance and applies a `transform: translate3d(delta.x, delta.y, 0)` while dragging.
  On `onDragEnd`, the delta is fed to `pixelDeltaToTimelineMinutes` and the new
  `minutesSinceMidnight` is passed to the workspace state.
- Workspace state `movePlanningAgendaItem({itemId, minutesSinceMidnight})` updates the
  item's `time`, re-sorts the agenda by parsed minutes, and renumbers the `stop` field.
- The move is currently applied to the local workspace state only. Wiring the move to
  the Supabase repository (via a server action) is a follow-up; the repository already
  exposes `moveItem` and the move use case is already covered by `tests/application/timeline-use-cases.test.ts`.
- Item render order: ascending `timeToMinutes`; ordering stays stable across edits.
- RLS in the DB: `timeline_items_insert_planners`, `_update_planners`, `_delete_planners`
  (owner + planner); the viewer is rejected at the DB.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `pnpm --dir apps/web test tests/application/timeline-use-cases` → 8 pass (use cases) |
| Unit | `pnpm --dir apps/web test tests/application/timeline-view` → 4 pass (build + move) |
| Unit | `pnpm --dir apps/web test tests/domain/drag-time` → 6 pass (drag math) |
| Integration | `pnpm --dir apps/web test tests/infrastructure/schema-contract` → 5 pass (covers `timeline_items`) |
| E2E | Not run; Playwright chromium unsupported on host (same as US-RF-014, US-RF-015) |
| Platform | `pnpm build` passes |
| Release | Not applicable |

Story proof update:

```bash
scripts/bin/harness-cli story update --id US-RF-005 --status implemented --unit 1 --integration 1 --e2e 0 --platform 0
```

Story verification command:

```bash
scripts/bin/harness-cli story update --id US-RF-005 --verify "pnpm --dir apps/web test"
```

## Harness Delta

- New tests: `tests/domain/drag-time.test.ts` (6), `tests/application/timeline-view.test.ts` (4).
- New component: `apps/web/components/planning/draggable-timeline.tsx`.
- New domain helper: `pixelDeltaToTimelineMinutes` in `apps/web/src/domain/timeline.ts`.
- New workspace state function: `movePlanningAgendaItem` in `apps/web/src/application/trips/planning-workspace-state.ts`.
- ItineraryTimeline extended with optional `renderItem` prop.

## Open follow-up

- Wire `DraggableTimeline.onMoveItem` to `moveTimelineItemUseCase` via a server action
  and the Supabase repository, so drag changes persist. The repository method
  `createSupabaseTimelineRepository().moveItem(...)` is already implemented; only the
  server action and wiring are missing.
- E2E test that drags an item by 30 minutes and verifies the 15-minute snap (blocked by
  Playwright chromium host limit).

## Evidence

- `pnpm --dir apps/web test`: 29 files / 106 tests pass (was 27 / 96 before this slice).
- `pnpm --dir apps/web build`: pass.
- `pnpm --dir apps/web lint`: pass (warnings only, no errors).
- Trip detail `/trips/da-nang` returns 200 and includes `aria-grabbed` and
  `aria-label="Drag <id> up or down to change its time"` on each item.
