# US-RF-012 Expenses Shell

## Status

planned

## Lane

normal

## Product Contract

The Expenses tab renders a trip expense breakdown: a donut chart by category and
a transaction history table. In V1 this is a shell or demo-backed surface that
shows sample content; full settlement ships in a follow-up story.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 012 + RF-014 + FR-091..FR-094 + SC-010)
- `docs/specs/001-rideflow-v1/tasks.md` (row 18, plan detail tbd)
- `publics/design/Expenses.png` (visual reference)

## Acceptance Criteria

- The Expenses tab is reachable from the trip detail page (Planning | Memories |
  Expenses).
- Donut chart: distribution by `category` (food, transport, accommodation,
  activities, other). Render with `recharts` or `chart.js`; 5-6 fixed categories in V1.
- Transaction history table: date, description, paid_by, amount, currency, category.
  Sort by date descending.
- Empty state: "No expenses recorded yet."
- Demo-backed content: when no `expense_entries` rows exist, render 5-6 fixture
  transactions.
- NO settlement or payment logic in V1 (FR-094 is a future spec).

## Design Notes

- Chart library: prefer `recharts` (React-friendly, ~100KB).
- Currency: render with
  `Intl.NumberFormat(locale, {style: "currency", currency})`; default to VND for
  Vietnam trips.
- Data source: query the `expense_entries` table. V1 falls back to the fixture.
- Category color: 5-6 distinct colors with accessible contrast.
- "Who paid" renders the member's display name (look up
  `trip_members.user_id` against `profiles.display_name`).
- Per spec NG-005, "Expenses may ship as shell or demo-backed surfaces first" — V1
  is fine to land as a shell.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | Render test for the chart + table (planned) |
| Integration | Schema contract for `expense_entries` (US-RF-002) |
| E2E | Not run in V1; tab switching is client-only |
| Platform | Desktop + mobile responsive |
| Release | Not applicable |

## Harness Delta

- No change to Harness.

## Evidence (none yet)

- Code has not been committed.

## Open follow-up

- Plan detail: break the work into tasks in `plan.md` (add Task 18) or write a
  story-specific plan.
- Components: `apps/web/components/expenses/{donut-chart,transaction-table,empty-state}.tsx`.
- Currency formatting: locale-aware (VND, USD, EUR support).
- Visual proof: screenshot compared to `publics/design/Expenses.png`.
- After V1: full settlement (who owes whom), payment reconciliation, multi-currency.
