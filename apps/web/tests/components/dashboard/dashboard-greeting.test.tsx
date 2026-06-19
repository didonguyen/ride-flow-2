import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";

describe("DashboardGreeting (pixel-perfect)", () => {
  it("renders the greeting in display font and forest tone", () => {
    render(
      <DashboardGreeting
        greeting="Welcome back."
        subtitle="The road is calling. Let's get planning."
      />
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Welcome back.");
    expect(heading.className).toContain("font-display");
    expect(heading.className).toContain("text-forest-800");
    expect(heading.className).toContain("text-5xl");
  });
});
