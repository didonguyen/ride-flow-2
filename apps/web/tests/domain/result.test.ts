import { describe, expect, it } from "vitest";
import { err, ok } from "@/src/lib/result";

describe("Result helpers", () => {
  it("creates success and failure results", () => {
    expect(ok("saved")).toEqual({ ok: true, value: "saved" });
    expect(err("invalid")).toEqual({ ok: false, error: "invalid" });
  });
});
