import { canManageMembers } from "@/src/domain/permissions";
import { err, type Result } from "@/src/lib/result";
import type {
  MemberRepository,
  PersistUpdateMemberRoleInput,
  UpdatedMemberRole,
  UpdateMemberRoleError,
  UpdateMemberRoleInput
} from "@/src/application/members/types";

export async function updateMemberRoleUseCase(
  repository: MemberRepository,
  input: UpdateMemberRoleInput
): Promise<Result<UpdatedMemberRole, UpdateMemberRoleError>> {
  if (!canManageMembers(input.actorRole)) {
    return err("member_manage_forbidden");
  }

  if (input.role === "owner") {
    return err("member_role_invalid");
  }

  const updateInput: PersistUpdateMemberRoleInput = {
    memberId: input.memberId,
    role: input.role
  };

  const member = await repository.updateMemberRole(updateInput);

  return { ok: true, value: member };
}
