import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AiInsightCard } from "@/components/trip/ai-insight-card";

describe("AiInsightCard", () => {
  it("renders the insight body and the action", async () => {
    const onAction = vi.fn();
    render(
      <AiInsightCard
        actionLabel="Review alternatives"
        body="Your accommodation costs are running 15% higher than typical."
        onAction={onAction}
      />
    );
    const card = screen.getByTestId("ai-insight-card");
    expect(card).toHaveTextContent(
      "Your accommodation costs are running 15% higher than typical."
    );
    await userEvent.click(screen.getByTestId("ai-insight-action"));
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});
