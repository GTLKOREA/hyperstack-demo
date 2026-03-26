import type { DashboardToday, DailySummary, JOSAction, PendingDecision, ActiveDeal } from "@/lib/jos-types";

const API_BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function fetchTodayDashboard(workspaceId: string, personaId: string): Promise<DashboardToday> {
  const payload = await request<any>(`/dashboard/today?workspaceId=${workspaceId}&personaId=${personaId}`);
  return {
    topPriorityActions: normalizeActions(payload?.topPriorityActions ?? payload?.topActions ?? payload?.actions ?? []),
    pendingDecisions: normalizeDecisions(payload?.pendingDecisions ?? []),
    followUpsDue: normalizeActions(payload?.followUpsDue ?? payload?.urgentActions ?? []),
    activeDeals: normalizeDeals(payload?.activeDeals ?? payload?.deals ?? []),
    dailySummary: payload?.dailySummary ? normalizeDailySummary(payload.dailySummary) : undefined,
  };
}

export async function fetchDailySummary(workspaceId: string, personaId: string): Promise<DailySummary> {
  const payload = await request<any>(`/dashboard/daily-summary?workspaceId=${workspaceId}&personaId=${personaId}`);
  return normalizeDailySummary(payload);
}

export async function fetchActions(workspaceId: string, personaId: string): Promise<JOSAction[]> {
  const payload = await request<unknown>(`/actions?workspaceId=${workspaceId}&personaId=${personaId}`);
  return normalizeActions(payload);
}

export async function completeAction(actionId: string) {
  return request<void>(`/actions/${actionId}/complete`, {
    method: "PATCH",
  });
}

export async function updateProjectWeight(projectId: string, weight: number) {
  return request<void>(`/projects/${projectId}/weight`, {
    method: "PATCH",
    body: JSON.stringify({ weight }),
  });
}

export async function updatePersonWeight(personId: string, weight: number) {
  return request<void>(`/persons/${personId}/weight`, {
    method: "PATCH",
    body: JSON.stringify({ weight }),
  });
}

export function normalizeActions(input: unknown): JOSAction[] {
  if (!Array.isArray(input)) return [];

  return input.map((item: any) => ({
    id: String(item.id),
    title: item.title ?? item.name ?? "Untitled action",
    description: item.description ?? "",
    whyImportant: item.whyImportant ?? item.reason ?? "",
    dueAt: item.dueAt ?? item.due ?? undefined,
    importanceScore: Number(item.importanceScore ?? item.importance ?? 50),
    urgencyScore: Number(item.urgencyScore ?? item.urgency ?? 50),
    priorityScore: Number(item.priorityScore ?? item.priority ?? 50),
    actionType: item.actionType ?? "task",
    status: item.status ?? "active",
    sourceRecordId: item.sourceRecordId ?? undefined,
    linkedProjectId: item.linkedProjectId ?? undefined,
    linkedPersonId: item.linkedPersonId ?? undefined,
    linkedDecisionId: item.linkedDecisionId ?? undefined,
    linkedDealId: item.linkedDealId ?? undefined,
  }));
}

export function normalizeDecisions(input: unknown): PendingDecision[] {
  if (!Array.isArray(input)) return [];

  return input.map((item: any) => ({
    id: String(item.id),
    title: item.title ?? "Pending decision",
    description: item.description ?? "",
    status: item.status ?? "pending",
    dueAt: item.dueAt ?? item.due ?? undefined,
  }));
}

export function normalizeDeals(input: unknown): ActiveDeal[] {
  if (!Array.isArray(input)) return [];

  return input.map((item: any) => ({
    id: String(item.id),
    title: item.title ?? item.name ?? "Active deal",
    stage: item.stage ?? "active",
    owner: item.owner ?? item.ownerName ?? undefined,
    nextAction: item.nextAction ?? item.next_step ?? undefined,
    blocker: item.blocker ?? undefined,
  }));
}

function normalizeDailySummary(input: any): DailySummary {
  return {
    keyActions: (input?.keyActions ?? input?.topActions ?? []).map((item: any) => ({
      id: String(item.id ?? item.title ?? Math.random()),
      title: item.title ?? "Key action",
    })),
    pendingDecisions: normalizeDecisions(input?.pendingDecisions ?? []),
    overdueActions: (input?.overdueActions ?? []).map((item: any) => ({
      id: String(item.id ?? item.title ?? Math.random()),
      title: item.title ?? "Overdue action",
    })),
    followUpDue: (input?.followUpDue ?? input?.followUpsDue ?? []).map((item: any) => ({
      id: String(item.id ?? item.title ?? Math.random()),
      title: item.title ?? "Follow-up",
    })),
  };
}

