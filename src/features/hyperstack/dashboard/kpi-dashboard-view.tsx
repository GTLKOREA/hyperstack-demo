import { motion } from "framer-motion";
import { ScenarioSelector } from "@/features/hyperstack/scenario/scenario-selector";
import { KpiSparkline } from "@/features/hyperstack/dashboard/kpi-sparkline";
import { ScenarioStateVisual } from "@/features/hyperstack/scenario/scenario-state-visual";
import { formatKpiValue } from "@/utils/hyperstack/kpi-formatters";
import { formatCurrencyMillions, formatPercentage } from "@/utils/hyperstack/number-formatters";
import { useHyperStackStore } from "@/store/use-hyperstack-store";
import type {
  LayerDefinition,
  ScenarioDefinition,
  ScenarioEvent,
} from "@/types/hyperstack";

interface DashboardMetricSeries {
  label: string;
  unit: string;
  values: number[];
  delta: string;
  tone: "good" | "watch" | "neutral";
}

interface WaterfallStage {
  label: string;
  values: number[];
  accent: string;
}

interface InvestmentLens {
  paybackMonths: number[];
  targetIrr: number;
  bankabilityThreshold: number;
}

const dashboardScenarioMetrics: Record<string, { metrics: DashboardMetricSeries[]; waterfall: WaterfallStage[]; investment: InvestmentLens }> = {
  "normal-operation": {
    metrics: [
      { label: "PUE", unit: "x", values: [1.28, 1.25, 1.22, 1.19], delta: "-0.04 vs base", tone: "good" },
      { label: "Uptime", unit: "%", values: [99.62, 99.71, 99.79, 99.84], delta: "+0.18%", tone: "good" },
      { label: "Power Cost", unit: "$/MWh", values: [84, 80, 77, 74], delta: "-$8", tone: "good" },
      { label: "IRR", unit: "%", values: [14.2, 15.1, 16.4, 17.3], delta: "+2.1%", tone: "good" },
      { label: "ROI", unit: "%", values: [11.8, 12.6, 13.9, 15.2], delta: "+1.7%", tone: "good" },
      { label: "Bankability Score", unit: "/100", values: [78, 82, 86, 89], delta: "+7", tone: "good" },
    ],
    waterfall: [
      { label: "Gross Revenue", values: [8.6, 9.4, 10.8, 12.1], accent: "#57B8FF" },
      { label: "Power Cost", values: [-3.2, -3.0, -2.8, -2.6], accent: "#FF8C6A" },
      { label: "Ops Cost", values: [-1.6, -1.5, -1.4, -1.3], accent: "#F4C95D" },
      { label: "Net Return", values: [3.8, 4.9, 6.6, 8.2], accent: "#39E6D2" },
    ],
    investment: { paybackMonths: [76, 71, 65, 58], targetIrr: 16, bankabilityThreshold: 85 },
  },
  "black-start": {
    metrics: [
      { label: "PUE", unit: "x", values: [1.61, 1.56, 1.48, 1.42, 1.38], delta: "+0.10 stress", tone: "watch" },
      { label: "Uptime", unit: "%", values: [82.6, 86.9, 91.8, 96.2, 98.9], delta: "recovery +16.3%", tone: "good" },
      { label: "Power Cost", unit: "$/MWh", values: [126, 118, 112, 106, 101], delta: "+$19", tone: "watch" },
      { label: "IRR", unit: "%", values: [7.6, 8.4, 9.3, 10.5, 11.9], delta: "-3.4%", tone: "watch" },
      { label: "ROI", unit: "%", values: [5.8, 6.7, 7.8, 8.9, 9.7], delta: "-2.8%", tone: "watch" },
      { label: "Bankability Score", unit: "/100", values: [64, 69, 74, 79, 83], delta: "resilience +8", tone: "neutral" },
    ],
    waterfall: [
      { label: "Gross Revenue", values: [4.2, 4.8, 5.6, 6.3, 6.9], accent: "#57B8FF" },
      { label: "Reserve Cost", values: [-1.9, -1.8, -1.6, -1.4, -1.3], accent: "#FF8C6A" },
      { label: "Recovery Cost", values: [-1.8, -1.6, -1.4, -1.2, -1.1], accent: "#F4C95D" },
      { label: "Net Return", values: [0.5, 1.4, 2.6, 3.7, 4.5], accent: "#39E6D2" },
    ],
    investment: { paybackMonths: [118, 110, 102, 93, 84], targetIrr: 14, bankabilityThreshold: 80 },
  },
  "peak-load": {
    metrics: [
      { label: "PUE", unit: "x", values: [1.36, 1.31, 1.27], delta: "+0.03 peak", tone: "neutral" },
      { label: "Uptime", unit: "%", values: [99.18, 99.34, 99.48], delta: "service intact", tone: "good" },
      { label: "Power Cost", unit: "$/MWh", values: [96, 103, 109], delta: "+$21", tone: "watch" },
      { label: "IRR", unit: "%", values: [15.6, 17.2, 19.1], delta: "+3.0%", tone: "good" },
      { label: "ROI", unit: "%", values: [13.2, 14.8, 16.9], delta: "+2.4%", tone: "good" },
      { label: "Bankability Score", unit: "/100", values: [80, 84, 87], delta: "+5", tone: "good" },
    ],
    waterfall: [
      { label: "Gross Revenue", values: [7.9, 9.2, 10.6], accent: "#57B8FF" },
      { label: "Energy Cost", values: [-2.8, -3.1, -3.4], accent: "#FF8C6A" },
      { label: "Flex Incentive", values: [1.1, 1.6, 2.2], accent: "#F4C95D" },
      { label: "Net Return", values: [6.2, 7.7, 9.4], accent: "#39E6D2" },
    ],
    investment: { paybackMonths: [69, 61, 54], targetIrr: 18, bankabilityThreshold: 84 },
  },
  "kpi-settlement": {
    metrics: [
      { label: "PUE", unit: "x", values: [1.24, 1.21, 1.18], delta: "-0.05", tone: "good" },
      { label: "Uptime", unit: "%", values: [99.74, 99.81, 99.88], delta: "+0.21%", tone: "good" },
      { label: "Power Cost", unit: "$/MWh", values: [79, 76, 73], delta: "-$9", tone: "good" },
      { label: "IRR", unit: "%", values: [16.1, 17.4, 18.8], delta: "+2.6%", tone: "good" },
      { label: "ROI", unit: "%", values: [14.0, 15.5, 17.1], delta: "+2.2%", tone: "good" },
      { label: "Bankability Score", unit: "/100", values: [85, 89, 93], delta: "+9", tone: "good" },
    ],
    waterfall: [
      { label: "Verified Revenue", values: [9.4, 10.8, 12.4], accent: "#57B8FF" },
      { label: "Settlement Fees", values: [-0.9, -0.8, -0.8], accent: "#FF8C6A" },
      { label: "Investor Allocation", values: [-2.4, -2.8, -3.2], accent: "#F4C95D" },
      { label: "Platform Return", values: [6.1, 7.2, 8.4], accent: "#39E6D2" },
    ],
    investment: { paybackMonths: [63, 56, 49], targetIrr: 18, bankabilityThreshold: 90 },
  },
};

