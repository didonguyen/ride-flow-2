import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2400&q=80";

export function LandingHero() {
  return (
    <section
      aria-labelledby="landing-hero-heading"
      className="relative isolate flex min-h-[560px] items-center overflow-hidden sm:min-h-[640px] lg:min-h-[720px]"
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
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/40 to-black/20"
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <p className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
          Collaborative trip planning
        </p>
        <h1
          className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
          id="landing-hero-heading"
        >
          Plan trips together, day by day.
        </h1>
        <p className="max-w-2xl text-base text-white/85 sm:text-lg lg:text-xl">
          RideFlow is a calm, image-led workspace for groups to build a shared
          itinerary, pin places, and let AI draft the first version.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            className="inline-flex items-center justify-center rounded-md bg-[#004853] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#013a44] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/40 sm:text-base"
            data-testid="landing-hero-cta"
            href={"/sign-up?next=/trips" as Route}
          >
            Get started
          </Link>
          <Link
            className="text-sm font-medium text-white/90 underline-offset-4 transition hover:text-white hover:underline sm:text-base"
            href={"/sign-in?next=/trips" as Route}
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
