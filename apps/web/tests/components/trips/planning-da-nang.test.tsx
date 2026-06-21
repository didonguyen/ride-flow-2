import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PlanningSurface } from "@/components/trips/planning-surface";
import { TripAppShell } from "@/components/trip/trip-app-shell";
import { TripSectionTabs } from "@/components/trip/trip-section-tabs";
import { TripCoverHeader } from "@/components/trip/trip-cover-header";
import {
  agendaForDay,
  getPlanningTripById
} from "@/src/application/trips/planning-data";

const trip = getPlanningTripById("da-nang")!;

describe("Da Nang trip (pixel-perfect)", () => {
  it("has per-day agenda counts: 6 / 6 / 7", () => {
    expect(trip.days).toHaveLength(3);
    expect(agendaForDay(trip, "day-1")).toHaveLength(6);
    expect(agendaForDay(trip, "day-2")).toHaveLength(6);
    expect(agendaForDay(trip, "day-3")).toHaveLength(7);
  });

  it("PlanningSurface renders Day 1 stops", () => {
    render(<PlanningSurface trip={trip} />);
    const timeline = screen.getByTestId("trip-timeline");
    const items = within(timeline).getAllByTestId("trip-timeline-item");
    expect(items).toHaveLength(6);
    expect(timeline).toHaveTextContent("Depart from HCM");
    expect(timeline).toHaveTextContent("Flight to Da Nang");
    expect(timeline).toHaveTextContent("Lunch at Mì Quảng Ấn");
    expect(timeline).toHaveTextContent("Dinner near My Khe Beach");
  });

  it("switches to Day 2 and shows Bà Nà Hills + Golden Bridge", async () => {
    render(<PlanningSurface trip={trip} />);
    await userEvent.click(screen.getByTestId("trip-day-rail-day-day-2"));
    const timeline = screen.getByTestId("trip-timeline");
    const items = within(timeline).getAllByTestId("trip-timeline-item");
    expect(items).toHaveLength(6);
    expect(timeline).toHaveTextContent("Drive up to Bà Nà Hills");
    expect(timeline).toHaveTextContent("Golden Bridge photo stop");
    expect(timeline).toHaveTextContent("French Village walk");
  });

  it("switches to Day 3 and shows the Hội An day trip", async () => {
    render(<PlanningSurface trip={trip} />);
    await userEvent.click(screen.getByTestId("trip-day-rail-day-day-3"));
    const timeline = screen.getByTestId("trip-timeline");
    const items = within(timeline).getAllByTestId("trip-timeline-item");
    expect(items).toHaveLength(7);
    expect(timeline).toHaveTextContent("Ancient Town walk");
    expect(timeline).toHaveTextContent("Cooking class at Bếp Xưa");
    expect(timeline).toHaveTextContent("Lantern-lit dinner");
  });

  it("renders the cover header with date and transport pills (no destination line)", () => {
    render(
      <TripCoverHeader
        coverImageUrl="https://example.com/cover.jpg"
        dateRange="Oct 26 - Oct 28"
        days="3 Days"
        transport="Plane + Van"
        tripName="Da Nang Trip"
      />
    );
    expect(screen.getByTestId("trip-cover-header")).toHaveTextContent(
      "Da Nang Trip"
    );
  });

  it("renders the section tabs with Planning active", () => {
    render(<TripSectionTabs activeTab="Planning" tripId="da-nang" />);
    expect(screen.getByTestId("trip-section-tab-planning")).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("renders the trip app shell with back link + page title", () => {
    render(
      <TripAppShell
        activeItem="My Trips"
        backHref={"/trips" as never}
        pageTitle="Da Nang Trip"
        showSearch
      >
        <div>body</div>
      </TripAppShell>
    );
    expect(screen.getByTestId("trip-app-back")).toHaveAttribute("href", "/trips");
    expect(screen.getByTestId("trip-app-page-title")).toHaveTextContent(
      "Da Nang Trip"
    );
    expect(screen.getByTestId("trip-app-search")).toBeInTheDocument();
  });
});
