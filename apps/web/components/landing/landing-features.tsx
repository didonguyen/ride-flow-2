import {
  CalendarDays,
  MapPin,
  Sparkles,
  Users
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const features: Feature[] = [
  {
    title: "Day-by-day timeline",
    description:
      "One card per day with a teal date rail and clear time slots for every stop.",
    icon: CalendarDays
  },
  {
    title: "Place search that pins snapshots",
    description:
      "Find cafes, viewpoints, and stays from seed data or OpenStreetMap, and freeze the choice onto the timeline.",
    icon: MapPin
  },
  {
    title: "Editable AI itinerary",
    description:
      "Generate a first draft, preview it, then append or replace. Your work is never overwritten.",
    icon: Sparkles
  },
  {
    title: "Realtime with your group",
    description:
      "Owners and planners see each other\u2019s edits within seconds. Viewers can follow along read-only.",
    icon: Users
  }
];

export function LandingFeatures() {
  return (
    <section
      aria-labelledby="landing-features-heading"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
            id="landing-features-heading"
          >
            Everything your group needs, in one workspace.
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Four building blocks replace the messy group chat and the scattered
            notes.
          </p>
        </div>

        <ul
          aria-label="RideFlow features"
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:border-forest-500/30 hover:shadow-rideflow-card"
                key={feature.title}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700 text-white"
                >
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <h3 className="text-lg font-semibold text-slate-950">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
