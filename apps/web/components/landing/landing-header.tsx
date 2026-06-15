import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/0 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link
          aria-label="RideFlow home"
          className="flex items-center"
          href={"/" as Route}
        >
          <Image
            alt="RideFlow"
            className="h-10 w-auto"
            height={80}
            priority
            src="/design/RideFlow_logo.png"
            width={200}
          />
        </Link>

        <nav aria-label="Landing actions" className="flex items-center gap-2 sm:gap-3">
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-[#004853] focus:ring-offset-2 sm:px-4 sm:text-base"
            href={"/sign-in?next=/trips" as Route}
          >
            Sign in
          </Link>
          <Link
            className="rounded-md bg-[#004853] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#013a44] focus:outline-none focus:ring-2 focus:ring-[#004853] focus:ring-offset-2 sm:px-5 sm:text-base"
            href={"/sign-up?next=/trips" as Route}
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
