import Link from "next/link";
import type { Route } from "next";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
          RideFlow V1
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Plan group trips on a shared timeline.
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Create a trip, invite planners, search places, and pin each stop to a
          time-based itinerary.
        </p>
        <div className="flex gap-3">
          <Link
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            href={"/trips" as Route}
          >
            Open Trips
          </Link>
          <Link
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium"
            href={"/sign-in" as Route}
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
