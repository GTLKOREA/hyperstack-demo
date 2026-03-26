import { flows, layers, scenarios as baseScenarios } from "@/data/hyperstack";
import scenarioFile from "@/data/hyperstack/json/scenarios.json";
import kpiFile from "@/data/hyperstack/json/kpis.json";
import type {
  EventLogEntry,
  FlowDefinition,
  FlowId,
  LayerDefinition,
  LayerId,
  ScenarioDefinition,
  ScenarioEvent,
  ScenarioId,
  ScenarioKpi,
} from "@/types/hyperstack";

interface ScenarioTimelineStepJson {
  step: number;
  timestamp: string;
  title: string;
  layerFocus: string[];
  message: string;
}

interface ScenarioJson {
  id: ScenarioId;
  name: string;
  summary: string;
  narrative: string;
  accent: string;
  primaryFlow: FlowId;
  timeline: ScenarioTimelineStepJson[];
}

interface ScenarioFileJson {
  scenarios: ScenarioJson[];
}

interface KpiSeriesJson {
  label: string;
  unit: string;
  values: number[];
  latest: number;
  deltaVsBaseline: number;
}

interface ScenarioKpiJson {
  displayName: string;
  series: Record<string, KpiSeriesJson>;
}

interface KpiFileJson {
  timeAxis: string[];
  scenarios: Partial<Record<ScenarioId, ScenarioKpiJson>>;
}

export interface ScenarioStepState {
  scenario: ScenarioDefinition;
  event: ScenarioEvent;
  currentFlowId: FlowId;
  currentKpiSnapshot: ScenarioKpi[];
  eventLogs: EventLogEntry[];
  selectedLayerId: LayerId;
  activeLayerIds: LayerId[];
  currentStep: number;
  totalSteps: number;
}

export interface ScenarioEngine {
  getScenario: (id: ScenarioId) => ScenarioDefinition;
  getScenarioEvent: (scenario: ScenarioDefinition, stepIndex: number) => ScenarioEvent;
  getStepState: (scenarioId: ScenarioId, stepIndex: number, selectedLayerOverride?: LayerId) => ScenarioStepState;
  nextStep: (scenarioId: ScenarioId, stepIndex: number) => number;
  previousStep: (scenarioId: ScenarioId, stepIndex: number) => number;
  resetStep: () => number;
  getAvailableScenarios: () => ScenarioDefinition[];
}

const runtimeScenarioFile = scenarioFile as ScenarioFileJson;
const runtimeKpiFile = kpiFile as KpiFileJson;

const baseScenarioIndex = new Map<ScenarioId, ScenarioDefinition>(
  baseScenarios.map((scenario) => [scenario.id, scenario]),
);

export const layerIndex = new Map<LayerDefinition["id"], LayerDefinition>(
  layers.map((layer) => [layer.id, layer]),
);

export const flowIndex = new Map<FlowDefinition["id"], FlowDefinition>(
  flows.map((flow) => [flow.id, flow]),
);

const layerCodeToId = new Map(layers.map((layer) => [layer.code, layer.id]));

function clampStep(step: number, totalSteps: number) {
  if (totalSteps <= 0) {
    return 0;
  }

  return Math.min(Math.max(step, 0), totalSteps - 1);
}

function formatKpiValue(value: number, unit: string) {
  if (unit === "%") {
    return `${value}%`;
  }

  if (unit === "sec") {
    return `${value} sec`;
  }

  if (unit === "USD_M") {
    return `$${value}M`;
  }

  return `${value}${unit ? ` ${unit}` : ""}`.trim();
}

function formatKpiDelta(delta: number, unit: string) {
  const prefix = delta > 0 ? "+" : "";
  if (unit === "USD_M") {
    return `${prefix}$${delta}M`;
  }

  return `${prefix}${delta}${unit === "%" ? "%" : ""}`;
}

function inferSeverity(stepIndex: number, scenarioId: ScenarioId): EventLogEntry["severity"] {
  if (scenarioId === "black-start" && stepIndex === 0) {
    return "alert";
  }

  return stepIndex % 2 === 0 ? "signal" : "info";
}

