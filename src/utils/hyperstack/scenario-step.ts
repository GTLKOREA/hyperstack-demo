import type { LayerId, ScenarioEvent, ScenarioId, ViewId } from "@/types/hyperstack";

const layerCodeMap: Record<string, LayerId> = {
  L1: "l1-physical",
  L2: "l2-aimeps",
  L3: "l3-gtl-link",
  L4: "l4-ashs",
  L5: "l5-financial-protocol",
  L6: "l6-eop-platform",
};

export interface PresentationStepLike {
  sequence: number;
  timestamp: string;
  view: ViewId;
  focusLayers: string[];
  caption: string;
}

export function parseScenarioStepIndex(step: number, totalSteps: number) {
  if (totalSteps <= 0) {
    return 0;
  }

  return Math.min(Math.max(step, 0), totalSteps - 1);
}

export function parseScenarioStepLabel(step: number, totalSteps: number) {
  return `${parseScenarioStepIndex(step, totalSteps) + 1} / ${Math.max(totalSteps, 1)}`;
}

export function parseStepFocusLayers(step: PresentationStepLike | null | undefined): LayerId[] {
  if (!step) {
    return [];
  }

  return step.focusLayers
    .map((code) => layerCodeMap[code])
    .filter((layerId): layerId is LayerId => Boolean(layerId));
}

export function parseScenarioEventSummary(event: ScenarioEvent) {
  return {
    title: event.title,
    timestamp: event.timestamp,
    layerId: event.layerId,
    flowId: event.flowId,
    caption: event.caption,
  };
}

export function isScenarioMatch(activeScenarioId: ScenarioId, targetScenarioId: ScenarioId) {
  return activeScenarioId === targetScenarioId;
}
