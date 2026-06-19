import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/src/lib/utils";

type AiAssistantCardProps = {
  title?: string;
  body: string;
  primaryAction?: { label: string; onClick?: () => void; href?: string };
  secondaryAction?: { label: string; onClick?: () => void; href?: string };
  children?: ReactNode;
  className?: string;
};

export function AiAssistantCard({
  title = "AI Assistant Tip",
  body,
  primaryAction,
  secondaryAction,
  children,
  className
}: AiAssistantCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-amber-100 p-5 ring-1 ring-amber-400/40",
        className
      )}
      data-testid="ai-assistant-card"
    >
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
      {children}
      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center gap-2">
          {primaryAction ? (
            <button
              className="inline-flex items-center justify-center rounded-full bg-forest-800 px-4 py-2 text-xs font-semibold text-white transition hover:bg-forest-700"
              data-testid="ai-assistant-primary"
              type="button"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </button>
          ) : null}
          {secondaryAction ? (
            <button
              className="inline-flex items-center justify-center rounded-full border border-forest-800/30 bg-paper-50 px-4 py-2 text-xs font-semibold text-forest-800 transition hover:border-forest-800/60"
              data-testid="ai-assistant-secondary"
              type="button"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          ) : null}
        </div>
      )}
    </article>
  );
}
