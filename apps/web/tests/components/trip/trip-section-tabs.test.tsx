import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { TripSectionTabs } from "@/components/trip/trip-section-tabs";

describe("TripSectionTabs", () => {
  it("renders the three tabs and marks the active one", () => {
    render(<TripSectionTabs activeTab="Planning" tripId="abc" />);
    const nav = screen.getByTestId("trip-section-tabs");
    expect(nav).toHaveTextContent("Planning");
    expect(nav).toHaveTextContent("Memories");
    expect(nav).toHaveTextContent("Expenses");
    expect(screen.getByTestId("trip-section-tab-planning")).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByTestId("trip-section-tab-expenses").getAttribute("href")
    ).toBe("/trips/abc/expenses");
  });
});
