import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { SettlementRow } from "@/components/trip/settlement-row";

describe("SettlementRow", () => {
  it("renders the debtor/creditor line and the amount", () => {
    render(
      <SettlementRow
        amount={18}
        creditorName="Nhut"
        debtorInitial="M"
        debtorName="Minh"
      />
    );
    const row = screen.getByTestId("settlement-row");
    expect(row).toHaveTextContent("Minh owes Nhut");
    expect(row).toHaveTextContent("$18.00");
  });
});
