import { cn } from "@/src/lib/utils";

export type BudgetSlice = {
  name: string;
  amount: number;
  color: string;
};

type BudgetUsageBarProps = {
  slices: BudgetSlice[];
  total: number;
  caption?: string;
  className?: string;
};

export function BudgetUsageBar({
  slices,
  total,
  caption,
  className
}: BudgetUsageBarProps) {
  const safeTotal = total > 0 ? total : 1;
  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      data-testid="budget-usage-bar"
    >
      <div
        aria-label="Budget usage bar"
        className="flex h-3 w-full overflow-hidden rounded-full bg-paper-200"
        role="img"
      >
        {slices.map((slice) => {
          const width = Math.max(0, Math.min(100, (slice.amount / safeTotal) * 100));
          if (width === 0) {
            return null;
          }
          return (
            <div
              aria-label={`${slice.name} ${width.toFixed(0)}%`}
              className="h-full"
              data-testid={`budget-slice-${slice.name.toLowerCase()}`}
              key={slice.name}
              style={{
                backgroundColor: slice.color,
                width: `${width}%`
              }}
            />
          );
        })}
      </div>
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-700">
        {slices.map((slice) => (
          <li className="flex items-center gap-2" key={slice.name}>
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            {slice.name} (${slice.amount.toFixed(0)})
          </li>
        ))}
      </ul>
      {caption ? (
        <p className="text-xs font-medium text-ink-500">{caption}</p>
      ) : null}
    </div>
  );
}
