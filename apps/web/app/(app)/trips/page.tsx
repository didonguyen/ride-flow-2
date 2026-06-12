import Link from "next/link";
import type { Route } from "next";

export default function TripsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-sky-700">
              RideFlow V1
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">Trips</h1>
            <p className="max-w-2xl text-lg text-slate-600">
              Create a shared planning space for each group trip.
            </p>
          </div>

          <Link
            className="inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white"
            href={"/trips/new" as Route}
          >
            New trip
          </Link>
        </div>

        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold">No trips yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Start by creating your first trip.
          </p>
        </div>
      </section>
    </main>
  );
}
