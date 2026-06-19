import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { MemoryEntry } from "@/components/trip/memory-entry";

describe("MemoryEntry", () => {
  it("renders timestamp, title, body, attribution, and pinned badge", () => {
    render(
      <MemoryEntry
        attribution="Marcus"
        attributionInitial="M"
        body="The marine layer was thick this morning."
        imageAlt="Motorcycle by Golden Gate"
        imageUrl="https://example.com/memory.jpg"
        pinned
        timestamp="06:30 AM • Sep 12"
        title="Morning Departure: SF Golden Gate"
      />
    );
    const entry = screen.getByTestId("memory-entry");
    expect(entry).toHaveTextContent("06:30 AM • Sep 12");
    expect(entry).toHaveTextContent("Morning Departure: SF Golden Gate");
    expect(entry).toHaveTextContent("Added by Marcus");
    expect(screen.getByTestId("pinned-option-badge")).toBeVisible();
  });
});
