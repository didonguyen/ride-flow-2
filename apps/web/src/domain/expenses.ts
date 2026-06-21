export type ExpenseShare = {
  memberId: string;
  shareAmount: number;
};

export type ExpenseBalanceMember = {
  id: string;
  name: string;
};

export type ExpenseBalanceInput = {
  expenses: Array<{
    amount: number;
    paidByMemberId: string;
    participants: ExpenseShare[];
  }>;
  members: ExpenseBalanceMember[];
};

export type ExpenseBalance = {
  amount: number;
  memberId: string;
  name: string;
  tone: "gets" | "owes" | "settled";
};

export function splitExpenseEqually(input: {
  amount: number;
  participantIds: string[];
}): ExpenseShare[] {
  if (input.participantIds.length === 0) {
    throw new Error("expense_participants_required");
  }

  const totalCents = toCents(input.amount);
  const baseShare = Math.floor(totalCents / input.participantIds.length);
  const remainder = totalCents - baseShare * input.participantIds.length;

  return input.participantIds.map((memberId, index) => ({
    memberId,
    shareAmount: fromCents(baseShare + (index < remainder ? 1 : 0))
  }));
}

export function calculateExpenseBalances({
  expenses,
  members
}: ExpenseBalanceInput): ExpenseBalance[] {
  const centsByMember = new Map<string, number>();

  for (const member of members) {
    centsByMember.set(member.id, 0);
  }

  for (const expense of expenses) {
    centsByMember.set(
      expense.paidByMemberId,
      (centsByMember.get(expense.paidByMemberId) ?? 0) + toCents(expense.amount)
    );

    for (const participant of expense.participants) {
      centsByMember.set(
        participant.memberId,
        (centsByMember.get(participant.memberId) ?? 0) -
          toCents(participant.shareAmount)
      );
    }
  }

  return members.map((member) => {
    const amount = fromCents(Math.abs(centsByMember.get(member.id) ?? 0));
    const raw = centsByMember.get(member.id) ?? 0;

    return {
      amount,
      memberId: member.id,
      name: member.name,
      tone: raw > 0 ? "gets" : raw < 0 ? "owes" : "settled"
    };
  });
}

function toCents(amount: number) {
  return Math.round(amount * 100);
}

function fromCents(cents: number) {
  return cents / 100;
}
