import type { TripRole } from "@/src/domain/permissions";

export type InviteMemberInput = {
  actorRole: TripRole;
  tripId: string;
  email: string;
  role: TripRole;
};

export type InviteMemberError =
  | "member_manage_forbidden"
  | "member_email_invalid"
  | "member_role_invalid";

export type InvitedMember = {
  id: string;
};

export type PersistInviteMemberInput = {
  tripId: string;
  email: string;
  role: Exclude<TripRole, "owner">;
};

export type UpdateMemberRoleInput = {
  actorRole: TripRole;
  memberId: string;
  role: TripRole;
};

export type UpdateMemberRoleError =
  | "member_manage_forbidden"
  | "member_role_invalid";

export type UpdatedMemberRole = {
  id: string;
  role: Exclude<TripRole, "owner">;
};

export type PersistUpdateMemberRoleInput = {
  memberId: string;
  role: Exclude<TripRole, "owner">;
};

export type TripMemberRecord = {
  id: string;
  tripId: string;
  email: string;
  role: TripRole;
  inviteStatus: "pending" | "accepted";
  userId: string | null;
};

export type MemberRepository = {
  inviteMember(input: PersistInviteMemberInput): Promise<InvitedMember>;
  updateMemberRole(
    input: PersistUpdateMemberRoleInput
  ): Promise<UpdatedMemberRole>;
  listMembers(tripId: string): Promise<TripMemberRecord[]>;
  getViewerRole(tripId: string, userId: string): Promise<TripRole | null>;
};
