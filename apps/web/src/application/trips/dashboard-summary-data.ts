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

const DEFAULT_ACTIVITY: DashboardActivity[] = [
  {
    id: "act-1",
    actor: "Alex",
    actorInitial: "A",
    action: "added a waypoint:",
    target: "Bao Loc Pass",
    relativeTime: "2 hours ago"
  },
  {
    id: "act-2",
    actor: "You",
    actorInitial: "Y",
    action: "booked accommodation:",
    target: "Forest Lodge",
    relativeTime: "Yesterday"
  },
  {
    id: "act-3",
    actor: "Sarah",
    actorInitial: "S",
    action: "updated the gear list.",
    target: "",
    relativeTime: "2 days ago"
  },
  {
    id: "act-4",
    actor: "You",
    actorInitial: "Y",
    action: "created route:",
    target: "Nam Cát Tiên Exploration",
    relativeTime: "3 days ago"
  }
];

const DEFAULT_UPCOMING: DashboardUpcomingTrip = {
  id: "da-nang",
  name: "Nam Cát Tiên Exploration",
  terrain: "Off-Road",
  daysLabel: "3 Days",
  coverImageUrl:
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2000&q=80",
  progress: 65,
  progressLabel: "65% Planned",
  members: [
    { id: "m-1", name: "Alex", initial: "A" },
    { id: "m-2", name: "Sarah", initial: "S" }
  ],
  extraMemberCount: 2
};

const DEFAULT_RECENT: DashboardCompletedTrip[] = [
  {
    id: "pacific-coast",
    name: "Pacific Coast Highway",
    completedLabel: "Completed • Oct 12",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80",
    meta: ["450 mi", "4 Riders"]
  },
  {
    id: "high-desert-loop",
    name: "High Desert Loop",
    completedLabel: "Completed • Sep 28",
    imageUrl:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=2000&q=80",
    meta: ["280 mi", "Solo"]
  }
];

export function getDashboardActivity(): DashboardActivity[] {
  return DEFAULT_ACTIVITY;
}

export function getDashboardUpcoming(): DashboardUpcomingTrip {
  return DEFAULT_UPCOMING;
}

export function getDashboardRecent(): DashboardCompletedTrip[] {
  return DEFAULT_RECENT;
}

export function memberPalette(): readonly string[] {
  return MEMBER_PALETTE;
}
