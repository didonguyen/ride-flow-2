import { Wallet } from "lucide-react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { TripStatCard } from "@/components/trip/trip-stat-card";

describe("TripStatCard", () => {
  it("renders label, value, and the default sage tone", () => {
    render(
      <TripStatCard icon={Wallet} label="Trip Budget" value="$600" />
    );
    const card = screen.getByTestId("trip-stat-card");
    expect(card).toHaveTextContent("Trip Budget");
    expect(card).toHaveTextContent("$600");
    expect(card.className).toContain("paper-50");
    expect(card).toHaveAttribute("data-tone", "default");
  });

  it("uses the terracotta ring when the tone is pending", () => {
    render(
      <TripStatCard icon={Wallet} label="Pending" tone="pending" value="$128" />
    );
    const card = screen.getByTestId("trip-stat-card");
    expect(card.className).toContain("terracotta-200");
    expect(card).toHaveAttribute("data-tone", "pending");
  });
});
