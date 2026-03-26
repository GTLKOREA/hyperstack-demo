import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { flows, layers, scenarios } from "@/data/hyperstack";
import presentationScript from "@/data/hyperstack/json/presentationScript.json";
import { buildCaption, getLayerForEvent, getScenarioEvent } from "@/utils/hyperstack/scenario-engine";
import { getPlaybackInterval, useHyperStackStore } from "@/store/use-hyperstack-store";
import { parseScenarioStepLabel, parseStepFocusLayers } from "@/utils/hyperstack/scenario-step";
import { Chip } from "@/components/ui";
import { BottomControlBar } from "@/features/hyperstack/layout/bottom-control-bar";
import { CenterStage } from "@/features/hyperstack/layout/center-stage";
import { LeftDetailPanel } from "@/features/hyperstack/layout/left-detail-panel";
import { RightInsightPanel } from "@/features/hyperstack/layout/right-insight-panel";
import { PresentationOverlay } from "@/features/hyperstack/presentation/presentation-overlay";
import type { ScenarioId, ViewId } from "@/types/hyperstack";

interface PresentationStep {
  sequence: number;
  timestamp: string;
  view: ViewId;
  focusLayers: string[];
  narrativeLabel?: string;
  headline?: string;
  caption: string;
}

interface PresentationEntry {
  scenarioId: ScenarioId;
  title: string;
  openingCaption: string;
  closingCaption: string;
  steps: PresentationStep[];
}

interface PresentationAutoplay {
  enabled: boolean;
  defaultScenario: ScenarioId;
  stepDurationMs: number;
  captionMode: string;
  loop: boolean;
}

interface PresentationFile {
  autoplay: PresentationAutoplay;
  scripts: PresentationEntry[];
}

const defaultOpeningMessage = "HyperStack is the operating system of infrastructure value creation.";
const defaultClosingMessage = "HyperStack turns infrastructure performance into financial assets.";
const presentationData = presentationScript as PresentationFile;

function getPresentationInterval({
  caption,
  openingMessage,
  closingMessage,
  playbackSpeed,
}: {
  caption: string;
  openingMessage?: string | null;
  closingMessage?: string | null;
  playbackSpeed: number;
}) {
  const baseMs = presentationData.autoplay.stepDurationMs ?? 3400;
  const combined = [openingMessage, caption, closingMessage].filter(Boolean).join(" ");
  const wordCount = combined.trim().split(/\s+/).filter(Boolean).length;
  const readingBuffer = wordCount * 115;
  const emphasisBuffer = openingMessage || closingMessage ? 700 : 0;
  const rawDuration = baseMs + readingBuffer + emphasisBuffer;
  return Math.max(1800, Math.round(rawDuration / Math.max(playbackSpeed, 0.5)));
}

