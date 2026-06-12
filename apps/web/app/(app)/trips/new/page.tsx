import Link from "next/link";
import type { Route } from "next";
import { NewTripForm } from "@/components/trips/new-trip-form";

async function createTripPlaceholderAction(_formData: FormData) {
  "use server";
}

export default function NewTripPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-2xl">
        <Link
          className="text-sm font-medium text-sky-700 hover:text-sky-800"
          href={"/trips" as Route}
        >
          Back to trips
        </Link>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create a trip
            </h1>
            <p className="text-sm text-slate-600">
              Add the trip basics. Saving will be wired to persistence in a
              later task.
            </p>
          </div>

          <div className="mt-6">
            <NewTripForm action={createTripPlaceholderAction} />
          </div>
        </div>
      </section>
    </main>
  );
}
