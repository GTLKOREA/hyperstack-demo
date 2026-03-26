import { motion } from "framer-motion";
import { useHyperStackStore } from "@/store/use-hyperstack-store";
import type { ScenarioDefinition } from "@/types/hyperstack";

const comparisonKeys: Array<keyof ScenarioDefinition["comparison"]> = [
  "resilience",
  "throughput",
  "margin",
  "autonomy",
];

function ScenarioTimeline({
  scenario,
  active,
}: {
  scenario: ScenarioDefinition;
  active: boolean;
}) {
  return (
    <div className={`rounded-[24px] border p-4 ${active ? "border-white/16 bg-white/[0.08]" : "border-white/8 bg-white/[0.03]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Timeline</p>
          <p className="mt-2 text-lg font-semibold text-white">{scenario.name}</p>
        </div>
        <span
          className="h-3 w-12 rounded-full"
          style={{ background: scenario.accent }}
        />
      </div>
      <div className="mt-4 space-y-3">
        {scenario.events.map((event, index) => (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`h-2.5 w-2.5 rounded-full ${active && index === 0 ? "bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]" : "bg-white/30"}`}
                style={index === 0 ? { background: scenario.accent } : undefined}
              />
              {index < scenario.events.length - 1 && <span className="mt-2 h-9 w-px bg-white/10" />}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/40">{event.timestamp}</p>
              <p className="mt-1 text-sm font-medium text-white">{event.title}</p>
              <p className="mt-1 text-sm leading-6 text-white/60">{event.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario,
  active,
  onSelect,
}: {
  scenario: ScenarioDefinition;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      onClick={onSelect}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      className={`rounded-[28px] border p-5 text-left transition ${
        active ? "border-white/18 bg-white/[0.09]" : "border-white/8 bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Scenario</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{scenario.name}</h3>
        </div>
        <span className="h-3 w-12 rounded-full" style={{ background: scenario.accent }} />
      </div>
      <p className="mt-3 text-sm leading-6 text-white/68">{scenario.summary}</p>
      <p className="mt-3 text-sm leading-6 text-white/54">{scenario.outlook}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {comparisonKeys.map((key) => (
          <div key={key}>
            <div className="flex items-center justify-between text-sm text-white/72">
              <span className="capitalize">{key}</span>
              <span>{scenario.comparison[key]}</span>
            </div>
            <div className="mt-2 h-2.5 rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full"
                style={{ background: scenario.accent }}
                initial={{ width: 0 }}
                animate={{ width: `${scenario.comparison[key]}%` }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.button>
  );
}

export function ScenarioComparisonView({
  activeScenario,
  scenarios,
}: {
  activeScenario: ScenarioDefinition;
  scenarios: ScenarioDefinition[];
}) {
  const { setScenario } = useHyperStackStore();

  return (
    <div className="grid h-full gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4 overflow-hidden">
        <div className="grid gap-4 md:grid-cols-2">
          {scenarios.map((scenario) => {
            const active = scenario.id === activeScenario.id;
            return (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                active={active}
                onSelect={() => setScenario(scenario.id)}
              />
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {scenarios.map((scenario) => (
            <ScenarioTimeline
              key={`${scenario.id}-timeline`}
              scenario={scenario}
              active={scenario.id === activeScenario.id}
            />
          ))}
        </div>
      </div>

      <div className="panel-card">
        <p className="eyebrow">KPI Difference View</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">Scenario spread</h3>
        <p className="mt-3 text-sm leading-6 text-white/68">
          Compare operating posture, risk profile, and monetization quality across the four flagship HyperStack scenarios. Selecting a scenario updates the demo instantly.
        </p>

        <div className="mt-6 space-y-4">
          {comparisonKeys.map((key) => {
            const values = scenarios.map((scenario) => ({
              name: scenario.name,
              value: scenario.comparison[key],
              accent: scenario.accent,
              active: scenario.id === activeScenario.id,
            }));
            const leader = [...values].sort((left, right) => right.value - left.value)[0];

            return (
              <div key={key} className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/42 capitalize">{key}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">Leader {leader.name}</p>
                </div>
                <div className="mt-4 space-y-3">
                  {values.map((item) => (
                    <button
                      key={`${key}-${item.name}`}
                      type="button"
                      onClick={() => {
                        const target = scenarios.find((scenario) => scenario.name === item.name);
                        if (target) {
                          setScenario(target.id);
                        }
                      }}
                      className="block w-full text-left"
                    >
                      <div className="flex items-center justify-between gap-3 text-sm text-white/72">
                        <span className={item.active ? "text-white" : "text-white/66"}>{item.name}</span>
                        <span className={item.active ? "text-white" : "text-white/66"}>{item.value}</span>
                      </div>
                      <div className="mt-2 h-2.5 rounded-full bg-white/8">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: item.accent }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%`, opacity: item.active ? 1 : 0.72 }}
                          transition={{ duration: 0.55, ease: "easeOut" }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

