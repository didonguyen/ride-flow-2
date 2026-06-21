import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MembersPanel } from "@/components/trips/members-panel";
import { PlanningSurface } from "@/components/trips/planning-surface";
import { TripAppShell } from "@/components/trip/trip-app-shell";
import { TripCoverHeader } from "@/components/trip/trip-cover-header";
import { TripSectionTabs } from "@/components/trip/trip-section-tabs";
import type { MemberListMember } from "@/components/trips/member-list";
import { getPlanningTripById } from "@/src/application/trips/planning-data";
import { mapSupabasePlanningTrip } from "@/src/application/trips/supabase-planning-data";
import type { TripRole } from "@/src/domain/permissions";
import { createSupabaseServerClient } from "@/src/infrastructure/supabase/server";
import {
  createSupabaseMemberRepository,
  getSupabasePlanningTripRows,
  listSupabaseMembers,
  type RideFlowSupabaseClient
} from "@/src/infrastructure/supabase/repositories";

export const dynamic = "force-dynamic";

type TripPlanningPageProps = {
  params: Promise<{
    tripId: string;
  }>;
  searchParams: Promise<{
    members_error?: string;
  }>;
};

export default async function TripPlanningPage({
  params,
  searchParams
}: TripPlanningPageProps) {
  const [{ tripId }, search] = await Promise.all([params, searchParams]);
  const data = await getTripData(tripId);

  if (!data) {
    notFound();
  }

  return (
    <TripAppShell
      activeItem="My Trips"
      backHref={"/trips" as Route}
      pageTitle={data.trip.name}
      showSearch
    >
      <TripCoverHeader
        coverImageUrl={data.trip.coverImageUrl ?? ""}
        dateRange={data.trip.dateRange}
        days={`${data.trip.days.length} Days`}
        destination={data.trip.destination ?? data.destination}
        transport="Motorcycle"
        tripName={data.trip.name}
      />
      <TripSectionTabs activeTab="Planning" tripId={data.trip.id} />
      <PlanningSurface trip={data.trip} />
      <div className="border-t border-paper-200 bg-paper-50 px-5 py-8 sm:px-8 lg:px-10">
        <MembersPanel
          errorCode={search.members_error ?? null}
          members={data.members}
          tripId={data.trip.id}
          viewerRole={data.viewerRole}
        />
      </div>
      <div className="border-t border-paper-200 bg-paper-50 px-5 py-6 text-center text-xs text-ink-500 sm:px-8 lg:px-10">
        <Link
          className="text-xs font-semibold uppercase tracking-[0.18em] text-forest-800 hover:underline"
          href={`/trips/${data.trip.id}#members` as Route}
        >
          Open members panel
        </Link>
      </div>
    </TripAppShell>
  );
}

type TripData = {
  destination: string;
  endDate: string;
  members: MemberListMember[];
  startDate: string;
  trip: ReturnType<typeof mapSupabasePlanningTrip>;
  viewerRole: TripRole | null;
};

async function getTripData(tripId: string): Promise<TripData | null> {
  const supabase = await createSupabaseServerClient();
  const rideflowSupabase = supabase as unknown as RideFlowSupabaseClient;
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!isUuid(tripId)) {
    const fallback = getPlanningTripById(tripId);
    if (!fallback) {
      return null;
    }
    return {
      trip: fallback,
      members: [],
      viewerRole: user ? "owner" : null,
      destination: fallback.name,
      startDate: fallback.days[0]?.date ?? "",
      endDate: fallback.days[fallback.days.length - 1]?.date ?? ""
    };
  }

  const [rows, members, viewerRole] = await Promise.all([
    getSupabasePlanningTripRows(rideflowSupabase, tripId),
    listSupabaseMembers(rideflowSupabase, tripId),
    user
      ? createSupabaseMemberRepository(rideflowSupabase).getViewerRole(
          tripId,
          user.id
        )
      : Promise.resolve(null)
  ]);

  if (!rows) {
    return null;
  }

  return {
    trip: mapSupabasePlanningTrip(rows),
    members: members.map(
      (member: import("@/src/application/members/types").TripMemberRecord) => ({
        id: member.id,
        email: member.email,
        role: member.role,
        inviteStatus: member.inviteStatus
      })
    ),
    viewerRole,
    destination: rows.trip.destination,
    startDate: rows.trip.start_date,
    endDate: rows.trip.end_date
  };
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
