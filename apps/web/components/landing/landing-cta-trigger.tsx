"use client";

import type { ReactNode } from "react";

import { AuthModalController } from "@/components/auth/auth-modal-controller";

type LandingHeroCtaTriggerProps = {
  className?: string;
  children: ReactNode;
};

export function LandingHeroCtaTrigger({
  className,
  children
}: LandingHeroCtaTriggerProps) {
  return (
    <AuthModalController
      initialMode="sign-up"
      next="/trips"
      renderTrigger={({ open, mode }) => (
        <button
          aria-label="Get started with RideFlow"
          className={className}
          data-testid="landing-hero-cta"
          type="button"
          onClick={() => open(mode)}
        >
          {children}
        </button>
      )}
    />
  );
}

type LandingFinalCtaTriggerProps = {
  className?: string;
  children: ReactNode;
};

export function LandingFinalCtaTrigger({
  className,
  children
}: LandingFinalCtaTriggerProps) {
  return (
    <AuthModalController
      initialMode="sign-up"
      next="/trips"
      renderTrigger={({ open, mode }) => (
        <button
          className={className}
          data-testid="landing-final-cta"
          type="button"
          onClick={() => open(mode)}
        >
          {children}
        </button>
      )}
    />
  );
}
