"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { AuthModal } from "@/components/auth/auth-modal";
import type { AuthMode } from "@/components/auth/auth-panel";
import { signInAction, signUpAction } from "@/src/application/auth/actions-server";

type AuthModalControllerProps = {
  next?: string;
  initialMode?: AuthMode;
  renderTrigger?: (helpers: {
    open: (mode: AuthMode) => void;
    mode: AuthMode;
  }) => ReactNode;
};

export function AuthModalController({
  next = "/trips",
  initialMode = "sign-in",
  renderTrigger
}: AuthModalControllerProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [open, setOpen] = useState(false);

  const handleOpen = (target: AuthMode) => {
    setMode(target);
    setOpen(true);
  };

  return (
    <>
      {renderTrigger
        ? renderTrigger({ open: handleOpen, mode })
        : (
          <>
            <button
              className="rounded-full px-3 py-2 text-sm font-medium text-white/85 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 focus:ring-offset-forest-900 sm:px-4 sm:text-base"
              data-testid="open-auth-modal-sign-in"
              type="button"
              onClick={() => handleOpen("sign-in")}
            >
              Sign in
            </button>
            <button
              className="rounded-full bg-mint-400 px-4 py-2 text-sm font-extrabold text-forest-900 shadow-sm transition hover:bg-mint-400/90 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 focus:ring-offset-forest-900 sm:px-6 sm:text-base"
              data-testid="open-auth-modal-sign-up"
              type="button"
              onClick={() => handleOpen("sign-up")}
            >
              Get started
            </button>
          </>
        )}
      <AuthModal
        action={mode === "sign-in" ? signInAction : signUpAction}
        mode={mode}
        next={next}
        open={open}
        onModeChange={setMode}
        onOpenChange={setOpen}
      />
    </>
  );
}
