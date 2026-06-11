import { describe, expect, it } from "vitest";
import { normalizeManualPlace } from "@/src/domain/places";

describe("place domain rules", () => {
  it("normalizes manual places", () => {
    expect(
      normalizeManualPlace({
        name: "  My Khe Beach ",
        address: "Da Nang",
        externalUrl: "https://example.com/my-khe"
      })
    ).toEqual({
      ok: true,
      value: {
        id: "manual:my-khe-beach",
        source: "manual",
        name: "My Khe Beach",
        address: "Da Nang",
        externalUrl: "https://example.com/my-khe"
      }
    });
  });

  it("rejects a blank manual place name", () => {
    expect(normalizeManualPlace({ name: "   " })).toEqual({
      ok: false,
      error: "place_name_required"
    });
  });
});
