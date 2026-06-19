"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Route } from "next";
import {
  Gauge,
  HelpCircle,
  LayoutGrid,
  Map as MapIcon,
  Plus,
  Settings as SettingsIcon
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/src/lib/utils";

type NavItem = {
  label: string;
  href: Route;
  icon: LucideIcon;
  testId: string;
};

const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", href: "/trips" as Route, icon: LayoutGrid, testId: "nav-dashboard" },
  { label: "My Trips", href: "/trips" as Route, icon: MapIcon, testId: "nav-my-trips" },
  { label: "New Trip", href: "/trips/new" as Route, icon: Plus, testId: "nav-new-trip" }
];

const SECONDARY_NAV: NavItem[] = [
  { label: "Settings", href: "/trips" as Route, icon: SettingsIcon, testId: "nav-settings" },
  { label: "Help Center", href: "/trips" as Route, icon: HelpCircle, testId: "nav-help" }
];

type TripAppShellProps = {
  children: ReactNode;
  activeItem?: "Dashboard" | "My Trips" | "New Trip" | "Settings" | "Help Center";
  memberName?: string;
  memberTier?: string;
  avatarUrl?: string;
  onUpgradeClick?: () => void;
  className?: string;
};

export function TripAppShell({
  children,
  activeItem = "My Trips",
  memberName = "The Modern Explorer",
  memberTier = "Premium Member",
  avatarUrl,
  onUpgradeClick,
  className
}: TripAppShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-paper-50 text-ink-950 lg:grid lg:grid-cols-[300px_minmax(0,1fr)]",
        className
      )}
      data-testid="trip-app-shell"
    >
      <header className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-paper-200 bg-paper-50/95 px-5 py-3 backdrop-blur lg:hidden">
        <Link aria-label="RideFlow" className="flex items-center" href={"/trips" as Route}>
          <Image
            alt="RideFlow"
            className="h-10 w-auto"
            height={40}
            src="/design/RideFlow_logo.png"
            width={120}
          />
        </Link>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700"
          href={"/trips/new" as Route}
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          New Trip
        </Link>
      </header>

      <aside
        aria-label="Primary navigation"
        className="hidden flex-col border-r border-paper-200 bg-paper-50 lg:flex"
      >
        <div className="flex flex-col gap-4 px-6 pt-8">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-sage-200"
            >
              {avatarUrl ? (
                <Image
                  alt=""
                  className="h-full w-full object-cover"
                  fill
                  sizes="48px"
                  src={avatarUrl}
                />
              ) : (
                <span className="text-base font-semibold text-forest-800">
                  {memberName.charAt(0)}
                </span>
              )}
            </span>
            <div className="leading-tight">
              <p className="text-base font-semibold text-ink-950">{memberName}</p>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-500">
                {memberTier}
              </p>
            </div>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white shadow-rideflow-editorial-card transition hover:bg-forest-700"
            data-testid="upgrade-to-pro"
            type="button"
            onClick={onUpgradeClick}
          >
            <Gauge aria-hidden="true" className="h-4 w-4" />
            Upgrade to Pro
          </button>
        </div>

        <nav aria-label="Primary navigation" className="mt-8 flex flex-col gap-1 px-3">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-sage-100 text-forest-800"
                    : "text-ink-700 hover:bg-paper-100 hover:text-ink-950"
                )}
                data-testid={item.testId}
                href={item.href}
                key={item.label}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-1 border-t border-paper-200 px-3 py-4">
          {SECONDARY_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-sage-100 text-forest-800"
                    : "text-ink-700 hover:bg-paper-100 hover:text-ink-950"
                )}
                data-testid={item.testId}
                href={item.href}
                key={item.label}
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
