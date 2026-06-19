import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { DateChip } from "@/components/trip/date-chip";

describe("DateChip", () => {
  it("renders the label and date", () => {
    render(<DateChip date="Oct 14" label="Day 1" />);
    const chip = screen.getByTestId("date-chip");
    expect(chip).toHaveTextContent("Day 1");
    expect(chip).toHaveTextContent("Oct 14");
    expect(chip).toHaveAttribute("data-selected", "false");
  });

  it("applies the selected data attribute when isSelected is true", () => {
    render(<DateChip date="Oct 14" isSelected label="Day 1" />);
    const chip = screen.getByTestId("date-chip");
    expect(chip).toHaveAttribute("data-selected", "true");
    expect(chip.className).toContain("sage-100");
  });
});
