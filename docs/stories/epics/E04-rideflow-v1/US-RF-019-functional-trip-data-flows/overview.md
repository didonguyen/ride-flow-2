# Overview

## Current Behavior

RideFlow has polished pages for trip creation, planning, memories, and expenses.
Trip creation writes basic Supabase records. Planning, memories, and expenses
still rely heavily on fixture data or local-only state for their main actions.

## Target Behavior

Trip creation stores full trip basics and a cover image without trip budget
fields. Planning actions persist to Supabase. Memories store trip-level album
entries with images. Expenses store records with paid-by and participant shares.
Local/dev seed data proves the main flows.

## Affected Users

- Owner
- Planner
- Viewer

## Affected Product Docs

- `docs/product/rideflow-v1.md`
- `docs/superpowers/specs/2026-06-21-rideflow-functional-trip-data-flows-design.md`

## Non-Goals

- Trip-level budget or budget currency.
- Real payment settlement.
- Per-day memory grouping.
- Custom unequal expense shares.

