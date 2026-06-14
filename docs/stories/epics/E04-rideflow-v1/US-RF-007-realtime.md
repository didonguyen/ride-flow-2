# US-RF-007 Realtime Sync

## Status

planned

## Lane

high-risk

## Product Contract

Every timeline update (add/edit/move/delete) syncs to other open clients viewing
the same trip within a few seconds. Conflict policy: last-write-wins. The UI
displays a disconnected/reconnecting state when sync is unavailable.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 009 + RF-011 + FR-076..FR-080)
- `docs/specs/001-rideflow-v1/plan.md` (Task 13)
- `docs/specs/001-rideflow-v1/tasks.md` (row 13)

## Acceptance Criteria

- `timelineChannelName(tripId)` returns `timeline:<tripId>` (stable format).
- `RealtimeTimelineClient` component subscribes to `postgres_changes` on
  `timeline_items` with the filter `trip_id=eq.<tripId>` and calls back `onRefresh`.
- Channel cleanup: `supabase.removeChannel` runs on unmount.
- Disconnected state: when the channel errors, the UI shows a "Reconnecting..." banner
  without blocking local reading (FR-080).
- Last-write-wins: the `updated_at` timestamp is maintained automatically through the
  `touch_updated_at` trigger (already in the Task 5 migration).
- Polling fallback: when Supabase Realtime is unavailable, the route polls
  `/api/timeline/[tripId]` every 5s (FR-078).

## Design Notes

- Use `createSupabaseBrowserClient()` from `infrastructure/supabase/client.ts`.
- Subscribe pattern: `useEffect` on mount + cleanup; dependency `[onRefresh, tripId]`.
- Channel name convention: `timeline:` prefix to avoid collisions with other channels.
- RLS continues to enforce: the client only receives events for trips where the user
  is a member (server-side filter).
- Reconnect: `@supabase/supabase-js` reconnects automatically; the UI only needs to
  surface the state.
- No optimistic update in V1 (FR-079 last-write-wins, kept simple).

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `pnpm --dir apps/web test tests/application/realtime-timeline` → 1 pass (channel name) — **planned** |
| Integration | Multi-client simulation: two browser contexts open the same trip, add an item in A, assert B refreshes — **planned E2E** |
| E2E | Not run; planned in US-RF-009 |
| Platform | Supabase Realtime enabled (CI env) |
| Release | Not applicable |

## Harness Delta

- No change to Harness.

## Evidence (none yet)

- Code has not been committed; everything lives in plan Task 13.

## Risk gates (high-risk)

- Cross-client state consistency
- Authorization (Realtime events filtered through RLS)
- Realtime disconnect UX

## Open follow-up

- Implement `RealtimeTimelineClient` with the cleanup pattern.
- Wire into the trip detail page; show a "Reconnecting..." banner when the channel
  state is not `SUBSCRIBED`.
- Decide the polling fallback when the Realtime channel errors after 3 retries.
- Visual proof: two browser side-by-side, edit in one, the other updates.
