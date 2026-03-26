import { create } from "zustand";
import { scenarios, views } from "@/data/hyperstack";
import { createScenarioEngine, type ScenarioEngine } from "@/utils/hyperstack/scenario-engine";
import type {
  EventLogEntry,
  FlowId,
  LayerId,
  ScenarioDefinition,
  ScenarioId,
  ScenarioKpi,
  ViewId,
} from "@/types/hyperstack";

const defaultView = views[0].id;
const defaultScenario = scenarios[0];
const defaultPlaybackSpeed = 1;
const maxEventLogs = 12;

const scenarioEngine: ScenarioEngine = createScenarioEngine();

function applyStepState(stepState: ReturnType<ScenarioEngine["getStepState"]>) {
  return {
    selectedScenario: stepState.scenario,
    currentFlowId: stepState.currentFlowId,
    currentKpiSnapshot: stepState.currentKpiSnapshot,
    eventLogs: stepState.eventLogs.slice(0, maxEventLogs),
    currentStep: stepState.currentStep,
    selectedLayerId: stepState.selectedLayerId,
    activeLayerIds: stepState.activeLayerIds,
  };
}

export interface HyperStackStore {
  selectedView: ViewId;
  selectedLayerId: LayerId;
  selectedScenarioId: ScenarioId;
  selectedScenario: ScenarioDefinition;
  currentFlowId: FlowId;
  isPlaying: boolean;
  currentStep: number;
  playbackSpeed: number;
  presentationMode: boolean;
  currentKpiSnapshot: ScenarioKpi[];
  eventLogs: EventLogEntry[];
  activeLayerIds: LayerId[];
  engineReady: boolean;

  initializeScenarioEngine: () => void;
  setView: (view: ViewId) => void;
  setSelectedLayer: (layerId: LayerId) => void;
  setScenario: (scenarioId: ScenarioId) => void;
  setPlaybackSpeed: (speed: number) => void;
  setPresentationMode: (enabled: boolean) => void;
  togglePresentationMode: () => void;
  play: () => void;
  pause: () => void;
  togglePlayback: () => void;
  resetPlayback: () => void;
  resetScenario: () => void;
  stepForward: () => void;
  stepBackward: () => void;
}

const initialStepState = scenarioEngine.getStepState(defaultScenario.id, 0, "l4-ashs");

export const useHyperStackStore = create<HyperStackStore>((set, get) => ({
  selectedView: defaultView,
  selectedLayerId: initialStepState.selectedLayerId,
  selectedScenarioId: defaultScenario.id,
  selectedScenario: initialStepState.scenario,
  currentFlowId: initialStepState.currentFlowId,
  isPlaying: true,
  currentStep: initialStepState.currentStep,
  playbackSpeed: defaultPlaybackSpeed,
  presentationMode: true,
  currentKpiSnapshot: initialStepState.currentKpiSnapshot,
  eventLogs: initialStepState.eventLogs,
  activeLayerIds: initialStepState.activeLayerIds,
  engineReady: false,

  initializeScenarioEngine: () => {
    const state = get();
    const stepState = scenarioEngine.getStepState(state.selectedScenarioId, state.currentStep, state.selectedLayerId);
    set({
      ...applyStepState(stepState),
      engineReady: true,
    });
  },

  setView: (view) => set({ selectedView: view }),

  setSelectedLayer: (layerId) => set({ selectedLayerId: layerId }),

  setScenario: (scenarioId) => {
    const stepState = scenarioEngine.getStepState(scenarioId, scenarioEngine.resetStep());
    set({
      selectedScenarioId: scenarioId,
      ...applyStepState(stepState),
    });
  },

  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed > 0 ? speed : defaultPlaybackSpeed }),
  setPresentationMode: (enabled) => set({ presentationMode: enabled }),
  togglePresentationMode: () => set((state) => ({ presentationMode: !state.presentationMode })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),

  resetPlayback: () => {
    const state = get();
    const stepState = scenarioEngine.getStepState(state.selectedScenarioId, scenarioEngine.resetStep());
    set({
      isPlaying: false,
      ...applyStepState(stepState),
    });
  },

  resetScenario: () => get().resetPlayback(),

  stepForward: () => {
    const state = get();
    const nextStep = scenarioEngine.nextStep(state.selectedScenarioId, state.currentStep);
    const stepState = scenarioEngine.getStepState(state.selectedScenarioId, nextStep, state.selectedLayerId);
    set(applyStepState(stepState));
  },

  stepBackward: () => {
    const state = get();
    const previousStep = scenarioEngine.previousStep(state.selectedScenarioId, state.currentStep);
    const stepState = scenarioEngine.getStepState(state.selectedScenarioId, previousStep, state.selectedLayerId);
    set(applyStepState(stepState));
  },
}));

export function getPlaybackInterval(speed: number) {
  const safeSpeed = speed > 0 ? speed : defaultPlaybackSpeed;
  return Math.max(900, Math.round(3400 / safeSpeed));
}
