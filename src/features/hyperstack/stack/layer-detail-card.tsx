import { motion } from "framer-motion";
import { layers } from "@/data/hyperstack";
import { flows } from "@/data/hyperstack";
import { getLayerColor } from "@/utils/hyperstack/layer-colors";
import type { LayerDefinition, LayerId, ScenarioEvent } from "@/types/hyperstack";

interface LayerDetailCardProps {
  activeLayer: LayerDefinition;
  activeEvent: ScenarioEvent;
}

const layerNarrative: Record<
  LayerId,
  {
    title: string;
    engine: string;
    role: string;
    upstream: string;
    downstream: string;
  }
> = {
  "l1-physical": {
    title: "Physical Infrastructure",
    engine: "Field infrastructure fabric",
    role: "Converts real-world energy, compute, and equipment state into machine-readable operating inputs.",
    upstream: "Receives translated control intent and dispatch commands from ASHS through GTL-Link.",
    downstream: "Supplies telemetry, capacity, and asset state into AIMEPS for normalization.",
  },
  "l2-aimeps": {
    title: "AIMEPS Standard",
    engine: "Measurement and optimization engine",
    role: "Standardizes raw field data into forecasts, anomaly signals, and optimization guidance.",
    upstream: "Consumes physical telemetry and asset context from L1 Physical Infrastructure.",
    downstream: "Publishes normalized intelligence into GTL-Link and ASHS for orchestration.",
  },
  "l3-gtl-link": {
    title: "GTL-Link Middleware",
    engine: "Interoperability and trust relay",
    role: "Synchronizes cross-domain state so data, commands, and proofs move through one secure transport layer.",
    upstream: "Receives machine-operable signals from AIMEPS and policy intent from ASHS.",
    downstream: "Routes trusted state to the field, finance layer, and executive platform.",
  },
  "l4-ashs": {
    title: "ASHS OS",
    engine: "Autonomous supervisory operating system",
    role: "Issues balancing, dispatch, and recovery decisions across the HyperStack estate.",
    upstream: "Consumes standardized operating intelligence from L2 AIMEPS and trusted state from L3 GTL-Link.",
    downstream: "Pushes control to infrastructure and verified performance intent into the financial layer.",
  },
  "l5-financial-protocol": {
    title: "Financial Protocol",
    engine: "Programmable finance engine",
    role: "Transforms verified operating performance into settlement, incentives, and investor-readable value.",
    upstream: "Consumes KPI proofs and policy outcomes from ASHS and GTL-Link.",
    downstream: "Publishes economic outcomes, bankability logic, and auditability into EOP.",
  },
  "l6-eop-platform": {
    title: "EOP Platform",
    engine: "Executive operating platform",
    role: "Exposes real-time operational, financial, and governance visibility to operators, investors, and government stakeholders.",
    upstream: "Consumes operating, financial, and audit signals from every lower layer of the stack.",
    downstream: "Surfaces decision-grade insight, accountability, and presentation-ready outcomes to external stakeholders.",
  },
};

export function LayerDetailCard({ activeLayer, activeEvent }: LayerDetailCardProps) {
  const details = layerNarrative[activeLayer.id];
  const activeFlow = flows.find((flow) => flow.id === activeEvent.flowId);
  const layerIndex = layers.findIndex((layer) => layer.id === activeLayer.id);
  const upstreamNeighbor = layerIndex < layers.length - 1 ? layers[layerIndex + 1] : null;
  const downstreamNeighbor = layerIndex > 0 ? layers[layerIndex - 1] : null;

  return (
    <motion.div
      key={activeLayer.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="hs-panel p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="hs-eyebrow">Layer Detail</p>
          <h3 className="mt-2 font-display text-2xl tracking-[-0.04em] text-white">
            {activeLayer.code} {details.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-white/70">{activeLayer.description}</p>
        </div>
        <span
          className="mt-1 h-4 w-4 rounded-full shadow-[0_0_24px_currentColor]"
          style={{ background: getLayerColor(activeLayer.id), color: getLayerColor(activeLayer.id) }}
        />
      </div>

      <div className="mt-5 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.03)_100%)] p-4">
        <p className="text-[10px] uppercase tracking-[0.26em] text-white/44">Primary Engine</p>
        <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-white">{details.engine}</p>
        <p className="mt-3 text-sm leading-6 text-white/74">{details.role}</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <DetailRow label="Upstream Relation" value={details.upstream} accent={upstreamNeighbor?.accent} neighbor={upstreamNeighbor?.code + (upstreamNeighbor ? ` ${upstreamNeighbor.shortName}` : "")} />
        <DetailRow label="Downstream Relation" value={details.downstream} accent={downstreamNeighbor?.accent} neighbor={downstreamNeighbor?.code + (downstreamNeighbor ? ` ${downstreamNeighbor.shortName}` : "")} />
      </div>

      <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">Layer Placement</p>
            <p className="mt-2 text-sm font-medium text-white">How this layer connects the stack</p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/60">
            Structural View
          </span>
        </div>
        <div className="mt-4 space-y-3">
          <RelationshipRow label="Above" layer={upstreamNeighbor} fallback="Topmost executive surface" />
          <RelationshipRow label="Current" layer={activeLayer} active />
          <RelationshipRow label="Below" layer={downstreamNeighbor} fallback="Physical field edge" />
        </div>
      </div>

      <div className="mt-4 rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
        <p className="hs-eyebrow">Current Operating Context</p>
        <p className="mt-2 text-base font-medium text-white">{activeEvent.title}</p>
        <p className="mt-2 text-sm leading-6 text-white/68">{activeEvent.caption}</p>
        {activeFlow ? (
          <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs uppercase tracking-[0.22em] text-white/58">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: activeFlow.color }} />
            <span>{activeFlow.name}</span>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

function DetailRow({
  label,
  value,
  accent,
  neighbor,
}: {
  label: string;
  value: string;
  accent?: string;
  neighbor?: string;
}) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">{label}</p>
        {neighbor ? (
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-white/62">
            {neighbor}
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex items-start gap-3">
        <span
          className="mt-2 h-2.5 w-2.5 rounded-full shadow-[0_0_14px_currentColor]"
          style={{ background: accent ?? "rgba(255,255,255,0.32)", color: accent ?? "rgba(255,255,255,0.32)" }}
        />
        <p className="text-sm leading-6 text-white/76">{value}</p>
      </div>
    </div>
  );
}

function RelationshipRow({
  label,
  layer,
  fallback,
  active = false,
}: {
  label: string;
  layer: LayerDefinition | null;
  fallback?: string;
  active?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between rounded-[18px] border px-4 py-3 ${active ? "border-white/16 bg-white/[0.08]" : "border-white/8 bg-black/20"}`}>
      <div>
        <p className="text-[10px] uppercase tracking-[0.24em] text-white/42">{label}</p>
        <p className="mt-1 text-sm font-medium text-white">{layer ? `${layer.code} ${layer.shortName}` : fallback}</p>
      </div>
      <span
        className="h-3 w-3 rounded-full shadow-[0_0_16px_currentColor]"
        style={{ background: layer?.accent ?? "rgba(255,255,255,0.28)", color: layer?.accent ?? "rgba(255,255,255,0.28)" }}
      />
    </div>
  );
}