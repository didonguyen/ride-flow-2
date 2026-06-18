import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthPanel } from "@/components/auth/auth-panel";

describe("AuthPanel", () => {
  it("renders sign-in fields and submits with the hidden next value", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => undefined);

    render(
      <AuthPanel
        action={action}
        mode="sign-in"
        next="/trips"
        onSwitchMode={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Email"), "rider@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByTestId("auth-panel-submit-sign-in"));

    expect(action).toHaveBeenCalledTimes(1);
    const submitted = action.mock.calls[0][0] as FormData;
    expect(submitted.get("email")).toBe("rider@example.com");
    expect(submitted.get("password")).toBe("password123");
    expect(submitted.get("next")).toBe("/trips");
  });

  it("shows the error alert when an error message is provided", () => {
    render(
      <AuthPanel
        action={vi.fn(async () => undefined)}
        error="Invalid email or password"
        mode="sign-in"
        onSwitchMode={vi.fn()}
      />
    );

    const alert = screen.getByTestId("auth-panel-error");
    expect(alert).toHaveTextContent("Invalid email or password");
    expect(alert).toHaveAttribute("role", "alert");
  });

  it("invokes onSwitchMode when the footer button is pressed", async () => {
    const user = userEvent.setup();
    const onSwitchMode = vi.fn();

    render(
      <AuthPanel
        action={vi.fn(async () => undefined)}
        mode="sign-in"
        onSwitchMode={onSwitchMode}
      />
    );

    await user.click(screen.getByTestId("auth-panel-switch-sign-in"));
    expect(onSwitchMode).toHaveBeenCalledWith("sign-up");
  });

  it("does not disable the submit button when native validation blocks submit", async () => {
    const user = userEvent.setup();
    const action = vi.fn(async () => undefined);

    render(
      <AuthPanel
        action={action}
        mode="sign-in"
        next="/trips"
        onSwitchMode={vi.fn()}
      />
    );

    const submit = screen.getByTestId("auth-panel-submit-sign-in");
    await user.click(submit);

    expect(action).not.toHaveBeenCalled();
    expect(submit).toBeEnabled();
  });
});
