import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

type SettlementRowProps = {
  debtorName: string;
  debtorInitial: string;
  creditorName: string;
  amount: number;
  className?: string;
};

export function SettlementRow({
  debtorName,
  debtorInitial,
  creditorName,
  amount,
  className
}: SettlementRowProps) {
  return (
    <article
      className={cn(
        "flex items-center gap-3 rounded-2xl bg-paper-50 px-4 py-3 ring-1 ring-paper-200",
        className
      )}
      data-testid="settlement-row"
    >
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sage-200 text-sm font-semibold text-forest-800"
      >
        {debtorInitial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-950">
          {debtorName} owes {creditorName}
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta-500">
          ${amount.toFixed(2)}
        </p>
      </div>
      <Check aria-hidden="true" className="h-5 w-5 text-forest-800" />
    </article>
  );
}
