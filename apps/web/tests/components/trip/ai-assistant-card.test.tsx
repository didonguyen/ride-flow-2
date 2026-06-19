import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AiAssistantCard } from "@/components/trip/ai-assistant-card";

describe("AiAssistantCard", () => {
  it("renders the tip body and both actions", () => {
    render(
      <AiAssistantCard
        body="Heavy rain is expected for Day 2 afternoon."
        primaryAction={{ label: "Find Indoor Activities" }}
        secondaryAction={{ label: "Dismiss" }}
      />
    );
    const card = screen.getByTestId("ai-assistant-card");
    expect(card).toHaveTextContent("Heavy rain is expected for Day 2 afternoon.");
    expect(screen.getByTestId("ai-assistant-primary")).toHaveTextContent(
      "Find Indoor Activities"
    );
    expect(screen.getByTestId("ai-assistant-secondary")).toHaveTextContent("Dismiss");
  });

  it("invokes the primary action on click", async () => {
    const onClick = vi.fn();
    render(
      <AiAssistantCard
        body="Tip"
        primaryAction={{ label: "Apply", onClick }}
      />
    );
    await userEvent.click(screen.getByTestId("ai-assistant-primary"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
