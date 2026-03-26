import type { ViewId } from '@/types/hyperstack';

export const views: Array<{ id: ViewId; label: string; kicker: string }> = [
  { id: "value-flow", label: "Value Flow View", kicker: "Investor storyline" },
  { id: "architecture", label: "Architecture Overview", kicker: "System stack" },
  { id: "sequence", label: "Sequence Flow Player", kicker: "Event timeline" },
  { id: "comparison", label: "Scenario Comparison", kicker: "Stress matrix" },
  { id: "dashboard", label: "KPI Dashboard", kicker: "Live operating lens" },
  { id: "map", label: "Global Map", kicker: "Regional orchestration" },
];
