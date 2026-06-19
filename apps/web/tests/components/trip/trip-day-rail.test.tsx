import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TripDayRail } from "@/components/trip/trip-day-rail";

const days = [
  { id: "day-1", label: "Day 1", date: "Oct 14", isSelected: true },
  { id: "day-2", label: "Day 2", date: "Oct 15" }
];

describe("TripDayRail", () => {
  it("renders the day list and the Add Day button", async () => {
    const onAdd = vi.fn();
    const onSelect = vi.fn();
    render(
      <TripDayRail days={days} onAddDay={onAdd} onSelectDay={onSelect} />
    );
    expect(screen.getByTestId("trip-day-rail-day-day-1")).toHaveTextContent(
      "Day 1"
    );
    await userEvent.click(screen.getByTestId("trip-day-rail-add"));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
