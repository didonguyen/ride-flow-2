import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { BudgetUsageBar } from "@/components/trip/budget-usage-bar";

const slices = [
  { name: "Accommodation", amount: 150, color: "#003527" },
  { name: "Food", amount: 120, color: "#80bea6" },
  { name: "Fuel", amount: 90, color: "#c3ecd7" },
  { name: "Tickets", amount: 60, color: "#f2cfbf" },
  { name: "Misc", amount: 30, color: "#b65a3a" }
];

describe("BudgetUsageBar", () => {
  it("renders one slice per category and a legend", () => {
    render(<BudgetUsageBar slices={slices} total={450} />);
    const bar = screen.getByTestId("budget-usage-bar");
    expect(bar).toBeVisible();
    expect(screen.getByTestId("budget-slice-accommodation")).toBeVisible();
    expect(screen.getByTestId("budget-slice-fuel")).toBeVisible();
    expect(screen.getByText(/Accommodation \(\$150\)/)).toBeVisible();
  });
});
