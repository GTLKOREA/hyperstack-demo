import type {
  ActiveDeal,
  CategoryMode,
  CommunicationChannel,
  CommunicationQueueItem,
  JOSAction,
  MatrixQuadrantKey,
  PendingDecision,
  WeightState,
} from "@/lib/jos-types";

const CHANNELS = ["Email", "SMS", "WhatsApp", "Telegram", "LinkedIn", "Slack / Teams", "KakaoTalk", "SNS DM"] as const;

export function deriveCategory(action: JOSAction): CategoryMode {
  const text = `${action.title} ${action.description ?? ""} ${action.actionType}`.toLowerCase();
  return /family|health|personal|home|weekend|private/.test(text) ? "private" : "business";
}

export function explainImportance(action: JOSAction): string {
  if (action.whyImportant) return action.whyImportant;
  if (action.linkedDecisionId) return "Decision is still pending and needs an executive call.";
  if (action.linkedDealId) return "Active deal momentum will stall without a next step.";
  if (action.actionType.includes("follow")) return "Follow-up is due and relationship momentum is at risk.";
  if (action.actionType.includes("response")) return "An explicit response is expected from you.";
  return "High-value operating item surfaced from daily workflow signals.";
}

export function formatDue(dueAt?: string): string {
  if (!dueAt) return "No due set";
  const date = new Date(dueAt);
  if (Number.isNaN(date.getTime())) return "No due set";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function scoreAction(action: JOSAction, mode: CategoryMode, weights: WeightState, snoozedIds: string[]): number {
  const category = deriveCategory(action);
  const modeWeight = category === mode ? weights[mode] : weights[category];
  const projectWeight = action.linkedProjectId ? weights.project : 24;
  const communicationWeight = action.linkedPersonId ? weights.communication : 20;
  const snoozePenalty = snoozedIds.includes(action.id) ? 38 : 0;
  const donePenalty = action.status === "done" ? 1000 : 0;

  return (
    action.priorityScore +
    action.importanceScore * 0.45 +
    action.urgencyScore * 0.35 +
    modeWeight * 0.18 +
    projectWeight * 0.1 +
    communicationWeight * 0.1 -
    snoozePenalty -
    donePenalty
  );
}

export function sortActions(actions: JOSAction[], mode: CategoryMode, weights: WeightState, snoozedIds: string[]) {
  return [...actions].sort(
    (left, right) => scoreAction(right, mode, weights, snoozedIds) - scoreAction(left, mode, weights, snoozedIds),
  );
}

export function groupByQuadrant(actions: JOSAction[]): Record<MatrixQuadrantKey, JOSAction[]> {
  const groups: Record<MatrixQuadrantKey, JOSAction[]> = {
    "high-importance-high-urgency": [],
    "high-importance-low-urgency": [],
    "low-importance-high-urgency": [],
    "low-importance-low-urgency": [],
  };

  for (const action of actions) {
    const importanceHigh = action.importanceScore >= 60;
    const urgencyHigh = action.urgencyScore >= 60;

    if (importanceHigh && urgencyHigh) groups["high-importance-high-urgency"].push(action);
    else if (importanceHigh) groups["high-importance-low-urgency"].push(action);
    else if (urgencyHigh) groups["low-importance-high-urgency"].push(action);
    else groups["low-importance-low-urgency"].push(action);
  }

  return groups;
}

export function buildCommunicationChannels(actions: JOSAction[]): CommunicationChannel[] {
  return CHANNELS.map((name) => {
    const messageCount = actions.filter((action) => mapChannel(action) === name).length;
    return {
      name,
      status: messageCount > 0 ? "live" : "watch",
      messageCount,
      capability:
        name === "SMS" || name === "KakaoTalk"
          ? "Domestic"
          : name === "LinkedIn" || name === "WhatsApp" || name === "Telegram"
            ? "Global"
            : "Domestic / Global",
    };
  });
}

export function buildCommunicationQueue(actions: JOSAction[]): CommunicationQueueItem[] {
  return actions
    .filter(isCommunicationAction)
    .slice(0, 8)
    .map((action) => ({
      id: action.id,
      personName: derivePersonLabel(action),
      region: deriveRegion(action),
      channel: mapChannel(action),
      requiredAction: action.title,
      category: deriveCategory(action),
    }));
}

export function summarizeDecision(decision: PendingDecision): string {
  return decision.description || decision.status || "Pending decision awaiting owner input.";
}

export function summarizeDeal(deal: ActiveDeal): string {
  return [deal.stage, deal.nextAction, deal.blocker].filter(Boolean).join(" · ") || "Deal is active and needs executive visibility.";
}

export function isCommunicationAction(action: JOSAction): boolean {
  return /reply|respond|follow|email|message|call|meeting|intro|investor/i.test(`${action.title} ${action.actionType}`);
}

function mapChannel(action: JOSAction): string {
  const text = `${action.title} ${action.description ?? ""} ${action.actionType}`.toLowerCase();
  if (/kakao/.test(text)) return "KakaoTalk";
  if (/telegram/.test(text)) return "Telegram";
  if (/whatsapp/.test(text)) return "WhatsApp";
  if (/linkedin/.test(text)) return "LinkedIn";
  if (/slack|teams/.test(text)) return "Slack / Teams";
  if (/sms|text/.test(text)) return "SMS";
  if (/instagram|sns|dm/.test(text)) return "SNS DM";
  return "Email";
}

function deriveRegion(action: JOSAction): "domestic" | "global" {
  const text = `${action.title} ${action.description ?? ""}`.toLowerCase();
  return /global|singapore|tokyo|japan|us|america|europe|dubai/.test(text) ? "global" : "domestic";
}

function derivePersonLabel(action: JOSAction): string {
  if (action.linkedPersonId) return `Contact ${action.linkedPersonId.slice(0, 4)}`;
  const firstToken = action.title.split(" ").slice(0, 2).join(" ");
  return firstToken || "Key contact";
}
