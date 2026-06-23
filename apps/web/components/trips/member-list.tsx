import type { TripRole } from "@/src/domain/permissions";
import type { ReactNode } from "react";

export type MemberListMember = {
  id: string;
  email: string;
  role: TripRole;
  inviteStatus: "pending" | "accepted";
};

type MemberListProps = {
  members: MemberListMember[];
  renderRoleControl?: (member: MemberListMember) => ReactNode;
};

const roleBadgeClass: Record<TripRole, string> = {
  owner: "bg-[#00565b] text-white",
  planner: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  member: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  viewer: "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
};

const statusBadgeClass: Record<MemberListMember["inviteStatus"], string> = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  accepted: "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
};

export function MemberList({ members, renderRoleControl }: MemberListProps) {
  return (
    <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
      {members.map((member) => (
        <li
          className="flex flex-col gap-3 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
          key={member.id}
        >
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-slate-950">{member.email}</span>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={[
                  "rounded-full px-2 py-0.5 font-extrabold uppercase tracking-wide",
                  statusBadgeClass[member.inviteStatus]
                ].join(" ")}
              >
                {member.inviteStatus}
              </span>
              <span
                className={[
                  "rounded-full px-2 py-0.5 font-extrabold uppercase tracking-wide",
                  roleBadgeClass[member.role]
                ].join(" ")}
              >
                {member.role}
              </span>
            </div>
          </div>
          {renderRoleControl ? renderRoleControl(member) : null}
        </li>
      ))}
    </ul>
  );
}
