import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { TransactionRow } from "@/components/trip/transaction-row";

describe("TransactionRow", () => {
  it("renders title, payer, date, amount, and the pending status chip", () => {
    render(
      <TransactionRow
        amount={24}
        category="food"
        date="Jul 10"
        paidBy="Minh"
        status="pending"
        title="Coffee stop"
      />
    );
    const row = screen.getByTestId("transaction-row");
    expect(row).toHaveTextContent("Coffee stop");
    expect(row).toHaveTextContent("Paid by Minh • Jul 10");
    expect(row).toHaveTextContent("$24.00");
    expect(row).toHaveTextContent("Pending");
  });
});
