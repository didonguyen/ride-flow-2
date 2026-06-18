import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";

import { AuthModalController } from "@/components/auth/auth-modal-controller";

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
          <AuthModalController next="/trips" />
        </nav>
      </div>
    </header>
  );
}
