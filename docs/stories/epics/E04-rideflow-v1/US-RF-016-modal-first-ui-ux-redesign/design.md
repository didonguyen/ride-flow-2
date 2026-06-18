# Design

## Domain Model

No domain model changes. RideFlow keeps the existing auth user, trip, trip day, and trip member rules from V1.

## Application Flow

Auth:

- `signInAction` and `signUpAction` remain the server action entrypoints.
- `normalizeAuthRedirect` remains the redirect guard.
- Modal and fallback pages share the same auth panel content.

Create trip:

- `createTripFromFormData` remains the application entrypoint.
- The form fields remain `name`, `destination`, `startDate`, and `endDate`.
- Modal and fallback pages share the same create-trip panel content.

## Interface Contract

Routes retained:

- `/`
- `/sign-in`
- `/sign-up`
- `/trips`
- `/trips/new`

Primary interaction changes:

- Landing buttons open modals.
- Dashboard new-trip CTA opens a modal.
- Fallback routes render the same panels as the modal content.

## Data Model

No database changes. No migrations. No RLS changes.

## UI / Platform Impact

- Shared UI primitives live under `apps/web/components/ui/`.
- Auth modal content lives under `apps/web/components/auth/`.
- Create-trip modal content lives under `apps/web/components/trips/`.
- Desktop dialogs are centered.
- Mobile dialogs behave like bottom sheets.
- Focus is trapped and restored through Radix Dialog.

## Observability

No new logs or audit records. Validation evidence is captured through tests, screenshots, and Harness trace.

## Alternatives Considered

1. Keep standalone pages only.
   - Rejected because it preserves current friction and does not meet the requested modal-first UX.
2. Replace auth actions with client fetch APIs for inline modal errors.
   - Deferred because it increases auth surface area. Preserve server actions first.
3. Install shadcn CLI and generated components.
   - Rejected for this spec because the needed dependencies already exist and manual primitives avoid unnecessary package churn.
