import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";

import { AuthModalController } from "@/components/auth/auth-modal-controller";
import { cn } from "@/src/lib/utils";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Vietnam", href: "#vietnam" },
  { label: "Feature", href: "#features" },
  { label: "Explore", href: "#discover" },
  { label: "About", href: "#about" }
];

type LandingHeaderProps = {
  className?: string;
};

export function LandingHeader({ className }: LandingHeaderProps) {
  return (
    <header
      className={cn(
        "absolute inset-x-0 top-0 z-30 w-full bg-transparent text-white",
        className
      )}
      data-testid="landing-header"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          aria-label="RideFlow home"
          className="flex items-center"
          href={"/" as Route}
        >
          <Image
            alt="RideFlow"
            className="h-10 w-auto brightness-0 invert sm:h-11"
            height={44}
            priority
            src="/design/RideFlow_logo.png"
            width={120}
          />
        </Link>

        <nav
          aria-label="Editorial navigation"
          className="hidden items-center gap-6 text-sm font-semibold text-white/85 sm:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              className="rounded-md px-1 py-1 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-forest-900"
              data-testid={`landing-nav-${link.label.toLowerCase()}`}
              href={link.href}
              key={link.label}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <nav
          aria-label="Landing actions"
          className="flex items-center gap-2 sm:gap-3"
        >
          <AuthModalController next="/trips" />
        </nav>
      </div>
    </header>
  );
}
