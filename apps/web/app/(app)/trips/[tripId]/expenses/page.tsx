import { notFound } from "next/navigation";

import { ExpensesSurface } from "@/components/trips/expenses-surface";
import { TripAppShell } from "@/components/trip/trip-app-shell";
import { TripCoverHeader } from "@/components/trip/trip-cover-header";
import { TripSectionTabs } from "@/components/trip/trip-section-tabs";
import {
  addExpenseAction,
  deleteExpenseAction,
  updateExpenseAction
} from "@/src/application/trips/expense-actions";
import { getTripExpenseSummary } from "@/src/application/trips/expenses-data";
import { getPlanningTripById } from "@/src/application/trips/planning-data";
import { mapSupabasePlanningTrip } from "@/src/application/trips/supabase-planning-data";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseExpenseRepository,
  getSupabasePlanningTripRows,
  listSupabaseMembers,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

export const dynamic = "force-dynamic";

type ExpensesPageProps = {
  params: Promise<{
    tripId: string;
  }>;
};

export default async function TripExpensesPage({ params }: ExpensesPageProps) {
  const { tripId } = await params;
  const data = await getExpensesPageData(tripId);

  if (!data) {
    notFound();
  }

  return (
    <TripAppShell
      activeItem="My Trips"
      backHref={"/trips" as never}
      pageTitle={data.trip.name}
      showSearch
    >
      <TripCoverHeader
        coverImageUrl={data.trip.coverImageUrl ?? ""}
        dateRange={data.trip.dateRange}
        days={`${data.trip.days.length} Days`}
        transport={data.trip.transport ?? "Motorcycle"}
        tripName={data.trip.name}
      />
      <TripSectionTabs activeTab="Expenses" tripId={data.trip.id} />
      <ExpensesSurface
        addExpenseAction={addExpenseAction}
        deleteExpenseAction={deleteExpenseAction}
        members={data.members}
        summary={data.summary}
        tripId={data.trip.id}
        tripName={data.trip.name}
        updateExpenseAction={updateExpenseAction}
      />
    </TripAppShell>
  );
}

async function getExpensesPageData(tripId: string) {
  const supabase = await createSupabaseServerClient();
  const rideflowSupabase = supabase as unknown as RideFlowSupabaseClient;

  if (!isUuid(tripId)) {
    const fallback = getPlanningTripById(tripId);
    return fallback
      ? {
          trip: fallback,
          members: [],
          summary: getTripExpenseSummary()
        }
      : null;
  }

  const rows = await getSupabasePlanningTripRows(rideflowSupabase, tripId);
  if (!rows) {
    return null;
  }

  const [members, expenses] = await Promise.all([
    listSupabaseMembers(rideflowSupabase, tripId),
    createSupabaseExpenseRepository(rideflowSupabase).listExpenses(tripId)
  ]);

  return {
    trip: mapSupabasePlanningTrip(rows),
    members,
    summary: getTripExpenseSummary({ expenses, members })
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
