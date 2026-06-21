import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TripRouteOverview } from "@/components/trips/trip-route-overview";

describe("TripRouteOverview (pixel-perfect)", () => {
  it("renders the route card with start, destination, distance, and duration", () => {
    render(
      <TripRouteOverview
        distance="142 km"
        duration="3h 15m"
        end={{ label: "Nam Cát Tiên", sublabel: "Dong Nai, Vietnam" }}
        start={{ label: "Hồ Chí Minh City", sublabel: "Starting Point" }}
      />
    );
    const card = screen.getByTestId("trip-route-overview");
    expect(card).toHaveTextContent("Route Overview");
    expect(card).toHaveTextContent("Hồ Chí Minh City");
    expect(card).toHaveTextContent("Nam Cát Tiên");
    expect(card).toHaveTextContent("142 km");
    expect(card).toHaveTextContent("3h 15m");
  });

  it("invokes onOpenMap when the external link is clicked", async () => {
    const onOpen = vi.fn();
    render(
      <TripRouteOverview
        distance="142 km"
        duration="3h 15m"
        end={{ label: "End" }}
        onOpenMap={onOpen}
        start={{ label: "Start" }}
      />
    );
    await userEvent.click(screen.getByTestId("trip-route-overview-open"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