function getScenarioIndex(step: number, totalSeriesPoints: number, totalSteps: number) {
  if (totalSeriesPoints <= 1 || totalSteps <= 1) {
    return 0;
  }

  return Math.min(totalSeriesPoints - 1, Math.round((step / (totalSteps - 1)) * (totalSeriesPoints - 1)));
}

function formatMetricValue(label: string, value: number, unit: string) {
  if (unit === "$/MWh") {
    return `${formatKpiValue(value, { unit: "$/MWh", digits: 0 })}/MWh`;
  }

  return formatKpiValue(value, { unit, digits: unit === "x" ? 2 : 1 });
}

function getMetricDelta(values: number[]) {
  const start = values[0] ?? 0;
  const end = values[values.length - 1] ?? start;
  return end - start;
}

function getMetricDirection(label: string, delta: number) {
  const lowerIsBetter = label === "PUE" || label === "Power Cost";
  const positive = lowerIsBetter ? delta < 0 : delta > 0;
  return { positive, arrow: positive ? "Up" : delta === 0 ? "Flat" : "Down" };
}

function getOperationalFinanceBridge(metrics: DashboardMetricSeries[], scenarioIndex: number) {
  const pue = metrics.find((metric) => metric.label === "PUE");
  const uptime = metrics.find((metric) => metric.label === "Uptime");
  const powerCost = metrics.find((metric) => metric.label === "Power Cost");
  const irr = metrics.find((metric) => metric.label === "IRR");
  const roi = metrics.find((metric) => metric.label === "ROI");
  const bankability = metrics.find((metric) => metric.label === "Bankability Score");

  const opsDriver = pue && uptime
    ? `PUE ${formatMetricValue(pue.label, pue.values[scenarioIndex] ?? pue.values[pue.values.length - 1], pue.unit)} and uptime ${formatMetricValue(uptime.label, uptime.values[scenarioIndex] ?? uptime.values[uptime.values.length - 1], uptime.unit)} improve operating quality.`
    : "Operational efficiency improves system quality.";
  const costDriver = powerCost
    ? `That compresses delivered power cost to ${formatMetricValue(powerCost.label, powerCost.values[scenarioIndex] ?? powerCost.values[powerCost.values.length - 1], powerCost.unit)}.`
    : "That improves cost discipline.";
  const financeOutcome = irr && roi && bankability
    ? `Financially, IRR reaches ${formatMetricValue(irr.label, irr.values[scenarioIndex] ?? irr.values[irr.values.length - 1], irr.unit)}, ROI reaches ${formatMetricValue(roi.label, roi.values[scenarioIndex] ?? roi.values[roi.values.length - 1], roi.unit)}, and bankability strengthens to ${formatMetricValue(bankability.label, bankability.values[scenarioIndex] ?? bankability.values[bankability.values.length - 1], bankability.unit)}.`
    : "Financial outcomes strengthen as operations improve.";

  return { opsDriver, costDriver, financeOutcome };
}

