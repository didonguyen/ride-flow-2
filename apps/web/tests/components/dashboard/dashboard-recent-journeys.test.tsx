import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { DashboardRecentJourneys } from "@/components/dashboard/dashboard-recent-journeys";
import type { DashboardCompletedTrip } from "@/src/application/trips/dashboard-summary-data";

const trips: DashboardCompletedTrip[] = [
  {
    id: "pacific-coast",
    name: "Pacific Coast Highway",
    completedLabel: "Completed • Oct 12",
    imageUrl: "https://example.com/pacific.jpg",
    meta: ["450 mi", "4 Riders"]
  },
  {
    id: "high-desert-loop",
    name: "High Desert Loop",
    completedLabel: "Completed • Sep 28",
    imageUrl: "https://example.com/desert.jpg",
    meta: ["280 mi", "Solo"]
  }
];

describe("DashboardRecentJourneys (pixel-perfect)", () => {
  it("renders two cards with completion labels and meta lines", () => {
    render(<DashboardRecentJourneys trips={trips} />);
    const section = screen.getByTestId("dashboard-recent-journeys");
    expect(section).toHaveTextContent("Recent Journeys");
    expect(section).toHaveTextContent("Pacific Coast Highway");
    expect(section).toHaveTextContent("High Desert Loop");
    expect(
      screen.getByTestId("recent-meta-pacific-coast-450-mi")
    ).toHaveTextContent("450 mi");
    expect(
      screen.getByTestId("recent-meta-pacific-coast-4-riders")
    ).toHaveTextContent("4 Riders");
  });
});
