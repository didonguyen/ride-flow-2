"use client";

import { forwardRef, useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CreateTripPanelProps = {
  action: (formData: FormData) => Promise<void> | void;
  error?: string;
  onSubmittingChange?: (isSubmitting: boolean) => void;
  submitRef?: React.Ref<HTMLButtonElement>;
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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      if (typeof (event.nativeEvent as { submitter?: HTMLButtonElement }).submitter?.disabled === "boolean") {
        setIsSubmitting(true);
        onSubmittingChange?.(true);
      }
    };

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
            Add the trip basics. Saving now creates the trip in Supabase V2.
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
          onSubmit={handleSubmit}
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

          <Button
            className="w-full sm:w-auto"
            data-testid="create-trip-panel-submit"
            disabled={isSubmitting}
            ref={submitRef}
            size="lg"
            type="submit"
            onClick={() => {
              setIsSubmitting(true);
              onSubmittingChange?.(true);
            }}
          >
            {submitLabel}
          </Button>
        </form>
      </div>
    );
  }
);
