import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { MemberBalanceRow } from "@/components/trip/member-balance-row";

describe("MemberBalanceRow", () => {
  it("renders the name with a positive Gets tone", () => {
    render(
      <MemberBalanceRow amount={45} initial="A" name="An" tone="gets" />
    );
    const row = screen.getByTestId("member-balance-row");
    expect(row).toHaveTextContent("An");
    expect(row).toHaveTextContent("Gets $45");
    expect(row).toHaveAttribute("data-tone", "gets");
  });

  it("renders the name with the Owes tone", () => {
    render(
      <MemberBalanceRow amount={25} initial="M" name="Minh" tone="owes" />
    );
    const row = screen.getByTestId("member-balance-row");
    expect(row).toHaveTextContent("Owes $25");
    expect(row).toHaveAttribute("data-tone", "owes");
  });
});