export function KpiDashboardView({ activeScenario, activeEvent, activeLayer, activeStep }: { activeScenario: ScenarioDefinition; activeEvent: ScenarioEvent; activeLayer: LayerDefinition; activeStep: number; }) {
  const { eventLogs } = useHyperStackStore();
  const scenarioPack = dashboardScenarioMetrics[activeScenario.id] ?? dashboardScenarioMetrics["normal-operation"];
  const scenarioIndex = getScenarioIndex(activeStep, scenarioPack.metrics[0]?.values.length ?? 1, activeScenario.events.length);
  const waterfallTotals = scenarioPack.waterfall.map((stage) => stage.values[scenarioIndex] ?? stage.values[stage.values.length - 1]);
  const maxWaterfallMagnitude = Math.max(...waterfallTotals.map((value) => Math.abs(value)), 1);
  const settlementMode = activeScenario.id === "kpi-settlement";
  const isBlackStart = activeScenario.id === "black-start";
  const isRecovered = isBlackStart && activeStep === activeScenario.events.length - 1;
  const operationalMetrics = scenarioPack.metrics.filter((metric) => ["PUE", "Uptime", "Power Cost"].includes(metric.label));
  const financialMetrics = scenarioPack.metrics.filter((metric) => ["IRR", "ROI", "Bankability Score"].includes(metric.label));
  const bridge = getOperationalFinanceBridge(scenarioPack.metrics, scenarioIndex);
  const irrMetric = scenarioPack.metrics.find((metric) => metric.label === "IRR");
  const bankabilityMetric = scenarioPack.metrics.find((metric) => metric.label === "Bankability Score");
  const paybackMonths = scenarioPack.investment.paybackMonths[scenarioIndex] ?? scenarioPack.investment.paybackMonths[scenarioPack.investment.paybackMonths.length - 1];
  const irrValue = irrMetric ? irrMetric.values[scenarioIndex] ?? irrMetric.values[irrMetric.values.length - 1] : 0;
  const bankabilityValue = bankabilityMetric ? bankabilityMetric.values[scenarioIndex] ?? bankabilityMetric.values[bankabilityMetric.values.length - 1] : 0;

  return (
    <div className="grid h-full gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
      <div className="space-y-4 overflow-hidden">
        <ScenarioSelector />
        {isBlackStart ? <motion.div key={`black-start-kpi-${activeStep}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`hs-panel p-5 ${activeStep === 0 ? "border-[#ff8c6a]/40 bg-[linear-gradient(180deg,rgba(255,140,106,0.14)_0%,rgba(255,140,106,0.05)_100%)]" : isRecovered ? "border-[#39E6D2]/28 bg-[linear-gradient(180deg,rgba(57,230,210,0.1)_0%,rgba(57,230,210,0.04)_100%)]" : ""}`}><p className="hs-eyebrow">Black Start Recovery Lens</p><h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{activeStep === 0 ? "Critical fault response" : isRecovered ? "Stabilized KPI recovery" : "Controlled system restoration"}</h3><p className="mt-3 text-sm leading-6 text-white/76">{activeStep === 0 ? "The first minutes are about fast detection and safe containment. This view makes the alert state obvious for non-technical audiences." : isRecovered ? "The sequence ends with visibly recovered uptime, confidence, and restored load so the audience sees a stable return toward normal operation." : "HyperStack restarts in stages, protects critical services first, and then expands restoration in a controlled recovery arc."}</p></motion.div> : null}
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <div className="hs-panel p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><p className="hs-eyebrow">KPI Dashboard</p><h3 className="mt-2 font-display text-3xl tracking-[-0.05em] text-white">Operational performance converted into financial results.</h3><p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">HyperStack links operating optimization to margin quality, settlement readiness, and investor confidence in one measurable system.</p></div><div className={`rounded-[22px] border px-4 py-4 ${isBlackStart && activeStep === 0 ? "border-[#ff8c6a]/32 bg-[#ff8c6a]/[0.08]" : isRecovered ? "border-[#39E6D2]/24 bg-[#39E6D2]/[0.06]" : "border-white/10 bg-white/[0.05]"}`}><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Live Focus</p><p className="mt-2 text-base font-semibold text-white">{activeEvent.title}</p><p className="mt-2 text-sm text-white/60">{activeScenario.name} ¡¤ Step {activeStep + 1}</p></div></div>
              <motion.div key={`${activeScenario.id}-${activeStep}-bridge`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="mt-5 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.03)_100%)] p-5"><div className="grid gap-3 xl:grid-cols-[1fr_80px_1fr] xl:items-center"><div className="rounded-[20px] border border-white/10 bg-black/20 p-4"><p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Operational Optimization</p><p className="mt-2 text-sm leading-6 text-white/76">{bridge.opsDriver}</p><p className="mt-2 text-sm leading-6 text-white/66">{bridge.costDriver}</p></div><div className="flex items-center justify-center"><div className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-white/56">Converts To</div></div><div className="rounded-[20px] border border-white/10 bg-black/20 p-4"><p className="text-[10px] uppercase tracking-[0.22em] text-white/42">Financial Transformation</p><p className="mt-2 text-sm leading-6 text-white/76">{bridge.financeOutcome}</p></div></div></motion.div>
              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                <MetricGroup title="Operational Drivers" kicker="Efficiency and resilience" metrics={operationalMetrics} scenarioIndex={scenarioIndex} accent="#57B8FF" />
                <div className="space-y-4">
                  <IrrSpotlightCard irrValue={irrValue} irrMetric={irrMetric} targetIrr={scenarioPack.investment.targetIrr} scenarioIndex={scenarioIndex} />
                  <PaybackCard paybackMonths={paybackMonths} series={scenarioPack.investment.paybackMonths} scenarioIndex={scenarioIndex} />
                  <BankabilityCard score={bankabilityValue} threshold={scenarioPack.investment.bankabilityThreshold} metric={bankabilityMetric} scenarioIndex={scenarioIndex} />
                </div>
              </div>
              <div className="mt-5"><MetricGroup title="Financial Outcomes" kicker="Return and bankability" metrics={financialMetrics} scenarioIndex={scenarioIndex} accent="#F4C95D" compact /></div>
            </div>
            <div className="hs-panel p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><p className="hs-eyebrow">Financial Flow</p><h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">{settlementMode ? "Settlement waterfall and investor distribution" : "Cashflow bridge to investment return"}</h3><p className="mt-2 text-sm leading-6 text-white/68">{settlementMode ? "KPI Settlement mode shows how verified operations become fees, allocations, and platform return." : "The waterfall now behaves like a live cashflow bridge, showing how operating gains lift net return and shorten payback."}</p></div><div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/58">{settlementMode ? "Investor View" : "Cashflow Lens"}</div></div>
              <div className="mt-5 grid gap-3 xl:grid-cols-3"><CausalLinkCard title="Ops Signal" body={bridge.opsDriver} accent="#57B8FF" /><CausalLinkCard title="Value Conversion" body={bridge.costDriver} accent="#F4C95D" /><CausalLinkCard title="Investment Result" body={bridge.financeOutcome} accent="#39E6D2" /></div>
              <div className="mt-6 grid gap-4 md:grid-cols-4">{scenarioPack.waterfall.map((stage) => { const value = stage.values[scenarioIndex] ?? stage.values[stage.values.length - 1]; const previousValue = stage.values[Math.max(scenarioIndex - 1, 0)] ?? value; const height = `${Math.max(36, (Math.abs(value) / maxWaterfallMagnitude) * 180)}px`; const stepDelta = value - previousValue; const positive = value >= 0; return (<div key={stage.label} className="rounded-[22px] border border-white/10 bg-black/20 p-4"><div className="flex items-start justify-between gap-3"><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{stage.label}</p><span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-white/58">{stepDelta >= 0 ? "+" : ""}{formatCurrencyMillions(stepDelta, 1)}</span></div><div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/42"><span>{positive ? "Inflow" : "Outflow"}</span><span className="h-px flex-1 bg-white/10" /><span>{positive ? "Accretive" : "Deductive"}</span></div><div className="mt-6 flex h-[220px] items-end justify-center"><motion.div initial={{ height: 0, opacity: 0.5, y: 18 }} animate={{ height, opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className={`relative w-20 overflow-hidden ${positive ? "rounded-t-[22px] rounded-b-[8px]" : "rounded-[22px]"}`} style={{ background: stage.accent, boxShadow: `0 0 28px ${stage.accent}33` }}><motion.div className="absolute inset-x-0 top-0 h-8 bg-white/18" animate={{ y: [0, 80, 160] }} transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }} /></motion.div></div><p className="mt-4 text-2xl font-semibold text-white">{value >= 0 ? "+" : ""}{formatCurrencyMillions(value, 1)}</p></div>); })}</div>
            </div>
          </div>
          <ScenarioStateVisual scenario={activeScenario} activeStep={activeStep} />
        </div>
      </div>
      <div className="space-y-4"><div className="hs-panel p-5"><p className="hs-eyebrow">Investment Summary</p><div className="mt-4 grid gap-3"><SummaryCard label="Selected Layer" title={activeLayer.shortName} body={activeLayer.description} /><SummaryCard label="Scenario" title={activeScenario.name} body={activeScenario.outlook} /><SummaryCard label="Current Event" title={activeEvent.title} body={activeEvent.caption} /></div></div><div className="hs-panel p-5"><p className="hs-eyebrow">Operations To Finance</p><div className="mt-4 space-y-3"><TransformationStat label="Operational Uplift" value={bridge.opsDriver} accent="#57B8FF" /><TransformationStat label="Cost Discipline" value={bridge.costDriver} accent="#F4C95D" /><TransformationStat label="Investor Outcome" value={bridge.financeOutcome} accent="#39E6D2" /></div></div><div className="hs-panel p-5"><div className="flex items-center justify-between gap-3"><div><p className="hs-eyebrow">Scenario Event Log</p><p className="mt-2 text-sm leading-6 text-white/66">Logs update with the active scenario and step progression from the JSON-driven engine.</p></div><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/58">{eventLogs.length} Entries</span></div><div className="mt-5 space-y-3">{eventLogs.map((log, index) => (<div key={`${log.time}-${log.message}-${index}`} className={`rounded-[20px] border px-4 py-4 ${isBlackStart && log.severity === "alert" ? "border-[#ff8c6a]/30 bg-[#ff8c6a]/[0.05]" : isRecovered && index === 0 ? "border-[#39E6D2]/22 bg-[#39E6D2]/[0.035]" : "border-white/10 bg-white/[0.04]"}`}><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${log.severity === "alert" ? "bg-[#FF8C6A]" : log.severity === "signal" ? "bg-[#F4C95D]" : "bg-[#39E6D2]"}`} /><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{log.severity}</p></div><p className="text-xs uppercase tracking-[0.22em] text-white/45">{log.time}</p></div><p className="mt-3 text-sm leading-6 text-white/72">{log.message}</p></div>))}</div></div></div>
    </div>
  );
}

