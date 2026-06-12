import { canManageMembers } from "@/src/domain/permissions";
import { err, type Result } from "@/src/lib/result";
import type {
  InvitedMember,
  InviteMemberError,
  InviteMemberInput,
  MemberRepository,
  PersistInviteMemberInput
} from "@/src/application/members/types";

const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function inviteMemberUseCase(
  repository: MemberRepository,
  input: InviteMemberInput
): Promise<Result<InvitedMember, InviteMemberError>> {
  if (!canManageMembers(input.actorRole)) {
    return err("member_manage_forbidden");
  }

  const email = input.email.trim().toLowerCase();

  if (!basicEmailPattern.test(email)) {
    return err("member_email_invalid");
  }

  if (input.role === "owner") {
    return err("member_role_invalid");
  }

  const inviteInput: PersistInviteMemberInput = {
    tripId: input.tripId,
    email,
    role: input.role
  };

  const member = await repository.inviteMember(inviteInput);

  return { ok: true, value: member };
}
