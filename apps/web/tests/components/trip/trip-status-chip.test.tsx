import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { TripStatusChip } from "@/components/trip/trip-status-chip";

describe("TripStatusChip", () => {
  it("renders with the confirmed tone and uppercase label", () => {
    render(<TripStatusChip tone="confirmed">Confirmed</TripStatusChip>);
    const chip = screen.getByTestId("trip-status-chip");
    expect(chip).toHaveTextContent("Confirmed");
    expect(chip).toHaveAttribute("data-tone", "confirmed");
    expect(chip.className).toContain("uppercase");
  });

  it("switches the tone classes for pending", () => {
    render(<TripStatusChip tone="pending">Pending</TripStatusChip>);
    const chip = screen.getByTestId("trip-status-chip");
    expect(chip.className).toContain("terracotta-100");
    expect(chip.className).toContain("terracotta-500");
  });
});
