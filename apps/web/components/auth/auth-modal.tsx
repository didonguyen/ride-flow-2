"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { AuthPanel, type AuthMode } from "@/components/auth/auth-panel";
import { cn } from "@/src/lib/utils";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  action: (formData: FormData) => Promise<void> | void;
  next?: string;
  error?: string;
  initialFocusRef?: React.RefObject<HTMLButtonElement | null>;
};

export function AuthModal({
  open,
  onOpenChange,
  mode,
  onModeChange,
  action,
  next,
  error,
  initialFocusRef
}: AuthModalProps) {
  const title = mode === "sign-in" ? "Sign in" : "Create your account";
  const description =
    mode === "sign-in"
      ? "Use your RideFlow account to continue planning trips."
      : "Get started with RideFlow to plan trips with your group.";

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className={cn("sm:max-w-[440px]")}
        data-testid={`auth-modal-${mode}`}
        onOpenAutoFocus={(event) => {
          if (initialFocusRef?.current) {
            event.preventDefault();
            initialFocusRef.current.focus();
          }
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <AuthPanel
          action={action}
          error={error}
          mode={mode}
          next={next}
          submitRef={initialFocusRef}
          onSwitchMode={onModeChange}
        />
      </DialogContent>
    </Dialog>
  );
}
