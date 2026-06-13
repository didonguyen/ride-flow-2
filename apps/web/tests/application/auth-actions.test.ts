import { describe, expect, it } from "vitest";

import { normalizeAuthRedirect } from "@/src/application/auth/actions";

describe("normalizeAuthRedirect", () => {
  it("keeps safe relative paths", () => {
    expect(normalizeAuthRedirect("/trips")).toBe("/trips");
  });

  it("falls back for absolute URLs", () => {
    expect(normalizeAuthRedirect("https://evil.example")).toBe("/trips");
  });

  it("falls back for missing redirects", () => {
    expect(normalizeAuthRedirect(null)).toBe("/trips");
  });

  it("falls back for protocol-relative URLs", () => {
    expect(normalizeAuthRedirect("//evil.example")).toBe("/trips");
  });
});
