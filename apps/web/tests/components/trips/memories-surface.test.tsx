import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MemoriesSurface } from "@/components/trips/memories-surface";

describe("MemoriesSurface (pixel-perfect)", () => {
  it("renders the memories timeline with two entries", () => {
    render(<MemoriesSurface tripId="nam-cat-tien" tripName="Nam Cát Tiên Exploration" />);
    const timeline = screen.getByTestId("memories-timeline");
    expect(timeline).toBeInTheDocument();
    expect(screen.getByTestId("memories-entry-mem-1")).toBeInTheDocument();
    expect(screen.getByTestId("memories-entry-mem-2")).toBeInTheDocument();
    expect(screen.getByTestId("trip-vault-card")).toBeInTheDocument();
  });

  it("shows the add memory confirmation when Add Memory is clicked", async () => {
    render(<MemoriesSurface tripId="nam-cat-tien" tripName="Nam Cát Tiên Exploration" />);
    await userEvent.click(screen.getByTestId("trip-vault-add"));
    expect(screen.getByTestId("memories-add-confirmation")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("memories-add-dismiss"));
    expect(
      screen.queryByTestId("memories-add-confirmation")
    ).not.toBeInTheDocument();
  });

  it("adds a new day when the day rail Add Day is clicked", async () => {
    render(<MemoriesSurface tripId="nam-cat-tien" tripName="Nam Cát Tiên Exploration" />);
    const initialDayButtons = screen.getAllByTestId(/^trip-day-rail-day-/);
    expect(initialDayButtons).toHaveLength(2);
    await userEvent.click(screen.getByTestId("trip-day-rail-add"));
    const afterDayButtons = screen.getAllByTestId(/^trip-day-rail-day-/);
    expect(afterDayButtons).toHaveLength(3);
  });
});
