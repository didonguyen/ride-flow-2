import { describe, expect, it } from "vitest";

import { validateMemoryDraft } from "@/src/domain/memories";

describe("memory domain", () => {
  it("accepts a title-only memory", () => {
    const result = validateMemoryDraft({
      content: "",
      imageCount: 0,
      title: "Dragon Bridge at night"
    });

    expect(result).toEqual({
      ok: true,
      value: {
        content: "",
        imageCount: 0,
        title: "Dragon Bridge at night"
      }
    });
  });

  it("accepts a content-only memory", () => {
    const result = validateMemoryDraft({
      content: "Everyone finally slowed down after dinner.",
      imageCount: 0,
      title: ""
    });

    expect(result.ok).toBe(true);
  });

  it("accepts an image-only memory", () => {
    const result = validateMemoryDraft({
      content: "",
      imageCount: 2,
      title: ""
    });

    expect(result.ok).toBe(true);
  });

  it("trims title and content", () => {
    const result = validateMemoryDraft({
      content: "  Cool morning air  ",
      imageCount: 1,
      title: "  Departure  "
    });

    expect(result).toEqual({
      ok: true,
      value: {
        content: "Cool morning air",
        imageCount: 1,
        title: "Departure"
      }
    });
  });

  it("rejects a fully empty memory", () => {
    const result = validateMemoryDraft({
      content: "   ",
      imageCount: 0,
      title: "   "
    });

    expect(result).toEqual({ ok: false, error: "memory_empty" });
  });
});
