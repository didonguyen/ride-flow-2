export const tripRoles = ["owner", "planner", "member", "viewer"] as const;

export type TripRole = (typeof tripRoles)[number];

const planningRoles: ReadonlyArray<TripRole> = ["owner", "planner"];

export function canReadTrip(role: TripRole): boolean {
  return tripRoles.includes(role);
}

export function canReadPlanning(role: TripRole): boolean {
  return tripRoles.includes(role);
}

export function canMutatePlanning(role: TripRole): boolean {
  return planningRoles.includes(role);
}

export function canMutateTimeline(role: TripRole): boolean {
  return canMutatePlanning(role);
}

export function canGenerateDraft(role: TripRole): boolean {
  return canMutatePlanning(role);
}

export function canManageMembers(role: TripRole): boolean {
  return role === "owner";
}

export function canDeleteTrip(role: TripRole): boolean {
  return role === "owner";
}
