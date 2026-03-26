import { motion } from "framer-motion";
import { flows, layers } from "@/data/hyperstack";
import { getLayerColor } from "@/utils/hyperstack/layer-colors";
import { flowSemantics, getFlowSemanticState } from "@/features/hyperstack/flow/flow-semantics";
import type { FlowId, LayerId } from "@/types/hyperstack";

interface FlowSequenceStageProps {
  currentFlowId: FlowId;
  currentStep: number;
  totalSteps: number;
  playbackSpeed: number;
  activeLayerIds: LayerId[];
}

const visualLayers = layers.slice().reverse();
const layerY = new Map<LayerId, number>(
  visualLayers.map((layer, index) => [layer.id, 80 + index * 74]),
);

function getStagePoints(flowId: FlowId) {
  const config = flowSemantics[flowId];
  const centerX = flowId === "control-downstream" ? 330 : flowId === "financial-flow" ? 356 : 324;

  return config.stages.map((stage, index) => {
    const y = layerY.get(stage.layerId) ?? 80;
    const horizontalOffset = flowId === "data-upstream"
      ? (index % 2 === 0 ? -18 : 20)
      : flowId === "control-downstream"
        ? (index % 2 === 0 ? 24 : -18)
        : index === 2
          ? -10
          : index % 2 === 0
            ? 14
            : -18;

    return {
      x: centerX + horizontalOffset,
      y,
    };
  });
}

function buildPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[index - 1];
    const controlY = (previous.y + point.y) / 2;
    return `${path} C ${previous.x} ${controlY}, ${point.x} ${controlY}, ${point.x} ${point.y}`;
  }, "");
}

function sampleCurve(points: Array<{ x: number; y: number }>, sampleCount = 18) {
  if (points.length === 0) {
    return [];
  }

  if (points.length === 1) {
    return points;
  }

  const sampled: Array<{ x: number; y: number }> = [];
  for (let segmentIndex = 0; segmentIndex < points.length - 1; segmentIndex += 1) {
    const start = points[segmentIndex];
    const end = points[segmentIndex + 1];
    for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
      const t = sampleIndex / sampleCount;
      sampled.push({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      });
    }
  }

  sampled.push(points[points.length - 1]);
  return sampled;
}

function ParticleTrail({
  flowId,
  playbackSpeed,
  index,
}: {
  flowId: FlowId;
  playbackSpeed: number;
  index: number;
}) {
  const semanticFlow = flowSemantics[flowId];
  const points = sampleCurve(getStagePoints(flowId), 14);
  const duration = Math.max(1.4, 3.4 / Math.max(playbackSpeed, 0.5));
  const particleColor = semanticFlow.accent;
  const radius = semanticFlow.particles === "financial" ? (index === 0 ? 5.5 : 4) : index === 0 ? 5 : 3.6;

  return (
    <motion.circle
      r={radius}
      fill={particleColor}
      animate={{
        opacity: semanticFlow.particles === "financial" ? [0, 0.6, 1, 0.3, 0] : [0, 0.95, 0.95, 0],
        cx: points.map((point) => point.x),
        cy: points.map((point) => point.y),
        scale: semanticFlow.particles === "upstream" ? [0.7, 1, 1.16, 0.86] : semanticFlow.particles === "financial" ? [0.8, 1.08, 1.24, 0.86] : [0.76, 1, 1, 0.82],
      }}
      transition={{
        duration,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
        delay: index * 0.22,
      }}
      style={{ filter: `drop-shadow(0 0 12px ${particleColor})` }}
    />
  );
}

