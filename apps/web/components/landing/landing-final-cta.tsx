import { LandingFinalCtaTrigger } from "@/components/landing/landing-cta-trigger";

export function LandingFinalCta() {
  return (
    <section
      aria-labelledby="landing-final-cta-heading"
      className="bg-forest-900 py-16 sm:py-20"
      data-testid="landing-final-cta-section"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 text-center sm:px-6 lg:px-8">
        <span
          aria-hidden="true"
          className="inline-block h-0.5 w-10 bg-amber-400"
        />
        <h2
          className="font-display text-3xl text-white sm:text-4xl"
          id="landing-final-cta-heading"
        >
          Plan your next journey
        </h2>
        <p className="max-w-xl text-base text-white/80 sm:text-lg">
          Sketch a calm, day-by-day plan with your group. No spreadsheets,
          no spam, just the trip.
        </p>
        <LandingFinalCtaTrigger className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-ink-950 shadow-rideflow-editorial-card transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-forest-900">
          Start planning
        </LandingFinalCtaTrigger>
      </div>
    </section>
  );
}
