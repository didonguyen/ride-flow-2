import { describe, expect, it, vi } from "vitest";
import { inviteMemberUseCase } from "@/src/application/members/invite-member";
import type { MemberRepository } from "@/src/application/members/types";

describe("inviteMemberUseCase", () => {
  it("allows an owner to invite a planner with a normalized email", async () => {
    const repository: MemberRepository = {
      inviteMember: vi.fn(async () => ({ id: "member-1" })),
      updateMemberRole: vi.fn()
    };

    const result = await inviteMemberUseCase(repository, {
      actorRole: "owner",
      tripId: "trip-1",
      email: "  Planner@Example.COM ",
      role: "planner"
    });

    expect(repository.inviteMember).toHaveBeenCalledWith({
      tripId: "trip-1",
      email: "planner@example.com",
      role: "planner"
    });
    expect(result).toEqual({ ok: true, value: { id: "member-1" } });
  });

  it("blocks planners before calling the repository", async () => {
    const repository: MemberRepository = {
      inviteMember: vi.fn(),
      updateMemberRole: vi.fn()
    };

    const result = await inviteMemberUseCase(repository, {
      actorRole: "planner",
      tripId: "trip-1",
      email: "viewer@example.com",
      role: "viewer"
    });

    expect(result).toEqual({ ok: false, error: "member_manage_forbidden" });
    expect(repository.inviteMember).not.toHaveBeenCalled();
  });

  it("rejects invalid email before calling the repository", async () => {
    const repository: MemberRepository = {
      inviteMember: vi.fn(),
      updateMemberRole: vi.fn()
    };

    const result = await inviteMemberUseCase(repository, {
      actorRole: "owner",
      tripId: "trip-1",
      email: "not-an-email",
      role: "viewer"
    });

    expect(result).toEqual({ ok: false, error: "member_email_invalid" });
    expect(repository.inviteMember).not.toHaveBeenCalled();
  });

  it("rejects owner invites before calling the repository", async () => {
    const repository: MemberRepository = {
      inviteMember: vi.fn(),
      updateMemberRole: vi.fn()
    };

    const result = await inviteMemberUseCase(repository, {
      actorRole: "owner",
      tripId: "trip-1",
      email: "owner@example.com",
      role: "owner"
    });

    expect(result).toEqual({ ok: false, error: "member_role_invalid" });
    expect(repository.inviteMember).not.toHaveBeenCalled();
  });
});
