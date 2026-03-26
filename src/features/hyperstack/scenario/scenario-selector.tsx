import { scenarios } from "@/data/hyperstack";
import { useHyperStackStore } from "@/store/use-hyperstack-store";

export function ScenarioSelector() {
  const { selectedScenarioId, setScenario } = useHyperStackStore();

  return (
    <div className="hs-panel p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="hs-eyebrow">Scenario Selector</p>
          <p className="mt-2 text-sm leading-6 text-white/68">
            Switch operating context to compare flow sequence, system state, KPI posture, and financial outcomes.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/50">
          4 Scenarios
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {scenarios.map((scenario) => {
          const active = scenario.id === selectedScenarioId;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setScenario(scenario.id)}
              className={`rounded-full border px-4 py-2.5 text-sm transition ${
                active
                  ? "border-white/20 bg-white/[0.12] text-white shadow-[0_14px_36px_rgba(0,0,0,0.2)]"
                  : "border-white/10 bg-white/[0.04] text-white/62 hover:border-white/18 hover:text-white"
              }`}
              style={active ? { boxShadow: `0 0 0 1px ${scenario.accent}55 inset, 0 16px 44px rgba(0,0,0,0.26)` } : undefined}
            >
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: scenario.accent }} />
                <span>{scenario.name}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


