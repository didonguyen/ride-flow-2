# US-RF-011 Memories Shell

## Status

planned

## Lane

normal

## Product Contract

The Memories tab renders an album/journal layout (not a social feed) and exposes
a PDF export action. In V1 this is a shell or demo-backed surface that shows
sample content; full upload and storage behavior ships in a follow-up story.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 011 + RF-013 + FR-087..FR-090 + SC-009)
- `docs/specs/001-rideflow-v1/tasks.md` (row 17, plan detail tbd)
- `publics/design/Memories.png` (visual reference)

## Acceptance Criteria

- The Memories tab is reachable from the trip detail page (Planning | Memories |
  Expenses).
- Album/journal layout: a photo collage with location/day metadata; never a feed
  scroll.
- PDF export button: downloads `trip-<id>-memories.pdf` (placeholder; a static file
  is acceptable in V1).
- Empty state: "No memories yet. Add photos during or after your trip."
- Demo-backed content: when no `memory_entries` rows exist, render 3-4 fixture
  entries with stock photos.
- NO social-feed look: no like/comment/share buttons, no infinite scroll.

## Design Notes

- Tailwind grid: 2-3 columns on desktop, 1 column on mobile.
- Photo tile: rounded corners with an optional caption overlay.
- PDF export: use `jspdf` or `react-pdf`; V1 only needs a placeholder, not a
  production-grade layout.
- Data source: query the `memory_entries` table (already in the migration). V1 can
  return empty and render the fixture instead.
- Shell pattern: the component reads from Supabase and falls back to fixtures when
  the result set is empty.
- Per spec NG-005, "Memories may ship as shell or demo-backed surfaces first" — V1
  is fine to land as a shell.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Render test with empty + fixture data (planned) |
| Integration | Schema contract for `memory_entries` (US-RF-002) |
| E2E | Not run in V1; the PDF export is a client-side action |
| Platform | Desktop + mobile responsive |
| Release | Not applicable |

## Harness Delta

- No change to Harness.

## Evidence (none yet)

- Code has not been committed.

## Open follow-up

- Plan detail: break the work into tasks in `plan.md` (add Task 17) or write a
  story-specific plan.
- Components: `apps/web/components/memories/{album-grid,memory-tile,export-button}.tsx`.
- Pick the PDF library: `jspdf` (~50KB) or `react-pdf` (~200KB).
- Visual proof: screenshot compared to `publics/design/Memories.png`.
- After V1: full upload, storage, and timeline behavior (see spec "Future
  MemoryEntry").
