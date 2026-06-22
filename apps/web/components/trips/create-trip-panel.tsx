"use client";

import { forwardRef, useEffect, type Ref } from "react";
import { useFormStatus } from "react-dom";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateTripPanelProps = {
  action: (formData: FormData) => Promise<void> | void;
  error?: string;
  onSubmittingChange?: (isSubmitting: boolean) => void;
  submitRef?: Ref<HTMLButtonElement>;
  contentClassName?: string;
  formClassName?: string;
  submitLabel?: string;
};

export const CreateTripPanel = forwardRef<HTMLDivElement, CreateTripPanelProps>(
  function CreateTripPanel(props, ref) {
    const {
      action,
      error,
      onSubmittingChange,
      submitRef,
      contentClassName,
      formClassName,
      submitLabel = "Create trip"
    } = props;

    return (
      <div
        className={contentClassName ?? "space-y-6"}
        data-testid="create-trip-panel"
        ref={ref}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Create a trip
          </h1>
          <p className="text-sm text-slate-500">
            Add the trip basics, cover image, and travel mode.
          </p>
        </div>

        {error ? (
          <Alert data-testid="create-trip-panel-error" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form
          action={action}
          className={formClassName ?? "space-y-4"}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Trip name</Label>
            <Input
              autoComplete="off"
              id="name"
              name="name"
              placeholder="Da Nang Food Trip"
              required
              type="text"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              autoComplete="off"
              id="destination"
              name="destination"
              placeholder="Da Nang"
              required
              type="text"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input id="startDate" name="startDate" required type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input id="endDate" name="endDate" required type="date" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="transport">Transport</Label>
              <Input
                autoComplete="off"
                defaultValue="Motorcycle"
                id="transport"
                name="transport"
                placeholder="Motorcycle"
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover image</Label>
              <Input
                accept="image/*"
                id="coverImage"
                name="coverImage"
                type="file"
              />
            </div>
          </div>

          <CreateTripSubmitButton
            onSubmittingChange={onSubmittingChange}
            submitLabel={submitLabel}
            submitRef={submitRef}
          />
        </form>
      </div>
    );
  }
);

function CreateTripSubmitButton({
  onSubmittingChange,
  submitLabel,
  submitRef
}: {
  onSubmittingChange?: (isSubmitting: boolean) => void;
  submitLabel: string;
  submitRef?: Ref<HTMLButtonElement>;
}) {
  const { pending } = useFormStatus();

  useEffect(() => {
    onSubmittingChange?.(pending);
  }, [onSubmittingChange, pending]);

  return (
    <Button
      className="w-full sm:w-auto"
      data-testid="create-trip-panel-submit"
      disabled={pending}
      ref={submitRef}
      size="lg"
      type="submit"
    >
      {pending ? "Creating trip..." : submitLabel}
    </Button>
  );
}