"use client";

import { ActionCard } from "@/components/jos/action-card";
import { CommunicationHub } from "@/components/jos/communication-hub";
import { MatrixView } from "@/components/jos/matrix-view";
import { WeightControl } from "@/components/jos/weight-control";
import {
  buildCommunicationChannels,
  buildCommunicationQueue,
  explainImportance,
  formatDue,
  summarizeDeal,
  summarizeDecision,
} from "@/lib/jos-presenters";
import type { CategoryMode, DashboardToday, DailySummary, JOSAction, WeightState } from "@/lib/jos-types";

type DashboardProps = {
  mode: CategoryMode;
  weights: WeightState;
  isRefreshing: boolean;
  error: string | null;
  focusActions: JOSAction[];
  surfacedActions: JOSAction[];
  today: DashboardToday | null;
  summary: DailySummary | null;
  selectedAction: JOSAction | null;
  onModeChange: (mode: CategoryMode) => void;
  onWeightChange: (key: keyof WeightState, value: number) => void;
  onComplete: (id: string) => void;
  onDelay: (id: string) => void;
  onViewDetail: (action: JOSAction) => void;
  onRefresh: () => void;
};

export function Dashboard({
  mode,
  weights,
  isRefreshing,
  error,
  focusActions,
  surfacedActions,
  today,
  summary,
  selectedAction,
  onModeChange,
  onWeightChange,
  onComplete,
  onDelay,
  onViewDetail,
  onRefresh,
}: DashboardProps) {
  const channels = buildCommunicationChannels(surfacedActions);
  const queue = buildCommunicationQueue(surfacedActions);
  const pendingDecisions = (today?.pendingDecisions ?? []).slice(0, 4);
  const activeDeals = (today?.activeDeals ?? []).slice(0, 4);
  const followUpsDue = surfacedActions.filter((action) => action.actionType.includes("follow") || action.actionType.includes("response")).slice(0, 4);

  return (
    <main className="jos-shell jos-grid-bg min-h-screen px-4 py-6 text-[var(--ink)] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
        <header className="jos-glass flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">Johney Operating System</p>
            <div className="flex flex-wrap items-end gap-3">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--ink-strong)] sm:text-4xl">Executive daily operating system</h1>
              <span className="rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-medium text-[var(--muted)]">
                {isRefreshing ? "Refreshing live board" : "Live from backend"}
              </span>
            </div>
            <p className="max-w-2xl text-sm text-[var(--muted)]">
              Open JOS before inbox. See the top actions, clear pending decisions, and keep every critical follow-up moving.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:items-end">
            <div className="inline-flex rounded-full border border-white/60 bg-white/70 p-1 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
              {(["business", "private"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onModeChange(item)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    mode === item ? "bg-[var(--ink-strong)] text-white" : "text-[var(--muted)] hover:text-[var(--ink-strong)]"
                  }`}
                >
                  {item === "business" ? "Business mode" : "Private mode"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--ink-strong)]"
            >
              Refresh board
            </button>
          </div>
        </header>

        {error ? (
          <div className="rounded-[24px] border border-[#fecaca] bg-[#fff1f2] px-5 py-4 text-sm text-[#9f1239]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
          <section className="flex flex-col gap-6">
            <div className="jos-glass p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Top Focus Board</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">Top 5 actions for today</h2>
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">3-second scan</span>
              </div>
              <div className="grid gap-4">
                {focusActions.map((action, index) => (
                  <ActionCard
                    key={action.id}
                    action={action}
                    rank={index + 1}
                    reason={explainImportance(action)}
                    onComplete={onComplete}
                    onDelay={onDelay}
                    onViewDetail={onViewDetail}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="jos-glass p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Pending Decisions</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">What needs a call now</h3>
                  </div>
                  <span className="text-sm text-[var(--muted)]">{pendingDecisions.length} active</span>
                </div>
                <div className="space-y-3">
                  {pendingDecisions.map((decision) => (
                    <div key={decision.id} className="rounded-[22px] border border-[var(--line)] bg-white/75 p-4">
                      <p className="font-medium text-[var(--ink-strong)]">{decision.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{summarizeDecision(decision)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="jos-glass p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Follow-up Due</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">Who needs a response</h3>
                  </div>
                  <span className="text-sm text-[var(--muted)]">{followUpsDue.length} queued</span>
                </div>
                <div className="space-y-3">
                  {followUpsDue.map((action) => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => onViewDetail(action)}
                      className="flex w-full items-start justify-between rounded-[22px] border border-[var(--line)] bg-white/75 p-4 text-left transition hover:border-[var(--accent)]"
                    >
                      <div>
                        <p className="font-medium text-[var(--ink-strong)]">{action.title}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{explainImportance(action)}</p>
                      </div>
                      <span className="text-sm font-medium text-[var(--accent)]">{formatDue(action.dueAt)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <MatrixView actions={surfacedActions} />
            <CommunicationHub channels={channels} queue={queue} mode={mode} />
          </section>

          <aside className="flex flex-col gap-6">
            <WeightControl mode={mode} weights={weights} onChange={onWeightChange} />

            <div className="jos-glass p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Daily Summary</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">Command brief</h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] bg-[var(--panel-strong)] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Key actions</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--ink-strong)]">{summary?.keyActions?.length ?? focusActions.length}</p>
                </div>
                <div className="rounded-[22px] bg-[var(--panel-strong)] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Overdue</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--ink-strong)]">{summary?.overdueActions?.length ?? 0}</p>
                </div>
                <div className="rounded-[22px] bg-[var(--panel-strong)] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Pending decisions</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--ink-strong)]">{summary?.pendingDecisions?.length ?? pendingDecisions.length}</p>
                </div>
                <div className="rounded-[22px] bg-[var(--panel-strong)] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Follow-up due</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--ink-strong)]">{summary?.followUpDue?.length ?? followUpsDue.length}</p>
                </div>
              </div>
              <div className="mt-5 rounded-[24px] border border-[var(--line)] bg-white/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Today&apos;s core brief</p>
                <ul className="mt-3 space-y-2 text-sm text-[var(--ink)]">
                  {(summary?.keyActions ?? focusActions).slice(0, 5).map((item: any, index: number) => (
                    <li key={item.id ?? `${item.title}-${index}`} className="flex gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="jos-glass p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Active Deals</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">Live commercial momentum</h3>
                </div>
                <span className="text-sm text-[var(--muted)]">{activeDeals.length} tracked</span>
              </div>
              <div className="space-y-3">
                {activeDeals.map((deal) => (
                  <div key={deal.id} className="rounded-[22px] border border-[var(--line)] bg-white/75 p-4">
                    <p className="font-medium text-[var(--ink-strong)]">{deal.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{summarizeDeal(deal)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="jos-glass p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Action Detail</p>
              {selectedAction ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">{selectedAction.title}</h3>
                    <p className="mt-2 text-sm text-[var(--muted)]">{explainImportance(selectedAction)}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[20px] bg-[var(--panel-strong)] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Due</p>
                      <p className="mt-2 font-medium text-[var(--ink-strong)]">{formatDue(selectedAction.dueAt)}</p>
                    </div>
                    <div className="rounded-[20px] bg-[var(--panel-strong)] p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Status</p>
                      <p className="mt-2 font-medium capitalize text-[var(--ink-strong)]">{selectedAction.status.replaceAll("_", " ")}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => onComplete(selectedAction.id)}
                      className="flex-1 rounded-full bg-[var(--ink-strong)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#0f172a]"
                    >
                      Complete
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelay(selectedAction.id)}
                      className="flex-1 rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--accent)]"
                    >
                      Delay
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-[var(--muted)]">Select an action to review its detail.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

