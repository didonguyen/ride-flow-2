import { Mail, UserCog } from "lucide-react";

import { MemberList, type MemberListMember } from "@/components/trips/member-list";
import {
  inviteMemberAction,
  updateMemberRoleAction
} from "@/src/application/members/actions";
import type { TripRole } from "@/src/domain/permissions";
import { canManageMembers } from "@/src/domain/permissions";

type MembersPanelProps = {
  tripId: string;
  viewerRole: TripRole | null;
  members: MemberListMember[];
  errorCode?: string | null;
};

const errorMessages: Record<string, string> = {
  auth_required: "You must sign in to manage members.",
  member_email_invalid: "Enter a valid email address.",
  member_role_invalid: "Owners cannot be invited or downgraded.",
  members_forbidden: "Only the trip owner can manage members.",
  member_manage_forbidden: "Only the trip owner can manage members."
};

export function MembersPanel({
  tripId,
  viewerRole,
  members,
  errorCode
}: MembersPanelProps) {
  const canManage = viewerRole !== null && canManageMembers(viewerRole);
  const error = errorCode ? errorMessages[errorCode] ?? null : null;

  return (
    <section
      className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-950/10 ring-1 ring-slate-200"
      id="members"
    >
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-[-0.02em] text-slate-950">
            Members
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {viewerRole
              ? `You are signed in as ${viewerRole}.`
              : "Read-only access."}
          </p>
        </div>
        {viewerRole ? (
          <span
            className={[
              "rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide",
              viewerRole === "owner"
                ? "bg-[#00565b] text-white"
                : viewerRole === "planner"
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
            ].join(" ")}
          >
            {viewerRole}
          </span>
        ) : null}
      </header>

      {error ? (
        <p
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {canManage ? (
        <form
          action={inviteMemberAction}
          className="mt-5 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          <input name="tripId" type="hidden" value={tripId} />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <Mail aria-hidden="true" className="h-4 w-4 text-slate-500" />
                Invite by email
              </span>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#00565b] focus:ring-4 focus:ring-[#00565b]/10"
                name="email"
                placeholder="planner@example.com"
                required
                type="email"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <UserCog aria-hidden="true" className="h-4 w-4 text-slate-500" />
                Role
              </span>
              <select
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold capitalize text-slate-950 outline-none transition focus:border-[#00565b] focus:ring-4 focus:ring-[#00565b]/10"
                defaultValue="planner"
                name="role"
              >
                <option value="planner">Planner</option>
                <option value="viewer">Viewer</option>
              </select>
            </label>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#00565b] px-5 text-sm font-extrabold text-white transition hover:bg-[#004853]"
              type="submit"
            >
              Send invite
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-5">
        <MemberList members={members} renderRoleControl={renderRoleControl(tripId, canManage, members)} />
      </div>
    </section>
  );
}

function renderRoleControl(
  tripId: string,
  canManage: boolean,
  members: MemberListMember[]
) {
  if (!canManage) {
    return undefined;
  }

  return function renderMemberRoleControl(member: MemberListMember) {
    if (member.role === "owner") {
      return undefined;
    }

    return (
      <form action={updateMemberRoleAction} className="flex items-center gap-2">
        <input name="tripId" type="hidden" value={tripId} />
        <input name="memberId" type="hidden" value={member.id} />
        <select
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold capitalize text-slate-700 outline-none focus:border-[#00565b] focus:ring-4 focus:ring-[#00565b]/10"
          defaultValue={member.role}
          name="role"
        >
          {uniqueRoles(members).map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-extrabold text-white transition hover:bg-slate-800"
          type="submit"
        >
          Update
        </button>
      </form>
    );
  };
}

function uniqueRoles(members: MemberListMember[]): TripRole[] {
  const roles = new Set<TripRole>(["planner", "viewer"]);
  for (const member of members) {
    roles.add(member.role);
  }
  return [...roles];
}
