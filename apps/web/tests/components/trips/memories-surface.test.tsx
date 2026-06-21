import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MemoriesSurface } from "@/components/trips/memories-surface";
import { getTripMemories } from "@/src/application/trips/memories-data";

describe("MemoriesSurface", () => {
  it("renders trip-level memories without a day rail", () => {
    render(
      <MemoriesSurface
        memories={getTripMemories()}
        tripId="nam-cat-tien"
        tripName="Nam Cát Tiên Exploration"
      />
    );

    expect(screen.getByTestId("memories-timeline")).toBeInTheDocument();
    expect(screen.getByTestId("memories-entry-mem-1")).toBeInTheDocument();
    expect(screen.queryByTestId("trip-day-rail")).not.toBeInTheDocument();
    expect(screen.getByTestId("trip-vault-card")).toBeInTheDocument();
  });

  it("shows the add memory form when Add Memory is clicked", async () => {
    render(
      <MemoriesSurface
        memories={getTripMemories()}
        tripId="nam-cat-tien"
        tripName="Nam Cát Tiên Exploration"
      />
    );

    await userEvent.click(screen.getByTestId("trip-vault-add"));
    expect(screen.getByTestId("memories-add-form")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Content")).toBeInTheDocument();
    expect(screen.getByLabelText("Images")).toHaveAttribute("multiple");
    await userEvent.click(screen.getByTestId("memories-add-dismiss"));
    expect(screen.queryByTestId("memories-add-form")).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no memories", () => {
    render(
      <MemoriesSurface
        memories={[]}
        tripId="trip-1"
        tripName="Da Nang"
      />
    );

    expect(screen.getByTestId("memories-empty")).toHaveTextContent(
      "No memories yet"
    );
  });
});
