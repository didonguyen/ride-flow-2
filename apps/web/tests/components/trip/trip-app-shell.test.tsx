import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { TripAppShell } from "@/components/trip/trip-app-shell";

describe("TripAppShell", () => {
  it("renders the sidebar profile, nav, and the active item marker", () => {
    render(
      <TripAppShell activeItem="My Trips">
        <div>body</div>
      </TripAppShell>
    );
    const shell = screen.getByTestId("trip-app-shell");
    expect(shell).toHaveTextContent("The Modern Explorer");
    expect(shell).toHaveTextContent("Premium Member");
    expect(screen.getByTestId("upgrade-to-pro")).toBeInTheDocument();
    expect(screen.getByTestId("nav-my-trips")).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByTestId("nav-settings")).toBeInTheDocument();
  });
});
