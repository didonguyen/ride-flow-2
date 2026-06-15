# Public Landing Page Tasks

Atomic task table mapping: spec RF → file → commit → proof.

| #   | Story    | Spec Ref            | Title                                  | Files (key)                                                                                          | Status | Commit | Evidence |
|-----|----------|---------------------|----------------------------------------|------------------------------------------------------------------------------------------------------|--------|--------|----------|
| 1   | US-RF-014| RF-001..RF-005      | Session-aware root route                | `apps/web/app/page.tsx`                                                                              | planned | —      | —        |
| 2   | US-RF-014| RF-022..RF-025      | Sticky transparent header               | `apps/web/components/landing/landing-header.tsx`                                                    | planned | —      | —        |
| 3   | US-RF-014| RF-013..RF-021      | Hero with Unsplash background           | `apps/web/components/landing/landing-hero.tsx`                                                      | planned | —      | —        |
| 4   | US-RF-014| RF-026..RF-032      | Features section (4 cards)              | `apps/web/components/landing/landing-features.tsx`                                                  | planned | —      | —        |
| 5   | US-RF-014| RF-033..RF-038      | How it works (3 steps)                  | `apps/web/components/landing/landing-how-it-works.tsx`                                              | planned | —      | —        |
| 6   | US-RF-014| RF-039..RF-042      | Visual preview block                    | `apps/web/components/landing/landing-preview.tsx`                                                   | planned | —      | —        |
| 7   | US-RF-014| RF-043..RF-045      | Final CTA band                          | `apps/web/components/landing/landing-final-cta.tsx`                                                 | planned | —      | —        |
| 8   | US-RF-014| RF-046..RF-048      | Footer                                  | `apps/web/components/landing/landing-footer.tsx`                                                    | planned | —      | —        |
| 9   | US-RF-014| RF-002..RF-006      | Landing page composition                | `apps/web/components/landing/landing-page.tsx`                                                      | planned | —      | —        |
| 10  | US-RF-014| RF-015              | next/image Unsplash remote pattern      | `apps/web/next.config.ts`                                                                            | planned | —      | —        |
| 11  | US-RF-014| E2E                 | Playwright smoke spec                   | `apps/web/tests/e2e/landing.spec.ts`                                                                | planned | —      | —        |
| 12  | US-RF-014| Validation          | Build, lint, unit, E2E pass             | —                                                                                                   | planned | —      | —        |
| 13  | US-RF-014| Documentation       | Update TEST_MATRIX and proof bundle     | `docs/TEST_MATRIX.md`, `docs/specs/002-public-landing/proof.md`                                    | planned | —      | —        |
| 14  | US-RF-014| Trace               | Record trace and friction if any        | `scripts/bin/harness-cli trace`, optional `backlog add`                                             | planned | —      | —        |
