import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthModal } from "@/components/auth/auth-modal";
import { CreateTripModal } from "@/components/trips/create-trip-modal";

type ConsoleErrorSpy = {
  mock: {
    calls: unknown[][];
  };
};

function expectNoDialogTitleWarning(errorSpy: ConsoleErrorSpy) {
  expect(
    errorSpy.mock.calls.some((call) =>
      String(call[0]).includes("DialogContent` requires a `DialogTitle")
    )
  ).toBe(false);
}

describe("modal accessibility", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens the auth modal without Radix DialogTitle warnings", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <AuthModal
        action={vi.fn(async () => undefined)}
        mode="sign-in"
        open
        onModeChange={vi.fn()}
        onOpenChange={vi.fn()}
      />
    );

    await waitFor(() => expectNoDialogTitleWarning(errorSpy));
  });

  it("opens the create-trip modal without Radix DialogTitle warnings", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <CreateTripModal
        action={vi.fn(async () => undefined)}
        open
        onOpenChange={vi.fn()}
      />
    );

    await waitFor(() => expectNoDialogTitleWarning(errorSpy));
  });
});
