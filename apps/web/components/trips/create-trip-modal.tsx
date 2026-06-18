"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CreateTripPanel } from "@/components/trips/create-trip-panel";
import { cn } from "@/src/lib/utils";

type CreateTripModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: (formData: FormData) => Promise<void> | void;
  error?: string;
  initialFocusRef?: React.RefObject<HTMLButtonElement | null>;
};

export function CreateTripModal({
  open,
  onOpenChange,
  action,
  error,
  initialFocusRef
}: CreateTripModalProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className={cn("sm:max-w-[640px]")}
        data-testid="create-trip-modal"
        onOpenAutoFocus={(event) => {
          if (initialFocusRef?.current) {
            event.preventDefault();
            initialFocusRef.current.focus();
          }
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Create a trip</DialogTitle>
          <DialogDescription>
            Add the trip basics. Saving now creates the trip in Supabase V2.
          </DialogDescription>
        </DialogHeader>
        <CreateTripPanel
          action={action}
          error={error}
          submitRef={initialFocusRef}
        />
      </DialogContent>
    </Dialog>
  );
}
