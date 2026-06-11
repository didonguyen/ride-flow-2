# RideFlow V1 Planning Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-shaped RideFlow web app focused on collaborative trip planning: auth, trip creation, roles, time-based itinerary editing, hybrid place search, near-realtime updates, and AI draft generation.

**Architecture:** Keep the current Harness repository at the root and add the application as a workspace under `apps/web`. Use small domain modules for product rules, application modules for use cases, Supabase as infrastructure, and Next.js App Router as the interface. Place search and AI draft generation must go through provider boundaries so OpenStreetMap, seed data, mock AI, OpenAI, and future Google Places can be swapped without rewriting planning logic.

**Tech Stack:** Next.js App Router, TypeScript, Supabase Auth/Postgres/Realtime/RLS, Tailwind CSS, shadcn/ui, Vitest, Testing Library, Playwright, Vercel.

---

## Source Spec

Build from `docs/superpowers/specs/2026-06-11-rideflow-v1-planning-core-design.md`.

## File Structure

Create this application structure:

```text
apps/web/
  app/
    (auth)/
      sign-in/page.tsx
      sign-up/page.tsx
    (app)/
      trips/page.tsx
      trips/new/page.tsx
      trips/[tripId]/page.tsx
    api/
      places/search/route.ts
      ai/draft/route.ts
    layout.tsx
    page.tsx
    globals.css
  components/
    auth/
    trips/
    timeline/
    places/
    ai/
    ui/
  src/
    application/
      ai/
      members/
      places/
      timeline/
      trips/
    domain/
      ai-draft.ts
      permissions.ts
      places.ts
      timeline.ts
      trips.ts
    infrastructure/
      ai/
      places/
      supabase/
    lib/
      env.ts
      result.ts
  tests/
    domain/
    application/
    infrastructure/
    e2e/
  vitest.config.ts
  playwright.config.ts
  package.json
supabase/
  migrations/
    202606110001_rideflow_v1_init.sql
docs/product/
  rideflow-v1.md
docs/stories/
  rideflow-v1-planning-core.md
```

Keep app logic out of the root Harness crates. Root package scripts may delegate to `apps/web`.

## Task 1: Workspace And Next.js Scaffold

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `apps/web/package.json`
- Create: `apps/web/app/layout.tsx`
- Create: `apps/web/app/page.tsx`
- Create: `apps/web/app/globals.css`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/postcss.config.mjs`
- Create: `apps/web/components.json`
- Create: `apps/web/src/lib/result.ts`

- [ ] **Step 1: Create the root workspace manifest**

Create `package.json`:

```json
{
  "name": "ride-flow-2",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev": "pnpm --dir apps/web dev",
    "build": "pnpm --dir apps/web build",
    "lint": "pnpm --dir apps/web lint",
    "test": "pnpm --dir apps/web test",
    "test:e2e": "pnpm --dir apps/web test:e2e"
  }
}
```

- [ ] **Step 2: Create pnpm workspace config**

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
```

- [ ] **Step 3: Create the web app package manifest**

Create `apps/web/package.json`:

