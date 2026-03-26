import { motion } from "framer-motion";
import { flows, layers } from "@/data/hyperstack";
import { useHyperStackStore } from "@/store/use-hyperstack-store";
import type { LayerDefinition, LayerId, ScenarioDefinition, ScenarioEvent } from "@/types/hyperstack";

interface ValueFlowViewProps {
  activeScenario: ScenarioDefinition;
  activeEvent: ScenarioEvent;
  activeLayer: LayerDefinition;
}

interface ValueStage {
  id: string;
  title: string;
  subtitle: string;
  outcome: string;
  layerIds: LayerId[];
  primaryLayerId: LayerId;
  tone: string;
}

const valueStages: ValueStage[] = [
  {
    id: "physical-asset",
    title: "Physical Asset",
    subtitle: "Energy, compute, and industrial infrastructure expose real operating state.",
    outcome: "The asset becomes an addressable source of value.",
    layerIds: ["l1-physical"],
    primaryLayerId: "l1-physical",
    tone: "#1E6B3A",
  },
  {
    id: "data",
    title: "Data",
    subtitle: "AIMEPS and GTL-Link convert raw telemetry into trusted, standardized machine input.",
    outcome: "Operations become legible and auditable.",
    layerIds: ["l2-aimeps", "l3-gtl-link"],
    primaryLayerId: "l2-aimeps",
    tone: "#0C447C",
  },
  {
    id: "ai-optimization",
    title: "AI Optimization",
    subtitle: "ASHS turns operating signals into dispatch, recovery, and efficiency decisions.",
    outcome: "Performance improves in real time.",
    layerIds: ["l4-ashs"],
    primaryLayerId: "l4-ashs",
    tone: "#085041",
  },
  {
    id: "kpi",
    title: "KPI",
    subtitle: "Improved uptime, PUE, reserve margin, and utilization become provable KPI quality.",
    outcome: "Performance is converted into measurable evidence.",
    layerIds: ["l4-ashs", "l5-financial-protocol"],
    primaryLayerId: "l5-financial-protocol",
    tone: "#3C3489",
  },
  {
    id: "financial-product",
    title: "Financial Product",
    subtitle: "Financial protocol applies settlement, incentive logic, and contract structure to verified outcomes.",
    outcome: "KPIs become finance-ready cashflow logic.",
    layerIds: ["l5-financial-protocol"],
    primaryLayerId: "l5-financial-protocol",
    tone: "#854F0B",
  },
  {
    id: "investor-return",
    title: "Investor Return",
    subtitle: "EOP exposes portfolio-level visibility, auditability, and capital-grade outcomes.",
    outcome: "Infrastructure performance is surfaced as investor return.",
    layerIds: ["l6-eop-platform"],
    primaryLayerId: "l6-eop-platform",
    tone: "#993556",
  },
];

function stageMatchesActiveLayer(stage: ValueStage, activeLayerId: LayerId) {
  return stage.layerIds.includes(activeLayerId);
}

