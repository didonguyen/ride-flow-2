import { LandingFinalCtaTrigger } from "@/components/landing/landing-cta-trigger";

export function LandingFinalCta() {
  return (
    <section
      aria-labelledby="landing-final-cta-heading"
      className="bg-forest-700 py-20 sm:py-24"
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
        <LandingFinalCtaTrigger className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-extrabold text-forest-900 shadow-sm transition hover:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-offset-2 focus:ring-offset-forest-700 sm:text-base">
          Get started
        </LandingFinalCtaTrigger>
      </div>
    </section>
  );
}
