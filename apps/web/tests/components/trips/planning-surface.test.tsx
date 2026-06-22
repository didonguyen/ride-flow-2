import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PlanningSurface } from "@/components/trips/planning-surface";
import { planningTrips } from "@/src/application/trips/planning-data";

describe("PlanningSurface (pixel-perfect)", () => {
  it("renders the day rail, timeline, route overview, AI assistant, and night alternatives", () => {
    render(<PlanningSurface trip={planningTrips[0]!} />);
    const surface = screen.getByTestId("planning-surface");
    expect(surface).toBeVisible();
    expect(screen.getByTestId("trip-day-rail")).toBeVisible();
    expect(screen.getByTestId("trip-timeline")).toBeVisible();
    expect(screen.getByTestId("trip-route-overview")).toBeVisible();
    expect(screen.getByTestId("ai-assistant-card")).toBeVisible();
    expect(screen.getByTestId("planning-night-alternatives")).toBeVisible();
    expect(
      screen.getByTestId("planning-night-alternative-green-hope")
    ).toHaveTextContent("Green Hope Lodge");
  });

  it("selects a day when the rail is clicked", async () => {
    const trip = planningTrips[0]!;
    if (trip.days.length < 2) {
      return;
    }
    render(<PlanningSurface addDayAction={vi.fn()} trip={trip} />);
    await userEvent.click(
      screen.getByTestId(`trip-day-rail-day-${trip.days[1]!.id}`)
    );
    expect(
      screen.getByTestId(`trip-day-rail-day-${trip.days[1]!.id}`)
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("invokes the dismiss handler when the AI assistant Dismiss is clicked", async () => {
    const onDismiss = vi.fn();
    render(
      <PlanningSurface
        onDismissAssistant={onDismiss}
        trip={planningTrips[0]!}
      />
    );
    await userEvent.click(screen.getByTestId("ai-assistant-secondary"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("submits a new day from the Add Day modal without adding a synthetic day", async () => {
    const trip = planningTrips[0]!;
    render(<PlanningSurface addDayAction={vi.fn()} trip={trip} />);
    const initialDays = screen.getAllByTestId(/^trip-day-rail-day-/);
    expect(initialDays).toHaveLength(trip.days.length);
    await userEvent.click(screen.getByTestId("trip-day-rail-add"));
    expect(screen.getByTestId("planning-add-day-form")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("planning-add-day-submit"));
    const afterDays = screen.getAllByTestId(/^trip-day-rail-day-/);
    expect(afterDays).toHaveLength(trip.days.length);
  });
});