export function ValueFlowView({ activeScenario, activeEvent, activeLayer }: ValueFlowViewProps) {
  const { selectedLayerId, setSelectedLayer } = useHyperStackStore();
  const focusedStage = valueStages.find((stage) => stageMatchesActiveLayer(stage, selectedLayerId))
    ?? valueStages.find((stage) => stageMatchesActiveLayer(stage, activeLayer.id))
    ?? valueStages[0];

  const topKpis = activeScenario.kpis.slice(0, 3);
  const activeFlow = flows.find((flow) => flow.id === activeEvent.flowId) ?? flows[0];

  return (
    <div className="grid h-full gap-5 xl:grid-cols-[1.55fr_0.95fr]">
      <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] px-5 py-5 shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
        <div className="absolute inset-x-12 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]" />
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Primary Investor Screen</p>
            <h3 className="mt-2 font-display text-[clamp(1.8rem,3vw,3.2rem)] leading-[1.05] tracking-[-0.05em] text-white">
              Physical Asset to Investor Return
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/68 md:text-base">
              HyperStack links infrastructure, data, AI, KPI proof, and financial products into a single value chain that investors can understand in seconds.
            </p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-4 text-right">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/42">Active Scenario</p>
            <p className="mt-2 text-lg font-semibold text-white">{activeScenario.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/42">{activeFlow.name}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 xl:grid-cols-[repeat(6,minmax(0,1fr))]">
          {valueStages.map((stage, index) => {
            const isActive = stage.id === focusedStage.id;
            const isPassed = index < valueStages.findIndex((item) => item.id === focusedStage.id);
            const relatedLayers = stage.layerIds.map((layerId) => layers.find((layer) => layer.id === layerId)).filter(Boolean) as LayerDefinition[];

            return (
              <div key={stage.id} className="relative">
                <motion.button
                  type="button"
                  onClick={() => setSelectedLayer(stage.primaryLayerId)}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group relative flex h-full w-full flex-col rounded-[26px] border px-4 py-4 text-left transition-all duration-300 ${
                    isActive
                      ? "border-white/18 bg-white/[0.11] shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
                      : isPassed
                        ? "border-white/12 bg-white/[0.06]"
                        : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.05]"
                  }`}
                  style={{ boxShadow: isActive ? `0 0 0 1px ${stage.tone}40, 0 24px 72px rgba(0,0,0,0.34), 0 0 42px ${stage.tone}22` : undefined }}
                >
                  <div
                    className="mb-4 h-1.5 w-16 rounded-full"
                    style={{ background: `linear-gradient(90deg, ${stage.tone}, rgba(255,255,255,0.82))` }}
                  />
                  <p className="text-[10px] uppercase tracking-[0.26em] text-white/42">Stage {index + 1}</p>
                  <p className="mt-2 font-display text-xl tracking-[-0.04em] text-white">{stage.title}</p>
                  <p className="mt-3 text-sm leading-6 text-white/66">{stage.subtitle}</p>
                  <p className="mt-4 text-sm font-medium leading-6 text-white/84">{stage.outcome}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {relatedLayers.map((layer) => (
                      <span
                        key={layer.id}
                        className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/58"
                      >
                        {layer.code} {layer.shortName}
                      </span>
                    ))}
                  </div>
                </motion.button>

                {index < valueStages.length - 1 ? (
                  <div className="pointer-events-none hidden xl:flex absolute -right-2 top-1/2 z-10 w-4 -translate-y-1/2 items-center justify-center">
                    <div className="h-px w-8 bg-[linear-gradient(90deg,rgba(255,255,255,0.18),rgba(255,255,255,0.5))]" />
                    <div className="h-2.5 w-2.5 -translate-x-1 rotate-45 border-r border-t border-white/50" />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">Current Trigger</p>
            <p className="mt-2 text-lg font-semibold text-white">{activeEvent.title}</p>
            <p className="mt-2 text-sm leading-6 text-white/66">{activeEvent.caption}</p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">Value Logic</p>
            <p className="mt-2 text-sm leading-6 text-white/74">
              Better operational control improves KPI quality. Verified KPIs support settlement logic. Settlement creates financial products and investor return.
            </p>
          </div>
          <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">Focused Layer</p>
            <p className="mt-2 text-lg font-semibold text-white">{activeLayer.code} {activeLayer.name}</p>
            <p className="mt-2 text-sm leading-6 text-white/66">{activeLayer.description}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.02)_100%)] px-5 py-5 shadow-[0_26px_72px_rgba(0,0,0,0.24)]">
          <p className="eyebrow">Focused Stage</p>
          <p className="mt-2 font-display text-3xl tracking-[-0.045em] text-white">{focusedStage.title}</p>
          <p className="mt-3 text-sm leading-7 text-white/68">{focusedStage.subtitle}</p>
          <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">Investor Meaning</p>
            <p className="mt-2 text-base font-medium leading-7 text-white">{focusedStage.outcome}</p>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.02)_100%)] px-5 py-5 shadow-[0_26px_72px_rgba(0,0,0,0.24)]">
          <p className="eyebrow">Value Evidence</p>
          <div className="mt-4 grid gap-3">
            {topKpis.map((kpi, index) => (
              <div key={kpi.label} className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">Proof {index + 1}</p>
                    <p className="mt-1 text-sm font-medium text-white">{kpi.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-white">{kpi.value}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#f4c95d]">{kpi.delta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[#f4c95d]/16 bg-[radial-gradient(circle_at_top,rgba(244,201,93,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.02)_100%)] px-5 py-5 shadow-[0_26px_72px_rgba(0,0,0,0.24)]">
          <p className="eyebrow">Bottom Line</p>
          <p className="mt-2 font-display text-2xl tracking-[-0.04em] text-white">HyperStack turns infrastructure into a financial product pipeline.</p>
          <p className="mt-3 text-sm leading-7 text-white/70">
            This is the simplest investor explanation of the platform: physical assets generate data, AI improves outcomes, KPIs prove performance, and financial protocol converts that proof into return.
          </p>
        </div>
      </section>
    </div>
  );
}
