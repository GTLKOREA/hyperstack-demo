"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import { Dashboard } from "@/components/jos/dashboard";
import {
  completeAction,
  fetchActions,
  fetchDailySummary,
  fetchTodayDashboard,
  updatePersonWeight,
  updateProjectWeight,
} from "@/lib/jos-api";
import { sortActions } from "@/lib/jos-presenters";
import type { CategoryMode, DashboardToday, DailySummary, JOSAction, WeightState } from "@/lib/jos-types";

const DEFAULT_WORKSPACE_ID = "11111111-1111-1111-1111-111111111111";
const DEFAULT_PERSONA_ID = "22222222-2222-2222-2222-222222222221";

const DEFAULT_WEIGHTS: WeightState = {
  business: 76,
  private: 38,
  project: 62,
  communication: 68,
};

function getDefaultMode(): CategoryMode {
  const day = new Date().getDay();
  return day === 0 || day === 6 ? "private" : "business";
}

export function DashboardShell() {
  const [mode, setMode] = useState<CategoryMode>(getDefaultMode);
  const [weights, setWeights] = useState<WeightState>(DEFAULT_WEIGHTS);
  const [today, setToday] = useState<DashboardToday | null>(null);
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [actions, setActions] = useState<JOSAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<JOSAction | null>(null);
  const [snoozedIds, setSnoozedIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function refreshAll() {
    try {
      setError(null);
      const [todayPayload, summaryPayload, actionsPayload] = await Promise.all([
        fetchTodayDashboard(DEFAULT_WORKSPACE_ID, DEFAULT_PERSONA_ID),
        fetchDailySummary(DEFAULT_WORKSPACE_ID, DEFAULT_PERSONA_ID),
        fetchActions(DEFAULT_WORKSPACE_ID, DEFAULT_PERSONA_ID),
      ]);

      setToday(todayPayload);
      setSummary(summaryPayload);
      setActions(actionsPayload);
      setSelectedAction((current) => {
        if (!current) return actionsPayload[0] ?? todayPayload.topPriorityActions[0] ?? null;
        return actionsPayload.find((item) => item.id === current.id) ?? todayPayload.topPriorityActions[0] ?? actionsPayload[0] ?? null;
      });
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load JOS dashboard.");
    }
  }

  useEffect(() => {
    void refreshAll();
  }, []);

  const orderedActions = useMemo(() => {
    const actionPool = actions.length > 0 ? actions : today?.topPriorityActions ?? [];
    return sortActions(actionPool, mode, weights, snoozedIds)
      .filter((action) => action.status !== "done")
      .slice(0, 7);
  }, [actions, mode, snoozedIds, today, weights]);

  const focusActions = orderedActions.slice(0, 5);

  function handleComplete(actionId: string) {
    startTransition(async () => {
      try {
        await completeAction(actionId);
        await refreshAll();
      } catch (completionError) {
        setError(completionError instanceof Error ? completionError.message : "Unable to complete action.");
      }
    });
  }

  function handleDelay(actionId: string) {
    setSnoozedIds((current) => Array.from(new Set([...current, actionId])));
  }

  function handleModeChange(nextMode: CategoryMode) {
    setMode(nextMode);
    setWeights((current) => ({
      ...current,
      business: nextMode === "business" ? Math.max(current.business, 72) : Math.min(current.business, 54),
      private: nextMode === "private" ? Math.max(current.private, 72) : Math.min(current.private, 54),
    }));
  }

  async function handleWeightChange(key: keyof WeightState, value: number) {
    setWeights((current) => ({ ...current, [key]: value }));

    try {
      if (key === "project") {
        const linkedProjectAction = orderedActions.find((action) => action.linkedProjectId);
        if (linkedProjectAction?.linkedProjectId) {
          await updateProjectWeight(linkedProjectAction.linkedProjectId, value);
        }
      }

      if (key === "communication") {
        const linkedPersonAction = orderedActions.find((action) => action.linkedPersonId);
        if (linkedPersonAction?.linkedPersonId) {
          await updatePersonWeight(linkedPersonAction.linkedPersonId, value);
        }
      }

      await refreshAll();
    } catch (weightError) {
      setError(weightError instanceof Error ? weightError.message : "Unable to update weights.");
    }
  }

  return (
    <Dashboard
      mode={mode}
      weights={weights}
      isRefreshing={isPending}
      error={error}
      focusActions={focusActions}
      surfacedActions={orderedActions}
      today={today}
      summary={summary}
      selectedAction={selectedAction}
      onModeChange={handleModeChange}
      onWeightChange={handleWeightChange}
      onComplete={handleComplete}
      onDelay={handleDelay}
      onViewDetail={setSelectedAction}
      onRefresh={() => {
        startTransition(async () => {
          await refreshAll();
        });
      }}
    />
  );
}