```json
{
  "name": "@rideflow/web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/modifiers": "^7.0.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@supabase/ssr": "^0.5.1",
    "@supabase/supabase-js": "^2.45.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.468.0",
    "next": "^15.0.0",
    "openai": "^4.73.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.53.0",
    "tailwind-merge": "^2.5.4",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@playwright/test": "^1.49.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/node": "^22.10.1",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.16.0",
    "eslint-config-next": "^15.0.0",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.16",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 4: Create TypeScript config**

Create `apps/web/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/src/*": ["./src/*"],
      "@/components/*": ["./components/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create Next.js config**

Create `apps/web/next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
```

- [ ] **Step 6: Create base app layout**

Create `apps/web/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RideFlow",
  description: "Collaborative trip planning for focused group itineraries"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Create landing redirect page**

Create `apps/web/app/page.tsx`:

```tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
          RideFlow V1
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Plan group trips on a shared timeline.
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Create a trip, invite planners, search places, and pin each stop to a
          time-based itinerary.
        </p>
        <div className="flex gap-3">
          <Link
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            href="/trips"
          >
            Open Trips
          </Link>
          <Link
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium"
            href="/sign-in"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Create global styles**

Create `apps/web/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

body {
  margin: 0;
  background: #f8fafc;
  color: #020617;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 9: Create Tailwind and shadcn config**

Create `apps/web/postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

Create `apps/web/tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
```

Create `apps/web/components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": false
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/src/lib/utils"
  }
}
```

- [ ] **Step 10: Add shared result helper**

Create `apps/web/src/lib/result.ts`:

```ts
export type Result<T, E extends string = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err<E extends string>(error: E): Result<never, E> {
  return { ok: false, error };
}
```

- [ ] **Step 11: Install dependencies**

Run:

```bash
pnpm install
```

Expected: `pnpm-lock.yaml` is created and dependencies install successfully.

- [ ] **Step 12: Verify scaffold**

Run:

```bash
pnpm build
```

Expected: Next.js builds `apps/web` successfully.

- [ ] **Step 13: Commit scaffold**

```bash
git add package.json pnpm-workspace.yaml pnpm-lock.yaml apps/web
git commit -m "chore: scaffold RideFlow web app"
```

## Task 2: Test Setup And Environment Contract

**Files:**
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/tests/setup.ts`
- Create: `apps/web/tests/domain/result.test.ts`
- Create: `apps/web/src/lib/env.ts`
- Create: `apps/web/.env.example`
- Modify: `apps/web/package.json`

- [ ] **Step 1: Add Vitest config**

Create `apps/web/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"]
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
      "@/src": new URL("./src", import.meta.url).pathname,
      "@/components": new URL("./components", import.meta.url).pathname
    }
  }
});
```

- [ ] **Step 2: Add testing setup**

Create `apps/web/tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add a smoke test for the result helper**

Create `apps/web/tests/domain/result.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { err, ok } from "@/src/lib/result";

describe("Result helpers", () => {
  it("creates success and failure results", () => {
    expect(ok("saved")).toEqual({ ok: true, value: "saved" });
    expect(err("invalid")).toEqual({ ok: false, error: "invalid" });
  });
});
```

- [ ] **Step 4: Run test to verify setup passes**

Run:

```bash
pnpm --dir apps/web test tests/domain/result.test.ts
```

Expected: PASS with one test file.

- [ ] **Step 5: Create environment example**

Create `apps/web/.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=replace-with-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=replace-with-local-service-role-key
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
OSM_NOMINATIM_BASE_URL=https://nominatim.openstreetmap.org
```

- [ ] **Step 6: Add parsed environment module**

Create `apps/web/src/lib/env.ts`:

```ts
import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1)
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().min(1).default("gpt-4.1-mini"),
  OSM_NOMINATIM_BASE_URL: z.string().url().default("https://nominatim.openstreetmap.org")
});

export function getPublicEnv() {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });
}

export function getServerEnv() {
  return serverEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    OSM_NOMINATIM_BASE_URL: process.env.OSM_NOMINATIM_BASE_URL
  });
}
```

- [ ] **Step 7: Add environment tests**

Create `apps/web/tests/domain/env.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";

describe("environment parsing", () => {
  it("parses required public environment values", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

    const { getPublicEnv } = await import("@/src/lib/env");

    expect(getPublicEnv()).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
    });
  });
});
```

- [ ] **Step 8: Run tests**

Run:

```bash
pnpm --dir apps/web test
```

Expected: PASS for result and env tests.

- [ ] **Step 9: Commit test setup**

```bash
git add apps/web/vitest.config.ts apps/web/tests apps/web/src/lib/env.ts apps/web/.env.example apps/web/package.json
git commit -m "test: add web test setup and env contract"
```

## Task 3: Domain Rules

**Files:**
- Create: `apps/web/src/domain/permissions.ts`
- Create: `apps/web/src/domain/trips.ts`
- Create: `apps/web/src/domain/timeline.ts`
- Create: `apps/web/src/domain/places.ts`
- Create: `apps/web/src/domain/ai-draft.ts`
- Create: `apps/web/tests/domain/permissions.test.ts`
- Create: `apps/web/tests/domain/trips.test.ts`
- Create: `apps/web/tests/domain/timeline.test.ts`
- Create: `apps/web/tests/domain/places.test.ts`
- Create: `apps/web/tests/domain/ai-draft.test.ts`

- [ ] **Step 1: Write failing permission tests**

Create `apps/web/tests/domain/permissions.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { canManageMembers, canMutateTimeline, canReadTrip } from "@/src/domain/permissions";

describe("trip permissions", () => {
  it("allows owner and planner to mutate timeline", () => {
    expect(canMutateTimeline("owner")).toBe(true);
    expect(canMutateTimeline("planner")).toBe(true);
    expect(canMutateTimeline("viewer")).toBe(false);
  });

  it("allows only owner to manage members", () => {
    expect(canManageMembers("owner")).toBe(true);
    expect(canManageMembers("planner")).toBe(false);
    expect(canManageMembers("viewer")).toBe(false);
  });

  it("allows all trip roles to read", () => {
    expect(canReadTrip("owner")).toBe(true);
    expect(canReadTrip("planner")).toBe(true);
    expect(canReadTrip("viewer")).toBe(true);
  });
});
```

- [ ] **Step 2: Run permission tests and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/domain/permissions.test.ts
```

Expected: FAIL because `@/src/domain/permissions` does not exist.

- [ ] **Step 3: Implement permission rules**

Create `apps/web/src/domain/permissions.ts`:

```ts
export const tripRoles = ["owner", "planner", "viewer"] as const;

export type TripRole = (typeof tripRoles)[number];

export function canReadTrip(role: TripRole): boolean {
  return role === "owner" || role === "planner" || role === "viewer";
}

export function canMutateTimeline(role: TripRole): boolean {
  return role === "owner" || role === "planner";
}

export function canGenerateDraft(role: TripRole): boolean {
  return role === "owner" || role === "planner";
}

export function canManageMembers(role: TripRole): boolean {
  return role === "owner";
}

export function canDeleteTrip(role: TripRole): boolean {
  return role === "owner";
}
```

- [ ] **Step 4: Run permission tests and verify pass**

Run:

```bash
pnpm --dir apps/web test tests/domain/permissions.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write failing trip date tests**

Create `apps/web/tests/domain/trips.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createTripDays, validateTripDateRange } from "@/src/domain/trips";

describe("trip date rules", () => {
  it("accepts an end date after start date", () => {
    expect(validateTripDateRange("2026-07-01", "2026-07-03")).toEqual({
      ok: true,
      value: { startDate: "2026-07-01", endDate: "2026-07-03" }
    });
  });

  it("rejects an end date before start date", () => {
    expect(validateTripDateRange("2026-07-03", "2026-07-01")).toEqual({
      ok: false,
      error: "trip_end_before_start"
    });
  });

  it("creates one trip day per calendar date", () => {
    expect(createTripDays("2026-07-01", "2026-07-03")).toEqual([
      { date: "2026-07-01", dayIndex: 1 },
      { date: "2026-07-02", dayIndex: 2 },
      { date: "2026-07-03", dayIndex: 3 }
    ]);
  });
});
```

- [ ] **Step 6: Run trip tests and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/domain/trips.test.ts
```

Expected: FAIL because `@/src/domain/trips` does not exist.

- [ ] **Step 7: Implement trip date rules**

Create `apps/web/src/domain/trips.ts`:

```ts
import { addDays, formatISO, isAfter, parseISO } from "date-fns";
import { err, ok, type Result } from "@/src/lib/result";

export type TripDateRange = {
  startDate: string;
  endDate: string;
};

export type TripDayDraft = {
  date: string;
  dayIndex: number;
};

function dateOnly(value: Date): string {
  return formatISO(value, { representation: "date" });
}

export function validateTripDateRange(
  startDate: string,
  endDate: string
): Result<TripDateRange, "trip_end_before_start"> {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (isAfter(start, end)) {
    return err("trip_end_before_start");
  }

  return ok({ startDate, endDate });
}

export function createTripDays(startDate: string, endDate: string): TripDayDraft[] {
  const days: TripDayDraft[] = [];
  let cursor = parseISO(startDate);
  const end = parseISO(endDate);
  let dayIndex = 1;

  while (!isAfter(cursor, end)) {
    days.push({ date: dateOnly(cursor), dayIndex });
    cursor = addDays(cursor, 1);
    dayIndex += 1;
  }

  return days;
}
```

- [ ] **Step 8: Run trip tests and verify pass**

Run:

```bash
pnpm --dir apps/web test tests/domain/trips.test.ts
```

Expected: PASS.

- [ ] **Step 9: Write failing timeline tests**

Create `apps/web/tests/domain/timeline.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { snapMinutesToTimeline, validateTimelineItemDraft } from "@/src/domain/timeline";

describe("timeline rules", () => {
  it("accepts a valid timeline item draft", () => {
    expect(
      validateTimelineItemDraft({
        title: "Coffee in Da Nang",
        startTime: "09:30",
        durationMinutes: 60,
        notes: "Start the day slowly"
      })
    ).toEqual({
      ok: true,
      value: {
        title: "Coffee in Da Nang",
        startTime: "09:30",
        durationMinutes: 60,
        notes: "Start the day slowly"
      }
    });
  });

  it("rejects empty title", () => {
    expect(
      validateTimelineItemDraft({
        title: "",
        startTime: "09:00",
        durationMinutes: 30,
        notes: ""
      })
    ).toEqual({ ok: false, error: "timeline_title_required" });
  });

  it("rejects invalid time", () => {
    expect(
      validateTimelineItemDraft({
        title: "Breakfast",
        startTime: "25:00",
        durationMinutes: 30,
        notes: ""
      })
    ).toEqual({ ok: false, error: "timeline_time_invalid" });
  });

  it("rejects non-positive duration", () => {
    expect(
      validateTimelineItemDraft({
        title: "Breakfast",
        startTime: "09:00",
        durationMinutes: 0,
        notes: ""
      })
    ).toEqual({ ok: false, error: "timeline_duration_invalid" });
  });

  it("snaps drag minutes to a fifteen-minute grid", () => {
    expect(snapMinutesToTimeline(548)).toBe(555);
  });
});
```

- [ ] **Step 10: Run timeline tests and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/domain/timeline.test.ts
```

Expected: FAIL because `@/src/domain/timeline` does not exist.

- [ ] **Step 11: Implement timeline rules**

Create `apps/web/src/domain/timeline.ts`:

```ts
import { err, ok, type Result } from "@/src/lib/result";

export type TimelineItemDraft = {
  title: string;
  startTime: string;
  durationMinutes: number;
  notes: string;
};

export type TimelineValidationError =
  | "timeline_title_required"
  | "timeline_time_invalid"
  | "timeline_duration_invalid";

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function validateTimelineItemDraft(
  draft: TimelineItemDraft
): Result<TimelineItemDraft, TimelineValidationError> {
  const title = draft.title.trim();

  if (title.length === 0) {
    return err("timeline_title_required");
  }

  if (!timePattern.test(draft.startTime)) {
    return err("timeline_time_invalid");
  }

  if (!Number.isInteger(draft.durationMinutes) || draft.durationMinutes <= 0) {
    return err("timeline_duration_invalid");
  }

  return ok({
    title,
    startTime: draft.startTime,
    durationMinutes: draft.durationMinutes,
    notes: draft.notes.trim()
  });
}

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(minutesSinceMidnight: number): string {
  const bounded = Math.max(0, Math.min(1439, minutesSinceMidnight));
  const hours = Math.floor(bounded / 60);
  const minutes = bounded % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function snapMinutesToTimeline(minutesSinceMidnight: number): number {
  return Math.max(0, Math.min(1439, Math.round(minutesSinceMidnight / 15) * 15));
}
```

- [ ] **Step 12: Write place and AI domain tests**

Create `apps/web/tests/domain/places.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { normalizeManualPlace } from "@/src/domain/places";

describe("place normalization", () => {
  it("normalizes manual place input", () => {
    expect(
      normalizeManualPlace({
        name: "  My Khe Beach ",
        address: "Da Nang",
        externalUrl: "https://maps.google.com/?q=My+Khe"
      })
    ).toEqual({
      ok: true,
      value: {
        id: "manual:my-khe-beach",
        source: "manual",
        name: "My Khe Beach",
        address: "Da Nang",
        externalUrl: "https://maps.google.com/?q=My+Khe"
      }
    });
  });

  it("rejects blank manual place names", () => {
    expect(normalizeManualPlace({ name: " " })).toEqual({
      ok: false,
      error: "place_name_required"
    });
  });
});
```

Create `apps/web/tests/domain/ai-draft.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateItineraryDraft } from "@/src/domain/ai-draft";

describe("AI draft validation", () => {
  it("accepts a valid draft grouped by day", () => {
    expect(
      validateItineraryDraft({
        days: [
          {
            date: "2026-07-01",
            items: [
              {
                startTime: "09:00",
                durationMinutes: 90,
                title: "Visit Hoi An Ancient Town",
                suggestedPlaceName: "Hoi An Ancient Town",
                notes: "Walk through the old streets"
              }
            ]
          }
        ]
      })
    ).toEqual({
      ok: true,
      value: {
        days: [
          {
            date: "2026-07-01",
            items: [
              {
                startTime: "09:00",
                durationMinutes: 90,
                title: "Visit Hoi An Ancient Town",
                suggestedPlaceName: "Hoi An Ancient Town",
                notes: "Walk through the old streets"
              }
            ]
          }
        ]
      }
    });
  });

  it("rejects drafts without days", () => {
    expect(validateItineraryDraft({ days: [] })).toEqual({
      ok: false,
      error: "ai_draft_days_required"
    });
  });
});
```

- [ ] **Step 13: Run place and AI tests and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/domain/places.test.ts tests/domain/ai-draft.test.ts
```

Expected: FAIL because the domain modules do not exist.

- [ ] **Step 14: Implement place and AI domain modules**

Create `apps/web/src/domain/places.ts`:

```ts
import { err, ok, type Result } from "@/src/lib/result";

export type PlaceSource = "seed" | "osm" | "manual" | "google";

export type PlaceSearchResult = {
  id: string;
  source: PlaceSource;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  category?: string;
  externalUrl?: string;
  metadata?: Record<string, unknown>;
};

export type ManualPlaceInput = {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  externalUrl?: string;
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeManualPlace(
  input: ManualPlaceInput
): Result<PlaceSearchResult, "place_name_required"> {
  const name = input.name.trim();

  if (name.length === 0) {
    return err("place_name_required");
  }

  return ok({
    id: `manual:${slugify(name)}`,
    source: "manual",
    name,
    address: input.address?.trim() || undefined,
    lat: input.lat,
    lng: input.lng,
    externalUrl: input.externalUrl?.trim() || undefined
  });
}
```

Create `apps/web/src/domain/ai-draft.ts`:

```ts
import { z } from "zod";
import { err, ok, type Result } from "@/src/lib/result";

const draftItemSchema = z.object({
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  durationMinutes: z.number().int().positive(),
  title: z.string().trim().min(1),
  suggestedPlaceName: z.string().trim().min(1).optional(),
  notes: z.string().trim().default("")
});

const draftDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  items: z.array(draftItemSchema)
});

export const itineraryDraftSchema = z.object({
  days: z.array(draftDaySchema).min(1)
});

export type ItineraryDraft = z.infer<typeof itineraryDraftSchema>;

export function validateItineraryDraft(
  value: unknown
): Result<ItineraryDraft, "ai_draft_days_required" | "ai_draft_invalid"> {
  const parsed = itineraryDraftSchema.safeParse(value);

  if (!parsed.success) {
    const hasEmptyDays =
      typeof value === "object" &&
      value !== null &&
      "days" in value &&
      Array.isArray((value as { days: unknown }).days) &&
      (value as { days: unknown[] }).days.length === 0;

    return err(hasEmptyDays ? "ai_draft_days_required" : "ai_draft_invalid");
  }

  return ok(parsed.data);
}
```

- [ ] **Step 15: Run all domain tests**

Run:

```bash
pnpm --dir apps/web test tests/domain
```

Expected: PASS.

- [ ] **Step 16: Commit domain rules**

```bash
git add apps/web/src/domain apps/web/tests/domain
git commit -m "feat: add RideFlow domain rules"
```

## Task 4: Product Contract And Story Packet

**Files:**
- Create: `docs/product/rideflow-v1.md`
- Create: `docs/stories/rideflow-v1-planning-core.md`
- Modify: `docs/TEST_MATRIX.md`

- [ ] **Step 1: Create product contract**

Create `docs/product/rideflow-v1.md`:

```markdown
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

## V1 Non-Goals

- Expense tracking and settlement.
- Photo memory timeline.
- Template export and import.
- Public sharing or marketplace.
- Map-first planning.
- Full multiplayer conflict handling.
```

- [ ] **Step 2: Create story packet**

Create `docs/stories/rideflow-v1-planning-core.md`:

```markdown
# RideFlow V1 Planning Core

Lane: high-risk

## Summary

Build the first RideFlow product slice in this repo: collaborative trip planning with auth, roles, timeline editing, place search, near-realtime sync, and AI draft generation.

## Product Docs

- `docs/product/rideflow-v1.md`
- `docs/superpowers/specs/2026-06-11-rideflow-v1-planning-core-design.md`

## Acceptance Criteria

- A user can sign up, sign in, and create a trip.
- A trip creates one day per date in the selected date range.
- An Owner can invite members and assign Owner, Planner, or Viewer access.
- Owner and Planner can create, edit, drag, and delete timeline items.
- Viewer cannot mutate planning data.
- Owner and Planner can search places from seed data, OpenStreetMap, and manual fallback.
- Pinned places persist as timeline item snapshots.
- Owner and Planner can generate, preview, and apply an AI draft.
- Open trip pages receive near-realtime timeline updates.
- The app passes unit, integration, and E2E happy-path tests.

## Proof

- Unit: `pnpm --dir apps/web test tests/domain`
- Integration: `pnpm --dir apps/web test tests/application tests/infrastructure`
- E2E: `pnpm --dir apps/web test:e2e`
- Build: `pnpm build`
```

- [ ] **Step 3: Add test matrix row**

Append this row to `docs/TEST_MATRIX.md` under the existing matrix table or create a new table section if the file is still a placeholder:

```markdown
| RideFlow V1 planning core | Auth, trip creation, roles, timeline, place search, AI draft, realtime sync | Unit + integration + E2E + build | `pnpm --dir apps/web test && pnpm --dir apps/web test:e2e && pnpm build` |
```

- [ ] **Step 4: Commit product docs**

```bash
git add docs/product/rideflow-v1.md docs/stories/rideflow-v1-planning-core.md docs/TEST_MATRIX.md
git commit -m "docs: add RideFlow v1 product contract"
```

## Task 5: Supabase Schema, RLS, And Local Database Contract

**Files:**
- Create: `supabase/migrations/202606110001_rideflow_v1_init.sql`
- Create: `apps/web/src/infrastructure/supabase/database.types.ts`
- Create: `apps/web/tests/infrastructure/schema-contract.test.ts`

- [ ] **Step 1: Write schema contract test**

Create `apps/web/tests/infrastructure/schema-contract.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Database } from "@/src/infrastructure/supabase/database.types";

describe("database type contract", () => {
  it("exposes timeline item rows with place snapshots", () => {
    type TimelineItem = Database["public"]["Tables"]["timeline_items"]["Row"];

    const item = {
      id: "item-1",
      trip_id: "trip-1",
      trip_day_id: "day-1",
      start_time: "09:00",
      duration_minutes: 60,
      title: "Coffee",
      notes: "Start slow",
      place_source: "manual",
      place_source_id: "manual:coffee",
      place_name: "Coffee shop",
      place_address: "Da Nang",
      place_lat: 16.047079,
      place_lng: 108.20623,
      place_external_url: "https://maps.google.com/?q=coffee",
      updated_by: "user-1",
      created_at: "2026-06-11T00:00:00Z",
      updated_at: "2026-06-11T00:00:00Z"
    } satisfies TimelineItem;

    expect(item.place_source).toBe("manual");
  });
});
```

- [ ] **Step 2: Run schema contract test and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/infrastructure/schema-contract.test.ts
```

Expected: FAIL because `database.types.ts` does not exist.

- [ ] **Step 3: Add database migration**

Create `supabase/migrations/202606110001_rideflow_v1_init.sql`:

```sql
create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type public.trip_role as enum ('owner', 'planner', 'viewer');
create type public.invite_status as enum ('pending', 'accepted');
create type public.place_source as enum ('seed', 'osm', 'manual', 'google');
create type public.ai_draft_status as enum ('pending', 'completed', 'failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext not null unique,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  destination text not null check (length(trim(destination)) > 0),
  start_date date not null,
  end_date date not null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trips_valid_date_range check (end_date >= start_date)
);

create table public.trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  invited_email citext not null,
  role public.trip_role not null,
  invite_status public.invite_status not null default 'pending',
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  constraint trip_members_user_or_pending check (
    (invite_status = 'pending' and user_id is null)
    or (invite_status = 'accepted' and user_id is not null)
  )
);

create unique index trip_members_unique_email_per_trip
  on public.trip_members (trip_id, invited_email);

create unique index trip_members_unique_user_per_trip
  on public.trip_members (trip_id, user_id)
  where user_id is not null;

create table public.trip_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  date date not null,
  day_index integer not null check (day_index > 0),
  unique (trip_id, date),
  unique (trip_id, day_index)
);

create table public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  trip_day_id uuid not null references public.trip_days(id) on delete cascade,
  start_time time not null,
  duration_minutes integer not null check (duration_minutes > 0),
  title text not null check (length(trim(title)) > 0),
  notes text not null default '',
  place_source public.place_source,
  place_source_id text,
  place_name text,
  place_address text,
  place_lat double precision,
  place_lng double precision,
  place_external_url text,
  updated_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ai_draft_runs (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  requested_by uuid not null references public.profiles(id),
  prompt text not null default '',
  status public.ai_draft_status not null default 'pending',
  validated_summary jsonb,
  raw_response jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trips_touch_updated_at
before update on public.trips
for each row execute function public.touch_updated_at();

create trigger timeline_items_touch_updated_at
before update on public.timeline_items
for each row execute function public.touch_updated_at();

create or replace function public.is_trip_member(target_trip_id uuid, allowed_roles public.trip_role[])
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trip_members tm
    where tm.trip_id = target_trip_id
      and tm.user_id = auth.uid()
      and tm.invite_status = 'accepted'
      and tm.role = any(allowed_roles)
  );
$$;

create or replace function public.accept_trip_invite(target_trip_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email citext;
begin
  current_email := nullif(auth.jwt() ->> 'email', '')::citext;

  if current_email is null then
    raise exception 'auth_email_required';
  end if;

  update public.trip_members
  set user_id = auth.uid(),
      invite_status = 'accepted',
      accepted_at = now()
  where trip_id = target_trip_id
    and invited_email = current_email
    and invite_status = 'pending'
    and user_id is null;

  if not found then
    raise exception 'invite_not_found';
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;
alter table public.trip_days enable row level security;
alter table public.timeline_items enable row level security;
alter table public.ai_draft_runs enable row level security;

create policy "profiles_read_own"
on public.profiles for select
using (id = auth.uid());

create policy "profiles_insert_own"
on public.profiles for insert
with check (id = auth.uid());

create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "trips_read_members"
on public.trips for select
using (public.is_trip_member(id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "trips_insert_owner"
on public.trips for insert
with check (owner_id = auth.uid());

create policy "trips_update_owner"
on public.trips for update
using (public.is_trip_member(id, array['owner']::public.trip_role[]))
with check (public.is_trip_member(id, array['owner']::public.trip_role[]));

create policy "trips_delete_owner"
on public.trips for delete
using (public.is_trip_member(id, array['owner']::public.trip_role[]));

create policy "trip_members_read_trip_members"
on public.trip_members for select
using (public.is_trip_member(trip_id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "trip_members_insert_owner"
on public.trip_members for insert
with check (exists (select 1 from public.trips t where t.id = trip_id and t.owner_id = auth.uid()));

create policy "trip_members_update_owner"
on public.trip_members for update
using (public.is_trip_member(trip_id, array['owner']::public.trip_role[]))
with check (public.is_trip_member(trip_id, array['owner']::public.trip_role[]));

create policy "trip_members_delete_owner"
on public.trip_members for delete
using (public.is_trip_member(trip_id, array['owner']::public.trip_role[]));

create policy "trip_days_read_members"
on public.trip_days for select
using (public.is_trip_member(trip_id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "trip_days_insert_owner"
on public.trip_days for insert
with check (exists (select 1 from public.trips t where t.id = trip_id and t.owner_id = auth.uid()));

create policy "timeline_items_read_members"
on public.timeline_items for select
using (public.is_trip_member(trip_id, array['owner', 'planner', 'viewer']::public.trip_role[]));

create policy "timeline_items_insert_planners"
on public.timeline_items for insert
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "timeline_items_update_planners"
on public.timeline_items for update
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]))
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "timeline_items_delete_planners"
on public.timeline_items for delete
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "ai_draft_runs_read_planners"
on public.ai_draft_runs for select
using (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));

create policy "ai_draft_runs_insert_planners"
on public.ai_draft_runs for insert
with check (public.is_trip_member(trip_id, array['owner', 'planner']::public.trip_role[]));
```

- [ ] **Step 4: Add minimal generated database types**

Create `apps/web/src/infrastructure/supabase/database.types.ts`:

```ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Enums: {
      trip_role: "owner" | "planner" | "viewer";
      invite_status: "pending" | "accepted";
      place_source: "seed" | "osm" | "manual" | "google";
      ai_draft_status: "pending" | "completed" | "failed";
    };
    Tables: {
      timeline_items: {
        Row: {
          id: string;
          trip_id: string;
          trip_day_id: string;
          start_time: string;
          duration_minutes: number;
          title: string;
          notes: string;
          place_source: "seed" | "osm" | "manual" | "google" | null;
          place_source_id: string | null;
          place_name: string | null;
          place_address: string | null;
          place_lat: number | null;
          place_lng: number | null;
          place_external_url: string | null;
          updated_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["timeline_items"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["timeline_items"]["Insert"]>;
      };
    };
    Functions: {
      accept_trip_invite: {
        Args: { target_trip_id: string };
        Returns: void;
      };
    };
  };
};
```

- [ ] **Step 5: Run schema contract test**

Run:

```bash
pnpm --dir apps/web test tests/infrastructure/schema-contract.test.ts
```

Expected: PASS.

- [ ] **Step 6: Verify migration with Supabase CLI**

Run:

```bash
supabase start
supabase db reset
```

Expected: local Supabase starts and the migration applies without SQL errors.

- [ ] **Step 7: Commit database contract**

```bash
git add supabase/migrations apps/web/src/infrastructure/supabase/database.types.ts apps/web/tests/infrastructure/schema-contract.test.ts
git commit -m "feat: add RideFlow database schema"
```

## Task 6: Supabase Clients And Auth Pages

**Files:**
- Create: `apps/web/src/infrastructure/supabase/client.ts`
- Create: `apps/web/src/infrastructure/supabase/server.ts`
- Create: `apps/web/app/(auth)/sign-in/page.tsx`
- Create: `apps/web/app/(auth)/sign-up/page.tsx`
- Create: `apps/web/components/auth/auth-form.tsx`
- Create: `apps/web/src/application/auth/actions.ts`
- Create: `apps/web/tests/application/auth-actions.test.ts`

- [ ] **Step 1: Write auth action test with mocked client**

Create `apps/web/tests/application/auth-actions.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { normalizeAuthRedirect } from "@/src/application/auth/actions";

describe("auth action helpers", () => {
  it("normalizes safe redirect paths", () => {
    expect(normalizeAuthRedirect("/trips")).toBe("/trips");
    expect(normalizeAuthRedirect("https://evil.example")).toBe("/trips");
    expect(normalizeAuthRedirect(null)).toBe("/trips");
  });
});
```

- [ ] **Step 2: Run auth test and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/application/auth-actions.test.ts
```

Expected: FAIL because `auth/actions.ts` does not exist.

- [ ] **Step 3: Add Supabase browser client**

Create `apps/web/src/infrastructure/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { getPublicEnv } from "@/src/lib/env";

export function createSupabaseBrowserClient() {
  const env = getPublicEnv();

  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
```

- [ ] **Step 4: Add Supabase server client**

Create `apps/web/src/infrastructure/supabase/server.ts`:

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { getPublicEnv } from "@/src/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = getPublicEnv();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        }
      }
    }
  );
}
```

- [ ] **Step 5: Add auth server actions**

Create `apps/web/src/application/auth/actions.ts`:

```ts
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";

export function normalizeAuthRedirect(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/trips";
  }

  return next;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = normalizeAuthRedirect(String(formData.get("next") ?? "/trips"));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = normalizeAuthRedirect(String(formData.get("next") ?? "/trips"));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/sign-up?error=${encodeURIComponent(error.message)}`);
  }

  redirect(next);
}
```

- [ ] **Step 6: Add reusable auth form**

Create `apps/web/components/auth/auth-form.tsx`:

```tsx
import type { ReactNode } from "react";

type AuthFormProps = {
  title: string;
  description: string;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  footer: ReactNode;
};

export function AuthForm({
  title,
  description,
  action,
  submitLabel,
  footer
}: AuthFormProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form action={action} className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
        <label className="grid gap-2 text-sm font-medium">
          Email
          <input
            className="rounded-md border px-3 py-2"
            name="email"
            required
            type="email"
          />
        </label>
        <label className="mt-4 grid gap-2 text-sm font-medium">
          Password
          <input
            className="rounded-md border px-3 py-2"
            minLength={8}
            name="password"
            required
            type="password"
          />
        </label>
        <button
          className="mt-6 w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          type="submit"
        >
          {submitLabel}
        </button>
        <div className="mt-4 text-sm text-slate-600">{footer}</div>
      </form>
    </main>
  );
}
```

- [ ] **Step 7: Add sign-in and sign-up pages**

Create `apps/web/app/(auth)/sign-in/page.tsx`:

```tsx
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { signInAction } from "@/src/application/auth/actions";

export default function SignInPage() {
  return (
    <AuthForm
      action={signInAction}
      description="Sign in to plan your trips."
      footer={
        <>
          No account yet? <Link className="font-medium text-sky-700" href="/sign-up">Create one</Link>
        </>
      }
      submitLabel="Sign in"
      title="Welcome back"
    />
  );
}
```

Create `apps/web/app/(auth)/sign-up/page.tsx`:

```tsx
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { signUpAction } from "@/src/application/auth/actions";

export default function SignUpPage() {
  return (
    <AuthForm
      action={signUpAction}
      description="Create an account to start planning with RideFlow."
      footer={
        <>
          Already have an account? <Link className="font-medium text-sky-700" href="/sign-in">Sign in</Link>
        </>
      }
      submitLabel="Create account"
      title="Create your account"
    />
  );
}
```

- [ ] **Step 8: Run auth tests**

Run:

```bash
pnpm --dir apps/web test tests/application/auth-actions.test.ts
```

Expected: PASS.

- [ ] **Step 9: Build app**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 10: Commit auth foundation**

```bash
git add apps/web/src/infrastructure/supabase apps/web/src/application/auth apps/web/components/auth apps/web/app/\\(auth\\)
git commit -m "feat: add Supabase auth shell"
```

## Task 7: Trip Creation And Trip Days

**Files:**
- Create: `apps/web/src/application/trips/types.ts`
- Create: `apps/web/src/application/trips/create-trip.ts`
- Create: `apps/web/components/trips/new-trip-form.tsx`
- Create: `apps/web/app/(app)/trips/new/page.tsx`
- Create: `apps/web/app/(app)/trips/page.tsx`
- Create: `apps/web/tests/application/create-trip.test.ts`

- [ ] **Step 1: Write create trip use-case test**

Create `apps/web/tests/application/create-trip.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { createTripUseCase } from "@/src/application/trips/create-trip";

describe("createTripUseCase", () => {
  it("creates a trip and one day per calendar date", async () => {
    const repository = {
      createTripWithDays: vi.fn().mockResolvedValue({
        id: "trip-1",
        days: [
          { id: "day-1", date: "2026-07-01", dayIndex: 1 },
          { id: "day-2", date: "2026-07-02", dayIndex: 2 }
        ]
      })
    };

    const result = await createTripUseCase(repository, {
      ownerId: "user-1",
      name: "Da Nang Food Trip",
      destination: "Da Nang",
      startDate: "2026-07-01",
      endDate: "2026-07-02"
    });

    expect(result).toEqual({
      ok: true,
      value: {
        id: "trip-1",
        days: [
          { id: "day-1", date: "2026-07-01", dayIndex: 1 },
          { id: "day-2", date: "2026-07-02", dayIndex: 2 }
        ]
      }
    });
    expect(repository.createTripWithDays).toHaveBeenCalledWith({
      ownerId: "user-1",
      name: "Da Nang Food Trip",
      destination: "Da Nang",
      startDate: "2026-07-01",
      endDate: "2026-07-02",
      days: [
        { date: "2026-07-01", dayIndex: 1 },
        { date: "2026-07-02", dayIndex: 2 }
      ]
    });
  });
});
```

- [ ] **Step 2: Run create trip test and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/application/create-trip.test.ts
```

Expected: FAIL because the use case does not exist.

- [ ] **Step 3: Add trip use-case types**

Create `apps/web/src/application/trips/types.ts`:

```ts
export type CreateTripInput = {
  ownerId: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
};

export type PersistTripWithDaysInput = CreateTripInput & {
  days: Array<{ date: string; dayIndex: number }>;
};

export type CreatedTrip = {
  id: string;
  days: Array<{ id: string; date: string; dayIndex: number }>;
};

export type TripRepository = {
  createTripWithDays(input: PersistTripWithDaysInput): Promise<CreatedTrip>;
};
```

- [ ] **Step 4: Add create trip use case**

Create `apps/web/src/application/trips/create-trip.ts`:

```ts
import { createTripDays, validateTripDateRange } from "@/src/domain/trips";
import { err, ok, type Result } from "@/src/lib/result";
import type { CreateTripInput, CreatedTrip, TripRepository } from "./types";

export async function createTripUseCase(
  repository: TripRepository,
  input: CreateTripInput
): Promise<Result<CreatedTrip, "trip_name_required" | "trip_destination_required" | "trip_end_before_start">> {
  const name = input.name.trim();
  const destination = input.destination.trim();

  if (name.length === 0) {
    return err("trip_name_required");
  }

  if (destination.length === 0) {
    return err("trip_destination_required");
  }

  const dateRange = validateTripDateRange(input.startDate, input.endDate);

  if (!dateRange.ok) {
    return dateRange;
  }

  const created = await repository.createTripWithDays({
    ownerId: input.ownerId,
    name,
    destination,
    startDate: input.startDate,
    endDate: input.endDate,
    days: createTripDays(input.startDate, input.endDate)
  });

  return ok(created);
}
```

- [ ] **Step 5: Run create trip test and verify pass**

Run:

```bash
pnpm --dir apps/web test tests/application/create-trip.test.ts
```

Expected: PASS.

- [ ] **Step 6: Add trip creation UI**

Create `apps/web/components/trips/new-trip-form.tsx`:

```tsx
"use client";

type NewTripFormProps = {
  action: (formData: FormData) => Promise<void>;
};

export function NewTripForm({ action }: NewTripFormProps) {
  return (
    <form action={action} className="grid gap-4 rounded-lg border bg-white p-5 shadow-sm">
      <label className="grid gap-2 text-sm font-medium">
        Trip name
        <input className="rounded-md border px-3 py-2" name="name" required />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Main destination
        <input className="rounded-md border px-3 py-2" name="destination" required />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Start date
          <input className="rounded-md border px-3 py-2" name="startDate" required type="date" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          End date
          <input className="rounded-md border px-3 py-2" name="endDate" required type="date" />
        </label>
      </div>
      <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white" type="submit">
        Create trip
      </button>
    </form>
  );
}
```

- [ ] **Step 7: Add trip pages with temporary empty data state**

Create `apps/web/app/(app)/trips/page.tsx`:

```tsx
import Link from "next/link";

export default function TripsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Trips</h1>
          <p className="text-sm text-slate-600">Create and manage collaborative itineraries.</p>
        </div>
        <Link className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white" href="/trips/new">
          New trip
        </Link>
      </div>
      <div className="mt-8 rounded-lg border bg-white p-6 text-sm text-slate-600">
        Your trips will appear here after the repository is connected.
      </div>
    </main>
  );
}
```

Create `apps/web/app/(app)/trips/new/page.tsx`:

```tsx
import { NewTripForm } from "@/components/trips/new-trip-form";

async function createTripAction(formData: FormData) {
  "use server";
  console.log("create trip", Object.fromEntries(formData));
}

export default function NewTripPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Create trip</h1>
      <p className="mt-2 text-sm text-slate-600">
        Start with a name, destination, and date range. RideFlow will create one timeline day per date.
      </p>
      <div className="mt-6">
        <NewTripForm action={createTripAction} />
      </div>
    </main>
  );
}
```

- [ ] **Step 8: Build after trip UI**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 9: Commit trip core use case**

```bash
git add apps/web/src/application/trips apps/web/components/trips apps/web/app/\\(app\\)/trips apps/web/tests/application/create-trip.test.ts
git commit -m "feat: add trip creation foundation"
```

## Task 8: Member Roles And Invite Use Cases

**Files:**
- Create: `apps/web/src/application/members/types.ts`
- Create: `apps/web/src/application/members/invite-member.ts`
- Create: `apps/web/src/application/members/update-member-role.ts`
- Create: `apps/web/components/trips/member-list.tsx`
- Create: `apps/web/tests/application/invite-member.test.ts`
- Create: `apps/web/tests/application/update-member-role.test.ts`

- [ ] **Step 1: Write invite use-case test**

Create `apps/web/tests/application/invite-member.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { inviteMemberUseCase } from "@/src/application/members/invite-member";

describe("inviteMemberUseCase", () => {
  it("allows owner to invite a planner by email", async () => {
    const repository = {
      inviteMember: vi.fn().mockResolvedValue({ id: "member-1" })
    };

    const result = await inviteMemberUseCase(repository, {
      actorRole: "owner",
      tripId: "trip-1",
      email: "planner@example.com",
      role: "planner"
    });

    expect(result).toEqual({ ok: true, value: { id: "member-1" } });
  });

  it("blocks planner from inviting members", async () => {
    const repository = {
      inviteMember: vi.fn()
    };

    const result = await inviteMemberUseCase(repository, {
      actorRole: "planner",
      tripId: "trip-1",
      email: "viewer@example.com",
      role: "viewer"
    });

    expect(result).toEqual({ ok: false, error: "member_manage_forbidden" });
    expect(repository.inviteMember).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run invite test and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/application/invite-member.test.ts
```

Expected: FAIL because member use case does not exist.

- [ ] **Step 3: Add member types and invite use case**

Create `apps/web/src/application/members/types.ts`:

```ts
import type { TripRole } from "@/src/domain/permissions";

export type InviteMemberInput = {
  actorRole: TripRole;
  tripId: string;
  email: string;
  role: TripRole;
};

export type MemberRepository = {
  inviteMember(input: {
    tripId: string;
    email: string;
    role: TripRole;
  }): Promise<{ id: string }>;
  updateMemberRole(input: {
    memberId: string;
    role: TripRole;
  }): Promise<{ id: string; role: TripRole }>;
};
```

Create `apps/web/src/application/members/invite-member.ts`:

```ts
import { canManageMembers, type TripRole } from "@/src/domain/permissions";
import { err, ok, type Result } from "@/src/lib/result";
import type { InviteMemberInput, MemberRepository } from "./types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function inviteMemberUseCase(
  repository: Pick<MemberRepository, "inviteMember">,
  input: InviteMemberInput
): Promise<Result<{ id: string }, "member_manage_forbidden" | "member_email_invalid" | "member_role_invalid">> {
  if (!canManageMembers(input.actorRole)) {
    return err("member_manage_forbidden");
  }

  if (!emailPattern.test(input.email.trim())) {
    return err("member_email_invalid");
  }

  const allowedRoles: TripRole[] = ["planner", "viewer"];
  if (!allowedRoles.includes(input.role)) {
    return err("member_role_invalid");
  }

  const invited = await repository.inviteMember({
    tripId: input.tripId,
    email: input.email.trim().toLowerCase(),
    role: input.role
  });

  return ok(invited);
}
```

- [ ] **Step 4: Run invite test and verify pass**

Run:

```bash
pnpm --dir apps/web test tests/application/invite-member.test.ts
```

Expected: PASS.

- [ ] **Step 5: Write update role test**

Create `apps/web/tests/application/update-member-role.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { updateMemberRoleUseCase } from "@/src/application/members/update-member-role";

describe("updateMemberRoleUseCase", () => {
  it("allows owner to update member role", async () => {
    const repository = {
      updateMemberRole: vi.fn().mockResolvedValue({ id: "member-1", role: "viewer" })
    };

    const result = await updateMemberRoleUseCase(repository, {
      actorRole: "owner",
      memberId: "member-1",
      role: "viewer"
    });

    expect(result).toEqual({ ok: true, value: { id: "member-1", role: "viewer" } });
  });
});
```

- [ ] **Step 6: Add update member role use case**

Create `apps/web/src/application/members/update-member-role.ts`:

```ts
import { canManageMembers, type TripRole } from "@/src/domain/permissions";
import { err, ok, type Result } from "@/src/lib/result";
import type { MemberRepository } from "./types";

export async function updateMemberRoleUseCase(
  repository: Pick<MemberRepository, "updateMemberRole">,
  input: { actorRole: TripRole; memberId: string; role: TripRole }
): Promise<Result<{ id: string; role: TripRole }, "member_manage_forbidden" | "member_role_invalid">> {
  if (!canManageMembers(input.actorRole)) {
    return err("member_manage_forbidden");
  }

  if (input.role === "owner") {
    return err("member_role_invalid");
  }

  const updated = await repository.updateMemberRole({
    memberId: input.memberId,
    role: input.role
  });

  return ok(updated);
}
```

- [ ] **Step 7: Run member tests**

Run:

```bash
pnpm --dir apps/web test tests/application/invite-member.test.ts tests/application/update-member-role.test.ts
```

Expected: PASS.

- [ ] **Step 8: Add member list UI**

Create `apps/web/components/trips/member-list.tsx`:

```tsx
import type { TripRole } from "@/src/domain/permissions";

type TripMemberView = {
  id: string;
  email: string;
  role: TripRole;
  inviteStatus: "pending" | "accepted";
};

export function MemberList({ members }: { members: TripMemberView[] }) {
  return (
    <section className="rounded-lg border bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Members</h2>
      <div className="mt-3 grid gap-2">
        {members.map((member) => (
          <div className="flex items-center justify-between rounded-md border px-3 py-2" key={member.id}>
            <div>
              <p className="text-sm font-medium">{member.email}</p>
              <p className="text-xs text-slate-500">{member.inviteStatus}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium">
              {member.role}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 9: Commit member use cases**

```bash
git add apps/web/src/application/members apps/web/tests/application/*member*.test.ts apps/web/components/trips/member-list.tsx
git commit -m "feat: add trip member role use cases"
```

## Task 9: Timeline Application Use Cases

**Files:**
- Create: `apps/web/src/application/timeline/types.ts`
- Create: `apps/web/src/application/timeline/add-item.ts`
- Create: `apps/web/src/application/timeline/move-item.ts`
- Create: `apps/web/src/application/timeline/delete-item.ts`
- Create: `apps/web/tests/application/timeline-use-cases.test.ts`

- [ ] **Step 1: Write timeline use-case tests**

Create `apps/web/tests/application/timeline-use-cases.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { addTimelineItemUseCase } from "@/src/application/timeline/add-item";
import { moveTimelineItemUseCase } from "@/src/application/timeline/move-item";

describe("timeline use cases", () => {
  it("allows planner to add a valid item", async () => {
    const repository = {
      addItem: vi.fn().mockResolvedValue({ id: "item-1" })
    };

    const result = await addTimelineItemUseCase(repository, {
      actorRole: "planner",
      tripId: "trip-1",
      tripDayId: "day-1",
      title: "Coffee",
      startTime: "09:00",
      durationMinutes: 60,
      notes: "Start slow"
    });

    expect(result).toEqual({ ok: true, value: { id: "item-1" } });
  });

  it("blocks viewer from adding items", async () => {
    const repository = {
      addItem: vi.fn()
    };

    const result = await addTimelineItemUseCase(repository, {
      actorRole: "viewer",
      tripId: "trip-1",
      tripDayId: "day-1",
      title: "Coffee",
      startTime: "09:00",
      durationMinutes: 60,
      notes: ""
    });

    expect(result).toEqual({ ok: false, error: "timeline_mutation_forbidden" });
  });

  it("snaps moved time to the timeline grid", async () => {
    const repository = {
      moveItem: vi.fn().mockResolvedValue({ id: "item-1", startTime: "09:15" })
    };

    const result = await moveTimelineItemUseCase(repository, {
      actorRole: "owner",
      itemId: "item-1",
      minutesSinceMidnight: 548
    });

    expect(result).toEqual({ ok: true, value: { id: "item-1", startTime: "09:15" } });
  });
});
```

- [ ] **Step 2: Run timeline use-case tests and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/application/timeline-use-cases.test.ts
```

Expected: FAIL because timeline application modules do not exist.

- [ ] **Step 3: Add timeline use-case types**

Create `apps/web/src/application/timeline/types.ts`:

```ts
import type { TripRole } from "@/src/domain/permissions";
import type { PlaceSearchResult } from "@/src/domain/places";

export type AddTimelineItemInput = {
  actorRole: TripRole;
  tripId: string;
  tripDayId: string;
  title: string;
  startTime: string;
  durationMinutes: number;
  notes: string;
  place?: PlaceSearchResult;
};

export type MoveTimelineItemInput = {
  actorRole: TripRole;
  itemId: string;
  minutesSinceMidnight: number;
};

export type TimelineRepository = {
  addItem(input: AddTimelineItemInput): Promise<{ id: string }>;
  moveItem(input: { itemId: string; startTime: string }): Promise<{ id: string; startTime: string }>;
  deleteItem(input: { itemId: string }): Promise<{ id: string }>;
};
```

- [ ] **Step 4: Add timeline use cases**

Create `apps/web/src/application/timeline/add-item.ts`:

```ts
import { canMutateTimeline } from "@/src/domain/permissions";
import { validateTimelineItemDraft } from "@/src/domain/timeline";
import { err, ok, type Result } from "@/src/lib/result";
import type { AddTimelineItemInput, TimelineRepository } from "./types";

export async function addTimelineItemUseCase(
  repository: Pick<TimelineRepository, "addItem">,
  input: AddTimelineItemInput
): Promise<Result<{ id: string }, "timeline_mutation_forbidden" | "timeline_title_required" | "timeline_time_invalid" | "timeline_duration_invalid">> {
  if (!canMutateTimeline(input.actorRole)) {
    return err("timeline_mutation_forbidden");
  }

  const valid = validateTimelineItemDraft(input);
  if (!valid.ok) {
    return valid;
  }

  const created = await repository.addItem({ ...input, ...valid.value });
  return ok(created);
}
```

Create `apps/web/src/application/timeline/move-item.ts`:

```ts
import { canMutateTimeline } from "@/src/domain/permissions";
import { minutesToTime, snapMinutesToTimeline } from "@/src/domain/timeline";
import { err, ok, type Result } from "@/src/lib/result";
import type { MoveTimelineItemInput, TimelineRepository } from "./types";

export async function moveTimelineItemUseCase(
  repository: Pick<TimelineRepository, "moveItem">,
  input: MoveTimelineItemInput
): Promise<Result<{ id: string; startTime: string }, "timeline_mutation_forbidden">> {
  if (!canMutateTimeline(input.actorRole)) {
    return err("timeline_mutation_forbidden");
  }

  const startTime = minutesToTime(snapMinutesToTimeline(input.minutesSinceMidnight));
  const moved = await repository.moveItem({ itemId: input.itemId, startTime });
  return ok(moved);
}
```

Create `apps/web/src/application/timeline/delete-item.ts`:

```ts
import { canMutateTimeline, type TripRole } from "@/src/domain/permissions";
import { err, ok, type Result } from "@/src/lib/result";
import type { TimelineRepository } from "./types";

export async function deleteTimelineItemUseCase(
  repository: Pick<TimelineRepository, "deleteItem">,
  input: { actorRole: TripRole; itemId: string }
): Promise<Result<{ id: string }, "timeline_mutation_forbidden">> {
  if (!canMutateTimeline(input.actorRole)) {
    return err("timeline_mutation_forbidden");
  }

  return ok(await repository.deleteItem({ itemId: input.itemId }));
}
```

- [ ] **Step 5: Run timeline use-case tests**

Run:

```bash
pnpm --dir apps/web test tests/application/timeline-use-cases.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit timeline use cases**

```bash
git add apps/web/src/application/timeline apps/web/tests/application/timeline-use-cases.test.ts
git commit -m "feat: add timeline use cases"
```

## Task 10: Timeline UI

**Files:**
- Create: `apps/web/components/timeline/timeline-day.tsx`
- Create: `apps/web/components/timeline/timeline-item-card.tsx`
- Create: `apps/web/components/timeline/timeline-item-form.tsx`
- Modify: `apps/web/app/(app)/trips/[tripId]/page.tsx`
- Create: `apps/web/tests/application/timeline-view.test.tsx`

- [ ] **Step 1: Write timeline render test**

Create `apps/web/tests/application/timeline-view.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TimelineDay } from "@/components/timeline/timeline-day";

describe("TimelineDay", () => {
  it("renders timeline items ordered by time", () => {
    render(
      <TimelineDay
        canEdit={true}
        date="2026-07-01"
        items={[
          { id: "2", startTime: "14:00", durationMinutes: 90, title: "Museum", notes: "", placeName: "Museum" },
          { id: "1", startTime: "09:00", durationMinutes: 60, title: "Coffee", notes: "", placeName: "Coffee shop" }
        ]}
      />
    );

    const headings = screen.getAllByRole("heading", { level: 3 }).map((node) => node.textContent);
    expect(headings).toEqual(["Coffee", "Museum"]);
  });
});
```

- [ ] **Step 2: Run render test and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/application/timeline-view.test.tsx
```

Expected: FAIL because timeline components do not exist.

- [ ] **Step 3: Add timeline item card**

Create `apps/web/components/timeline/timeline-item-card.tsx`:

```tsx
export type TimelineItemView = {
  id: string;
  startTime: string;
  durationMinutes: number;
  title: string;
  notes: string;
  placeName?: string | null;
};

export function TimelineItemCard({ item, canEdit }: { item: TimelineItemView; canEdit: boolean }) {
  return (
    <article className="rounded-md border bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {item.startTime} · {item.durationMinutes} min
          </p>
          <h3 className="mt-1 text-base font-semibold">{item.title}</h3>
          {item.placeName ? <p className="mt-1 text-sm text-slate-600">{item.placeName}</p> : null}
          {item.notes ? <p className="mt-2 text-sm text-slate-600">{item.notes}</p> : null}
        </div>
        {canEdit ? (
          <button className="rounded-md border px-2 py-1 text-xs" type="button">
            Edit
          </button>
        ) : null}
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Add timeline day component**

Create `apps/web/components/timeline/timeline-day.tsx`:

```tsx
import { timeToMinutes } from "@/src/domain/timeline";
import { TimelineItemCard, type TimelineItemView } from "./timeline-item-card";

type TimelineDayProps = {
  date: string;
  items: TimelineItemView[];
  canEdit: boolean;
};

export function TimelineDay({ date, items, canEdit }: TimelineDayProps) {
  const orderedItems = [...items].sort(
    (first, second) => timeToMinutes(first.startTime) - timeToMinutes(second.startTime)
  );

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">{date}</h2>
        <p className="text-sm text-slate-600">Drag or edit items to refine the day plan.</p>
      </div>
      <div className="grid gap-3">
        {orderedItems.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-white p-6 text-sm text-slate-500">
            No itinerary items yet.
          </div>
        ) : (
          orderedItems.map((item) => (
            <TimelineItemCard canEdit={canEdit} item={item} key={item.id} />
          ))
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Add timeline item form**

Create `apps/web/components/timeline/timeline-item-form.tsx`:

```tsx
export function TimelineItemForm({ action }: { action: (formData: FormData) => Promise<void> }) {
  return (
    <form action={action} className="grid gap-3 rounded-lg border bg-white p-4">
      <label className="grid gap-1 text-sm font-medium">
        Time
        <input className="rounded-md border px-3 py-2" name="startTime" required type="time" />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Title
        <input className="rounded-md border px-3 py-2" name="title" required />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Duration
        <input className="rounded-md border px-3 py-2" min={15} name="durationMinutes" required step={15} type="number" />
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Notes
        <textarea className="min-h-24 rounded-md border px-3 py-2" name="notes" />
      </label>
      <button className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white" type="submit">
        Add item
      </button>
    </form>
  );
}
```

- [ ] **Step 6: Add trip detail page shell**

Create `apps/web/app/(app)/trips/[tripId]/page.tsx`:

```tsx
import { TimelineDay } from "@/components/timeline/timeline-day";
import { TimelineItemForm } from "@/components/timeline/timeline-item-form";

async function addItemAction(formData: FormData) {
  "use server";
  console.log("add item", Object.fromEntries(formData));
}

export default function TripDetailPage({ params }: { params: { tripId: string } }) {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
      <section className="grid gap-6">
        <div>
          <p className="text-sm font-medium text-sky-700">Trip {params.tripId}</p>
          <h1 className="text-2xl font-semibold">Itinerary</h1>
        </div>
        <TimelineDay
          canEdit={true}
          date="2026-07-01"
          items={[]}
        />
      </section>
      <aside className="grid content-start gap-4">
        <TimelineItemForm action={addItemAction} />
      </aside>
    </main>
  );
}
```

- [ ] **Step 7: Run timeline render test**

Run:

```bash
pnpm --dir apps/web test tests/application/timeline-view.test.tsx
```

Expected: PASS.

- [ ] **Step 8: Build app**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 9: Commit timeline UI**

```bash
git add apps/web/components/timeline apps/web/app/\\(app\\)/trips/\\[tripId\\] apps/web/tests/application/timeline-view.test.tsx
git commit -m "feat: add timeline planning UI"
```

## Task 11: Hybrid Place Search

**Files:**
- Create: `apps/web/src/application/places/provider.ts`
- Create: `apps/web/src/infrastructure/places/seed-data.ts`
- Create: `apps/web/src/infrastructure/places/seed-provider.ts`
- Create: `apps/web/src/infrastructure/places/osm-provider.ts`
- Create: `apps/web/src/infrastructure/places/hybrid-provider.ts`
- Create: `apps/web/app/api/places/search/route.ts`
- Create: `apps/web/components/places/place-search-panel.tsx`
- Create: `apps/web/tests/infrastructure/place-search.test.ts`

- [ ] **Step 1: Write place search tests**

Create `apps/web/tests/infrastructure/place-search.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { SeedPlaceSearchProvider } from "@/src/infrastructure/places/seed-provider";
import { HybridPlaceSearchProvider } from "@/src/infrastructure/places/hybrid-provider";

describe("place search providers", () => {
  it("finds seeded Vietnam places", async () => {
    const provider = new SeedPlaceSearchProvider();
    const results = await provider.searchPlaces("Hoi An", {});

    expect(results[0]).toMatchObject({
      source: "seed",
      name: "Hoi An Ancient Town"
    });
  });

  it("falls back to secondary provider when seed data has no match", async () => {
    const fallback = {
      searchPlaces: vi.fn().mockResolvedValue([{ id: "osm:1", source: "osm", name: "Hidden Cafe" }]),
      getPlaceDetails: vi.fn()
    };
    const provider = new HybridPlaceSearchProvider(new SeedPlaceSearchProvider([]), fallback);
    const results = await provider.searchPlaces("Hidden Cafe", {});

    expect(results).toEqual([{ id: "osm:1", source: "osm", name: "Hidden Cafe" }]);
  });
});
```

- [ ] **Step 2: Run place search tests and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/infrastructure/place-search.test.ts
```

Expected: FAIL because place providers do not exist.

- [ ] **Step 3: Add provider interface**

Create `apps/web/src/application/places/provider.ts`:

```ts
import type { PlaceSearchResult } from "@/src/domain/places";

export type PlaceSearchOptions = {
  nearLat?: number;
  nearLng?: number;
  limit?: number;
};

export type PlaceSearchProvider = {
  searchPlaces(query: string, options: PlaceSearchOptions): Promise<PlaceSearchResult[]>;
  getPlaceDetails(placeId: string): Promise<PlaceSearchResult | null>;
};
```

- [ ] **Step 4: Add seed data**

Create `apps/web/src/infrastructure/places/seed-data.ts`:

```ts
import type { PlaceSearchResult } from "@/src/domain/places";

export const vietnamSeedPlaces: PlaceSearchResult[] = [
  {
    id: "seed:hoi-an-ancient-town",
    source: "seed",
    name: "Hoi An Ancient Town",
    address: "Hoi An, Quang Nam, Vietnam",
    lat: 15.880058,
    lng: 108.338047,
    category: "historic",
    externalUrl: "https://www.openstreetmap.org/search?query=Hoi%20An%20Ancient%20Town"
  },
  {
    id: "seed:my-khe-beach",
    source: "seed",
    name: "My Khe Beach",
    address: "Da Nang, Vietnam",
    lat: 16.054407,
    lng: 108.247498,
    category: "beach",
    externalUrl: "https://www.openstreetmap.org/search?query=My%20Khe%20Beach"
  },
  {
    id: "seed:ben-thanh-market",
    source: "seed",
    name: "Ben Thanh Market",
    address: "Ho Chi Minh City, Vietnam",
    lat: 10.772109,
    lng: 106.698278,
    category: "market",
    externalUrl: "https://www.openstreetmap.org/search?query=Ben%20Thanh%20Market"
  }
];
```

- [ ] **Step 5: Add seed provider**

Create `apps/web/src/infrastructure/places/seed-provider.ts`:

```ts
import type { PlaceSearchProvider, PlaceSearchOptions } from "@/src/application/places/provider";
import type { PlaceSearchResult } from "@/src/domain/places";
import { vietnamSeedPlaces } from "./seed-data";

export class SeedPlaceSearchProvider implements PlaceSearchProvider {
  constructor(private readonly places: PlaceSearchResult[] = vietnamSeedPlaces) {}

  async searchPlaces(query: string, options: PlaceSearchOptions): Promise<PlaceSearchResult[]> {
    const normalized = query.trim().toLowerCase();
    const limit = options.limit ?? 8;

    if (!normalized) {
      return [];
    }

    return this.places
      .filter((place) => {
        const haystack = `${place.name} ${place.address ?? ""} ${place.category ?? ""}`.toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, limit);
  }

  async getPlaceDetails(placeId: string): Promise<PlaceSearchResult | null> {
    return this.places.find((place) => place.id === placeId) ?? null;
  }
}
```

- [ ] **Step 6: Add OSM provider**

Create `apps/web/src/infrastructure/places/osm-provider.ts`:

```ts
import type { PlaceSearchProvider, PlaceSearchOptions } from "@/src/application/places/provider";
import type { PlaceSearchResult } from "@/src/domain/places";

type OsmResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
};

export class OsmPlaceSearchProvider implements PlaceSearchProvider {
  constructor(private readonly baseUrl: string) {}

  async searchPlaces(query: string, options: PlaceSearchOptions): Promise<PlaceSearchResult[]> {
    const trimmed = query.trim();
    if (!trimmed) {
      return [];
    }

    const url = new URL("/search", this.baseUrl);
    url.searchParams.set("q", trimmed);
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", String(options.limit ?? 8));

    const response = await fetch(url, {
      headers: {
        "User-Agent": "RideFlow/1.0 place-search"
      }
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as OsmResult[];

    return data.map((item) => ({
      id: `osm:${item.place_id}`,
      source: "osm",
      name: item.display_name.split(",")[0] ?? item.display_name,
      address: item.display_name,
      lat: Number(item.lat),
      lng: Number(item.lon),
      category: item.type,
      externalUrl: `https://www.openstreetmap.org/search?query=${encodeURIComponent(item.display_name)}`,
      metadata: item
    }));
  }

  async getPlaceDetails(placeId: string): Promise<PlaceSearchResult | null> {
    return null;
  }
}
```

- [ ] **Step 7: Add hybrid provider**

Create `apps/web/src/infrastructure/places/hybrid-provider.ts`:

```ts
import type { PlaceSearchProvider, PlaceSearchOptions } from "@/src/application/places/provider";
import type { PlaceSearchResult } from "@/src/domain/places";

export class HybridPlaceSearchProvider implements PlaceSearchProvider {
  constructor(
    private readonly primary: PlaceSearchProvider,
    private readonly fallback: PlaceSearchProvider
  ) {}

  async searchPlaces(query: string, options: PlaceSearchOptions): Promise<PlaceSearchResult[]> {
    const primaryResults = await this.primary.searchPlaces(query, options);
    if (primaryResults.length > 0) {
      return primaryResults;
    }

    return this.fallback.searchPlaces(query, options);
  }

  async getPlaceDetails(placeId: string): Promise<PlaceSearchResult | null> {
    return (await this.primary.getPlaceDetails(placeId)) ?? (await this.fallback.getPlaceDetails(placeId));
  }
}
```

- [ ] **Step 8: Add search route**

Create `apps/web/app/api/places/search/route.ts`:

```ts
import { NextResponse } from "next/server";
import { getServerEnv } from "@/src/lib/env";
import { HybridPlaceSearchProvider } from "@/src/infrastructure/places/hybrid-provider";
import { OsmPlaceSearchProvider } from "@/src/infrastructure/places/osm-provider";
import { SeedPlaceSearchProvider } from "@/src/infrastructure/places/seed-provider";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const env = getServerEnv();
  const provider = new HybridPlaceSearchProvider(
    new SeedPlaceSearchProvider(),
    new OsmPlaceSearchProvider(env.OSM_NOMINATIM_BASE_URL)
  );

  const results = await provider.searchPlaces(query, { limit: 8 });

  return NextResponse.json({ results });
}
```

- [ ] **Step 9: Add place search panel**

Create `apps/web/components/places/place-search-panel.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { PlaceSearchResult } from "@/src/domain/places";

export function PlaceSearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceSearchResult[]>([]);

  async function search() {
    const response = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
    const data = (await response.json()) as { results: PlaceSearchResult[] };
    setResults(data.results);
  }

  return (
    <section className="rounded-lg border bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Places</h2>
      <div className="mt-3 flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Hoi An, beach, cafe"
          value={query}
        />
        <button className="rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white" onClick={search} type="button">
          Search
        </button>
      </div>
      <div className="mt-3 grid gap-2">
        {results.map((place) => (
          <button className="rounded-md border px-3 py-2 text-left text-sm" key={place.id} type="button">
            <span className="block font-medium">{place.name}</span>
            <span className="block text-xs text-slate-500">{place.address}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 10: Run place provider tests**

Run:

```bash
pnpm --dir apps/web test tests/infrastructure/place-search.test.ts
```

Expected: PASS.

- [ ] **Step 11: Build app**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 12: Commit place search**

```bash
git add apps/web/src/application/places apps/web/src/infrastructure/places apps/web/app/api/places apps/web/components/places apps/web/tests/infrastructure/place-search.test.ts
git commit -m "feat: add hybrid place search"
```

## Task 12: Drag Timeline Interaction

**Files:**
- Create: `apps/web/components/timeline/draggable-timeline.tsx`
- Modify: `apps/web/components/timeline/timeline-day.tsx`
- Create: `apps/web/tests/application/drag-time.test.ts`

- [ ] **Step 1: Write drag math test**

Create `apps/web/tests/application/drag-time.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { pixelDeltaToTimelineMinutes } from "@/components/timeline/draggable-timeline";

describe("drag timeline math", () => {
  it("converts vertical pixel delta into snapped timeline minutes", () => {
    expect(
      pixelDeltaToTimelineMinutes({
        originalMinutes: 540,
        deltaY: 38,
        pixelsPerHour: 80
      })
    ).toBe(570);
  });
});
```

- [ ] **Step 2: Run drag test and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/application/drag-time.test.ts
```

Expected: FAIL because `draggable-timeline.tsx` does not exist.

- [ ] **Step 3: Add draggable timeline component**

Create `apps/web/components/timeline/draggable-timeline.tsx`:

```tsx
"use client";

import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { snapMinutesToTimeline, timeToMinutes } from "@/src/domain/timeline";
import { TimelineItemCard, type TimelineItemView } from "./timeline-item-card";

export function pixelDeltaToTimelineMinutes({
  originalMinutes,
  deltaY,
  pixelsPerHour
}: {
  originalMinutes: number;
  deltaY: number;
  pixelsPerHour: number;
}): number {
  const minutesDelta = (deltaY / pixelsPerHour) * 60;
  return snapMinutesToTimeline(originalMinutes + minutesDelta);
}

type DraggableTimelineProps = {
  items: TimelineItemView[];
  canEdit: boolean;
  onMove: (itemId: string, minutesSinceMidnight: number) => void;
};

const pixelsPerHour = 80;

export function DraggableTimeline({ items, canEdit, onMove }: DraggableTimelineProps) {
  function handleDragEnd(event: DragEndEvent) {
    const item = items.find((candidate) => candidate.id === event.active.id);
    if (!item || !canEdit) {
      return;
    }

    const nextMinutes = pixelDeltaToTimelineMinutes({
      originalMinutes: timeToMinutes(item.startTime),
      deltaY: event.delta.y,
      pixelsPerHour
    });

    onMove(item.id, nextMinutes);
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid gap-3">
        {items.map((item) => (
          <TimelineItemCard canEdit={canEdit} item={item} key={item.id} />
        ))}
      </div>
    </DndContext>
  );
}
```

- [ ] **Step 4: Wire draggable timeline into day view**

Modify `apps/web/components/timeline/timeline-day.tsx`:

```tsx
"use client";

import { timeToMinutes } from "@/src/domain/timeline";
import { DraggableTimeline } from "./draggable-timeline";
import type { TimelineItemView } from "./timeline-item-card";

type TimelineDayProps = {
  date: string;
  items: TimelineItemView[];
  canEdit: boolean;
  onMove?: (itemId: string, minutesSinceMidnight: number) => void;
};

export function TimelineDay({ date, items, canEdit, onMove = () => undefined }: TimelineDayProps) {
  const orderedItems = [...items].sort(
    (first, second) => timeToMinutes(first.startTime) - timeToMinutes(second.startTime)
  );

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="text-xl font-semibold">{date}</h2>
        <p className="text-sm text-slate-600">Drag or edit items to refine the day plan.</p>
      </div>
      {orderedItems.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-6 text-sm text-slate-500">
          No itinerary items yet.
        </div>
      ) : (
        <DraggableTimeline canEdit={canEdit} items={orderedItems} onMove={onMove} />
      )}
    </section>
  );
}
```

- [ ] **Step 5: Run drag and render tests**

Run:

```bash
pnpm --dir apps/web test tests/application/drag-time.test.ts tests/application/timeline-view.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit drag timeline**

```bash
git add apps/web/components/timeline apps/web/tests/application/drag-time.test.ts
git commit -m "feat: add draggable timeline interaction"
```

## Task 13: Near-Realtime Timeline Sync

**Files:**
- Create: `apps/web/src/application/timeline/realtime.ts`
- Create: `apps/web/components/timeline/realtime-timeline-client.tsx`
- Create: `apps/web/tests/application/realtime-timeline.test.ts`

- [ ] **Step 1: Write channel name test**

Create `apps/web/tests/application/realtime-timeline.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { timelineChannelName } from "@/src/application/timeline/realtime";

describe("timeline realtime helpers", () => {
  it("creates a stable channel name per trip", () => {
    expect(timelineChannelName("trip-123")).toBe("timeline:trip-123");
  });
});
```

- [ ] **Step 2: Run realtime helper test and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/application/realtime-timeline.test.ts
```

Expected: FAIL because realtime helper does not exist.

- [ ] **Step 3: Add realtime helper**

Create `apps/web/src/application/timeline/realtime.ts`:

```ts
export function timelineChannelName(tripId: string): string {
  return `timeline:${tripId}`;
}
```

- [ ] **Step 4: Add realtime client component**

Create `apps/web/components/timeline/realtime-timeline-client.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/src/infrastructure/supabase/client";
import { timelineChannelName } from "@/src/application/timeline/realtime";

export function RealtimeTimelineClient({
  tripId,
  onRefresh
}: {
  tripId: string;
  onRefresh: () => void;
}) {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(timelineChannelName(tripId))
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "timeline_items",
          filter: `trip_id=eq.${tripId}`
        },
        () => onRefresh()
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [onRefresh, tripId]);

  return null;
}
```

- [ ] **Step 5: Run realtime helper test**

Run:

```bash
pnpm --dir apps/web test tests/application/realtime-timeline.test.ts
```

Expected: PASS.

- [ ] **Step 6: Build app**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 7: Commit realtime sync**

```bash
git add apps/web/src/application/timeline/realtime.ts apps/web/components/timeline/realtime-timeline-client.tsx apps/web/tests/application/realtime-timeline.test.ts
git commit -m "feat: add timeline realtime subscription"
```

## Task 14: AI Draft Provider And Preview

**Files:**
- Create: `apps/web/src/application/ai/provider.ts`
- Create: `apps/web/src/infrastructure/ai/mock-draft-provider.ts`
- Create: `apps/web/src/infrastructure/ai/openai-draft-provider.ts`
- Create: `apps/web/app/api/ai/draft/route.ts`
- Create: `apps/web/components/ai/ai-draft-panel.tsx`
- Create: `apps/web/tests/infrastructure/ai-draft-provider.test.ts`

- [ ] **Step 1: Write AI provider tests**

Create `apps/web/tests/infrastructure/ai-draft-provider.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { MockItineraryDraftProvider } from "@/src/infrastructure/ai/mock-draft-provider";

describe("MockItineraryDraftProvider", () => {
  it("generates one valid draft day per trip day", async () => {
    const provider = new MockItineraryDraftProvider();
    const draft = await provider.generateDraft({
      destination: "Da Nang",
      days: [
        { date: "2026-07-01", dayIndex: 1 },
        { date: "2026-07-02", dayIndex: 2 }
      ],
      preferencePrompt: "food focused"
    });

    expect(draft.days).toHaveLength(2);
    expect(draft.days[0]?.items[0]).toMatchObject({
      startTime: "09:00",
      durationMinutes: 120
    });
  });
});
```

- [ ] **Step 2: Run AI provider test and verify failure**

Run:

```bash
pnpm --dir apps/web test tests/infrastructure/ai-draft-provider.test.ts
```

Expected: FAIL because AI provider does not exist.

- [ ] **Step 3: Add AI provider interface**

Create `apps/web/src/application/ai/provider.ts`:

```ts
import type { ItineraryDraft } from "@/src/domain/ai-draft";

export type ItineraryDraftInput = {
  destination: string;
  days: Array<{ date: string; dayIndex: number }>;
  preferencePrompt: string;
};

export type ItineraryDraftProvider = {
  generateDraft(input: ItineraryDraftInput): Promise<ItineraryDraft>;
};
```

- [ ] **Step 4: Add mock draft provider**

Create `apps/web/src/infrastructure/ai/mock-draft-provider.ts`:

```ts
import type { ItineraryDraftProvider, ItineraryDraftInput } from "@/src/application/ai/provider";
import type { ItineraryDraft } from "@/src/domain/ai-draft";

export class MockItineraryDraftProvider implements ItineraryDraftProvider {
  async generateDraft(input: ItineraryDraftInput): Promise<ItineraryDraft> {
    return {
      days: input.days.map((day) => ({
        date: day.date,
        items: [
          {
            startTime: "09:00",
            durationMinutes: 120,
            title: `Explore ${input.destination}`,
            suggestedPlaceName: input.destination,
            notes: input.preferencePrompt
              ? `Draft based on preference: ${input.preferencePrompt}`
              : "Start with a flexible morning stop."
          }
        ]
      }))
    };
  }
}
```

- [ ] **Step 5: Add OpenAI draft provider**

Create `apps/web/src/infrastructure/ai/openai-draft-provider.ts`:

```ts
import OpenAI from "openai";
import type { ItineraryDraftProvider, ItineraryDraftInput } from "@/src/application/ai/provider";
import { itineraryDraftSchema, type ItineraryDraft } from "@/src/domain/ai-draft";

export class OpenAIItineraryDraftProvider implements ItineraryDraftProvider {
  constructor(
    private readonly client: OpenAI,
    private readonly model: string
  ) {}

  async generateDraft(input: ItineraryDraftInput): Promise<ItineraryDraft> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content:
            "Create concise travel itinerary drafts as JSON. Return only JSON with days[].date and days[].items[]."
        },
        {
          role: "user",
          content: JSON.stringify({
            destination: input.destination,
            days: input.days,
            preferencePrompt: input.preferencePrompt,
            schema: {
              days: [
                {
                  date: "YYYY-MM-DD",
                  items: [
                    {
                      startTime: "HH:mm",
                      durationMinutes: 90,
                      title: "Short itinerary item title",
                      suggestedPlaceName: "Place name",
                      notes: "Planner-facing note"
                    }
                  ]
                }
              ]
            }
          })
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message.content ?? "{}";
    return itineraryDraftSchema.parse(JSON.parse(content));
  }
}
```

- [ ] **Step 6: Add AI draft route**

Create `apps/web/app/api/ai/draft/route.ts`:

```ts
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerEnv } from "@/src/lib/env";
import { validateItineraryDraft } from "@/src/domain/ai-draft";
import { MockItineraryDraftProvider } from "@/src/infrastructure/ai/mock-draft-provider";
import { OpenAIItineraryDraftProvider } from "@/src/infrastructure/ai/openai-draft-provider";

const requestSchema = z.object({
  destination: z.string().min(1),
  days: z.array(z.object({ date: z.string(), dayIndex: z.number().int().positive() })).min(1),
  preferencePrompt: z.string().default("")
});

export async function POST(request: Request) {
  const body = requestSchema.parse(await request.json());
  const env = getServerEnv();
  const provider = env.OPENAI_API_KEY
    ? new OpenAIItineraryDraftProvider(new OpenAI({ apiKey: env.OPENAI_API_KEY }), env.OPENAI_MODEL)
    : new MockItineraryDraftProvider();

  const draft = await provider.generateDraft(body);
  const valid = validateItineraryDraft(draft);

  if (!valid.ok) {
    return NextResponse.json({ error: valid.error }, { status: 422 });
  }

  return NextResponse.json({ draft: valid.value });
}
```

- [ ] **Step 7: Add AI draft panel**

Create `apps/web/components/ai/ai-draft-panel.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { ItineraryDraft } from "@/src/domain/ai-draft";

export function AiDraftPanel({
  destination,
  days
}: {
  destination: string;
  days: Array<{ date: string; dayIndex: number }>;
}) {
  const [preferencePrompt, setPreferencePrompt] = useState("");
  const [draft, setDraft] = useState<ItineraryDraft | null>(null);

  async function generateDraft() {
    const response = await fetch("/api/ai/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, days, preferencePrompt })
    });
    const data = (await response.json()) as { draft: ItineraryDraft };
    setDraft(data.draft);
  }

  return (
    <section className="rounded-lg border bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">AI draft</h2>
      <textarea
        className="mt-3 min-h-20 w-full rounded-md border px-3 py-2 text-sm"
        onChange={(event) => setPreferencePrompt(event.target.value)}
        placeholder="Food focused, low travel intensity, family friendly"
        value={preferencePrompt}
      />
      <button className="mt-3 rounded-md bg-slate-950 px-3 py-2 text-sm font-medium text-white" onClick={generateDraft} type="button">
        Generate draft
      </button>
      {draft ? (
        <div className="mt-4 grid gap-3">
          {draft.days.map((day) => (
            <div className="rounded-md border p-3" key={day.date}>
              <p className="text-sm font-medium">{day.date}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                {day.items.map((item) => (
                  <li key={`${day.date}-${item.startTime}-${item.title}`}>
                    {item.startTime} · {item.title}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <button className="rounded-md border px-3 py-2 text-sm font-medium" type="button">
            Apply draft
          </button>
        </div>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 8: Run AI provider test**

Run:

```bash
pnpm --dir apps/web test tests/infrastructure/ai-draft-provider.test.ts
```

Expected: PASS.

- [ ] **Step 9: Build app**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 10: Commit AI draft provider**

```bash
git add apps/web/src/application/ai apps/web/src/infrastructure/ai apps/web/app/api/ai apps/web/components/ai apps/web/tests/infrastructure/ai-draft-provider.test.ts
git commit -m "feat: add AI itinerary draft provider"
```

## Task 15: End-To-End Happy Path

**Files:**
- Create: `apps/web/playwright.config.ts`
- Create: `apps/web/tests/e2e/planning-core.spec.ts`
- Modify: `apps/web/package.json`

- [ ] **Step 1: Add Playwright config**

Create `apps/web/playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  webServer: {
    command: "pnpm dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120_000
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
```

- [ ] **Step 2: Add smoke E2E test**

Create `apps/web/tests/e2e/planning-core.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("visitor can reach the planning entry points", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /plan group trips/i })).toBeVisible();

  await page.getByRole("link", { name: /open trips/i }).click();
  await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();

  await page.getByRole("link", { name: /new trip/i }).click();
  await expect(page.getByRole("heading", { name: "Create trip" })).toBeVisible();
});
```

- [ ] **Step 3: Run E2E test**

Run:

```bash
pnpm --dir apps/web test:e2e
```

Expected: PASS in desktop and mobile projects.

- [ ] **Step 4: Run full verification**

Run:

```bash
pnpm --dir apps/web test
pnpm --dir apps/web test:e2e
pnpm build
```

Expected: all commands PASS.

- [ ] **Step 5: Commit E2E coverage**

```bash
git add apps/web/playwright.config.ts apps/web/tests/e2e apps/web/package.json
git commit -m "test: add RideFlow planning E2E smoke"
```

## Task 16: Production Wiring And Hardening

**Files:**
- Modify: `apps/web/app/(app)/trips/page.tsx`
- Modify: `apps/web/app/(app)/trips/new/page.tsx`
- Modify: `apps/web/app/(app)/trips/[tripId]/page.tsx`
- Create: `apps/web/src/infrastructure/supabase/trip-repository.ts`
- Create: `apps/web/src/infrastructure/supabase/timeline-repository.ts`
- Create: `apps/web/components/trips/access-denied.tsx`
- Create: `apps/web/components/trips/empty-state.tsx`

- [ ] **Step 1: Create access denied component**

Create `apps/web/components/trips/access-denied.tsx`:

```tsx
import Link from "next/link";

export function AccessDenied() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-sm rounded-lg border bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-slate-600">
          You do not have access to this trip.
        </p>
        <Link className="mt-4 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white" href="/trips">
          Back to trips
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create empty state component**

Create `apps/web/components/trips/empty-state.tsx`:

```tsx
import Link from "next/link";

export function EmptyTripsState() {
  return (
    <div className="rounded-lg border border-dashed bg-white p-8 text-center">
      <h2 className="text-lg font-semibold">No trips yet</h2>
      <p className="mt-2 text-sm text-slate-600">
        Create your first trip and start building a shared itinerary.
      </p>
      <Link className="mt-4 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white" href="/trips/new">
        Create trip
      </Link>
    </div>
  );
}
```

- [ ] **Step 3: Add Supabase trip repository**

Create `apps/web/src/infrastructure/supabase/trip-repository.ts`:

```ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CreatedTrip, PersistTripWithDaysInput, TripRepository } from "@/src/application/trips/types";
import type { Database } from "./database.types";

export class SupabaseTripRepository implements TripRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async createTripWithDays(input: PersistTripWithDaysInput): Promise<CreatedTrip> {
    const { data: trip, error: tripError } = await this.supabase
      .from("trips")
      .insert({
        name: input.name,
        destination: input.destination,
        start_date: input.startDate,
        end_date: input.endDate,
        owner_id: input.ownerId
      })
      .select("id")
      .single();

    if (tripError) {
      throw tripError;
    }

    const { error: memberError } = await this.supabase.from("trip_members").insert({
      trip_id: trip.id,
      user_id: input.ownerId,
      invited_email: "",
      role: "owner",
      invite_status: "accepted"
    });

    if (memberError) {
      throw memberError;
    }

    const { data: days, error: daysError } = await this.supabase
      .from("trip_days")
      .insert(
        input.days.map((day) => ({
          trip_id: trip.id,
          date: day.date,
          day_index: day.dayIndex
        }))
      )
      .select("id,date,day_index");

    if (daysError) {
      throw daysError;
    }

    return {
      id: trip.id,
      days: days.map((day) => ({
        id: day.id,
        date: day.date,
        dayIndex: day.day_index
      }))
    };
  }
}
```

- [ ] **Step 4: Add Supabase timeline repository**

Create `apps/web/src/infrastructure/supabase/timeline-repository.ts`:

```ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AddTimelineItemInput, TimelineRepository } from "@/src/application/timeline/types";
import type { Database } from "./database.types";

export class SupabaseTimelineRepository implements TimelineRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async addItem(input: AddTimelineItemInput): Promise<{ id: string }> {
    const { data, error } = await this.supabase
      .from("timeline_items")
      .insert({
        trip_id: input.tripId,
        trip_day_id: input.tripDayId,
        start_time: input.startTime,
        duration_minutes: input.durationMinutes,
        title: input.title,
        notes: input.notes,
        place_source: input.place?.source ?? null,
        place_source_id: input.place?.id ?? null,
        place_name: input.place?.name ?? null,
        place_address: input.place?.address ?? null,
        place_lat: input.place?.lat ?? null,
        place_lng: input.place?.lng ?? null,
        place_external_url: input.place?.externalUrl ?? null,
        updated_by: ""
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return { id: data.id };
  }

  async moveItem(input: { itemId: string; startTime: string }): Promise<{ id: string; startTime: string }> {
    const { data, error } = await this.supabase
      .from("timeline_items")
      .update({ start_time: input.startTime })
      .eq("id", input.itemId)
      .select("id,start_time")
      .single();

    if (error) {
      throw error;
    }

    return { id: data.id, startTime: data.start_time };
  }

  async deleteItem(input: { itemId: string }): Promise<{ id: string }> {
    const { data, error } = await this.supabase
      .from("timeline_items")
      .delete()
      .eq("id", input.itemId)
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return { id: data.id };
  }
}
```

- [ ] **Step 5: Run full verification**

Run:

```bash
pnpm --dir apps/web test
pnpm build
```

Expected: PASS.

- [ ] **Step 6: Commit production wiring pass**

```bash
git add apps/web/app/\\(app\\)/trips apps/web/components/trips apps/web/src/infrastructure/supabase
git commit -m "feat: wire RideFlow planning repositories"
```

## Task 17: Final Verification And Harness Trace

**Files:**
- Modify: `docs/stories/rideflow-v1-planning-core.md`

- [ ] **Step 1: Run final unit and integration tests**

Run:

```bash
pnpm --dir apps/web test
```

Expected: PASS.

- [ ] **Step 2: Run final E2E tests**

Run:

```bash
pnpm --dir apps/web test:e2e
```

Expected: PASS.

- [ ] **Step 3: Run production build**

Run:

```bash
pnpm build
```

Expected: PASS.

- [ ] **Step 4: Update story proof**

Modify `docs/stories/rideflow-v1-planning-core.md` by appending:

```markdown
## Latest Verification

- Unit and integration: `pnpm --dir apps/web test`
- E2E: `pnpm --dir apps/web test:e2e`
- Build: `pnpm build`
```

- [ ] **Step 5: Record Harness intake and trace when CLI is restored**

If `scripts/bin/harness-cli` exists, run:

```bash
scripts/bin/harness-cli intake --type "New spec" --summary "Build RideFlow V1 planning core" --lane high-risk
scripts/bin/harness-cli trace --summary "Implemented RideFlow V1 planning core" --outcome "completed"
```

Expected: intake and trace records are created. If the CLI is still absent, add this note to the story file:

```markdown
## Harness CLI Note

The documented Harness CLI path `scripts/bin/harness-cli` was unavailable during implementation, so durable intake and trace records could not be written from this workspace.
```

- [ ] **Step 6: Commit final proof**

```bash
git add docs/stories/rideflow-v1-planning-core.md
git commit -m "docs: record RideFlow v1 verification"
```

## Plan Self-Review

Spec coverage:

- V1 product scope is covered by Tasks 1, 4, 7, 10, 11, 12, 13, 14, and 16.
- Roles and permissions are covered by Tasks 3, 5, 8, and 16.
- Timeline UX is covered by Tasks 3, 9, 10, 12, and 13.
- Hybrid place search is covered by Task 11.
- AI draft is covered by Task 14.
- Architecture and tech stack are covered by Tasks 1, 2, 5, 6, and 16.
- Data model and validation are covered by Tasks 3, 5, 7, 8, 9, 11, and 14.
- Testing and proof are covered by Tasks 2, 3, 5, 7 through 15, and 17.

Placeholder scan:

- The plan contains concrete file paths, commands, and code snippets for each implementation area.
- The plan does not rely on unspecified feature work outside the approved V1 scope.

Type consistency:

- Role names are consistently `owner`, `planner`, and `viewer`.
- Place sources are consistently `seed`, `osm`, `manual`, and `google`.
- Timeline fields are consistently `startTime`, `durationMinutes`, `title`, `notes`, and place snapshot fields.
- AI draft fields are consistently `days`, `date`, `items`, `startTime`, `durationMinutes`, `title`, `suggestedPlaceName`, and `notes`.
