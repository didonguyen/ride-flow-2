# Design

## Domain Model

The story extends the existing trip, day, member, and timeline model with
trip-level memories and expense entries. Memories belong to a trip, not a trip
day. Expenses belong to a trip and have one paid-by member plus one or more
participant shares.

## Application Flow

Create-trip actions validate trip basics, create trip/day/member records, upload
a cover image when present, and redirect to the new trip. Planning actions use
server actions and Supabase repositories for stop create, update, move, delete,
and place pinning. Memories and expenses use server actions with form-backed
CRUD.

## Interface Contract

The existing Next.js routes remain:

- `/trips`
- `/trips/new`
- `/trips/:tripId`
- `/trips/:tripId/memories`
- `/trips/:tripId/expenses`

Server actions return redirect/query-param errors for page forms and throw only
unexpected infrastructure errors.

## Data Model

Add trip cover and transport columns. Add `memory_entries`, `memory_assets`,
`expense_entries`, and `expense_participants`. Add RLS policies that let trip
members read and only owners/planners mutate.

Trip budget columns are not part of this story.

## UI / Platform Impact

The existing editorial UI remains the baseline. New forms and controls should
fit the current modal/card language, preserve existing test ids where practical,
and avoid marketing-style redesign.

## Observability

No new external observability is required. Harness trace evidence and test
output are sufficient for this story.

## Alternatives Considered

1. Fixture-backed surfaces: rejected because the requested behavior needs real
   data.
2. Trip-level budget: rejected by user correction.
3. Full settlement/payment flow: deferred to a later story.

