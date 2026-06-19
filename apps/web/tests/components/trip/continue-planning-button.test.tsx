import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ContinuePlanningButton } from "@/components/trip/continue-planning-button";

describe("ContinuePlanningButton", () => {
  it("renders a link to the trip with the default label", () => {
    render(<ContinuePlanningButton href={"/trips/abc" as never} />);
    const link = screen.getByTestId("continue-planning-button");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/trips/abc");
    expect(link).toHaveTextContent("Continue planning");
    expect(link.className).toContain("forest-800");
  });
});
