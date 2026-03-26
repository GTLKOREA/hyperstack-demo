import { lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { flows, scenarios } from "@/data/hyperstack";
import type {
  LayerDefinition,
  ScenarioDefinition,
  ScenarioEvent,
  ScenarioKpi,
  ViewId,
} from "@/types/hyperstack";

const ValueFlowView = lazy(() => import("@/features/hyperstack/flow/value-flow-view").then((module) => ({ default: module.ValueFlowView })));
const ArchitectureOverview = lazy(() => import("@/features/hyperstack/stack/architecture-overview").then((module) => ({ default: module.ArchitectureOverview })));
const SequenceFlowView = lazy(() => import("@/features/hyperstack/flow/sequence-flow-view").then((module) => ({ default: module.SequenceFlowView })));
const ScenarioComparisonView = lazy(() => import("@/features/hyperstack/scenario/scenario-comparison-view").then((module) => ({ default: module.ScenarioComparisonView })));
const KpiDashboardView = lazy(() => import("@/features/hyperstack/dashboard/kpi-dashboard-view").then((module) => ({ default: module.KpiDashboardView })));
const GlobalMapView = lazy(() => import("@/features/hyperstack/map/global-map-view").then((module) => ({ default: module.GlobalMapView })));

interface CenterStageProps {
  activeView: ViewId;
  activeScenario: ScenarioDefinition;
  activeEvent: ScenarioEvent;
  activeLayer: LayerDefinition;
  activeStep: number;
  kpiSnapshot: ScenarioKpi[];
}

function getViewTitle(view: ViewId) {
  switch (view) {
    case "value-flow":
      return "Value Flow To Investor Return";
    case "architecture":
      return "Value Creation Stack";
    case "sequence":
      return "Operational Flow To Financial Outcome";
    case "comparison":
      return "Scenario Value Comparison";
    case "dashboard":
      return "KPI To Investor Return Dashboard";
    case "map":
      return "Strategic Market Value Layer";
  }
}

function getViewSubtitle(view: ViewId) {
  switch (view) {
    case "value-flow":
      return "The simplest investor explanation of HyperStack: physical assets become data, AI, KPI proof, financial products, and investor return.";
    case "architecture":
      return "How infrastructure capability compounds into KPI proof, revenue quality, and investor visibility.";
    case "sequence":
      return "Every operating flow is framed by the financial meaning it produces.";
    case "comparison":
      return "See which scenarios create resilience, margin, and capital-quality outcomes.";
    case "dashboard":
      return "Track how operating optimization becomes bankability, ROI, and settlement confidence.";
    case "map":
      return "Read the platform footprint as a coverage, monetization, and executive-visibility layer.";
  }
}

export function CenterStage({
  activeView,
  activeScenario,
  activeEvent,
  activeLayer,
  activeStep,
  kpiSnapshot,
}: CenterStageProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="relative flex items-center justify-between border-b border-white/8 px-6 py-5">
        <div className="absolute inset-x-10 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)]" />
        <div className="max-w-3xl">
          <p className="eyebrow">Investor Narrative View</p>
          <h2 className="mt-2 font-display text-3xl tracking-[-0.04em] text-white">{getViewTitle(activeView)}</h2>
          <p className="mt-2 text-sm leading-6 text-white/62">{getViewSubtitle(activeView)}</p>
        </div>
        <div className="hidden flex-wrap gap-2 md:flex">
          {flows.map((flow) => (
            <span
              key={flow.id}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs uppercase tracking-[0.22em] text-white/55 transition hover:border-white/18 hover:bg-white/[0.06]"
            >
              {flow.name}
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden px-5 py-5 md:px-6 md:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 18, scale: 0.99, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, scale: 0.99, filter: "blur(8px)" }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="h-full"
          >
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center rounded-[28px] border border-white/8 bg-white/[0.03]">
                  <p className="text-sm uppercase tracking-[0.26em] text-white/45">Loading View</p>
                </div>
              }
            >
              {activeView === "value-flow" && (
                <ValueFlowView activeScenario={activeScenario} activeEvent={activeEvent} activeLayer={activeLayer} />
              )}
              {activeView === "architecture" && (
                <ArchitectureOverview activeScenario={activeScenario} activeEvent={activeEvent} activeLayer={activeLayer} />
              )}
              {activeView === "sequence" && <SequenceFlowView activeScenario={activeScenario} activeEvent={activeEvent} />}
              {activeView === "comparison" && (
                <ScenarioComparisonView activeScenario={activeScenario} scenarios={scenarios} />
              )}
              {activeView === "dashboard" && (
                <KpiDashboardView activeScenario={activeScenario} activeEvent={activeEvent} activeLayer={activeLayer} activeStep={activeStep} />
              )}
              {activeView === "map" && <GlobalMapView activeScenario={activeScenario} />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
