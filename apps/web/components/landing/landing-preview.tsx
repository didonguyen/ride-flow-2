import Image from "next/image";

export function LandingPreview() {
  return (
    <section
      aria-labelledby="landing-preview-heading"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl"
            id="landing-preview-heading"
          >
            See the dashboard before you sign up.
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Image-led trip cards, a clear new-trip path, and the same calm
            sidebar you will use every day.
          </p>
        </div>

        <figure className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          <Image
            alt="RideFlow dashboard preview showing three trip cards and a new-trip card."
            className="h-auto w-full"
            height={1080}
            src="/design/RideFlow_Dashboard.png"
            width={1920}
          />
        </figure>
      </div>
    </section>
  );
}
