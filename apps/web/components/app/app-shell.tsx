import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import {
  Compass,
  Grid2X2,
  MapPin,
  PlusCircle,
  Settings
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  label: string;
  href: Route;
  icon: LucideIcon;
};

const primaryNavItems: NavItem[] = [
  { label: "Dashboard", href: "/trips" as Route, icon: Grid2X2 },
  { label: "Trips", href: "/trips" as Route, icon: MapPin },
  { label: "New Trip", href: "/trips/new" as Route, icon: PlusCircle },
  { label: "Explore", href: "/trips" as Route, icon: Compass }
];

type AppShellProps = {
  activeItem?: string;
  children: ReactNode;
};

export function AppShell({ activeItem = "Dashboard", children }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f8fa] text-slate-950 lg:grid lg:grid-cols-[320px_minmax(0,1fr)]">
      <header className="sticky top-0 z-20 w-screen max-w-full border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex w-full max-w-full items-center justify-between">
          <Link
            aria-label="RideFlow dashboard"
            className="flex items-center"
            href={"/trips" as Route}
          >
            <img
              alt="RideFlow"
              className="h-14 w-28 object-contain object-left"
              src="/design/RideFlow_logo.png"
            />
          </Link>
          <Link
            className="hidden h-10 w-10 items-center justify-center gap-2 rounded-full bg-forest-700 text-sm font-semibold text-white shadow-sm transition hover:bg-forest-500 sm:inline-flex sm:w-auto sm:rounded-xl sm:px-4"
            href={"/trips/new" as Route}
          >
            <PlusCircle aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">New Trip</span>
          </Link>
        </div>
      </header>

      <aside className="hidden min-h-screen flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-72 items-center justify-center px-10">
          <Link aria-label="RideFlow dashboard" href={"/trips" as Route}>
            <img
              alt="RideFlow"
              className="h-48 w-64 object-contain"
              src="/design/RideFlow_logo.png"
            />
          </Link>
        </div>

        <nav aria-label="Primary navigation" className="space-y-4 px-5">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === activeItem;

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-5 rounded-lg px-6 py-4 text-xl font-semibold transition",
                  isActive
                    ? "bg-forest-700 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                ].join(" ")}
                href={item.href}
                key={item.label}
              >
                <Icon
                  aria-hidden="true"
                  className={[
                    "h-7 w-7",
                    isActive ? "text-white" : "text-slate-500"
                  ].join(" ")}
                  strokeWidth={2.3}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-100">
          <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-7">
            <div
              aria-hidden="true"
              className="h-12 w-12 rounded-full bg-[radial-gradient(circle_at_35%_25%,#d5f7ef,#1f766f_48%,#0f172a_100%)] shadow-inner"
            />
            <span className="text-lg font-semibold text-slate-700">Alex</span>
          </div>
          <Link
            className="flex items-center gap-5 px-10 py-7 text-xl font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            href={"/trips" as Route}
          >
            <Settings aria-hidden="true" className="h-7 w-7" strokeWidth={2.3} />
            Settings
          </Link>
        </div>
      </aside>

      <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-9">
        {children}
      </main>
    </div>
  );
}
