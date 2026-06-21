import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TripAppShell } from "@/components/trip/trip-app-shell";

describe("TripAppShell (pixel-perfect)", () => {
  it("renders the sidebar profile, Upgrade to Pro pill, and active Dashboard nav", () => {
    render(
      <TripAppShell activeItem="Dashboard" pageTitle="Dashboard">
        <div>body</div>
      </TripAppShell>
    );
    expect(screen.getByTestId("upgrade-to-pro")).toBeInTheDocument();
    expect(screen.getByTestId("nav-dashboard")).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(screen.getByTestId("nav-settings")).toBeInTheDocument();
  });

  it("renders the top bar with page title, bell, and account", () => {
    render(
      <TripAppShell pageTitle="Dashboard">
        <div>body</div>
      </TripAppShell>
    );
    const topbar = screen.getByTestId("trip-app-topbar");
    expect(topbar).toBeInTheDocument();
    expect(screen.getByTestId("trip-app-page-title")).toHaveTextContent("Dashboard");
    expect(screen.getByTestId("trip-app-bell")).toBeInTheDocument();
    expect(screen.getByTestId("trip-app-account")).toBeInTheDocument();
  });

  it("renders the back link and search button on the trip details top bar", () => {
    render(
      <TripAppShell
        activeItem="My Trips"
        backHref={"/trips" as never}
        pageTitle="Nam Cát Tiên Exploration"
        showSearch
      >
        <div>body</div>
      </TripAppShell>
    );
    const back = screen.getByTestId("trip-app-back");
    expect(back).toHaveAttribute("href", "/trips");
    expect(screen.getByTestId("trip-app-page-title")).toHaveTextContent(
      "Nam Cát Tiên Exploration"
    );
    expect(screen.getByTestId("trip-app-search")).toBeInTheDocument();
    expect(screen.getByTestId("nav-my-trips")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("invokes onUpgradeClick when the Upgrade to Pro button is pressed", async () => {
    const onClick = vi.fn();
    render(
      <TripAppShell onUpgradeClick={onClick} pageTitle="Dashboard">
        <div>body</div>
      </TripAppShell>
    );
    await userEvent.click(screen.getByTestId("upgrade-to-pro"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
