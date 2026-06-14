import type { Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MembersPanel } from "@/components/trips/members-panel";
import { AppShell } from "@/components/app/app-shell";
import { DateRail } from "@/components/planning/date-rail";
import { MobileTripHeader } from "@/components/planning/mobile-trip-header";
import { PlanningWorkspace } from "@/components/planning/planning-workspace";
import { TripSectionTabs } from "@/components/planning/trip-section-tabs";
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
    <AppShell activeItem="Dashboard">
      <MobileTripHeader
        dateRange={data.trip.dateRange}
        name={data.trip.name}
        tripId={data.trip.id}
      />
      <div className="-mx-5 -mt-8 bg-white sm:-mx-8 lg:-mx-12 lg:-mt-9">
        <TripSectionTabs activeTab="Planning" tripId={data.trip.id} />
        <DateRail days={data.trip.days} />
        <PlanningWorkspace
          destination={data.destination}
          endDate={data.endDate}
          startDate={data.startDate}
          trip={data.trip}
          tripId={data.trip.id}
        />
        <div className="px-5 pb-12 sm:px-8 lg:px-12">
          <MembersPanel
            errorCode={search.members_error ?? null}
            members={data.members}
            tripId={data.trip.id}
            viewerRole={data.viewerRole}
          />
        </div>
        <div className="border-t border-slate-200 bg-white px-5 py-6 text-center text-xs text-slate-500 sm:px-8 lg:px-12">
          <Link
            className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00565b] hover:underline"
            href={`/trips/${data.trip.id}#members` as Route}
          >
            Open members panel
          </Link>
        </div>
      </div>
    </AppShell>
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
      endDate:
        fallback.days[fallback.days.length - 1]?.date ?? ""
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
    members: members.map((member: import("@/src/application/members/types").TripMemberRecord) => ({
      id: member.id,
      email: member.email,
      role: member.role,
      inviteStatus: member.inviteStatus
    })),
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
