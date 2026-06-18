"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { CreateTripModal } from "@/components/trips/create-trip-modal";
import { PlusCircle } from "lucide-react";

type CreateTripModalControllerProps = {
  action: (formData: FormData) => Promise<void> | void;
};

export function CreateTripModalController({
  action
}: CreateTripModalControllerProps) {
  const [open, setOpen] = useState(false);
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        className="h-12 rounded-full px-6 text-base"
        data-testid="dashboard-open-create-trip-modal"
        size="lg"
        type="button"
        variant="secondary"
        onClick={() => setOpen(true)}
      >
        <PlusCircle aria-hidden="true" className="h-5 w-5" />
        New trip
      </Button>
      <CreateTripModal
        action={action}
        initialFocusRef={submitRef}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
