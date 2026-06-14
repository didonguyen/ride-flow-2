# US-RF-004 Members & Invites

## Status

implemented

## Lane

high-risk

## Product Contract

The Owner invites a member by email with role `planner` or `viewer`. The Owner can
change a member's role or remove the member. The invited user accepts the invite
through the `accept_trip_invite` RPC at sign-in. Planner and Viewer cannot manage
members, and Viewer cannot mutate trip data.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 005 + RF-009 + FR-058..FR-065 + J-005)
- `docs/specs/001-rideflow-v1/plan.md` (Task 8)
- `docs/specs/001-rideflow-v1/tasks.md` (row 8)
- `apps/web/src/domain/permissions.ts`

## Acceptance Criteria

- `inviteMemberUseCase`:
  - Rejects when the actor is not the owner with `member_manage_forbidden`
  - Validates the email format and rejects `member_email_invalid` otherwise
  - Rejects the role `owner` (only `planner` and `viewer` are allowed) with `member_role_invalid`
  - Normalizes the email to lowercase trimmed
  - Calls `repository.inviteMember({tripId, email, role})`
- `updateMemberRoleUseCase`:
  - Rejects when the actor is not the owner with `member_manage_forbidden`
  - Rejects the role `owner` for the new value with `member_role_invalid`
  - Calls `repository.updateMemberRole({memberId, role})`
- `apps/web/components/trips/member-list.tsx` shows the member list with a role badge
  and the invite status.
- Database RLS: `trip_members` insert/update/delete is restricted to the owner.
- Tests cover the 3 invite use-case cases plus 1 update-role case.

## Design Notes

- The domain rule `canManageMembers(role)` lives in `domain/permissions.ts`; it is reused
  for both invite and update.
- RLS policies in the migration:
  - `trip_members_insert_owner`: only the trip owner can insert a new member
  - `trip_members_update_owner`: only the owner can update
  - `trip_members_delete_owner`: only the owner can delete
- Email pattern check: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (lightweight; full validation lives
  in the DB `citext` column).
- Race: two concurrent invites for the same email → the
  `trip_members_unique_email_per_trip` index rejects the duplicate.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `pnpm --dir apps/web test tests/application/invite-member` → 4 pass |
| Unit | `pnpm --dir apps/web test tests/application/update-member-role` → 3 pass |
| Integration | `pnpm --dir apps/web test tests/infrastructure/schema-contract` → 5 pass (covers `trip_members` RLS) |
| E2E | Not run; planned in US-RF-009 (invite flow + accept flow) |
| Platform | `pnpm build` (CI evidence from `af4d1cc`) |
| Release | Not applicable |

## Harness Delta

- No change to Harness.

## Evidence

- `apps/web/src/application/members/{types,invite-member,update-member-role}.ts` exist
- `apps/web/components/trips/member-list.tsx` exists
- Tests: 4 + 3 = 7 pass (proof.md "Members & Invites")
- Git: `af4d1cc feat: add trip member role use cases`

## Risk gates (high-risk)

- Auth (invite requires the owner role check)
- Authorization (role assignment and change)
- Audit/security (the `pending` → `accepted` transition is logged via `accepted_at`)

Requires human confirmation before changing the permission matrix or the invite/accept
flow.
