export const tripRoles = ["owner", "planner", "viewer"] as const;

export type TripRole = (typeof tripRoles)[number];

export function canReadTrip(role: TripRole): boolean {
  return tripRoles.includes(role);
}

export function canMutateTimeline(role: TripRole): boolean {
  return role === "owner" || role === "planner";
}

export function canGenerateDraft(role: TripRole): boolean {
  return role === "owner" || role === "planner";
}

export function canManageMembers(role: TripRole): boolean {
  return role === "owner";
}

export function canDeleteTrip(role: TripRole): boolean {
  return role === "owner";
}
