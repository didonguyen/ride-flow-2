import type { TripMemberRecord } from "@/src/application/members/types";
import type { ExpenseRecord } from "@/src/application/trips/types";
import { calculateExpenseBalances } from "@/src/domain/expenses";

export type TripExpense = {
  amount: number;
  category: "fuel" | "food" | "stay" | "tickets" | "transport" | "other";
  currency: string;
  date: string;
  dateValue: string;
  id: string;
  notes: string;
  paidBy: string;
  paidByMemberId: string;
  participantIds: string[];
  title: string;
};

export type TripCategorySlice = {
  amount: number;
  color: string;
  name: string;
};

export type TripMemberBalance = {
  amount: number;
  id: string;
  initial: string;
  name: string;
  tone: "gets" | "owes" | "settled";
};

export type TripExpenseSummary = {
  balances: TripMemberBalance[];
  breakdown: TripCategorySlice[];
  currency: string;
  insight: { actionLabel: string; body: string; title: string };
  memberCount: number;
  perPerson: number;
  totalSpent: number;
  transactions: TripExpense[];
};

const CATEGORY_COLORS: Record<string, string> = {
  fuel: "#B65A3A",
  food: "#2B6954",
  stay: "#003527",
  tickets: "#F2CFBF",
  transport: "#80BEA6",
  other: "#64748b"
};

export function getTripExpenseSummary(input?: {
  expenses: ExpenseRecord[];
  members: TripMemberRecord[];
}): TripExpenseSummary {
  if (!input) {
    return getDefaultExpenseSummary();
  }

  const memberNameById = new Map(
    input.members.map((member) => [member.id, displayMemberName(member)])
  );
  const transactions = input.expenses.map((expense) => ({
    id: expense.id,
    title: expense.title,
    paidBy: memberNameById.get(expense.paidByMemberId) ?? "Unknown",
    paidByMemberId: expense.paidByMemberId,
    participantIds: expense.participants.map((participant) => participant.memberId),
    date: formatDate(expense.date),
    dateValue: expense.date,
    amount: expense.amount,
    currency: expense.currency,
    category: normalizeCategory(expense.category),
    notes: expense.notes
  }));
  const totalSpent = input.expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const breakdown = buildBreakdown(transactions);
  const balances = calculateExpenseBalances({
    expenses: input.expenses.map((expense) => ({
      amount: expense.amount,
      paidByMemberId: expense.paidByMemberId,
      participants: expense.participants
    })),
    members: input.members.map((member) => ({
      id: member.id,
      name: displayMemberName(member)
    }))
  }).map((balance) => ({
    id: balance.memberId,
    name: balance.name,
    initial: initialFor(balance.name),
    amount: balance.amount,
    tone: balance.tone
  }));

  return {
    totalSpent,
    currency: transactions[0]?.currency ?? "VND",
    memberCount: input.members.length,
    perPerson: input.members.length > 0 ? roundMoney(totalSpent / input.members.length) : 0,
    breakdown,
    transactions,
    balances,
    insight: {
      title: "Expense Insight",
      body:
        transactions.length === 0
          ? "No expenses recorded yet. Add the first shared cost to start balances."
          : `${transactions.length} expenses are being shared across ${input.members.length} trip members.`,
      actionLabel: "Review expenses"
    }
  };
}

function getDefaultExpenseSummary(): TripExpenseSummary {
  const members: TripMemberRecord[] = [
    {
      id: "member-1",
      tripId: "trip-1",
      userId: "user-1",
      email: "an@example.com",
      role: "owner",
      inviteStatus: "accepted"
    },
    {
      id: "member-2",
      tripId: "trip-1",
      userId: null,
      email: "binh@example.com",
      role: "planner",
      inviteStatus: "pending"
    }
  ];
  return getTripExpenseSummary({
    members,
    expenses: [
      {
        id: "tx-1",
        tripId: "trip-1",
        title: "Fuel refill",
        amount: 68000,
        currency: "VND",
        category: "fuel",
        paidByMemberId: "member-1",
        date: "2026-07-10",
        notes: "Highway stop",
        createdBy: "user-1",
        participants: [
          { memberId: "member-1", shareAmount: 34000 },
          { memberId: "member-2", shareAmount: 34000 }
        ]
      }
    ]
  });
}

function buildBreakdown(transactions: TripExpense[]): TripCategorySlice[] {
  const byCategory = new Map<string, number>();
  for (const transaction of transactions) {
    byCategory.set(
      transaction.category,
      (byCategory.get(transaction.category) ?? 0) + transaction.amount
    );
  }

  return Array.from(byCategory.entries()).map(([name, amount]) => ({
    name,
    amount,
    color: CATEGORY_COLORS[name] ?? CATEGORY_COLORS.other
  }));
}

function displayMemberName(member: TripMemberRecord) {
  return member.email.split("@")[0] || member.role;
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  });
}

function initialFor(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function normalizeCategory(value: string): TripExpense["category"] {
  if (["fuel", "food", "stay", "tickets", "transport"].includes(value)) {
    return value as TripExpense["category"];
  }
  return "other";
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
