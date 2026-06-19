import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { DashboardPlanningActivity } from "@/components/dashboard/dashboard-planning-activity";
import type { DashboardActivity } from "@/src/application/trips/dashboard-summary-data";

const entries: DashboardActivity[] = [
  {
    id: "act-1",
    actor: "Alex",
    actorInitial: "A",
    action: "added a waypoint:",
    target: "Bao Loc Pass",
    relativeTime: "2 hours ago"
  },
  {
    id: "act-2",
    actor: "You",
    actorInitial: "Y",
    action: "booked accommodation:",
    target: "Forest Lodge",
    relativeTime: "Yesterday"
  }
];

describe("DashboardPlanningActivity (pixel-perfect)", () => {
  it("renders the planning activity header, entries, and full-history link", () => {
    render(<DashboardPlanningActivity entries={entries} />);
    const card = screen.getByTestId("dashboard-planning-activity");
    expect(card).toHaveTextContent("Planning Activity");
    expect(card).toHaveTextContent("Alex");
    expect(card).toHaveTextContent("Bao Loc Pass");
    expect(card).toHaveTextContent("2 hours ago");
    expect(card).toHaveTextContent("You");
    expect(card).toHaveTextContent("Forest Lodge");
    expect(screen.getByTestId("dashboard-activity-full")).toHaveTextContent(
      "View full history"
    );
  });
});
