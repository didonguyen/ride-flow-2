import type { DashboardTrip } from "@/src/application/trips/dashboard-data";

export type DashboardMember = {
  id: string;
  name: string;
  initial: string;
  avatarUrl?: string;
};

export type DashboardActivity = {
  id: string;
  actor: string;
  actorInitial: string;
  action: string;
  target: string;
  relativeTime: string;
  hasUpdate?: boolean;
};

export type DashboardUpcomingTrip = {
  id: string;
  name: string;
  terrain: string;
  daysLabel: string;
  coverImageUrl: string;
  progress: number;
  progressLabel: string;
  members: DashboardMember[];
  extraMemberCount?: number;
};

export type DashboardCompletedTrip = {
  id: string;
  name: string;
  completedLabel: string;
  imageUrl: string;
  meta: string[];
};

const MEMBER_PALETTE = ["#003527", "#064E3B", "#2B6954", "#80BEA6"];

function progressFromTrip(trip: DashboardTrip, index: number) {
  if (typeof trip.rating === "number") {
    return Math.min(95, Math.max(20, Math.round((trip.rating / 5) * 100)));
  }

  return Math.min(85, 45 + index * 10);
}

function memberFromName(name: string): DashboardMember {
  const initial = name.trim().charAt(0).toUpperCase() || "Y";

  return {
    id: "you",
    name: "You",
    initial
  };
}

export function getDashboardActivity(trips: DashboardTrip[] = []): DashboardActivity[] {
  return trips.slice(0, 4).map((trip, index) => ({
    id: "activity-" + trip.id,
    actor: index === 0 ? "You" : "RideFlow",
    actorInitial: index === 0 ? "Y" : "R",
    action: index === 0 ? "updated route:" : "kept trip ready:",
    target: trip.name,
    relativeTime: index === 0 ? "Recently" : trip.dateRange,
    hasUpdate: index === 0
  }));
}

export function getDashboardUpcoming(
  trips: DashboardTrip[] = []
): DashboardUpcomingTrip | null {
  const trip = trips[0];

  if (!trip) {
    return null;
  }

  const progress = progressFromTrip(trip, 0);

  return {
    id: trip.id,
    name: trip.name,
    terrain: trip.transport ?? "Motorcycle",
    daysLabel: trip.daysLabel ?? "Trip Plan",
    coverImageUrl: trip.imageUrl,
    progress,
    progressLabel: progress + "% Planned",
    members: [memberFromName(trip.name)]
  };
}

export function getDashboardRecent(
  trips: DashboardTrip[] = []
): DashboardCompletedTrip[] {
  return trips.slice(1, 5).map((trip) => ({
    id: trip.id,
    name: trip.name,
    completedLabel: trip.dateRange,
    imageUrl: trip.imageUrl,
    meta: [trip.destination, trip.transport ?? "Journey"]
  }));
}

export function memberPalette(): readonly string[] {
  return MEMBER_PALETTE;
}
