# RideFlow V1 Product Contract

RideFlow V1 is a responsive web app for collaborative trip planning.

## Primary User

The primary user is a group trip Owner or delegated Planner who needs to turn a trip idea into a time-based itinerary that other members can view and help refine.

## V1 Behaviors

- Users sign up and sign in with email and password.
- An Owner creates a trip with name, destination, start date, and end date.
- The system creates one trip day per date in the trip range.
- The Owner invites members by email and assigns Owner, Planner, or Viewer access.
- Owners and Planners create, edit, move, and delete timeline items.
- Viewers can read trip data but cannot mutate planning data.
- Owners and Planners search places through seed data, OpenStreetMap, or manual input.
- Pinned places are stored as snapshots on timeline items.
- Owners and Planners may generate an AI itinerary draft, preview it, and apply it as append or replace.
- Timeline changes sync to other open clients within a short delay.
- Owners and Planners can add shared trip-level memories with optional title,
  optional content, and one or more images.
- Owners and Planners can add, edit, and delete expenses, choose who paid, and
  choose which trip members joined the expense.
- Expenses can show derived category totals, recent transactions, per-person
  averages, and basic member balances.
- Trip creation does not collect or store trip-level budget or trip-level budget
  currency.

## V1 Non-Goals

- Payment settlement and payment reconciliation.
- Per-day memory grouping and advanced memory timeline behavior.
- Trip-level budget planning.
- Template export and import.
- Public sharing or marketplace.
- Map-first planning.
- Full multiplayer conflict handling.
