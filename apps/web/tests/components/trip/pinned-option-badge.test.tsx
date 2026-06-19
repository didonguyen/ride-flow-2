import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { PinnedOptionBadge } from "@/components/trip/pinned-option-badge";

describe("PinnedOptionBadge", () => {
  it("renders the pinned option label and the forest background tone", () => {
    render(<PinnedOptionBadge />);
    const badge = screen.getByTestId("pinned-option-badge");
    expect(badge).toHaveTextContent("Pinned Option");
    expect(badge.className).toContain("forest-800");
  });
});
