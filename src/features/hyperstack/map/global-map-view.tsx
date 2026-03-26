import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { layers } from "@/data/hyperstack";
import type { ScenarioDefinition } from "@/types/hyperstack";

const statusToneMap: Record<string, { label: string; accent: string; glow: string }> = {
  Stable: { label: "Stable", accent: "#39E6D2", glow: "rgba(57,230,210,0.34)" },
  Settled: { label: "Settled", accent: "#F4C95D", glow: "rgba(244,201,93,0.34)" },
  Recovering: { label: "Recovering", accent: "#FF8C6A", glow: "rgba(255,140,106,0.34)" },
  "High Demand": { label: "High Demand", accent: "#57B8FF", glow: "rgba(87,184,255,0.34)" },
  "Flex Dispatch": { label: "Flex Dispatch", accent: "#57B8FF", glow: "rgba(87,184,255,0.34)" },
  "Reserve Export": { label: "Reserve Export", accent: "#F4C95D", glow: "rgba(244,201,93,0.34)" },
  "Exporting Support": { label: "Exporting Support", accent: "#F4C95D", glow: "rgba(244,201,93,0.34)" },
  "Assist Mode": { label: "Assist Mode", accent: "#FF8C6A", glow: "rgba(255,140,106,0.34)" },
};

function getStatusTone(status: string) {
  return statusToneMap[status] ?? { label: status, accent: "#39E6D2", glow: "rgba(57,230,210,0.34)" };
}

