import type { TripRole } from "@/src/domain/permissions";

export type MemberListMember = {
  id: string;
  email: string;
  role: TripRole;
  inviteStatus: "pending" | "accepted";
};

type MemberListProps = {
  members: MemberListMember[];
};

export function MemberList({ members }: MemberListProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Members</h2>
      <ul className="divide-y divide-slate-200 rounded-md border border-slate-200">
        {members.map((member) => (
          <li
            className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
            key={member.id}
          >
            <span className="font-medium text-slate-950">{member.email}</span>
            <span className="flex flex-wrap gap-2 text-xs capitalize text-slate-600">
              <span>{member.inviteStatus}</span>
              <span>{member.role}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
