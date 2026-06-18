import Image from "next/image";
import { ChevronsUp } from "lucide-react";

import { LandingHeroCtaTrigger } from "@/components/landing/landing-cta-trigger";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80";

export function LandingHero() {
  return (
    <section
      aria-labelledby="landing-hero-heading"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-forest-900 sm:min-h-[640px] lg:min-h-[720px]"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        fill
        priority
        sizes="100vw"
        src={HERO_IMAGE_URL}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-900/80 via-forest-900/45 to-forest-900/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-forest-900 via-forest-900/70 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-5 px-4 pb-44 pt-20 text-center sm:items-start sm:px-6 sm:pb-40 sm:pt-20 sm:text-left lg:px-8">
        <p className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
          A calmer way to plan together
        </p>
        <h1
          className="max-w-3xl text-balance text-5xl font-extrabold leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl"
          id="landing-hero-heading"
        >
          Explore Your
          <br className="hidden sm:block" />{" "}
          <span className="sm:inline">Favorite Journey</span>
        </h1>
        <p className="max-w-xl text-base text-white/85 sm:text-lg lg:text-xl">
          Let&apos;s Make Our Life Better
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center sm:bottom-8">
        <LandingHeroCtaTrigger className="pointer-events-auto inline-flex animate-rideflow-hero-rise items-center gap-3 rounded-full border border-white/25 bg-white/10 px-2 py-2 pr-6 text-white shadow-2xl shadow-forest-900/40 backdrop-blur-xl transition hover:scale-[1.02] hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 focus:ring-offset-forest-900">
          <span
            aria-hidden="true"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-forest-900 shadow-lg transition group-hover:translate-y-[-1px] sm:h-14 sm:w-14"
          >
            <ChevronsUp className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.4} />
          </span>
          <span className="flex flex-col items-start text-left">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Tap to start
            </span>
            <span className="text-sm font-extrabold tracking-[-0.01em] text-white sm:text-base">
              Go
            </span>
          </span>
        </LandingHeroCtaTrigger>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-24 bg-gradient-to-t from-forest-900 to-transparent sm:hidden"
      />
    </section>
  );
}
