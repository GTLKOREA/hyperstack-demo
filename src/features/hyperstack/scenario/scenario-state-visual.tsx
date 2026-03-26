import { motion } from "framer-motion";
import type { ScenarioDefinition } from "@/types/hyperstack";

interface ScenarioStateVisualProps {
  scenario: ScenarioDefinition;
  activeStep: number;
}

const scenarioNarratives = {
  "normal-operation": {
    title: "Operational to financial continuity",
    steps: ["Telemetry synchronized", "Optimization stabilized", "Settlement confidence rising"],
    bars: [74, 82, 91],
    tone: "#0C447C",
  },
  "black-start": {
    title: "Failure contained and service restored",
    steps: [
      "Fault detection",
      "Emergency stabilization",
      "Engine start",
      "Staged load restoration",
      "Return to normal operation",
    ],
    bars: [28, 46, 61, 82, 96],
    tone: "#1E6B3A",
  },
  "peak-load": {
    title: "Load surge to AI optimization recovery",
    steps: ["Load surge", "Cooling + ESS response", "AI optimization recovery"],
    bars: [82, 71, 90],
    tone: "#854F0B",
  },
  "kpi-settlement": {
    title: "Operations converted into financial trust",
    steps: ["KPI proof", "Waterfall settlement", "Investor service view"],
    bars: [78, 88, 94],
    tone: "#993556",
  },
} as const;

export function ScenarioStateVisual({ scenario, activeStep }: ScenarioStateVisualProps) {
  const visual = scenarioNarratives[scenario.id];
  const progressIndex = Math.min(
    visual.steps.length - 1,
    Math.round((activeStep / Math.max(scenario.events.length - 1, 1)) * (visual.steps.length - 1)),
  );
  const isBlackStart = scenario.id === "black-start";

  return (
    <div className="hs-panel p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="hs-eyebrow">Scenario State</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{visual.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/68">{scenario.summary}</p>
        </div>
        <span className="h-3 w-12 rounded-full" style={{ background: visual.tone }} />
      </div>

      {isBlackStart && progressIndex === 0 ? (
        <div className="mt-5 rounded-[22px] border border-[#ff8c6a]/40 bg-[linear-gradient(180deg,rgba(255,140,106,0.16)_0%,rgba(255,140,106,0.06)_100%)] px-4 py-4 shadow-[0_18px_44px_rgba(255,140,106,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#ffb39a]">Critical Alert</p>
          <p className="mt-2 text-sm leading-6 text-white/82">
            HyperStack detects the fault immediately, isolates instability, and begins a controlled recovery sequence before service losses cascade.
          </p>
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {visual.steps.map((step, index) => {
          const active = index <= progressIndex;
          const isAlertStage = isBlackStart && index === 0;
          const isRecoveredStage = isBlackStart && index === visual.steps.length - 1;
          const tone = isAlertStage ? "#FF8C6A" : isRecoveredStage ? "#39E6D2" : visual.tone;

          return (
            <div key={step} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ background: active ? tone : "rgba(255,255,255,0.18)", boxShadow: active ? `0 0 14px ${tone}` : "none" }}
              />
              <div>
                <p className={`text-sm font-medium ${active ? "text-white" : "text-white/52"}`}>{step}</p>
                <div className="mt-2 h-2.5 rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: tone }}
                    initial={{ width: 0 }}
                    animate={{ width: active ? `${visual.bars[index]}%` : "12%", opacity: active ? 1 : 0.35 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </div>
              </div>
              <p className={`text-xs uppercase tracking-[0.2em] ${active ? "text-white/62" : "text-white/34"}`}>
                {isRecoveredStage && active ? "Recovered" : active ? "Active" : "Pending"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

