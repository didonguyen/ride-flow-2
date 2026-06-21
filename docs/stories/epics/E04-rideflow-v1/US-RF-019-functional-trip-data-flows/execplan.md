# Exec Plan

## Goal

Make the existing RideFlow trip creation, planning, memories, and expenses
surfaces functional with Supabase-backed data while preserving the current UI
direction.

## Scope

In scope:

- Trip cover image and transport.
- Planning day selection and persisted stop actions.
- Trip-level memories with image upload.
- Expense CRUD with paid-by and participant shares.
- Local/dev seed data.
- Tests and build verification.

Out of scope:

- Trip budget and trip budget currency.
- Real payment settlement.
- Per-day memories.
- Advanced expense reconciliation.

## Risk Classification

Risk flags:

- Data model.
- Authorization.
- Public contracts.
- Existing behavior.
- Weak proof.
- Multi-domain.

Hard gates:

- Authorization.
- Data migration.

## Work Phases

1. Confirm spec approval.
2. Write implementation plan.
3. Add failing tests for domain and application behavior.
4. Add schema migration and generated/manual types.
5. Implement repositories and server actions.
6. Wire UI forms and persisted handlers.
7. Add seed data.
8. Run tests and build.
9. Update Harness story evidence and trace.

## Stop Conditions

Pause for human confirmation if:

- A production Supabase project must be modified directly.
- Existing data would need destructive migration.
- Browser verification cannot run and no acceptable alternative proof exists.
- The UI must choose between preserving old fixture visual content and showing
  only real empty states.

