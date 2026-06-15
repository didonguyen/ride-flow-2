import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-forest-900/70 backdrop-blur supports-[backdrop-filter]:bg-forest-900/55">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          aria-label="RideFlow home"
          className="flex items-center"
          href={"/" as Route}
        >
          <Image
            alt="RideFlow"
            className="h-10 w-auto brightness-0 invert sm:h-11"
            height={80}
            priority
            src="/design/RideFlow_logo.png"
            width={200}
          />
        </Link>

        <nav aria-label="Landing actions" className="flex items-center gap-2 sm:gap-3">
          <Link
            className="rounded-full px-3 py-2 text-sm font-medium text-white/85 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 focus:ring-offset-forest-900 sm:px-4 sm:text-base"
            href={"/sign-in?next=/trips" as Route}
          >
            Sign in
          </Link>
          <Link
            className="rounded-full bg-mint-400 px-4 py-2 text-sm font-extrabold text-forest-900 shadow-sm transition hover:bg-mint-400/90 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 focus:ring-offset-forest-900 sm:px-6 sm:text-base"
            href={"/sign-up?next=/trips" as Route}
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
