import { AnimatePresence } from "framer-motion";
import { LayerDetailCard } from "@/features/hyperstack/stack/layer-detail-card";
import { LayerLegend } from "@/features/hyperstack/stack/layer-legend";
import { LayerStack } from "@/features/hyperstack/stack/layer-stack";
import type {
  LayerDefinition,
  ScenarioDefinition,
  ScenarioEvent,
} from "@/types/hyperstack";

interface ArchitectureOverviewProps {
  activeScenario: ScenarioDefinition;
  activeEvent: ScenarioEvent;
  activeLayer: LayerDefinition;
}

export function ArchitectureOverview({
  activeScenario,
  activeEvent,
  activeLayer,
}: ArchitectureOverviewProps) {
  return (
    <div className="grid h-full gap-4 xl:grid-cols-[minmax(0,1.2fr)_390px]">
      <div className="space-y-4">
        <div className="hs-panel relative overflow-hidden p-5 md:p-6">
          <div className="absolute inset-x-8 top-0 h-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_72%)] blur-3xl" />
          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="hs-eyebrow">Architecture Overview</p>
                <h3 className="mt-3 font-display text-[clamp(1.9rem,2.8vw,3rem)] leading-none tracking-[-0.05em] text-white">
                  One operating stack turning infrastructure performance into financial value.
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">
                  HyperStack is designed so physical control, AI optimization, and KPI proof all compound toward settlement quality, revenue capture, and investor-grade visibility.
                </p>
              </div>

              <div className="rounded-[22px] border border-white/10 bg-white/[0.05] px-4 py-4 backdrop-blur-xl">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Scenario Context</p>
                <p className="mt-2 text-base font-semibold text-white">{activeScenario.name}</p>
                <p className="mt-2 max-w-xs text-sm leading-6 text-white/64">{activeScenario.outlook}</p>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Operational Input</p>
                <p className="mt-2 text-sm leading-6 text-white/74">Physical infrastructure and AI control produce measurable efficiency, resilience, and throughput.</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">KPI Conversion</p>
                <p className="mt-2 text-sm leading-6 text-white/74">GTL-Link, ASHS, and Financial Protocol convert operating proof into auditable KPI quality.</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Investor Outcome</p>
                <p className="mt-2 text-sm leading-6 text-white/74">EOP surfaces margin, bankability, and portfolio-grade financial meaning from the stack.</p>
              </div>
            </div>

            <LayerStack activeLayer={activeLayer} />
          </div>
        </div>

        <LayerLegend activeLayer={activeLayer} />
      </div>

      <AnimatePresence mode="wait">
        <LayerDetailCard key={activeLayer.id} activeLayer={activeLayer} activeEvent={activeEvent} />
      </AnimatePresence>
    </div>
  );
}