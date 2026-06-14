# US-RF-010 Mobile Agenda

## Status

planned

## Lane

normal

## Product Contract

On mobile viewports (360-430px wide), the trip view prioritizes agenda content: a
sticky trip header, a horizontal day picker, an agenda list, and a primary action
reachable without horizontal scroll. The Owner and Planner edit items through a
bottom sheet. The Viewer sees a read-only state.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 010 + RF-012 + FR-081..FR-086 + SC-008)
- `docs/specs/001-rideflow-v1/tasks.md` (row 16, plan detail tbd)
- `publics/design/Planning.png` (visual reference, mobile variant)

## Acceptance Criteria

- Trip detail page renders responsively: ≥ 1024px uses the desktop layout
  (sidebar + agenda + map); < 1024px uses the mobile layout (header + day picker +
  agenda + bottom sheet for edits).
- Mobile layout passes the Lighthouse mobile audit with a score ≥ 90.
- Sticky trip header: trip name + destination + dates; never scrolls out of view.
- Horizontal day picker: swipe horizontally to change day, with the current day
  highlighted.
- Bottom sheet: hosts the item edit form; dismisses via swipe-down or backdrop tap.
- Save/cancel buttons inside the bottom sheet must not be hidden by the keyboard
  (FR-085).
- No horizontal overflow at the 360px width (FR-086).
- The Viewer sees a read-only state (no Edit button, bottom sheet disabled).

## Design Notes

- Use the Tailwind `md:` breakpoint to switch layouts.
- Bottom sheet: Radix UI Dialog or custom CSS with `fixed bottom-0` plus a transform
  transition.
- Keyboard handling: the `visualViewport` API detects keyboard show/hide and adjusts
  the bottom padding.
- Horizontal day picker: CSS `scroll-snap`; no third-party library needed.
- Hide the map panel on mobile (reduce noise); focus on the agenda. Per FR-031,
  "Map shall not be the only way".

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Component test for the mobile header + day picker (planned) |
| Integration | Existing schema + use case pass (US-RF-003, US-RF-005) |
| E2E | Playwright mobile project (US-RF-009) running the trip detail at the 360px viewport |
| Platform | Chrome DevTools mobile + Pixel 7 device emulation |
| Release | Not applicable |

## Harness Delta

- No change to Harness.

## Evidence (none yet)

- Code has not been committed.

## Open follow-up

- Plan detail: break the work into tasks in `plan.md` (add Task 16) or write a
  story-specific plan.
- Mobile breakpoint testing: 360px, 414px, 430px.
- Bottom sheet component (Radix Dialog with the `position="bottom"` variant).
- Visual regression snapshot for the mobile trip view.
