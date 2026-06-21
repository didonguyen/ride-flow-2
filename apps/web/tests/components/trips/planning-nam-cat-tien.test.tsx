import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PlanningSurface } from "@/components/trips/planning-surface";
import { TripAppShell } from "@/components/trip/trip-app-shell";
import { TripSectionTabs } from "@/components/trip/trip-section-tabs";
import { TripCoverHeader } from "@/components/trip/trip-cover-header";
import {
  agendaForDay,
  planningTrips
} from "@/src/application/trips/planning-data";

const trip = planningTrips.find((t) => t.id === "nam-cat-tien")!;

describe("Nam Cát Tiên trip (pixel-perfect)", () => {
  it("filters the agenda to the selected day", () => {
    expect(agendaForDay(trip, "day-1").length).toBe(5);
    expect(agendaForDay(trip, "day-2").length).toBe(4);
  });

  it("PlanningSurface renders Day 1 stops and the day rail", () => {
    render(<PlanningSurface trip={trip} />);
    const timeline = screen.getByTestId("trip-timeline");
    const items = within(timeline).getAllByTestId("trip-timeline-item");
    expect(items).toHaveLength(5);
    expect(timeline).toHaveTextContent("Depart from HCM");
    expect(timeline).toHaveTextContent("Lunch near Nam Cát Tiên");
    expect(timeline).toHaveTextContent("Sunset at Bàu Sấu Lake");
  });

  it("switches the timeline when the day rail is clicked", async () => {
    render(<PlanningSurface trip={trip} />);
    await userEvent.click(screen.getByTestId("trip-day-rail-day-day-2"));
    const timeline = screen.getByTestId("trip-timeline");
    const items = within(timeline).getAllByTestId("trip-timeline-item");
    expect(items).toHaveLength(4);
    expect(timeline).toHaveTextContent("Sunrise Safari Drive");
    expect(timeline).toHaveTextContent("Return to HCM");
  });

  it("renders the cover header without a destination line", () => {
    render(
      <TripCoverHeader
        coverImageUrl="https://example.com/cover.jpg"
        dateRange="Oct 14-15"
        days="2 Days"
        transport="Motorcycle"
        tripName="Nam Cát Tiên Exploration"
      />
    );
    const header = screen.getByTestId("trip-cover-header");
    expect(header).toHaveTextContent("Nam Cát Tiên Exploration");
  });

  it("renders the section tabs with Planning active", () => {
    render(<TripSectionTabs activeTab="Planning" tripId="nam-cat-tien" />);
    expect(screen.getByTestId("trip-section-tab-planning")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("renders the trip app shell with the back link, page title, and search", () => {
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
    expect(screen.getByTestId("trip-app-back")).toHaveAttribute("href", "/trips");
    expect(screen.getByTestId("trip-app-page-title")).toHaveTextContent(
      "Nam Cát Tiên Exploration"
    );
    expect(screen.getByTestId("trip-app-search")).toBeInTheDocument();
  });
});
