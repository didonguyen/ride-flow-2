import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CreateTripPanel } from "@/components/trips/create-trip-panel";

describe("CreateTripPanel", () => {
  it("renders all required trip fields", () => {
    render(<CreateTripPanel action={vi.fn(async () => undefined)} />);

    expect(screen.getByLabelText("Trip name")).toBeInTheDocument();
    expect(screen.getByLabelText("Destination")).toBeInTheDocument();
    expect(screen.getByLabelText("Start date")).toBeInTheDocument();
    expect(screen.getByLabelText("End date")).toBeInTheDocument();
    expect(screen.getByTestId("create-trip-panel-submit")).toBeInTheDocument();
  });

  it("submits the trip fields as form data", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => undefined);

    render(<CreateTripPanel action={action} />);

    await user.type(screen.getByLabelText("Trip name"), "Da Nang Trip");
    await user.type(screen.getByLabelText("Destination"), "Da Nang");
    await user.type(screen.getByLabelText("Start date"), "2026-07-01");
    await user.type(screen.getByLabelText("End date"), "2026-07-05");
    await user.click(screen.getByTestId("create-trip-panel-submit"));

    const submitted = action.mock.calls[0][0] as FormData;
    expect(submitted.get("name")).toBe("Da Nang Trip");
    expect(submitted.get("destination")).toBe("Da Nang");
    expect(submitted.get("startDate")).toBe("2026-07-01");
    expect(submitted.get("endDate")).toBe("2026-07-05");
  });

  it("renders an alert when the action returns a validation error", () => {
    render(
      <CreateTripPanel
        action={vi.fn(async () => undefined)}
        error="End date must be after the start date"
      />
    );

    const alert = screen.getByTestId("create-trip-panel-error");
    expect(alert).toHaveTextContent("End date must be after the start date");
    expect(alert).toHaveAttribute("role", "alert");
  });
});
