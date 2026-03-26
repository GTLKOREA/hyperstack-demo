import type { FlowId, LayerId } from "@/types/hyperstack";

export interface SemanticStage {
  layerId: LayerId;
  label: string;
  caption: string;
}

interface FlowSemanticDefinition {
  accent: string;
  glow: string;
  direction: string;
  badge: string;
  subtitle: string;
  feeling: string;
  financialMeaning: string;
  particles: "upstream" | "downstream" | "financial";
  pathDash: string;
  sourceLabel: string;
  targetLabel: string;
  directionCue: string;
  stages: SemanticStage[];
}

export const flowSemantics: Record<FlowId, FlowSemanticDefinition> = {
  "data-upstream": {
    accent: "#57B8FF",
    glow: "rgba(87, 184, 255, 0.34)",
    direction: "Upstream",
    badge: "Rising Intelligence",
    subtitle: "Physical measurement -> semantic standardization -> protocol normalization -> AI optimization -> KPI attestation -> market output",
    feeling: "Signals rise through the stack as raw measurements become machine intelligence and market-ready outputs.",
    financialMeaning: "The upstream flow turns raw infrastructure data into KPI-grade proof that supports revenue quality and investor reporting.",
    particles: "upstream",
    pathDash: "14 12",
    sourceLabel: "Physical Edge",
    targetLabel: "Executive / Market Surface",
    directionCue: "Bottom to top",
    stages: [
      { layerId: "l1-physical", label: "Physical Measurement", caption: "Field telemetry and infrastructure state are measured at the asset edge." },
      { layerId: "l2-aimeps", label: "Semantic Standardization", caption: "AIMEPS structures raw telemetry into machine-operable meaning." },
      { layerId: "l3-gtl-link", label: "Protocol Normalization", caption: "GTL-Link normalizes inter-layer exchange into a trusted protocol channel." },
      { layerId: "l4-ashs", label: "AI Optimization", caption: "ASHS converts standardized signals into supervisory operating intelligence." },
      { layerId: "l5-financial-protocol", label: "KPI Attestation", caption: "Performance proof is attested for economic and governance use." },
      { layerId: "l6-eop-platform", label: "Market Output", caption: "The platform surfaces investor-ready market and service outcomes." },
    ],
  },
  "control-downstream": {
    accent: "#39E6D2",
    glow: "rgba(57, 230, 210, 0.32)",
    direction: "Downstream",
    badge: "Precise Execution",
    subtitle: "AI decision -> translated control -> physical execution",
    feeling: "Control descends with intent, precision, and verification until the field responds at the physical edge.",
    financialMeaning: "The downstream flow protects uptime, lowers operating waste, and preserves the KPI base that drives ROI and bankability.",
    particles: "downstream",
    pathDash: "4 10",
    sourceLabel: "Supervisory Decision",
    targetLabel: "Field Execution",
    directionCue: "Top to bottom",
    stages: [
      { layerId: "l4-ashs", label: "AI Decision", caption: "ASHS selects the optimal balancing or recovery action." },
      { layerId: "l3-gtl-link", label: "Translated Control", caption: "GTL-Link converts intent into synchronized control packets." },
      { layerId: "l1-physical", label: "Physical Execution", caption: "Field assets execute the instruction across energy and compute infrastructure." },
    ],
  },
  "financial-flow": {
    accent: "#F4C95D",
    glow: "rgba(244, 201, 93, 0.34)",
    direction: "Financial",
    badge: "Value Conversion",
    subtitle: "KPI -> contract logic -> waterfall settlement -> financial service / investor view",
    feeling: "Verified operational proof converts into settlement logic, waterfall allocation, and investor-visible financial outcomes.",
    financialMeaning: "This is the explicit monetization layer, where verified operations become settlement, cash yield, and capital-grade clarity.",
    particles: "financial",
    pathDash: "10 16",
    sourceLabel: "Verified KPI Proof",
    targetLabel: "Investor / Service View",
    directionCue: "Proof to settlement",
    stages: [
      { layerId: "l4-ashs", label: "KPI Proof", caption: "Verified operating KPIs are prepared as trusted settlement inputs." },
      { layerId: "l5-financial-protocol", label: "Contract Logic", caption: "Programmable finance rules evaluate payouts, incentives, and obligations." },
      { layerId: "l5-financial-protocol", label: "Waterfall Settlement", caption: "A financial waterfall allocates value across reserves, partners, and distributions." },
      { layerId: "l6-eop-platform", label: "Investor View", caption: "EOP publishes the financial service layer and investor-facing result." },
    ],
  },
};

export function getFlowSemanticState(flowId: FlowId, currentStep: number, totalSteps: number) {
  const semanticFlow = flowSemantics[flowId];
  const progress = totalSteps <= 1 ? 1 : currentStep / (totalSteps - 1);
  const activeStageIndex = Math.round(progress * (semanticFlow.stages.length - 1));
  const activeStage = semanticFlow.stages[activeStageIndex] ?? semanticFlow.stages[0];
  const nextStage = semanticFlow.stages[Math.min(activeStageIndex + 1, semanticFlow.stages.length - 1)] ?? activeStage;

  return {
    semanticFlow,
    progress,
    activeStageIndex,
    activeStage,
    nextStage,
  };
}