function mapLayerCodesToIds(layerCodes: string[]) {
  return layerCodes
    .map((code) => layerCodeToId.get(code))
    .filter((value): value is LayerId => Boolean(value));
}

function buildKpiSnapshot(
  scenarioId: ScenarioId,
  scenarioKpis: ScenarioKpiJson | undefined,
  stepIndex: number,
  totalSteps: number,
  fallbackScenario: ScenarioDefinition,
) {
  if (!scenarioKpis) {
    return fallbackScenario.kpis;
  }

  const progressIndex = totalSteps <= 1 ? 0 : Math.round((stepIndex / (totalSteps - 1)) * 6);

  return Object.values(scenarioKpis.series).map((series) => ({
    label: series.label,
    value: formatKpiValue(series.values[Math.min(progressIndex, series.values.length - 1)] ?? series.latest, series.unit),
    delta: formatKpiDelta(series.deltaVsBaseline, series.unit),
    trend: series.values,
    tone: series.deltaVsBaseline > 0 ? "good" : series.deltaVsBaseline < 0 ? "watch" : "neutral",
  })) satisfies ScenarioKpi[];
}

function buildEventLogs(
  scenarioId: ScenarioId,
  timeline: ScenarioTimelineStepJson[],
  stepIndex: number,
  fallbackLogs: EventLogEntry[],
) {
  const timelineLogs = timeline
    .slice(0, stepIndex + 1)
    .map((step, index) => ({
      time: step.timestamp,
      severity: inferSeverity(index, scenarioId),
      message: step.message,
    })) satisfies EventLogEntry[];

  return [...timelineLogs.reverse(), ...fallbackLogs].slice(0, 12);
}

function buildScenarioEvents(
  scenarioId: ScenarioId,
  timeline: ScenarioTimelineStepJson[],
  primaryFlow: FlowId,
  fallbackScenario: ScenarioDefinition,
) {
  return timeline.map((step, index) => {
    const highlightLayers = mapLayerCodesToIds(step.layerFocus);
    const primaryLayer = highlightLayers[highlightLayers.length - 1] ?? fallbackScenario.events[index]?.layerId ?? "l4-ashs";

    return {
      id: `${scenarioId}-json-${step.step}`,
      title: step.title,
      caption: step.message,
      timestamp: step.timestamp,
      layerId: primaryLayer,
      flowId: primaryFlow,
      highlightLayers,
      metrics: fallbackScenario.events[index]?.metrics ?? fallbackScenario.events[0]?.metrics ?? [],
      log: {
        time: step.timestamp,
        severity: inferSeverity(index, scenarioId),
        message: step.message,
      },
    } satisfies ScenarioEvent;
  });
}

function mergeScenario(
  jsonScenario: ScenarioJson | undefined,
  jsonKpis: ScenarioKpiJson | undefined,
  fallbackScenario: ScenarioDefinition,
) {
  if (!jsonScenario) {
    return fallbackScenario;
  }

  return {
    ...fallbackScenario,
    name: jsonScenario.name,
    summary: jsonScenario.summary,
    outlook: jsonScenario.narrative,
    accent: jsonScenario.accent,
    kpis: buildKpiSnapshot(jsonScenario.id, jsonKpis, jsonScenario.timeline.length - 1, jsonScenario.timeline.length, fallbackScenario),
    events: buildScenarioEvents(jsonScenario.id, jsonScenario.timeline, jsonScenario.primaryFlow, fallbackScenario),
    logs: buildEventLogs(jsonScenario.id, jsonScenario.timeline, jsonScenario.timeline.length - 1, fallbackScenario.logs),
  } satisfies ScenarioDefinition;
}

export function getLayerForEvent(event: ScenarioEvent): LayerDefinition {
  return layerIndex.get(event.layerId) ?? layers[0];
}

export function buildCaption(
  scenario: ScenarioDefinition,
  event: ScenarioEvent,
  isPresentationMode: boolean,
) {
  if (!isPresentationMode) {
    return event.caption;
  }

  return `${scenario.captionLead} ${event.caption}`;
}