function DirectionalArrows({ flowId }: { flowId: FlowId }) {
  const positions = flowId === "data-upstream"
    ? [420, 342, 264]
    : flowId === "control-downstream"
      ? [210, 288, 366]
      : [246, 320, 394];
  const rotation = flowId === "data-upstream" ? 0 : 180;
  const color = flowSemantics[flowId].accent;

  return (
    <>
      {positions.map((y, index) => (
        <g key={`${flowId}-arrow-${index}`} transform={`translate(642 ${y}) rotate(${rotation})`} opacity={0.88 - index * 0.14}>
          <path d="M 0 0 L 10 -14 L 20 0" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </>
  );
}

function FlowLaneLabels({ flowId }: { flowId: FlowId }) {
  const semanticFlow = flowSemantics[flowId];
  const startY = flowId === "data-upstream" ? 456 : flowId === "control-downstream" ? 234 : 178;
  const endY = flowId === "data-upstream" ? 72 : flowId === "control-downstream" ? 456 : 368;

  return (
    <>
      <text x="604" y={startY} fill="rgba(255,255,255,0.42)" fontSize="10" letterSpacing="2.2" textAnchor="middle">
        {semanticFlow.sourceLabel.toUpperCase()}
      </text>
      <text x="604" y={endY} fill={semanticFlow.accent} fontSize="10" letterSpacing="2.2" textAnchor="middle">
        {semanticFlow.targetLabel.toUpperCase()}
      </text>
    </>
  );
}

function FinancialWaterfall({ accent }: { accent: string }) {
  const bars = [0.92, 0.72, 0.54, 0.36];
  return (
    <g opacity="0.96">
      {bars.map((height, index) => (
        <rect
          key={`settlement-bar-${index}`}
          x={534 + index * 34}
          y={308 - height * 94}
          rx="8"
          width="18"
          height={height * 94}
          fill={index === 0 ? accent : `${accent}${index === 1 ? "cc" : index === 2 ? "99" : "66"}`}
        />
      ))}
      <text x="600" y="214" fill={accent} fontSize="10" letterSpacing="2">SETTLEMENT</text>
    </g>
  );
}

export function FlowSequenceStage({
  currentFlowId,
  currentStep,
  totalSteps,
  playbackSpeed,
  activeLayerIds,
}: FlowSequenceStageProps) {
  const flow = flows.find((item) => item.id === currentFlowId) ?? flows[0];
  const { semanticFlow, progress, activeStageIndex } = getFlowSemanticState(currentFlowId, currentStep, totalSteps);
  const stagePoints = getStagePoints(currentFlowId);
  const stagePath = buildPath(stagePoints);
  const particleCount = currentFlowId === "data-upstream" ? 5 : currentFlowId === "financial-flow" ? 4 : 3;

  return (
    <div className="hs-panel p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="hs-eyebrow">Flow Visualization</p>
          <h3 className="mt-2 font-display text-2xl tracking-[-0.04em] text-white">{flow.name}</h3>
          <p className="mt-2 text-sm leading-6 text-white/66">{semanticFlow.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/58">
            {semanticFlow.directionCue}
          </div>
          <div
            className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em]"
            style={{
              color: semanticFlow.accent,
              borderColor: `${semanticFlow.accent}55`,
              background: `${semanticFlow.accent}12`,
              boxShadow: `0 0 24px ${semanticFlow.glow}`,
            }}
          >
            {semanticFlow.badge}
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)] p-4">
        <svg viewBox="0 0 760 540" className="h-[540px] w-full">
          <defs>
            <linearGradient id="flow-stage-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={semanticFlow.accent} stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.28" />
            </linearGradient>
          </defs>

          {visualLayers.map((layer) => {
            const y = layerY.get(layer.id) ?? 80;
            const isInFlow = activeLayerIds.includes(layer.id);
            const isFlowFocused = semanticFlow.stages.some((stage) => stage.layerId === layer.id);
            return (
              <g key={layer.id} opacity={isFlowFocused ? 1 : 0.78}>
                <rect
                  x="44"
                  y={y - 24}
                  rx="18"
                  width="244"
                  height="48"
                  fill={isInFlow ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.04)"}
                  stroke={isInFlow ? getLayerColor(layer.id) : isFlowFocused ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.08)"}
                  strokeWidth={isInFlow ? 1.8 : 1}
                />
                <rect x="44" y={y - 24} rx="18" width="8" height="48" fill={getLayerColor(layer.id)} />
                <text x="68" y={y - 2} fill="rgba(255,255,255,0.92)" fontSize="14" fontWeight="700">{layer.code} {layer.shortName}</text>
                <text x="68" y={y + 15} fill="rgba(255,255,255,0.50)" fontSize="10" letterSpacing="1.6">{layer.name.toUpperCase()}</text>
              </g>
            );
          })}

          <FlowLaneLabels flowId={currentFlowId} />
          <DirectionalArrows flowId={currentFlowId} />

          {currentFlowId === "data-upstream" ? (
            <g opacity="0.34">
              <path d="M 606 470 L 606 68" stroke={semanticFlow.accent} strokeWidth="1.5" strokeDasharray="6 10" />
            </g>
          ) : null}

          {currentFlowId === "control-downstream" ? (
            <g opacity="0.34">
              <path d="M 606 164 L 606 468" stroke={semanticFlow.accent} strokeWidth="1.5" strokeDasharray="2 10" />
            </g>
          ) : null}

          <motion.path
            d={stagePath}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="18"
            strokeLinecap="round"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 0.42 }}
            transition={{ duration: 0.4 }}
          />
          <motion.path
            key={`${currentFlowId}-${currentStep}`}
            d={stagePath}
            fill="none"
            stroke="url(#flow-stage-gradient)"
            strokeWidth={currentFlowId === "control-downstream" ? 7 : currentFlowId === "financial-flow" ? 10 : 8}
            strokeLinecap="round"
            strokeDasharray={semanticFlow.pathDash}
            initial={{ pathLength: 0, opacity: 0.45 }}
            animate={{ pathLength: Math.max(progress, 0.18), opacity: [0.45, 1, 0.72] }}
            transition={{ duration: Math.max(1.2, 2.8 / Math.max(playbackSpeed, 0.5)), ease: "easeInOut" }}
          />

          {currentFlowId === "financial-flow" ? (
            <>
              <rect x="510" y="196" rx="18" width="180" height="132" fill="rgba(244,201,93,0.06)" stroke="rgba(244,201,93,0.28)" strokeWidth="1.2" />
              <FinancialWaterfall accent={semanticFlow.accent} />
            </>
          ) : null}

          {Array.from({ length: particleCount }, (_, index) => (
            <ParticleTrail key={`${currentFlowId}-${index}`} flowId={currentFlowId} playbackSpeed={playbackSpeed} index={index} />
          ))}

          {semanticFlow.stages.map((stage, index) => {
            const point = stagePoints[index];
            const isActive = index <= activeStageIndex;
            const tone = semanticFlow.accent;
            const anchorX = currentFlowId === "control-downstream" ? point.x - 26 : point.x + 24;
            const textAnchor = currentFlowId === "control-downstream" ? "end" : "start";

            return (
              <g key={`${stage.label}-${index}`}>
                {currentFlowId === "control-downstream" ? (
                  <rect
                    x={point.x - (isActive ? 13 : 10)}
                    y={point.y - (isActive ? 13 : 10)}
                    width={(isActive ? 26 : 20)}
                    height={(isActive ? 26 : 20)}
                    rx="6"
                    fill={isActive ? tone : "rgba(255,255,255,0.18)"}
                    stroke="rgba(255,255,255,0.24)"
                    strokeWidth="1.5"
                  />
                ) : (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 13 : 10}
                    fill={isActive ? tone : "rgba(255,255,255,0.18)"}
                    stroke="rgba(255,255,255,0.24)"
                    strokeWidth="1.5"
                  />
                )}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 26 : 18}
                  fill="transparent"
                  stroke={isActive ? `${tone}55` : "rgba(255,255,255,0.06)"}
                  strokeWidth="1.2"
                />
                <text x={anchorX} y={point.y - 8} textAnchor={textAnchor} fill="rgba(255,255,255,0.96)" fontSize="13" fontWeight="700">
                  {stage.label}
                </text>
                <text x={anchorX} y={point.y + 10} textAnchor={textAnchor} fill="rgba(255,255,255,0.56)" fontSize="10.5">
                  {stage.caption}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}