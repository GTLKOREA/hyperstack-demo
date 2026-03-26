import { AnimatePresence, motion } from "framer-motion";
import type {
  EventLogEntry,
  ScenarioEvent,
  ScenarioKpi,
} from "@/types/hyperstack";

interface RightInsightPanelProps {
  activeEvent: ScenarioEvent;
  caption: string;
  kpiSnapshot: ScenarioKpi[];
  logs: EventLogEntry[];
  isAutoplayActive?: boolean;
  presentationMode?: boolean;
}

function Sparkline({ trend }: { trend: number[] }) {
  const max = Math.max(...trend);
  const min = Math.min(...trend);
  const points = trend
    .map((value, index) => {
      const x = (index / (trend.length - 1)) * 100;
      const y = 34 - ((value - min) / Math.max(max - min, 1)) * 26;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 34" className="mt-3 h-10 w-full overflow-visible">
      <polyline
        fill="none"
        stroke="url(#spark-gradient)"
        strokeWidth="2.5"
        points={points}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="spark-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#57B8FF" />
          <stop offset="45%" stopColor="#39E6D2" />
          <stop offset="100%" stopColor="#FF8C6A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RightInsightPanel({
  activeEvent,
  caption,
  kpiSnapshot,
  logs,
  isAutoplayActive = false,
  presentationMode = false,
}: RightInsightPanelProps) {
  return (
    <aside className="glass-panel hs-scroll flex min-h-[680px] flex-col p-5 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">Value Surface</p>
          {isAutoplayActive ? (
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/72">
              Live Autoplay
            </span>
          ) : null}
        </div>
        <div className="mt-3 grid gap-3">
          {kpiSnapshot.map((kpi) => (
            <motion.div
              key={kpi.label}
              layout
              className="rounded-[22px] border border-white/10 bg-white/[0.045] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.16)] transition-all duration-300 hover:border-white/14 hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">{kpi.value}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-xs text-white/72">
                  {kpi.delta}
                </span>
              </div>
              <Sparkline trend={kpi.trend} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={caption}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
          className="panel-card mt-4 overflow-hidden"
        >
          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow">{isAutoplayActive || presentationMode ? "Value Caption" : "Presentation Mode"}</p>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/60">
                {isAutoplayActive ? "Narrating" : "Ready"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/82">{caption}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="panel-card mt-4 transition-colors duration-300 hover:border-white/14">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Current Value Trigger</p>
            <p className="mt-2 text-base font-semibold text-white">{activeEvent.title}</p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/58">
            {activeEvent.timestamp}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {activeEvent.metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-white/8 bg-black/20 px-3 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/42">{metric.label}</p>
              <p className="mt-2 text-sm font-semibold text-white">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-card mt-4 transition-colors duration-300 hover:border-white/14">
        <p className="eyebrow">Investor Perspective</p>
        <p className="mt-3 text-sm leading-6 text-white/74">
          HyperStack is presented here as a value engine: operating actions improve KPI quality, KPI quality improves financial trust, and financial trust improves investability.
        </p>
      </div>

      <div className="panel-card mt-4 flex-1 transition-colors duration-300 hover:border-white/14">
        <p className="eyebrow">Value Log</p>
        <div className="mt-3 space-y-3">
          {logs.map((log, index) => (
            <div key={`${log.time}-${log.message}-${index}`} className="flex gap-3 rounded-[16px] px-2 py-2 transition-colors hover:bg-white/[0.03]">
              <span
                className={`mt-1 h-2.5 w-2.5 rounded-full ${
                  log.severity === "alert"
                    ? "bg-ember shadow-[0_0_12px_rgba(255,140,106,0.7)]"
                    : log.severity === "signal"
                      ? "bg-gold shadow-[0_0_12px_rgba(244,201,93,0.7)]"
                      : "bg-cyan shadow-[0_0_12px_rgba(57,230,210,0.7)]"
                }`}
              />
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-white/40">{log.time}</p>
                <p className="mt-1 text-sm leading-6 text-white/78">{log.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}