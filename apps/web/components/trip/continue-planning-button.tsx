"use client";

import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

type ContinuePlanningButtonProps = {
  href: Route;
  children?: ReactNode;
  className?: string;
};

export function ContinuePlanningButton({
  href,
  children = "Continue planning",
  className
}: ContinuePlanningButtonProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white shadow-rideflow-editorial-card transition hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-800 focus:ring-offset-2 focus:ring-offset-paper-50",
        className
      )}
      data-testid="continue-planning-button"
      href={href}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}
