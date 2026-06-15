type Step = {
  number: number;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: 1,
    title: "Create a trip",
    description:
      "Name, destination, dates. We generate one card per day."
  },
  {
    number: 2,
    title: "Build the plan",
    description:
      "Drag stops into the timeline. Pin places, attach notes, set durations."
  },
  {
    number: 3,
    title: "Invite and go",
    description:
      "Invite members as Planner or Viewer. The trip stays live as it changes."
  }
];

export function LandingHowItWorks() {
  return (
    <section
      aria-labelledby="landing-how-heading"
      className="bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
            id="landing-how-heading"
          >
            How RideFlow works.
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            From idea to a shared itinerary in three steps.
          </p>
        </div>

        <ol
          aria-label="How RideFlow works"
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {steps.map((step) => (
            <li
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6"
              key={step.number}
            >
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#004853] text-base font-bold text-white"
              >
                {step.number}
              </span>
              <h3 className="text-lg font-semibold text-slate-950">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