export function HyperStackDemoShell() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const {
    currentStep,
    selectedView,
    currentKpiSnapshot,
    engineReady,
    eventLogs,
    initializeScenarioEngine,
    isPlaying,
    playbackSpeed,
    presentationMode,
    selectedLayerId,
    selectedScenario,
    setSelectedLayer,
    setScenario,
    setView,
    resetScenario,
    stepBackward,
    stepForward,
    togglePlayback,
    togglePresentationMode,
  } = useHyperStackStore();

  const scenario = selectedScenario;
  const activeEvent = getScenarioEvent(scenario, currentStep);
  const activeLayer = layers.find((layer) => layer.id === selectedLayerId) ?? getLayerForEvent(activeEvent);
  const activeFlow = flows.find((flow) => flow.id === activeEvent.flowId) ?? flows[0];

  const activePresentationScript = useMemo(
    () => presentationData.scripts.find((script) => script.scenarioId === scenario.id) ?? null,
    [scenario.id],
  );
  const activePresentationStep = activePresentationScript?.steps[currentStep] ?? null;
  const totalPresentationSteps = activePresentationScript?.steps.length ?? scenario.events.length;
  const stepLabel = parseScenarioStepLabel(currentStep, totalPresentationSteps);
  const presentationCaption = activePresentationStep?.caption ?? buildCaption(scenario, activeEvent, presentationMode);
  const presentationTitle = activePresentationScript?.title ?? `${scenario.name} Narrative`;
  const presentationHeadline = activePresentationStep?.headline ?? presentationCaption;
  const narrativeSteps = activePresentationScript?.steps.map((step) => step.narrativeLabel ?? `Step ${step.sequence}`) ?? [];
  const activeNarrativeLabel = activePresentationStep?.narrativeLabel ?? stepLabel;
  const presentationTimestamp = activePresentationStep?.timestamp ?? activeEvent.timestamp;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === Math.max(totalPresentationSteps - 1, 0);
  const openingMessage = isFirstStep ? activePresentationScript?.openingCaption ?? defaultOpeningMessage : null;
  const closingMessage = isLastStep ? activePresentationScript?.closingCaption ?? defaultClosingMessage : null;
  const presentationInterval = getPresentationInterval({
    caption: presentationCaption,
    openingMessage,
    closingMessage,
    playbackSpeed,
  });

  useEffect(() => {
    initializeScenarioEngine();
  }, [initializeScenarioEngine]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = presentationMode ? presentationInterval : getPlaybackInterval(playbackSpeed * 0.74);

    const timer = window.setTimeout(() => {
      stepForward();
    }, interval);

    return () => window.clearTimeout(timer);
  }, [isPlaying, playbackSpeed, presentationInterval, presentationMode, stepForward]);

  useEffect(() => {
    if (!presentationMode || !activePresentationStep) {
      return;
    }

    setView(activePresentationStep.view);
    const focusLayers = parseStepFocusLayers(activePresentationStep);
    if (focusLayers.length > 0) {
      setSelectedLayer(focusLayers[focusLayers.length - 1]);
    }
  }, [activePresentationStep, presentationMode, setSelectedLayer, setView]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (event.key === " " || key === "k") {
        event.preventDefault();
        togglePlayback();
        return;
      }

      if (event.key === "ArrowRight" || key === "n" || key === "l") {
        event.preventDefault();
        stepForward();
        return;
      }

      if (event.key === "ArrowLeft" || key === "p" || key === "j") {
        event.preventDefault();
        stepBackward();
        return;
      }

      if (key === "f" || event.key === "Enter") {
        event.preventDefault();
        void toggleFullscreen();
        return;
      }

      if (key === "m") {
        event.preventDefault();
        togglePresentationMode();
        return;
      }

      if (event.key === "Home" || key === "r") {
        event.preventDefault();
        resetScenario();
        return;
      }

      if (["1", "2", "3", "4"].includes(event.key)) {
        const nextScenario = scenarios[Number(event.key) - 1];
        if (nextScenario) {
          event.preventDefault();
          setScenario(nextScenario.id);
        }
        return;
      }

      if (event.key === "Escape" && document.fullscreenElement) {
        event.preventDefault();
        void document.exitFullscreen();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [resetScenario, setScenario, stepBackward, stepForward, togglePlayback, togglePresentationMode]);

  async function toggleFullscreen() {
    const target = shellRef.current;
    if (!target) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await target.requestFullscreen();
  }

  return (
    <div ref={shellRef} className={`relative min-h-screen overflow-hidden bg-ink text-white ${presentationMode ? "presentation-shell" : ""}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(30,107,58,0.14),transparent_22%),radial-gradient(circle_at_84%_12%,rgba(60,52,137,0.18),transparent_22%),radial-gradient(circle_at_52%_100%,rgba(153,53,86,0.12),transparent_32%),linear-gradient(180deg,#09111b_0%,#050a12_52%,#02050a_100%)]" />
      <div className="absolute inset-0 bg-hero-grid bg-[size:72px_72px] opacity-[0.12]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_100%)]" />

      <main className={`relative z-10 flex min-h-screen flex-col px-4 py-4 md:px-6 md:py-6 ${presentationMode ? "gap-4" : ""}`}>
        <section className={`relative flex items-center justify-between gap-4 overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.022)_100%)] px-5 py-4 shadow-[0_20px_54px_rgba(0,0,0,0.24)] backdrop-blur-2xl ${presentationMode ? "opacity-92" : ""}`}>
          <div className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.34em] text-white/48">HyperStack Platform</p>
            <p className="mt-1 font-display text-lg tracking-[-0.03em] text-white md:text-[1.15rem]">Infrastructure Value Operating System</p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Chip tone="layer">Investor Perspective</Chip>
            <Chip>{scenario.name}</Chip>
            <Chip>{activeFlow.name}</Chip>
          </div>
        </section>

        {!presentationMode && (
          <section className="glass-panel mt-5 flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="relative z-10 max-w-4xl">
              <p className="text-[11px] uppercase tracking-[0.36em] text-white/56">HyperStack Platform</p>
              <h1 className="mt-3 font-display text-3xl tracking-[-0.055em] text-white md:text-5xl">
                Infrastructure Value Operating System
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/72 md:text-base">
                A premium interactive environment for explaining how HyperStack converts physical infrastructure performance into KPI quality, financial outcomes, and investor-grade visibility.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="panel-card min-w-[170px] px-4 py-4">
                <p className="eyebrow">Engine Status</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">
                  {engineReady ? "Value Engine Live" : "Loading Engine"}
                </p>
              </div>
              <div className="panel-card min-w-[170px] px-4 py-4">
                <p className="eyebrow">Active View</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">{selectedView}</p>
              </div>
              <div className="panel-card min-w-[170px] px-4 py-4">
                <p className="eyebrow">Scenario</p>
                <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">{scenario.name}</p>
              </div>
            </div>
          </section>
        )}

        <section className={`min-h-0 flex-1 ${presentationMode ? "grid grid-cols-1 gap-4" : "hs-shell-grid mt-5"}`}>
          {!presentationMode && (
            <LeftDetailPanel
              activeLayer={activeLayer}
              activeFlow={activeFlow}
              activeEvent={activeEvent}
              activeScenario={scenario}
            />
          )}

          <div className={`glass-panel overflow-hidden transition-all duration-500 ${presentationMode ? "min-h-[calc(100vh-220px)] rounded-[34px]" : "min-h-[720px]"}`}>
            <CenterStage
              activeView={selectedView}
              activeScenario={scenario}
              activeEvent={activeEvent}
              activeLayer={activeLayer}
              activeStep={currentStep}
              kpiSnapshot={currentKpiSnapshot}
            />
          </div>

          {!presentationMode && (
            <RightInsightPanel
              activeEvent={activeEvent}
              caption={presentationCaption}
              kpiSnapshot={currentKpiSnapshot}
              logs={eventLogs}
              isAutoplayActive={isPlaying}
              presentationMode={presentationMode}
            />
          )}
        </section>

        {!presentationMode && (
          <footer className="mt-5 flex items-center justify-between gap-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.02)_100%)] px-5 py-4 text-sm text-white/62 shadow-[0_18px_44px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
            <p>{isFirstStep ? defaultOpeningMessage : isLastStep ? defaultClosingMessage : presentationCaption}</p>
            <p className="hidden uppercase tracking-[0.22em] text-white/40 md:block">HyperStack turns operational proof into investable value</p>
          </footer>
        )}

        <BottomControlBar isFullscreen={isFullscreen} onToggleFullscreen={() => void toggleFullscreen()} />
      </main>

      {presentationMode && (
        <PresentationOverlay
          title={presentationTitle}
          headline={presentationHeadline}
          caption={presentationCaption}
          stepLabel={stepLabel}
          narrativeSteps={narrativeSteps}
          activeNarrativeLabel={activeNarrativeLabel}
          timestamp={presentationTimestamp}
          isPlaying={isPlaying}
          isFullscreen={isFullscreen}
          playbackSpeed={playbackSpeed}
          currentStep={currentStep}
          totalSteps={totalPresentationSteps}
          openingMessage={openingMessage}
          closingMessage={closingMessage}
        />
      )}

      {!presentationMode && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${scenario.id}-${currentStep}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="pointer-events-none absolute right-6 top-28 hidden max-w-md rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,22,0.72)_0%,rgba(5,8,14,0.88)_100%)] px-5 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl 2xl:block"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/42">Live Value Caption</p>
            <p className="mt-2 text-sm leading-6 text-white/82">{presentationCaption}</p>
          </motion.div>
        </AnimatePresence>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-44 bg-[linear-gradient(180deg,rgba(2,5,12,0)_0%,rgba(2,5,12,0.96)_100%)]" />
      <div className="pointer-events-none absolute left-6 top-24 hidden 2xl:block">
        <Chip tone="layer">Investor Value Narrative</Chip>
      </div>
    </div>
  );
}
