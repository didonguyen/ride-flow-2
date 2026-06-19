import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { DashboardUpcomingAdventure } from "@/components/dashboard/dashboard-upcoming-adventure";
import type { DashboardUpcomingTrip } from "@/src/application/trips/dashboard-summary-data";

const trip: DashboardUpcomingTrip = {
  id: "da-nang",
  name: "Nam Cát Tiên Exploration",
  terrain: "Off-Road",
  daysLabel: "3 Days",
  coverImageUrl: "https://example.com/cover.jpg",
  progress: 65,
  progressLabel: "65% Planned",
  members: [
    { id: "m-1", name: "Alex", initial: "A" },
    { id: "m-2", name: "Sarah", initial: "S" }
  ],
  extraMemberCount: 2
};

describe("DashboardUpcomingAdventure (pixel-perfect)", () => {
  it("renders terrain chip, days chip, 65% progress, and members", () => {
    render(
      <DashboardUpcomingAdventure href={"/trips/da-nang" as never} trip={trip} />
    );
    const card = screen.getByTestId("dashboard-upcoming-adventure");
    expect(card).toHaveTextContent("Off-Road");
    expect(card).toHaveTextContent("3 Days");
    expect(card).toHaveTextContent("Nam Cát Tiên Exploration");
    expect(card).toHaveTextContent("65%");
    expect(card).toHaveTextContent("Planned");
    expect(screen.getByTestId("dashboard-upcoming-progress")).toBeVisible();
    expect(screen.getByTestId("upcoming-member-m-1")).toHaveTextContent("A");
    expect(screen.getByTestId("upcoming-member-m-2")).toHaveTextContent("S");
    expect(screen.getByTestId("upcoming-extra-members")).toHaveTextContent("+2");
  });
});
