import type { LucideIcon } from "lucide-react";
import { Coffee, Fuel, MapPin, Receipt, Utensils, Wallet } from "lucide-react";

import { TripStatusChip, type TripStatusTone } from "@/components/trip/trip-status-chip";
import { cn } from "@/src/lib/utils";

export type TransactionCategory =
  | "fuel"
  | "food"
  | "stay"
  | "tickets"
  | "transport"
  | "other";

const CATEGORY_ICON: Record<TransactionCategory, LucideIcon> = {
  fuel: Fuel,
  food: Utensils,
  stay: MapPin,
  tickets: Receipt,
  transport: Coffee,
  other: Wallet
};

const CATEGORY_TONE: Record<TransactionCategory, "fuel" | "default"> = {
  fuel: "fuel",
  food: "default",
  stay: "default",
  tickets: "default",
  transport: "default",
  other: "default"
};

export type TransactionStatus = "settled" | "pending" | "needs-transfer";

const STATUS_TONE: Record<TransactionStatus, TripStatusTone> = {
  settled: "settled",
  pending: "pending",
  "needs-transfer": "needs-transfer"
};

const STATUS_LABEL: Record<TransactionStatus, string> = {
  settled: "Settled",
  pending: "Pending",
  "needs-transfer": "Needs transfer"
};

type TransactionRowProps = {
  title: string;
  paidBy: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  status: TransactionStatus;
  className?: string;
};

export function TransactionRow({
  title,
  paidBy,
  date,
  amount,
  category,
  status,
  className
}: TransactionRowProps) {
  const Icon = CATEGORY_ICON[category];
  const tone = CATEGORY_TONE[category];
  return (
    <article
      className={cn(
        "flex items-center gap-4 rounded-2xl bg-paper-50 px-4 py-4 ring-1 ring-paper-200 transition hover:ring-sage-300",
        className
      )}
      data-testid="transaction-row"
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
          tone === "fuel"
            ? "bg-terracotta-100 text-terracotta-500"
            : "bg-sage-100 text-forest-800"
        )}
      >
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-ink-950">{title}</h3>
        <p className="text-xs font-medium text-ink-500">
          Paid by {paidBy} • {date}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="text-base font-semibold text-ink-950">
          ${amount.toFixed(2)}
        </span>
        <TripStatusChip tone={STATUS_TONE[status]}>
          {STATUS_LABEL[status]}
        </TripStatusChip>
      </div>
    </article>
  );
}
