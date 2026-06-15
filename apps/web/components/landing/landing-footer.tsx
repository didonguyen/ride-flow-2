import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

export function LandingFooter() {
  return (
    <footer className="bg-forest-900 text-white/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <Link
          aria-label="RideFlow home"
          className="flex items-center"
          href={"/" as Route}
        >
          <Image
            alt="RideFlow"
            className="h-12 w-auto brightness-0 invert"
            height={96}
            src="/design/RideFlow_logo.png"
            width={240}
          />
        </Link>
        <p className="text-sm text-white/70">
          © 2026 RideFlow. All rights reserved.
        </p>
        <Link
          className="rounded-md px-3 py-2 text-sm font-medium text-white transition hover:text-mint-400 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 focus:ring-offset-forest-900"
          href={"/sign-in?next=/trips" as Route}
        >
          Sign in
        </Link>
      </div>
    </footer>
  );
}