function MetricGroup({ title, kicker, metrics, scenarioIndex, accent, compact = false }: { title: string; kicker: string; metrics: DashboardMetricSeries[]; scenarioIndex: number; accent: string; compact?: boolean; }) {
  return <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{kicker}</p><h4 className="mt-2 text-lg font-semibold text-white">{title}</h4><div className={`mt-4 grid gap-4 ${compact ? "md:grid-cols-3" : ""}`}>{metrics.map((metric) => { const currentValue = metric.values[scenarioIndex] ?? metric.values[metric.values.length - 1]; const delta = getMetricDelta(metric.values); const direction = getMetricDirection(metric.label, delta); return <motion.div key={metric.label} layout className="rounded-[22px] border border-white/10 bg-black/20 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{metric.label}</p><p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">{formatMetricValue(metric.label, currentValue, metric.unit)}</p></div><div className="flex flex-col items-end gap-2"><span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-xs text-white/70">{metric.delta}</span><span className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.18em]" style={{ color: direction.positive ? accent : "#FF8C6A", borderColor: direction.positive ? `${accent}55` : "rgba(255,140,106,0.35)", background: direction.positive ? `${accent}12` : "rgba(255,140,106,0.08)" }}>{direction.arrow}</span></div></div><div className="mt-4"><KpiSparkline values={metric.values} activeIndex={scenarioIndex} tone={metric.tone} /></div></motion.div>; })}</div></div>;
}

