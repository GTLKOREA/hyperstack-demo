"use client";

import { deriveCategory, formatDue } from "@/lib/jos-presenters";
import type { JOSAction } from "@/lib/jos-types";

type ActionCardProps = {
  action: JOSAction;
  rank: number;
  reason: string;
  onComplete: (id: string) => void;
  onDelay: (id: string) => void;
  onViewDetail: (action: JOSAction) => void;
};

export function ActionCard({ action, rank, reason, onComplete, onDelay, onViewDetail }: ActionCardProps) {
  const category = deriveCategory(action);

  return (
    <article className="rounded-[28px] border border-[var(--line)] bg-white/80 p-5 shadow-[0_22px_44px_rgba(15,23,42,0.06)] transition hover:border-[var(--accent)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--panel-strong)] text-sm font-semibold text-[var(--ink-strong)]">
            {rank}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">{action.title}</h3>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                category === "business" ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[#eef2ff] text-[#4338ca]"
              }`}>
                {category}
              </span>
            </div>
            <p className="max-w-2xl text-sm text-[var(--muted)]">{reason}</p>
            <div className="flex flex-wrap gap-2 text-xs font-medium">
              <span className="rounded-full bg-[var(--panel-strong)] px-3 py-1 text-[var(--muted)]">Importance {action.importanceScore}</span>
              <span className="rounded-full bg-[var(--panel-strong)] px-3 py-1 text-[var(--muted)]">Urgency {action.urgencyScore}</span>
              <span className="rounded-full bg-[var(--panel-strong)] px-3 py-1 text-[var(--muted)]">Due {formatDue(action.dueAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
          <button
            type="button"
            onClick={() => onViewDetail(action)}
            className="rounded-full border border-[var(--line)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)]"
          >
            View detail
          </button>
          <button
            type="button"
            onClick={() => onDelay(action.id)}
            className="rounded-full border border-[var(--line)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)]"
          >
            Delay
          </button>
          <button
            type="button"
            onClick={() => onComplete(action.id)}
            className="rounded-full bg-[var(--ink-strong)] px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[#0f172a]"
          >
            Complete
          </button>
        </div>
      </div>
    </article>
  );
}

