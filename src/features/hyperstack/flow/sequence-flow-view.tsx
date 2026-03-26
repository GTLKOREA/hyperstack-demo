import { motion } from "framer-motion";
import { flows } from "@/data/hyperstack";
import { FlowPlayerControls } from "@/features/hyperstack/flow/flow-player-controls";
import { FlowSequenceStage } from "@/features/hyperstack/flow/flow-sequence-stage";
import { getFlowSemanticState } from "@/features/hyperstack/flow/flow-semantics";
import { useHyperStackStore } from "@/store/use-hyperstack-store";
import type { ScenarioDefinition, ScenarioEvent } from "@/types/hyperstack";

export function SequenceFlowView({
  activeScenario,
  activeEvent,
}: {
  activeScenario: ScenarioDefinition;
  activeEvent: ScenarioEvent;
}) {
  const {
    activeLayerIds,
    currentFlowId,
    currentStep,
    eventLogs,
    isPlaying,
    playbackSpeed,
    resetPlayback,
    setPlaybackSpeed,
    stepBackward,
    stepForward,
    togglePlayback,
  } = useHyperStackStore();

  const activeFlow = flows.find((flow) => flow.id === currentFlowId) ?? flows[0];
  const totalSteps = activeScenario.events.length;
  const isBlackStart = activeScenario.id === "black-start";
  const isOpeningAlert = isBlackStart && currentStep === 0;
  const isRecovered = isBlackStart && currentStep === totalSteps - 1;
  const { semanticFlow, activeStage, activeStageIndex, nextStage } = getFlowSemanticState(currentFlowId, currentStep, totalSteps);

  return (
    <div className="grid h-full gap-4 xl:grid-cols-[minmax(0,1.25fr)_380px]">
      <div className="space-y-4">
        <FlowPlayerControls
          currentFlowId={currentFlowId}
          isPlaying={isPlaying}
          currentStep={currentStep}
          totalSteps={totalSteps}
          playbackSpeed={playbackSpeed}
          onPlayPause={togglePlayback}
          onPrevious={stepBackward}
          onNext={stepForward}
          onReset={resetPlayback}
          onSpeedChange={setPlaybackSpeed}
        />

        {isBlackStart ? (
          <motion.div
            key={`black-start-banner-${currentStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`hs-panel p-5 ${isOpeningAlert ? "border-[#ff8c6a]/45 bg-[linear-gradient(180deg,rgba(255,140,106,0.16)_0%,rgba(255,140,106,0.06)_100%)]" : isRecovered ? "border-[#39E6D2]/30 bg-[linear-gradient(180deg,rgba(57,230,210,0.12)_0%,rgba(57,230,210,0.04)_100%)]" : ""}`}
          >
            <p className="hs-eyebrow">Black Start Recovery Arc</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
              {isOpeningAlert ? "Critical fault detected and contained" : isRecovered ? "System stabilized and KPI recovery confirmed" : "Controlled restart and staged restoration"}
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/76">
              {isOpeningAlert
                ? "The platform raises a clear critical alert, isolates instability, and protects priority infrastructure before failures cascade."
                : isRecovered
                  ? "The recovery sequence ends in a calm, stable operating posture with uptime, confidence, and restored load trending back toward normal service."
                  : "HyperStack brings restart engines online, restores loads in waves, and keeps recovery understandable at every step."}
            </p>
          </motion.div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <FlowSequenceStage
            currentFlowId={currentFlowId}
            currentStep={currentStep}
            totalSteps={totalSteps}
            playbackSpeed={playbackSpeed}
            activeLayerIds={activeLayerIds}
          />

          <div className="space-y-4">
            <div className="hs-panel p-5">
              <p className="hs-eyebrow">Directional Narrative</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em]"
                  style={{
                    color: semanticFlow.accent,
                    borderColor: `${semanticFlow.accent}55`,
                    background: `${semanticFlow.accent}14`,
                  }}
                >
                  {semanticFlow.badge}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/56">
                  {semanticFlow.directionCue}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/74">{semanticFlow.feeling}</p>
              <div className="mt-4 grid gap-2">
                <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Source</p>
                  <p className="mt-1 text-sm font-medium text-white">{semanticFlow.sourceLabel}</p>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Target</p>
                  <p className="mt-1 text-sm font-medium text-white">{semanticFlow.targetLabel}</p>
                </div>
              </div>
            </div>

            <div className="hs-panel p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="hs-eyebrow">Financial Meaning</p>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/58">
                  Value Lens
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/76">{semanticFlow.financialMeaning}</p>
              <div className="mt-4 rounded-[18px] border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Current Impact</p>
                <p className="mt-2 text-sm leading-6 text-white/72">{activeEvent.caption}</p>
              </div>
            </div>

            <div className="hs-panel p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="hs-eyebrow">Step-by-Step Caption</p>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/58">
                  Stage {activeStageIndex + 1}
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl tracking-[-0.03em] text-white">{activeStage.label}</h3>
              <p className="mt-3 text-sm leading-6 text-white/76">{activeStage.caption}</p>

              <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Now</p>
                <p className="mt-1 text-sm font-medium text-white">{activeStage.label}</p>
                <p className="mt-2 text-sm leading-6 text-white/70">{activeStage.caption}</p>
              </div>

              <div className="mt-3 rounded-[18px] border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Next</p>
                <p className="mt-1 text-sm font-medium text-white">{nextStage.label}</p>
                <p className="mt-2 text-sm leading-6 text-white/66">{nextStage.caption}</p>
              </div>

              <div className="mt-4 space-y-2">
                {semanticFlow.stages.map((stage, index) => {
                  const active = index === activeStageIndex;
                  const completed = index < activeStageIndex;
                  return (
                    <div
                      key={`${stage.label}-${index}`}
                      className={`rounded-[18px] border px-4 py-3 transition-all duration-300 ${
                        active
                          ? "border-white/16 bg-white/[0.08]"
                          : completed
                            ? "border-white/10 bg-white/[0.05]"
                            : "border-white/8 bg-black/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-1 h-2.5 w-2.5 rounded-full"
                          style={{
                            background: active || completed ? semanticFlow.accent : "rgba(255,255,255,0.24)",
                            boxShadow: active ? `0 0 14px ${semanticFlow.glow}` : "none",
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">{stage.layerId.toUpperCase()}</p>
                            <p className="text-[10px] uppercase tracking-[0.22em] text-white/38">{index + 1}</p>
                          </div>
                          <p className="mt-1 text-sm font-medium text-white">{stage.label}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {flows.map((flow) => {
            const active = flow.id === activeFlow.id;
            const { semanticFlow: flowNarrative } = getFlowSemanticState(flow.id, currentStep, totalSteps);
            return (
              <motion.div
                key={flow.id}
                layout
                className={`hs-card ${active ? "border-white/18 bg-white/[0.09]" : "border-white/10 bg-white/[0.03]"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="hs-eyebrow">{flow.direction}</p>
                    <p className="mt-2 text-base font-semibold text-white">{flow.name}</p>
                  </div>
                  <span className="h-3 w-12 rounded-full" style={{ background: flow.color }} />
                </div>
                <p className="mt-3 text-sm leading-6 text-white/66">{flow.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.22em]" style={{ color: flowNarrative.accent }}>
                  {flowNarrative.badge}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/58">{flowNarrative.financialMeaning}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <motion.div
          key={activeEvent.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={`hs-panel p-5 ${isOpeningAlert ? "border-[#ff8c6a]/40 shadow-[0_22px_60px_rgba(255,140,106,0.12)]" : isRecovered ? "border-[#39E6D2]/28" : ""}`}
        >
          <p className="hs-eyebrow">Step Caption</p>
          <div className="mt-3 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl tracking-[-0.04em] text-white">{activeEvent.title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/72">{activeEvent.caption}</p>
            </div>
            <div className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em] ${isOpeningAlert ? "border-[#ff8c6a]/45 bg-[#ff8c6a]/10 text-[#ffd2c4]" : isRecovered ? "border-[#39E6D2]/35 bg-[#39E6D2]/10 text-[#baf9f1]" : "border-white/10 bg-white/[0.04] text-white/58"}`}>
              {activeEvent.timestamp}
            </div>
          </div>

          <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Narration</p>
            <p className="mt-2 text-base font-medium text-white">{activeStage.label}</p>
            <p className="mt-2 text-sm leading-6 text-white/74">{activeStage.caption}</p>
          </div>

          <div className="mt-4 rounded-[20px] border border-white/10 bg-black/20 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Investor Meaning</p>
            <p className="mt-2 text-sm leading-6 text-white/74">{semanticFlow.financialMeaning}</p>
          </div>

          <div className="mt-5 grid gap-3">
            {activeEvent.metrics.map((metric) => (
              <div key={metric.label} className={`rounded-[18px] border px-4 py-3 ${isOpeningAlert ? "border-[#ff8c6a]/25 bg-[#ff8c6a]/[0.06]" : isRecovered ? "border-[#39E6D2]/20 bg-[#39E6D2]/[0.04]" : "border-white/10 bg-white/[0.04]"}`}>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{metric.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="hs-panel p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="hs-eyebrow">Event Log</p>
              <p className="mt-2 text-sm leading-6 text-white/66">
                Mock scenario timing is driven from JSON and updates as playback advances.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/58">
              {activeScenario.name}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {eventLogs.map((log, index) => {
              const critical = log.severity === "alert" && isBlackStart;
              return (
                <motion.div
                  key={`${log.time}-${log.message}-${index}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.18), duration: 0.2 }}
                  className={`rounded-[20px] border px-4 py-4 ${critical ? "border-[#ff8c6a]/35 bg-[linear-gradient(180deg,rgba(255,140,106,0.12)_0%,rgba(255,140,106,0.05)_100%)]" : "border-white/10 bg-white/[0.04]"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          log.severity === "alert"
                            ? "bg-[#ff8c6a] shadow-[0_0_12px_rgba(255,140,106,0.8)]"
                            : log.severity === "signal"
                              ? "bg-[#39e6d2] shadow-[0_0_12px_rgba(57,230,210,0.8)]"
                              : "bg-white/45"
                        }`}
                      />
                      <p className={`text-[10px] uppercase tracking-[0.24em] ${critical ? "text-[#ffd2c4]" : "text-white/45"}`}>{log.severity}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/45">{log.time}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/72">{log.message}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}