import { AppShell } from "@/components/app/app-shell";
import { NewTripCard, TripCard } from "@/components/trips/trip-card";
import { dashboardTrips } from "@/src/application/trips/dashboard-data";

export default function TripsPage() {
  return (
    <AppShell activeItem="Dashboard">
      <section className="mx-auto max-w-[1460px]">
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl">
            Trips Dashboard
          </h1>
          <h2 className="mt-8 text-2xl font-extrabold tracking-[-0.02em] text-slate-900">
            Recent Trips
          </h2>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
          {dashboardTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
          <NewTripCard />
        </div>
      </section>
    </AppShell>
  );
}
