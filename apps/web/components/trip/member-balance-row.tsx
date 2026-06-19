import { cn } from "@/src/lib/utils";

type MemberBalanceRowProps = {
  name: string;
  initial: string;
  amount: number;
  tone: "gets" | "owes";
  className?: string;
};

export function MemberBalanceRow({
  name,
  initial,
  amount,
  tone,
  className
}: MemberBalanceRowProps) {
  const positive = tone === "gets";
  return (
    <article
      className={cn(
        "flex items-center gap-3 py-2",
        className
      )}
      data-testid="member-balance-row"
      data-tone={tone}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper-100 text-sm font-semibold text-ink-700 ring-1 ring-paper-200"
      >
        {initial}
      </span>
      <span className="flex-1 text-sm font-semibold text-ink-950">{name}</span>
      <span
        className={cn(
          "text-sm font-semibold",
          positive ? "text-forest-800" : "text-terracotta-500"
        )}
      >
        {positive ? "Gets" : "Owes"} ${amount.toFixed(0)}
      </span>
    </article>
  );
}