function IrrSpotlightCard({ irrValue, irrMetric, targetIrr, scenarioIndex }: { irrValue: number; irrMetric?: DashboardMetricSeries; targetIrr: number; scenarioIndex: number; }) {
  const progress = Math.min(100, (irrValue / Math.max(targetIrr, 1)) * 100);
  return <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(244,201,93,0.14)_0%,rgba(244,201,93,0.05)_100%)] p-5 shadow-[0_18px_44px_rgba(244,201,93,0.08)]"><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">IRR Spotlight</p><div className="mt-3 flex items-end justify-between gap-4"><div><p className="text-4xl font-semibold tracking-[-0.05em] text-white">{formatPercentage(irrValue, 1)}</p><p className="mt-2 text-sm leading-6 text-white/72">IRR is framed as the lead investment-performance signal for this scenario.</p></div><span className="rounded-full border border-[#F4C95D]/35 bg-[#F4C95D]/12 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#F4C95D]">Target {formatPercentage(targetIrr, 0)}</span></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(progress, 8)}%` }} transition={{ duration: 0.65, ease: "easeOut" }} className="h-full rounded-full bg-[linear-gradient(90deg,#F4C95D_0%,#FFFFFF_100%)]" /></div>{irrMetric ? <div className="mt-4"><KpiSparkline values={irrMetric.values} activeIndex={scenarioIndex} tone={irrMetric.tone} /></div> : null}</div>;
}

function PaybackCard({ paybackMonths, series, scenarioIndex }: { paybackMonths: number; series: number[]; scenarioIndex: number; }) {
  const maxMonths = Math.max(...series, 1); const progress = ((maxMonths - paybackMonths) / maxMonths) * 100;
  return <div className="rounded-[26px] border border-white/10 bg-white/[0.05] p-5"><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Payback Period</p><div className="mt-3 flex items-end justify-between gap-4"><div><p className="text-3xl font-semibold tracking-[-0.04em] text-white">{paybackMonths} months</p><p className="mt-2 text-sm leading-6 text-white/70">Shorter payback strengthens capital efficiency and speeds portfolio recycling.</p></div><span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/58">Step {scenarioIndex + 1}</span></div><div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/45"><span>Capital Recovery</span><span>Faster is better</span></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(progress, 10)}%` }} transition={{ duration: 0.65, ease: "easeOut" }} className="h-full rounded-full bg-[linear-gradient(90deg,#57B8FF_0%,#39E6D2_100%)]" /></div></div></div>;
}

