import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookieSet: vi.fn(),
  createServerClient: vi.fn()
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    getAll: () => [],
    set: mocks.cookieSet
  }))
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: mocks.createServerClient
}));

describe("createSupabaseServerClient", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54321");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
  });

  it("ignores cookie write attempts when called from a Server Component", async () => {
    mocks.cookieSet.mockImplementation(() => {
      throw new Error(
        "Cookies can only be modified in a Server Action or Route Handler."
      );
    });
    mocks.createServerClient.mockImplementation((_url, _key, options) => {
      options.cookies.setAll([
        {
          name: "sb-test-auth-token",
          value: "token",
          options: { path: "/" }
        }
      ]);

      return { auth: { getUser: vi.fn() } };
    });

    const { createSupabaseServerClient } = await import(
      "@/src/infrastructure/supabase/server"
    );

    await expect(createSupabaseServerClient()).resolves.toEqual({
      auth: { getUser: expect.any(Function) }
    });
  });
});
