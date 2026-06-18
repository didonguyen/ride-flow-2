import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

describe("shared UI primitives", () => {
  it("renders a button with the default variant class", () => {
    render(<Button>Continue</Button>);

    const button = screen.getByRole("button", { name: "Continue" });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("bg-forest-700");
  });

  it("supports secondary and ghost variants", () => {
    render(
      <div>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    );

    expect(screen.getByRole("button", { name: "Secondary" }).className).toContain(
      "bg-mint-400"
    );
    expect(screen.getByRole("button", { name: "Ghost" }).className).toContain(
      "hover:bg-slate-100"
    );
  });

  it("renders an input that accepts user typing", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Email" name="email" type="email" />);

    const input = screen.getByLabelText("Email");
    await user.type(input, "rider@example.com");

    expect(input).toHaveValue("rider@example.com");
  });

  it("labels its input via the Label primitive", () => {
    render(
      <div>
        <Label htmlFor="trip-name">Trip name</Label>
        <Input id="trip-name" name="name" type="text" />
      </div>
    );

    const input = screen.getByLabelText("Trip name");
    expect(input).toBeInTheDocument();
  });
});

describe("Dialog primitive", () => {
  it("opens the content when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>Use your RideFlow account.</DialogDescription>
          </DialogHeader>
          <p>Body</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText("Body")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(await screen.findByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("calls onOpenChange(false) when Esc closes the dialog", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog defaultOpen onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
          <p>Body</p>
        </DialogContent>
      </Dialog>
    );

    await user.keyboard("{Escape}");

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