function BankabilityCard({ score, threshold, metric, scenarioIndex }: { score: number; threshold: number; metric?: DashboardMetricSeries; scenarioIndex: number; }) {
  const progress = Math.min(100, score); const thresholdMet = score >= threshold;
  return <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(57,230,210,0.12)_0%,rgba(57,230,210,0.04)_100%)] p-5 shadow-[0_18px_44px_rgba(57,230,210,0.08)]"><div className="flex items-center justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Bankability Score</p><p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-white">{Math.round(score)}</p></div><span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${thresholdMet ? "border-[#39E6D2]/35 bg-[#39E6D2]/12 text-[#39E6D2]" : "border-[#FF8C6A]/35 bg-[#FF8C6A]/12 text-[#FF8C6A]"}`}>{thresholdMet ? "Investment Ready" : "Below Threshold"}</span></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(progress, 12)}%` }} transition={{ duration: 0.65, ease: "easeOut" }} className="h-full rounded-full bg-[linear-gradient(90deg,#39E6D2_0%,#FFFFFF_100%)]" /></div><p className="mt-3 text-sm leading-6 text-white/72">Bankability is elevated here as a top-level investment trust metric, not a secondary system stat.</p>{metric ? <div className="mt-4"><KpiSparkline values={metric.values} activeIndex={scenarioIndex} tone={metric.tone} /></div> : null}</div>;
}

function CausalLinkCard({ title, body, accent }: { title: string; body: string; accent: string }) { return <div className="rounded-[22px] border border-white/10 bg-black/20 p-4"><div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full" style={{ background: accent, boxShadow: `0 0 14px ${accent}` }} /><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{title}</p></div><p className="mt-3 text-sm leading-6 text-white/72">{body}</p></div>; }
function TransformationStat({ label, value, accent }: { label: string; value: string; accent: string }) { return <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4"><div className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-full" style={{ background: accent, boxShadow: `0 0 14px ${accent}` }} /><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{label}</p></div><p className="mt-3 text-sm leading-6 text-white/68">{value}</p></div>; }
function SummaryCard({ label, title, body }: { label: string; title: string; body: string; }) { return <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{label}</p><p className="mt-2 text-lg font-semibold text-white">{title}</p><p className="mt-2 text-sm leading-6 text-white/66">{body}</p></div>; }
