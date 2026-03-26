"use client";

import { groupByQuadrant } from "@/lib/jos-presenters";
import type { JOSAction, MatrixQuadrantKey } from "@/lib/jos-types";

const quadrantMeta: Record<MatrixQuadrantKey, { title: string; tone: string }> = {
  "high-importance-high-urgency": { title: "High importance / High urgency", tone: "bg-[#fff7ed] text-[#c2410c]" },
  "high-importance-low-urgency": { title: "High importance / Low urgency", tone: "bg-[#f0fdf4] text-[#15803d]" },
  "low-importance-high-urgency": { title: "Low importance / High urgency", tone: "bg-[#eff6ff] text-[#1d4ed8]" },
  "low-importance-low-urgency": { title: "Low importance / Low urgency", tone: "bg-[#f8fafc] text-[#475569]" },
};

export function MatrixView({ actions }: { actions: JOSAction[] }) {
  const quadrants = groupByQuadrant(actions);

  return (
    <section className="jos-glass p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Importance / Urgency Matrix</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">Where the day is leaning</h3>
        </div>
        <span className="text-sm text-[var(--muted)]">{actions.length} surfaced actions</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(quadrants) as MatrixQuadrantKey[]).map((key) => (
          <div key={key} className="rounded-[24px] border border-[var(--line)] bg-white/75 p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-[var(--ink-strong)]">{quadrantMeta[key].title}</h4>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${quadrantMeta[key].tone}`}>
                {quadrants[key].length}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {quadrants[key].slice(0, 3).map((action) => (
                <div key={action.id} className="rounded-[18px] bg-[var(--panel-strong)] px-3 py-2 text-sm text-[var(--ink)]">
                  {action.title}
                </div>
              ))}
              {quadrants[key].length === 0 ? <p className="text-sm text-[var(--muted)]">No actions in this quadrant.</p> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

