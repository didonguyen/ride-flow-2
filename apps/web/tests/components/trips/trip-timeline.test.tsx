import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TripTimeline, TripTimelineItem } from "@/components/trips/trip-timeline";
import type { PlanningAgendaItem } from "@/src/application/trips/planning-data";

const baseItem: PlanningAgendaItem = {
  id: "item-1",
  stop: 1,
  time: "07:00 AM",
  title: "Depart from HCM",
  description: "Starting Point",
  category: "flight",
  imageUrl: "",
  imageAlt: ""
};

describe("TripTimeline (pixel-perfect)", () => {
  it("renders a timeline item with the requested status tone", () => {
    render(
      <TripTimelineItem
        item={baseItem}
        status="confirmed"
        statusLabel="Confirmed"
      />
    );
    const item = screen.getByTestId("trip-timeline-item");
    expect(item).toHaveTextContent("07:00 AM");
    expect(item).toHaveTextContent("Depart from HCM");
    expect(item).toHaveTextContent("Confirmed");
  });

  it("renders a stack of timeline items via TripTimeline", () => {
    render(
      <TripTimeline
        items={[
          { ...baseItem, id: "a" },
          { ...baseItem, id: "b", time: "09:30 AM", title: "Coffee & Fuel" }
        ]}
      />
    );
    const list = screen.getByTestId("trip-timeline");
    expect(list).toHaveTextContent("Depart from HCM");
    expect(list).toHaveTextContent("Coffee & Fuel");
  });

  it("invokes onConfirmItem when the Book / Confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    const withImage: PlanningAgendaItem = {
      ...baseItem,
      imageUrl: "https://example.com/forest.jpg",
      imageAlt: "Forest cafe",
      rating: "4.5/5"
    };
    render(
      <TripTimeline
        items={[withImage]}
        onConfirmItem={onConfirm}
        statusOverrides={{ "item-1": { status: "ready", label: "Ready" } }}
      />
    );
    await userEvent.click(screen.getByTestId("trip-timeline-confirm"));
    expect(onConfirm).toHaveBeenCalledWith("item-1");
    expect(screen.getByTestId("trip-timeline-image")).toBeVisible();
    expect(screen.getByTestId("trip-timeline-backup")).toHaveTextContent(
      "Backup Option"
    );
  });
});