export function createScenarioEngine(): ScenarioEngine {
  const runtimeScenarios = runtimeScenarioFile.scenarios.reduce((accumulator, scenario) => {
    accumulator.set(scenario.id, scenario);
    return accumulator;
  }, new Map<ScenarioId, ScenarioJson>());

  const runtimeKpis: Partial<Record<ScenarioId, ScenarioKpiJson>> = runtimeKpiFile.scenarios ?? {};

  const hydratedScenarios = baseScenarios.map((fallbackScenario) =>
    mergeScenario(runtimeScenarios.get(fallbackScenario.id), runtimeKpis[fallbackScenario.id], fallbackScenario),
  );

  const scenarioIndex = new Map<ScenarioId, ScenarioDefinition>(
    hydratedScenarios.map((scenario) => [scenario.id, scenario]),
  );

  const getScenario = (id: ScenarioId) => scenarioIndex.get(id) ?? baseScenarioIndex.get(id) ?? baseScenarios[0];

  const getScenarioEvent = (scenario: ScenarioDefinition, stepIndex: number) =>
    scenario.events[clampStep(stepIndex, scenario.events.length)] ?? scenario.events[0];

  const getStepState = (
    scenarioId: ScenarioId,
    stepIndex: number,
    selectedLayerOverride?: LayerId,
  ): ScenarioStepState => {
    const scenario = getScenario(scenarioId);
    const currentStep = clampStep(stepIndex, scenario.events.length);
    const event = getScenarioEvent(scenario, currentStep);
    const scenarioJson = runtimeScenarios.get(scenarioId);
    const kpiJson = runtimeKpis[scenarioId];
    const activeLayerIds = event.highlightLayers.length > 0 ? event.highlightLayers : [event.layerId];

    return {
      scenario,
      event,
      currentFlowId: event.flowId,
      currentKpiSnapshot: buildKpiSnapshot(
        scenarioId,
        kpiJson,
        currentStep,
        Math.max(scenario.events.length, 1),
        scenario,
      ),
      eventLogs: buildEventLogs(
        scenarioId,
        scenarioJson?.timeline ?? scenario.events.map((scenarioEvent, index) => ({
          step: index + 1,
          timestamp: scenarioEvent.timestamp,
          title: scenarioEvent.title,
          layerFocus: scenarioEvent.highlightLayers.map((layerId) => layerIndex.get(layerId)?.code ?? "L4"),
          message: scenarioEvent.caption,
        })),
        currentStep,
        scenario.logs,
      ),
      selectedLayerId: selectedLayerOverride ?? event.layerId,
      activeLayerIds,
      currentStep,
      totalSteps: scenario.events.length,
    };
  };

  return {
    getScenario,
    getScenarioEvent,
    getStepState,
    nextStep: (scenarioId, stepIndex) => {
      const totalSteps = getScenario(scenarioId).events.length;
      return totalSteps <= 0 ? 0 : (stepIndex + 1) % totalSteps;
    },
    previousStep: (scenarioId, stepIndex) => {
      const totalSteps = getScenario(scenarioId).events.length;
      return totalSteps <= 0 ? 0 : (stepIndex - 1 + totalSteps) % totalSteps;
    },
    resetStep: () => 0,
    getAvailableScenarios: () => hydratedScenarios,
  };
}

const scenarioEngine = createScenarioEngine();

export function loadScenarioEngine() {
  return scenarioEngine;
}

export function getScenario(id: ScenarioId): ScenarioDefinition {
  return scenarioEngine.getScenario(id);
}

export function getScenarioEvent(scenario: ScenarioDefinition, stepIndex: number): ScenarioEvent {
  return scenarioEngine.getScenarioEvent(scenario, stepIndex);
}

export function buildRollingLogs(scenario: ScenarioDefinition, stepIndex: number) {
  return scenarioEngine.getStepState(scenario.id, stepIndex).eventLogs;
}
