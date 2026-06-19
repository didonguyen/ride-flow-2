import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { TripCoverHeader } from "@/components/trip/trip-cover-header";

describe("TripCoverHeader", () => {
  it("renders the trip name, three metadata pills, and a back link", () => {
    render(
      <TripCoverHeader
        coverImageUrl="https://example.com/cover.jpg"
        dateRange="Oct 14-15"
        days="2 Days"
        destination="Nam Cát Tiên, Vietnam"
        transport="Motorcycle"
        tripName="Nam Cát Tiên Exploration"
      />
    );
    const header = screen.getByTestId("trip-cover-header");
    expect(header).toHaveTextContent("Nam Cát Tiên Exploration");
    expect(header).toHaveTextContent("Oct 14-15");
    expect(header).toHaveTextContent("2 Days");
    expect(header).toHaveTextContent("Motorcycle");
    expect(screen.getByTestId("trip-cover-back")).toHaveAttribute(
      "href",
      "/trips"
    );
  });
});
