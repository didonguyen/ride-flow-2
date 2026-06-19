"use client";

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Route } from "next";
import {
  Bell,
  Compass,
  Gauge,
  HelpCircle,
  LayoutGrid,
  Map as MapIcon,
  Plus,
  Settings as SettingsIcon,
  UserRound
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
  pageTitle?: string;
  pageIcon?: LucideIcon;
  pageActions?: ReactNode;
  memberName?: string;
  memberTier?: string;
  avatarUrl?: string;
  onUpgradeClick?: () => void;
  className?: string;
};

export function TripAppShell({
  children,
  activeItem = "Dashboard",
  pageTitle,
  pageIcon: PageIcon = Compass,
  pageActions,
  memberName = "The Modern Explorer",
  memberTier = "Premium Member",
  avatarUrl,
  onUpgradeClick,
  className
}: TripAppShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col bg-paper-50 text-ink-950 lg:grid lg:grid-cols-[240px_minmax(0,1fr)]",
        className
      )}
      data-testid="trip-app-shell"
    >
      <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-paper-200 bg-paper-50 px-5 py-3 lg:hidden">
        <Link aria-label="RideFlow" className="flex items-center" href={"/trips" as Route}>
          <Image
            alt="RideFlow"
            className="h-9 w-auto"
            height={36}
            src="/design/RideFlow_logo.png"
            width={108}
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
        <div className="flex items-center gap-3 px-5 pt-7">
          <span
            aria-hidden="true"
            className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-paper-200 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-500"
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
              "img"
            )}
          </span>
          <div className="leading-tight">
            <p className="text-base font-semibold text-ink-950">{memberName}</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
              {memberTier}
            </p>
          </div>
        </div>

        <div className="px-5 pt-5">
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white shadow-rideflow-editorial-card transition hover:bg-forest-700"
            data-testid="upgrade-to-pro"
            type="button"
            onClick={onUpgradeClick}
          >
            <Gauge aria-hidden="true" className="h-4 w-4" />
            Upgrade to Pro
          </button>
        </div>

        <nav aria-label="Primary navigation" className="mt-7 flex flex-col gap-1 px-3">
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

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="sticky top-0 z-20 hidden h-[72px] w-full items-center justify-between border-b border-paper-200 bg-paper-50 px-6 lg:flex lg:px-10"
          data-testid="trip-app-topbar"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sage-100 text-forest-800"
            >
              <PageIcon aria-hidden="true" className="h-5 w-5" />
            </span>
            <h1
              className="font-display text-2xl text-forest-800"
              data-testid="trip-app-page-title"
            >
              {pageTitle ?? "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {pageActions}
            <button
              aria-label="Notifications"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-paper-100 hover:text-ink-950 focus:outline-none focus:ring-2 focus:ring-forest-800/40"
              data-testid="trip-app-bell"
              type="button"
            >
              <Bell aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              aria-label="Account"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper-200 text-ink-700 transition hover:border-forest-800/40 hover:text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/40"
              data-testid="trip-app-account"
              type="button"
            >
              <UserRound aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
