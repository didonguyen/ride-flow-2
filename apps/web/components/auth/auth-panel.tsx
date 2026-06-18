"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type AuthMode = "sign-in" | "sign-up";

type AuthPanelProps = {
  mode: AuthMode;
  action: (formData: FormData) => Promise<void> | void;
  error?: string;
  next?: string;
  onSwitchMode?: (mode: AuthMode) => void;
  hideFooter?: boolean;
  submitRef?: React.Ref<HTMLButtonElement>;
  contentClassName?: string;
};

const COPY: Record<
  AuthMode,
  {
    title: string;
    description: string;
    submit: string;
    pending: string;
    cta: string;
    ctaMode: AuthMode;
    ctaLabel: string;
  }
> = {
  "sign-in": {
    title: "Sign in",
    description: "Use your RideFlow account to continue planning trips.",
    submit: "Sign in",
    pending: "Signing in...",
    cta: "Need an account?",
    ctaMode: "sign-up",
    ctaLabel: "Sign up"
  },
  "sign-up": {
    title: "Create your account",
    description: "Get started with RideFlow to plan trips with your group.",
    submit: "Create account",
    pending: "Creating account...",
    cta: "Already have an account?",
    ctaMode: "sign-in",
    ctaLabel: "Sign in"
  }
};

export const AuthPanel = forwardRef<HTMLDivElement, AuthPanelProps>(
  function AuthPanel(props, ref) {
    const {
      mode,
      action,
      error,
      next,
      onSwitchMode,
      hideFooter = false,
      submitRef,
      contentClassName
    } = props;
    const copy = COPY[mode];

    return (
      <div
        className={contentClassName ?? "space-y-6"}
        data-testid={`auth-panel-${mode}`}
        ref={ref}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {copy.title}
          </h1>
          <p className="text-sm text-slate-500">{copy.description}</p>
        </div>

        {error ? (
          <Alert data-testid="auth-panel-error" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <form
          action={action}
          className="space-y-4"
        >
          <input name="next" type="hidden" value={next ?? ""} />
          <div className="space-y-2">
            <Label htmlFor={`${mode}-email`}>Email</Label>
            <Input
              autoComplete="email"
              id={`${mode}-email`}
              name="email"
              required
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${mode}-password`}>Password</Label>
            <Input
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              id={`${mode}-password`}
              minLength={8}
              name="password"
              required
              type="password"
            />
          </div>
          <AuthSubmitButton
            data-testid={`auth-panel-submit-${mode}`}
            pendingLabel={copy.pending}
            ref={submitRef}
          >
            {copy.submit}
          </AuthSubmitButton>
        </form>

        {!hideFooter && onSwitchMode ? (
          <p className="text-center text-sm text-slate-500">
            {copy.cta}{" "}
            <button
              className="font-semibold text-forest-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 focus:ring-offset-white rounded-sm"
              data-testid={`auth-panel-switch-${mode}`}
              type="button"
              onClick={() => onSwitchMode(copy.ctaMode)}
            >
              {copy.ctaLabel}
            </button>
          </p>
        ) : null}
      </div>
    );
  }
);

const AuthSubmitButton = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button> & {
    pendingLabel: string;
  }
>(function AuthSubmitButton({ children, pendingLabel, ...props }, ref) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full"
      disabled={pending}
      ref={ref}
      size="lg"
      type="submit"
      {...props}
    >
      {pending ? pendingLabel : children}
    </Button>
  );
});
