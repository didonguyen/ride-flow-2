import { afterEach, describe, expect, it, vi } from "vitest";

describe("environment parsing", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("parses required public environment values", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");

    const { getPublicEnv } = await import("@/src/lib/env");

    expect(getPublicEnv()).toEqual({
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key"
    });
  });

  it("uses server defaults when optional environment values are blank", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    vi.stubEnv("OPENAI_API_KEY", "");
    vi.stubEnv("OPENAI_MODEL", "");
    vi.stubEnv("OSM_NOMINATIM_BASE_URL", "");

    const { getServerEnv } = await import("@/src/lib/env");

    expect(getServerEnv()).toMatchObject({
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
      OPENAI_API_KEY: undefined,
      OPENAI_MODEL: "gpt-4.1-mini",
      OSM_NOMINATIM_BASE_URL: "https://nominatim.openstreetmap.org"
    });
  });
});
