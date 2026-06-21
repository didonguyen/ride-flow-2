import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ExpensesSurface } from "@/components/trips/expenses-surface";
import type { TripMemberRecord } from "@/src/application/members/types";
import { getTripExpenseSummary } from "@/src/application/trips/expenses-data";
import type { ExpenseRecord } from "@/src/application/trips/types";

const members: TripMemberRecord[] = [
  {
    id: "member-1",
    tripId: "trip-1",
    userId: "user-1",
    email: "an@example.com",
    role: "owner",
    inviteStatus: "accepted"
  },
  {
    id: "member-2",
    tripId: "trip-1",
    userId: null,
    email: "binh@example.com",
    role: "planner",
    inviteStatus: "pending"
  }
];

const expenses: ExpenseRecord[] = [
  {
    id: "expense-1",
    tripId: "trip-1",
    title: "Fuel refill",
    amount: 68000,
    currency: "VND",
    category: "fuel",
    paidByMemberId: "member-1",
    date: "2026-07-10",
    notes: "Highway stop",
    createdBy: "user-1",
    participants: [
      { memberId: "member-1", shareAmount: 34000 },
      { memberId: "member-2", shareAmount: 34000 }
    ]
  }
];

function renderSurface(overrides?: {
  expenses?: ExpenseRecord[];
  members?: TripMemberRecord[];
}) {
  const activeMembers = overrides?.members ?? members;
  return render(
    <ExpensesSurface
      addExpenseAction={vi.fn()}
      deleteExpenseAction={vi.fn()}
      members={activeMembers}
      summary={getTripExpenseSummary({
        expenses: overrides?.expenses ?? expenses,
        members: activeMembers
      })}
      tripId="trip-1"
      tripName="Nam Cat Tien Exploration"
      updateExpenseAction={vi.fn()}
    />
  );
}

describe("ExpensesSurface", () => {
  it("opens a real add-expense form with payer and participant controls", async () => {
    renderSurface();

    await userEvent.click(screen.getByTestId("expenses-add"));

    expect(screen.getByTestId("expenses-add-form")).toBeInTheDocument();
    expect(screen.getByLabelText("Paid by")).toHaveValue("member-1");
    expect(screen.getByLabelText("an@example.com")).toBeChecked();
    expect(screen.getByLabelText("binh@example.com")).toBeChecked();
    expect(screen.queryByText("Trip Budget")).not.toBeInTheDocument();
  });

  it("opens the edit form for an existing expense", async () => {
    renderSurface();

    await userEvent.click(screen.getByTestId("expenses-edit-expense-1"));

    expect(screen.getByTestId("expenses-edit-form")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fuel refill")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2026-07-10")).toBeInTheDocument();
  });

  it("shows the settle confirmation when Settle all balances is clicked", async () => {
    renderSurface();

    await userEvent.click(screen.getByTestId("expenses-settle-all"));

    expect(screen.getByTestId("expenses-settle-confirmation")).toBeInTheDocument();
  });

  it("shows an empty state when the trip has no expenses", () => {
    renderSurface({ expenses: [] });

    expect(screen.getByTestId("expenses-empty")).toHaveTextContent(
      "No expenses recorded yet."
    );
  });
});