export function GlobalMapView({
  activeScenario,
}: {
  activeScenario: ScenarioDefinition;
}) {
  const highlightedSites = useMemo(() => activeScenario.mapNodes.slice(0, 5), [activeScenario.mapNodes]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(highlightedSites[0]?.id ?? "");
  const selectedSite = highlightedSites.find((node) => node.id === selectedSiteId) ?? highlightedSites[0];
  const eopLayer = layers.find((layer) => layer.id === "l6-eop-platform");

  const statusSummary = useMemo(() => {
    return highlightedSites.reduce<Record<string, number>>((accumulator, node) => {
      accumulator[node.status] = (accumulator[node.status] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [highlightedSites]);

  return (
    <div className="grid h-full gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_18%_18%,rgba(57,230,210,0.12),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(87,184,255,0.14),transparent_26%),radial-gradient(circle_at_60%_76%,rgba(153,53,86,0.18),transparent_28%),linear-gradient(180deg,rgba(10,20,34,0.96)_0%,rgba(5,9,17,0.99)_100%)] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.34)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />

        <div className="absolute inset-x-6 top-6 z-10 flex items-start justify-between gap-4">
          <div className="max-w-xl rounded-[22px] border border-white/10 bg-black/28 px-4 py-4 backdrop-blur-xl">
            <p className="eyebrow">EOP Platform Expansion Layer</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white">Strategic market expansion visible through one executive operating surface</h3>
            <p className="mt-2 text-sm leading-6 text-white/68">
              {eopLayer?.shortName ?? "EOP"} turns regional infrastructure nodes into a strategic coverage map for operators, investors, and public-sector partners. This is where site readiness, market posture, and platform reach become decision-grade intelligence.
            </p>
          </div>
          <div className="hidden min-w-[240px] rounded-[20px] border border-white/10 bg-black/28 px-4 py-4 backdrop-blur-xl lg:block">
            <p className="eyebrow">Strategic Coverage</p>
            <p className="mt-2 text-lg font-semibold text-white">{highlightedSites.length} highlighted EOP nodes</p>
            <p className="mt-1 text-sm text-white/60">APAC, EMEA, MEA, Americas mapped into one platform narrative</p>
          </div>
        </div>

        <svg viewBox="0 0 100 60" className="h-full w-full pt-24">
          <path d="M7 25 L16 21 L22 22 L26 18 L34 19 L39 24 L33 29 L24 31 L18 30 L10 29 Z" fill="rgba(255,255,255,0.08)" />
          <path d="M41 18 L47 14 L54 15 L58 20 L55 25 L46 24 L42 21 Z" fill="rgba(255,255,255,0.08)" />
          <path d="M52 28 L58 25 L65 28 L67 34 L62 38 L56 36 L53 31 Z" fill="rgba(255,255,255,0.08)" />
          <path d="M70 17 L80 16 L90 21 L88 28 L80 27 L74 23 Z" fill="rgba(255,255,255,0.08)" />
          <path d="M77 34 L84 37 L86 45 L81 50 L74 46 L73 40 Z" fill="rgba(255,255,255,0.08)" />

          <motion.path d="M20 38 C34 26, 54 22, 77 34" stroke="rgba(87,184,255,0.36)" strokeWidth="1" fill="none" strokeDasharray="2 2" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY }} />
          <motion.path d="M49 28 C60 23, 68 21, 77 34" stroke="rgba(57,230,210,0.36)" strokeWidth="1" fill="none" strokeDasharray="2 2" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }} />
          <motion.path d="M20 38 C36 34, 43 28, 49 28" stroke="rgba(244,201,93,0.32)" strokeWidth="1" fill="none" strokeDasharray="2 2" animate={{ opacity: [0.25, 0.72, 0.25] }} transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 0.8 }} />

          {highlightedSites.map((node) => {
            const selected = node.id === selectedSite?.id;
            const tone = getStatusTone(node.status);
            return (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={selected ? 2.4 : 1.8}
                  fill={tone.accent}
                  initial={{ opacity: 0.5, scale: 0.8 }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.45, 0.8] }}
                  transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, delay: node.load / 100 }}
                  style={{ cursor: "pointer", filter: `drop-shadow(0 0 14px ${tone.accent})` }}
                  onClick={() => setSelectedSiteId(node.id)}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={selected ? 5.2 : 3.6}
                  fill="none"
                  stroke={selected ? tone.accent : "rgba(255,255,255,0.16)"}
                  strokeWidth={selected ? 1 : 0.5}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedSiteId(node.id)}
                />
                <circle cx={node.x + 4.8} cy={node.y - 3.2} r="0.9" fill={tone.accent} opacity="0.92" />
                <text x={node.x + 2.5} y={node.y - 1.8} fill={selected ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.72)"} fontSize="2.1">
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-6 right-6 hidden rounded-[22px] border border-white/10 bg-black/28 px-4 py-4 backdrop-blur-xl lg:block">
          <p className="eyebrow">Status Overview</p>
          <div className="mt-3 space-y-2">
            {Object.entries(statusSummary).map(([status, count]) => {
              const tone = getStatusTone(status);
              return (
                <div key={status} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: tone.accent, boxShadow: `0 0 12px ${tone.glow}` }} />
                    <span className="text-xs uppercase tracking-[0.22em] text-white/64">{tone.label}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {selectedSite && (
          <motion.div
            key={selectedSite.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute bottom-6 left-6 max-w-sm rounded-[24px] border border-white/10 bg-black/35 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          >
            <p className="eyebrow">EOP Status Tooltip</p>
            <div className="mt-2 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-white">{selectedSite.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/45">{selectedSite.region}</p>
              </div>
              <span
                className="rounded-full border px-3 py-1 text-xs"
                style={{
                  color: getStatusTone(selectedSite.status).accent,
                  borderColor: `${getStatusTone(selectedSite.status).accent}55`,
                  background: `${getStatusTone(selectedSite.status).accent}12`,
                }}
              >
                {selectedSite.status}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/66">
              EOP frames this node as a strategic market asset, combining regional reliability, platform coverage, and stakeholder visibility in one executive view.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <StatusChip label="Load" value={`${selectedSite.load}%`} />
              <StatusChip label="Role" value="EOP Node" />
              <StatusChip label="Narrative" value={selectedSite.status} />
              <StatusChip label="Layer" value="L6 Platform" />
            </div>
          </motion.div>
        )}
      </div>

      <div className="panel-card">
        <p className="eyebrow">EOP Expansion Nodes</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">Strategic market footprint</h3>
        <p className="mt-3 text-sm leading-6 text-white/68">
          The map is not decorative. It is the EOP Platform view of where HyperStack is operating, where it is monetizing, and how regional nodes support reliability, settlement, and market access.
        </p>

        <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">EOP Narrative</p>
          <p className="mt-2 text-sm leading-6 text-white/72">
            L6 EOP Platform turns global infrastructure presence into an executive market layer by surfacing site posture, regional importance, and portfolio visibility in real time.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {highlightedSites.map((node) => {
            const selected = node.id === selectedSite?.id;
            const tone = getStatusTone(node.status);
            return (
              <motion.button
                key={node.id}
                type="button"
                onClick={() => setSelectedSiteId(node.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.995 }}
                className={`w-full rounded-[20px] border p-4 text-left transition ${
                  selected
                    ? "border-white/18 bg-white/[0.08] shadow-[0_16px_38px_rgba(0,0,0,0.22)]"
                    : "border-white/8 bg-black/20 hover:border-white/14 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{node.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/45">{node.region}</p>
                  </div>
                  <span
                    className="rounded-full border px-3 py-1 text-xs"
                    style={{
                      color: tone.accent,
                      borderColor: `${tone.accent}55`,
                      background: `${tone.accent}12`,
                    }}
                  >
                    {node.status}
                  </span>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${node.load}%` }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    style={{ background: tone.accent }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-white/45">
                  <span>Load {node.load}%</span>
                  <span>{selected ? "Selected Node" : "Portfolio Node"}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatusChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/42">{label}</p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}