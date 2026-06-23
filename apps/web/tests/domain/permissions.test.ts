import { describe, expect, it } from "vitest";
import {
  canManageMembers,
  canMutateTimeline,
  canReadTrip,
  tripRoles
} from "@/src/domain/permissions";

describe("trip permissions", () => {
  it("allows every trip role to read trips", () => {
    expect(tripRoles.map((role) => canReadTrip(role))).toEqual([
      true,
      true,
      true,
      true
    ]);
  });

  it("allows only owners and planners to mutate the timeline", () => {
    expect(canMutateTimeline("owner")).toBe(true);
    expect(canMutateTimeline("planner")).toBe(true);
    expect(canMutateTimeline("member")).toBe(false);
    expect(canMutateTimeline("viewer")).toBe(false);
  });

  it("allows only owners to manage members", () => {
    expect(canManageMembers("owner")).toBe(true);
    expect(canManageMembers("planner")).toBe(false);
    expect(canManageMembers("member")).toBe(false);
    expect(canManageMembers("viewer")).toBe(false);
  });
});
