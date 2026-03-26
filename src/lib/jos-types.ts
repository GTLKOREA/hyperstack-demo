export type CategoryMode = "business" | "private";

export type JOSAction = {
  id: string;
  title: string;
  description?: string;
  whyImportant?: string;
  dueAt?: string;
  importanceScore: number;
  urgencyScore: number;
  priorityScore: number;
  actionType: string;
  status: string;
  sourceRecordId?: string;
  linkedProjectId?: string;
  linkedPersonId?: string;
  linkedDecisionId?: string;
  linkedDealId?: string;
  category?: CategoryMode;
};

export type PendingDecision = {
  id: string;
  title: string;
  description?: string;
  status?: string;
  dueAt?: string;
};

export type ActiveDeal = {
  id: string;
  title: string;
  stage?: string;
  owner?: string;
  nextAction?: string;
  blocker?: string;
};

export type DailySummary = {
  keyActions: Array<Pick<JOSAction, "id" | "title">>;
  pendingDecisions: PendingDecision[];
  overdueActions: Array<Pick<JOSAction, "id" | "title">>;
  followUpDue: Array<Pick<JOSAction, "id" | "title">>;
};

export type DashboardToday = {
  topPriorityActions: JOSAction[];
  pendingDecisions: PendingDecision[];
  followUpsDue: JOSAction[];
  activeDeals: ActiveDeal[];
  dailySummary?: DailySummary;
};

export type WeightState = {
  business: number;
  private: number;
  project: number;
  communication: number;
};

export type MatrixQuadrantKey =
  | "high-importance-high-urgency"
  | "high-importance-low-urgency"
  | "low-importance-high-urgency"
  | "low-importance-low-urgency";

export type ChannelStatus = "live" | "watch";

export type CommunicationChannel = {
  name: string;
  status: ChannelStatus;
  messageCount: number;
  capability: "Domestic" | "Global" | "Domestic / Global";
};

export type CommunicationQueueItem = {
  id: string;
  personName: string;
  region: "domestic" | "global";
  channel: string;
  requiredAction: string;
  category: CategoryMode;
};

