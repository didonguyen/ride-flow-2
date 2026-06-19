export type TripExpense = {
  id: string;
  title: string;
  paidBy: string;
  date: string;
  amount: number;
  category: "fuel" | "food" | "stay" | "tickets" | "transport" | "other";
  status: "settled" | "pending" | "needs-transfer";
};

export type TripBudgetSlice = {
  name: string;
  amount: number;
  color: string;
};

export type TripSettlement = {
  id: string;
  debtorName: string;
  debtorInitial: string;
  creditorName: string;
  amount: number;
};

export type TripMemberBalance = {
  id: string;
  name: string;
  initial: string;
  amount: number;
  tone: "gets" | "owes";
};

export type TripExpenseSummary = {
  totalSpent: number;
  budget: number;
  pending: number;
  perPerson: number;
  breakdown: TripBudgetSlice[];
  transactions: TripExpense[];
  settlements: TripSettlement[];
  balances: TripMemberBalance[];
  insight: { title: string; body: string; actionLabel: string };
};

const DEFAULT_BUDGET_SLICES: TripBudgetSlice[] = [
  { name: "Accommodation", amount: 150, color: "#003527" },
  { name: "Food", amount: 120, color: "#2B6954" },
  { name: "Fuel", amount: 90, color: "#80BEA6" },
  { name: "Tickets", amount: 60, color: "#F2CFBF" },
  { name: "Misc", amount: 30, color: "#B65A3A" }
];

const DEFAULT_TRANSACTIONS: TripExpense[] = [
  {
    id: "tx-1",
    title: "Fuel refill",
    paidBy: "Nhut",
    date: "Jul 10",
    amount: 68,
    category: "fuel",
    status: "settled"
  },
  {
    id: "tx-2",
    title: "Coffee stop",
    paidBy: "Minh",
    date: "Jul 10",
    amount: 24,
    category: "food",
    status: "pending"
  },
  {
    id: "tx-3",
    title: "Green Bamboo Lodge",
    paidBy: "An",
    date: "Jul 10",
    amount: 180,
    category: "stay",
    status: "needs-transfer"
  },
  {
    id: "tx-4",
    title: "National park entrance",
    paidBy: "Binh",
    date: "Jul 11",
    amount: 42,
    category: "tickets",
    status: "pending"
  }
];

const DEFAULT_SETTLEMENTS: TripSettlement[] = [
  {
    id: "stl-1",
    debtorName: "Minh",
    debtorInitial: "M",
    creditorName: "Nhut",
    amount: 18
  },
  {
    id: "stl-2",
    debtorName: "Binh",
    debtorInitial: "B",
    creditorName: "An",
    amount: 32
  }
];

const DEFAULT_BALANCES: TripMemberBalance[] = [
  { id: "b-1", name: "An", initial: "A", amount: 45, tone: "gets" },
  { id: "b-2", name: "Nhut", initial: "N", amount: 12, tone: "gets" },
  { id: "b-3", name: "Minh", initial: "M", amount: 25, tone: "owes" },
  { id: "b-4", name: "Binh", initial: "B", amount: 32, tone: "owes" }
];

const DEFAULT_INSIGHT = {
  title: "AI Insight",
  body:
    "Your accommodation costs are running 15% higher than typical for Đồng Nai region. Consider booking standard lodges to keep within your $600 total budget.",
  actionLabel: "Review alternatives"
};

export function getTripExpenseSummary(): TripExpenseSummary {
  return {
    totalSpent: 450,
    budget: 600,
    pending: 128,
    perPerson: 75,
    breakdown: DEFAULT_BUDGET_SLICES,
    transactions: DEFAULT_TRANSACTIONS,
    settlements: DEFAULT_SETTLEMENTS,
    balances: DEFAULT_BALANCES,
    insight: DEFAULT_INSIGHT
  };
}
