import { flows, layers, views } from "@/data/hyperstack";
import { useHyperStackStore } from "@/store/use-hyperstack-store";
import type {
  FlowDefinition,
  LayerDefinition,
  ScenarioDefinition,
  ScenarioEvent,
} from "@/types/hyperstack";

interface LeftDetailPanelProps {
  activeLayer: LayerDefinition;
  activeFlow: FlowDefinition;
  activeEvent: ScenarioEvent;
  activeScenario: ScenarioDefinition;
}

export function LeftDetailPanel({
  activeLayer,
  activeFlow,
  activeEvent,
  activeScenario,
}: LeftDetailPanelProps) {
  const { selectedView, selectedLayerId, setSelectedLayer, setView } = useHyperStackStore();

  return (
    <aside className="glass-panel hs-scroll flex min-h-[720px] flex-col gap-4 p-4 md:p-5">
      <div className="panel-card">
        <p className="eyebrow">View Navigation</p>
        <div className="mt-4 space-y-2">
          {views.map((view) => {
            const active = view.id === selectedView;
            return (
              <button
                key={view.id}
                type="button"
                onClick={() => setView(view.id)}
                className={`flex w-full items-center justify-between rounded-[20px] border px-4 py-3 text-left transition-all duration-300 ${
                  active
                    ? "border-white/16 bg-white/[0.08] shadow-[0_18px_44px_rgba(12,68,124,0.16)]"
                    : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.05]"
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">{view.kicker}</p>
                  <p className="mt-1 text-sm font-medium text-white">{view.label}</p>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-sky shadow-[0_0_14px_rgba(87,184,255,0.85)]" : "bg-white/20"}`} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Layer Intelligence</p>
            <h2 className="mt-2 font-display text-2xl tracking-[-0.03em] text-white">
              {activeLayer.code} {activeLayer.name}
            </h2>
          </div>
          <span
            className="mt-1 h-3.5 w-3.5 rounded-full shadow-[0_0_20px_currentColor]"
            style={{ background: activeLayer.accent, color: activeLayer.accent }}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-white/72">{activeLayer.description}</p>
      </div>

      <div className="space-y-2">
        {layers
          .slice()
          .reverse()
          .map((layer) => {
            const selected = layer.id === selectedLayerId;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setSelectedLayer(layer.id)}
                className={`flex w-full items-center justify-between rounded-[18px] border px-4 py-3 text-left transition-all duration-300 ${
                  selected
                    ? "border-white/16 bg-white/[0.08] shadow-[0_16px_38px_rgba(0,0,0,0.22)]"
                    : "border-white/8 bg-white/[0.025] hover:border-white/14 hover:bg-white/[0.05]"
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-white/45">{layer.code}</p>
                  <p className="mt-1 text-sm font-medium text-white">{layer.shortName}</p>
                </div>
                <span
                  className="h-3 w-3 rounded-full shadow-[0_0_18px_currentColor]"
                  style={{ background: layer.accent, color: layer.accent }}
                />
              </button>
            );
          })}
      </div>

      <div className="panel-card">
        <p className="eyebrow">Active Flow</p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-white">{activeFlow.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/48">{activeFlow.direction}</p>
          </div>
          <span className="h-3 w-14 rounded-full shadow-[0_0_16px_rgba(255,255,255,0.12)]" style={{ background: activeFlow.color }} />
        </div>
        <p className="mt-3 text-sm leading-6 text-white/66">{activeFlow.description}</p>
      </div>

      <div className="panel-card">
        <p className="eyebrow">Scenario Lens</p>
        <p className="mt-2 text-lg font-semibold text-white">{activeScenario.name}</p>
        <p className="mt-2 text-sm leading-6 text-white/68">{activeScenario.summary}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {activeLayer.metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-white/8 bg-black/20 px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/42">{metric.label}</p>
              <p className="mt-2 text-sm font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-card flex-1">
        <p className="eyebrow">Current Step</p>
        <p className="mt-2 text-lg font-semibold text-white">{activeEvent.title}</p>
        <p className="mt-2 text-sm leading-6 text-white/68">{activeEvent.caption}</p>
        <div className="mt-4 space-y-2">
          {activeLayer.functions.map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-white/74">
              <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_12px_rgba(57,230,210,0.7)]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {flows.map((flow) => (
            <span
              key={flow.id}
              className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/58"
            >
              {flow.name}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}