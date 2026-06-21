import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";

type SettlementRowProps = {
  debtorName: string;
  debtorInitial: string;
  creditorName: string;
  amount: number;
  className?: string;
};

const AVATAR_TONES = [
  "bg-sage-200 text-forest-800",
  "bg-amber-100 text-amber-500",
  "bg-terracotta-100 text-terracotta-500",
  "bg-paper-200 text-ink-700"
];

function toneFor(initial: string) {
  const code = initial.toUpperCase().charCodeAt(0);
  return AVATAR_TONES[code % AVATAR_TONES.length];
}

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
        "flex items-center gap-3 rounded-2xl bg-paper-100 px-4 py-3",
        className
      )}
      data-testid="settlement-row"
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
          toneFor(debtorInitial)
        )}
      >
        {debtorInitial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-950">
          {debtorName} owes {creditorName}
        </p>
        <p className="text-xs font-semibold text-terracotta-500">
          ${amount.toFixed(2)}
        </p>
      </div>
      <Check aria-hidden="true" className="h-5 w-5 text-forest-800" />
    </article>
  );
}
