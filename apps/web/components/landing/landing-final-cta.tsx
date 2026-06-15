import Link from "next/link";
import type { Route } from "next";

export function LandingFinalCta() {
  return (
    <section
      aria-labelledby="landing-final-cta-heading"
      className="bg-[#004853] py-20 sm:py-24"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <h2
          className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          id="landing-final-cta-heading"
        >
          Ready to plan your next trip?
        </h2>
        <p className="max-w-2xl text-base text-white/85 sm:text-lg">
          Create a free RideFlow account and turn the idea into a shared plan in
          minutes.
        </p>
        <Link
          className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-[#004853] shadow-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#004853] sm:text-base"
          data-testid="landing-final-cta"
          href={"/sign-up?next=/trips" as Route}
        >
          Get started
        </Link>
      </div>
    </section>
  );
}
