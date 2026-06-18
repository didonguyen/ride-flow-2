"use client";

import { Button } from "@/components/ui/button";
import { CreateTripModal } from "@/components/trips/create-trip-modal";
import { CreateTripModalController } from "@/components/trips/create-trip-modal-controller";
import { PlusCircle } from "lucide-react";
import { useRef } from "react";

type CreateTripButtonProps = {
  action: (formData: FormData) => Promise<void> | void;
};

export function CreateTripButton({ action }: CreateTripButtonProps) {
  return <CreateTripModalController action={action} />;
}

type CreateTripEmptyStateProps = CreateTripButtonProps & {
  title: string;
  subtitle: string;
};

export function CreateTripEmptyState({
  action,
  title,
  subtitle
}: CreateTripEmptyStateProps) {
  return (
    <div
      className="mt-8 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-forest-500/40 bg-white px-8 py-14 text-center"
      data-testid="dashboard-empty-state"
    >
      <PlusCircle aria-hidden="true" className="h-12 w-12 text-forest-500" strokeWidth={1.8} />
      <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-slate-700">
        {title}
      </h2>
      <p className="max-w-md text-base font-medium text-slate-400">
        {subtitle}
      </p>
      <CreateTripModalController action={action} />
    </div>
  );
}
