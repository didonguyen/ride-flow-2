# US-RF-008 AI Draft

## Status

planned

## Lane

normal

## Product Contract

The Owner or Planner generates an AI itinerary draft from a destination, a date
range, and an optional preference prompt. The draft must pass schema validation
before it can be previewed. Apply modes are `append` and `replace` (replace
requires explicit confirmation). An AI failure must not block manual planning.

## Relevant Product Docs

- `docs/specs/001-rideflow-v1/spec.md` (Slice 008 + RF-010 + FR-066..FR-075 + J-006)
- `docs/specs/001-rideflow-v1/plan.md` (Task 14)
- `docs/specs/001-rideflow-v1/tasks.md` (row 14)
- Provider contract in `spec.md` (TypeScript `ItineraryDraftProvider` interface)

## Acceptance Criteria

- `ItineraryDraftProvider` interface: `generateDraft({destination, days, preferencePrompt}) → ItineraryDraft`.
- 2 provider implementations:
  - `MockItineraryDraftProvider` (default when no API key is set; 1 item per day with
    a 120-minute duration)
  - `OpenAIItineraryDraftProvider` (`gpt-4.1-mini`,
    `response_format: {type: "json_object"}`)
- Domain `validateItineraryDraft(value)` returns
  `Result<ItineraryDraft, "ai_draft_days_required" | "ai_draft_invalid">`.
- API route `/api/ai/draft` accepts POST `{destination, days, preferencePrompt}` and
  returns `{draft}` or 422 with an error code.
- UI `AiDraftPanel`:
  - Preference prompt textarea
  - Suggestion chips (food focused, slow pace, family friendly)
  - Generate button
  - Draft preview grouped by day
  - Append / Replace action with a confirm dialog for replace (FR-073)
- `ai_draft_runs` table stores run history: `prompt`, `status`
  (pending/succeeded/failed/applied), `validated_summary`, `raw_response`.

## Design Notes

- Schema validation: Zod `itineraryDraftSchema` enforcing the standard
  `days[].items[]` shape.
- OpenAI prompt: send the JSON schema to the model, parse the response, and validate.
- Failure mode: when the provider throws, the route returns
  `{error: "ai_draft_failed"}`; manual planning keeps working.
- Mock default: for one trip day produce one item at `09:00` lasting 120 minutes with
  the title `Explore <destination>`.
- Apply logic: append adds new items, replace first shows a warning dialog and only
  deletes existing items in scope once the user confirms.
- Audit: each run records `requested_by` and the raw response (even on failure) for
  debugging.

## Validation

| Layer | Expected proof |
| --- | --- |
| Unit | `pnpm --dir apps/web test tests/infrastructure/ai-draft-provider` → 1 pass (mock generate) — **planned** |
| Unit | `pnpm --dir apps/web test tests/domain/ai-draft` → 3 pass (validation, already in US-RF-001) |
| Integration | API route smoke with the mock provider — **planned** |
| E2E | Not run; planned in US-RF-009 (mock draft → preview → apply) |
| Platform | `pnpm build` (planned) |
| Release | Not applicable |

## Harness Delta

- No change to Harness.

## Evidence (partial)

- Domain: `apps/web/src/domain/ai-draft.ts` + `tests/domain/ai-draft.test.ts` 3 pass
  (in the US-RF-001 bundle).

## Open follow-up

- Implement the 2 providers, the route, and the UI panel.
- Add an `applyDraftUseCase` (append/replace) with permission checks.
- Decide the cost policy: OpenAI key plus a budget cap (open question, see spec IC-003).
- Wire the `ai_draft_runs` write path (currently schema only).
- Visual proof: draft preview cards match the `publics/design/Planning.png` style.
