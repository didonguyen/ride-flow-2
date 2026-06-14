type ExpenseTransaction = {
  id: string;
  date: string;
  category: "Food" | "Transport" | "Stay" | "Activities" | "Other";
  description: string;
  amount: number;
};

type ExpenseCategory = ExpenseTransaction["category"];

const seedCategories: { name: ExpenseCategory; amount: number; color: string }[] = [
  { name: "Food", amount: 540, color: "#0f766e" },
  { name: "Stay", amount: 240, color: "#9b1c1c" },
  { name: "Transport", amount: 200, color: "#1f766f" },
  { name: "Activities", amount: 120, color: "#b45309" },
  { name: "Other", amount: 100, color: "#475569" }
];

const seedTransactions: ExpenseTransaction[] = [
  {
    id: "tx-1",
    date: "May 10",
    category: "Food",
    description: "Dinner at Banh Mi Queen",
    amount: 85
  },
  {
    id: "tx-2",
    date: "May 10",
    category: "Transport",
    description: "Ride to hotel via Grab",
    amount: 50
  },
  {
    id: "tx-3",
    date: "May 11",
    category: "Stay",
    description: "Island Serenity Boutique Hotel",
    amount: 240
  },
  {
    id: "tx-4",
    date: "May 11",
    category: "Food",
    description: "Coffee and pastries at Cong Caphe",
    amount: 40
  },
  {
    id: "tx-5",
    date: "May 12",
    category: "Activities",
    description: "Cooking class with local chef",
    amount: 120
  }
];

const categoryEmoji: Record<ExpenseCategory, string> = {
  Food: "🍜",
  Transport: "🚕",
  Stay: "🏨",
  Activities: "⚡",
  Other: "🎁"
};

type ExpensesSurfaceProps = {
  tripId: string;
  tripName: string;
};

export function ExpensesSurface({ tripId, tripName }: ExpensesSurfaceProps) {
  const total = seedCategories.reduce((acc, entry) => acc + entry.amount, 0);
  const breakdown = seedCategories.map((entry) => ({
    ...entry,
    percent: total === 0 ? 0 : Math.round((entry.amount / total) * 100)
  }));

  return (
    <section className="px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8" data-testid="expenses-shell">
        <header>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#00565b]">
            {tripName}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.02em] text-slate-950 sm:text-4xl">
            Trip Expense Manager: {tripName}
          </h1>
        </header>

        <article className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-slate-950">
            Expense Breakdown
          </h2>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.45fr_0.55fr] lg:items-center">
            <DonutChart breakdown={breakdown} total={total} />
            <ul className="space-y-3">
              {breakdown.map((entry) => (
                <li className="flex items-center gap-3" key={entry.name}>
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="flex-1 text-sm font-semibold text-slate-700">
                    {entry.name}
                  </span>
                  <span className="text-sm font-extrabold text-slate-950">
                    {entry.percent}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
          <h2 className="text-lg font-extrabold tracking-[-0.02em] text-slate-950">
            Transaction History
          </h2>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">
                <th className="py-2">Date</th>
                <th className="py-2">Category</th>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {seedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-3 text-sm text-slate-500">{transaction.date}</td>
                  <td className="py-3 text-sm">
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold"
                      style={{ backgroundColor: "#ecfeff", color: "#0f766e" }}
                    >
                      <span aria-hidden="true">{categoryEmoji[transaction.category]}</span>
                      {transaction.category} ({transaction.description.split(" ").slice(-1)[0]})
                    </span>
                  </td>
                  <td className="py-3 text-sm italic text-slate-500">
                    {transaction.description}
                  </td>
                  <td className="py-3 text-right text-sm font-extrabold text-slate-950">
                    ${transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <p className="text-center text-xs text-slate-500">
          Demo expense surface · Trip {tripId} · Full settlement behavior comes in a later spec.
        </p>
      </div>
    </section>
  );
}

type DonutChartProps = {
  breakdown: { name: ExpenseCategory; amount: number; color: string; percent: number }[];
  total: number;
};

function DonutChart({ breakdown, total }: DonutChartProps) {
  const size = 220;
  const radius = 80;
  const stroke = 36;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg
        aria-label="Expense breakdown donut"
        className="h-full w-full -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={center}
          cy={center}
          fill="transparent"
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        {breakdown.map((entry) => {
          const length = (entry.percent / 100) * circumference;
          const segment = (
            <circle
              cx={center}
              cy={center}
              fill="transparent"
              key={entry.name}
              r={radius}
              stroke={entry.color}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={-offset}
              strokeWidth={stroke}
            />
          );
          offset += length;
          return segment;
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
          Total
        </span>
        <span className="mt-1 text-2xl font-extrabold text-slate-950">
          ${(total / 1000).toFixed(1)}k
        </span>
      </div>
    </div>
  );
}
