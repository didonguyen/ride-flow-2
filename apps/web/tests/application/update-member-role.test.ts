import { describe, expect, it, vi } from "vitest";
import { updateMemberRoleUseCase } from "@/src/application/members/update-member-role";
import type { MemberRepository } from "@/src/application/members/types";

describe("updateMemberRoleUseCase", () => {
  it("allows an owner to update a member role", async () => {
    const repository: MemberRepository = {
      inviteMember: vi.fn(),
      updateMemberRole: vi.fn(async (input) => ({
        id: input.memberId,
        role: input.role
      }))
    };

    const result = await updateMemberRoleUseCase(repository, {
      actorRole: "owner",
      memberId: "member-1",
      role: "planner"
    });

    expect(repository.updateMemberRole).toHaveBeenCalledWith({
      memberId: "member-1",
      role: "planner"
    });
    expect(result).toEqual({
      ok: true,
      value: { id: "member-1", role: "planner" }
    });
  });

  it("blocks viewers before calling the repository", async () => {
    const repository: MemberRepository = {
      inviteMember: vi.fn(),
      updateMemberRole: vi.fn()
    };

    const result = await updateMemberRoleUseCase(repository, {
      actorRole: "viewer",
      memberId: "member-1",
      role: "planner"
    });

    expect(result).toEqual({ ok: false, error: "member_manage_forbidden" });
    expect(repository.updateMemberRole).not.toHaveBeenCalled();
  });

  it("rejects owner role updates before calling the repository", async () => {
    const repository: MemberRepository = {
      inviteMember: vi.fn(),
      updateMemberRole: vi.fn()
    };

    const result = await updateMemberRoleUseCase(repository, {
      actorRole: "owner",
      memberId: "member-1",
      role: "owner"
    });

    expect(result).toEqual({ ok: false, error: "member_role_invalid" });
    expect(repository.updateMemberRole).not.toHaveBeenCalled();
  });
});
