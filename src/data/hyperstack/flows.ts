import type { FlowDefinition } from '@/types/hyperstack';

export const flows: FlowDefinition[] = [
  {
    id: "data-upstream",
    name: "Data Upstream",
    direction: "L1 -> L6",
    description: "Telemetry, forecasts, and verified outcomes rise from assets into executive intelligence.",
    color: "#0C447C",
    sourceLayer: "l1-physical",
    targetLayer: "l6-eop-platform",
  },
  {
    id: "control-downstream",
    name: "Control Downstream",
    direction: "L4 -> L1",
    description: "Autonomous supervisory commands descend to the field for balancing, dispatch, and recovery.",
    color: "#085041",
    sourceLayer: "l4-ashs",
    targetLayer: "l1-physical",
  },
  {
    id: "financial-flow",
    name: "Financial Flow",
    direction: "L4 -> L6",
    description: "Performance-aware settlement propagates market and incentive outcomes into platform reporting.",
    color: "#854F0B",
    sourceLayer: "l4-ashs",
    targetLayer: "l6-eop-platform",
  },
];

