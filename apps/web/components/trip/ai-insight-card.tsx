import { Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

type AiInsightCardProps = {
  title?: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function AiInsightCard({
  title = "AI Insight",
  body,
  actionLabel,
  onAction,
  className
}: AiInsightCardProps) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl bg-amber-100 p-5 ring-1 ring-amber-400/40",
        className
      )}
      data-testid="ai-insight-card"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-amber-100"
          >
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-500">
            {title}
          </h3>
        </div>
        <p className="text-sm leading-6 text-ink-950">{body}</p>
        {actionLabel ? (
          <button
            className="self-start text-sm font-semibold text-forest-800 underline-offset-4 hover:underline"
            data-testid="ai-insight-action"
            type="button"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-400/20"
      />
    </article>
  );
}
