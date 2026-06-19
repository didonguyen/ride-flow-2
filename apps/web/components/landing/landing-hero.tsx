import Image from "next/image";
import { Plus } from "lucide-react";

import { LandingHeroCtaTrigger } from "@/components/landing/landing-cta-trigger";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=2400&q=80";

export function LandingHero() {
  return (
    <section
      aria-labelledby="landing-hero-heading"
      className="relative isolate flex min-h-[640px] items-center justify-center overflow-hidden bg-forest-900 lg:min-h-[760px]"
      data-testid="landing-hero"
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
        className="absolute inset-0 -z-10 bg-gradient-to-b from-forest-900/55 via-forest-900/20 to-forest-900/80"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 pb-32 pt-32 sm:px-6 lg:px-12">
        <span
          aria-hidden="true"
          className="inline-block h-0.5 w-12 bg-white/80"
        />
        <h1
          className="font-display max-w-2xl text-5xl text-white sm:text-6xl lg:text-7xl"
          id="landing-hero-heading"
        >
          Vietnam
        </h1>
        <p className="max-w-xl text-base leading-7 text-white/85 sm:text-lg">
          With a heritage spanning thousands of years, Vietnam offers a rich
          tapestry of history, stunning landscapes, and a vibrant culture to
          explore. Join us on the adventure.
        </p>
        <LandingHeroCtaTrigger className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-forest-900">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-forest-900">
            <Plus aria-hidden="true" className="h-4 w-4" />
          </span>
          Explore
        </LandingHeroCtaTrigger>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent via-paper-50/20 to-paper-50"
      />
    </section>
  );
}
