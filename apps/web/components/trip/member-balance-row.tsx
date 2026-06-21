import { cn } from "@/src/lib/utils";

type MemberBalanceRowProps = {
  name: string;
  initial: string;
  amount: number;
  tone: "gets" | "owes";
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
        "flex items-center gap-3 py-3",
        className
      )}
      data-testid="member-balance-row"
      data-tone={tone}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold",
          toneFor(initial)
        )}
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
