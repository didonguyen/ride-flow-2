import { Compass, Map, NotebookPen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type EditorialFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const features: EditorialFeature[] = [
  {
    title: "Day-by-day planning",
    description:
      "Sketch a calm, day-by-day plan with a small group. No more sticky-note overload.",
    icon: NotebookPen
  },
  {
    title: "Group first, route second",
    description:
      "Invite riders, share the plan, and let realtime updates keep everyone on the same page.",
    icon: Compass
  },
  {
    title: "Memory vault",
    description:
      "Save your favorite stops, photos, and journal entries. Bring the trip home with you.",
    icon: Map
  }
];

export function LandingEditorialFeatures() {
  return (
    <section
      aria-labelledby="landing-editorial-features-heading"
      className="bg-paper-50 py-16 sm:py-24"
      data-testid="landing-editorial-features"
      id="features"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span
            aria-hidden="true"
            className="inline-block h-0.5 w-10 bg-forest-800"
          />
          <h2
            className="mt-4 font-display text-3xl text-ink-950 sm:text-4xl"
            id="landing-editorial-features-heading"
          >
            The Modern Explorer toolkit
          </h2>
          <p className="mt-3 text-base leading-7 text-ink-700 sm:text-lg">
            Three building blocks replace the messy group chat and the scattered
            notes.
          </p>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li
                className="flex flex-col gap-4 rounded-2xl bg-paper-50 p-6 shadow-rideflow-editorial-card ring-1 ring-paper-200"
                key={feature.title}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-forest-800"
                >
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-ink-950">
                  {feature.title}
                </h3>
                <p className="text-sm leading-6 text-ink-700">
                  {feature.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
