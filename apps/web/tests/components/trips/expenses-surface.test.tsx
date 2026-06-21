import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExpensesSurface } from "@/components/trips/expenses-surface";

describe("ExpensesSurface (pixel-perfect)", () => {
  it("toggles Split equally when the button is clicked", async () => {
    render(<ExpensesSurface tripId="nam-cat-tien" tripName="Nam Cát Tiên Exploration" />);
    const split = screen.getByTestId("expenses-split-equally");
    expect(split).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(split);
    expect(split).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the add expense confirmation when Add expense is clicked", async () => {
    render(<ExpensesSurface tripId="nam-cat-tien" tripName="Nam Cát Tiên Exploration" />);
    await userEvent.click(screen.getByTestId("expenses-add"));
    expect(screen.getByTestId("expenses-add-confirmation")).toBeInTheDocument();
  });

  it("toggles Edit Details", async () => {
    render(<ExpensesSurface tripId="nam-cat-tien" tripName="Nam Cát Tiên Exploration" />);
    const edit = screen.getByTestId("expenses-edit-details");
    expect(edit).toHaveTextContent("Edit Details");
    await userEvent.click(edit);
    expect(edit).toHaveTextContent("Editing…");
  });

  it("toggles Start Ride", async () => {
    render(<ExpensesSurface tripId="nam-cat-tien" tripName="Nam Cát Tiên Exploration" />);
    const ride = screen.getByTestId("expenses-start-ride");
    expect(ride).toHaveTextContent("Start Ride");
    await userEvent.click(ride);
    expect(ride).toHaveTextContent("Riding…");
  });

  it("shows the settle confirmation when Settle all balances is clicked", async () => {
    render(<ExpensesSurface tripId="nam-cat-tien" tripName="Nam Cát Tiên Exploration" />);
    await userEvent.click(screen.getByTestId("expenses-settle-all"));
    expect(screen.getByTestId("expenses-settle-confirmation")).toBeInTheDocument();
  });
});
