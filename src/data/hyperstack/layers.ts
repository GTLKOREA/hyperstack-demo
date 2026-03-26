import type { LayerDefinition } from '@/types/hyperstack';

export const layers: LayerDefinition[] = [
  {
    id: "l1-physical",
    code: "L1",
    name: "Physical",
    shortName: "Physical",
    description:
      "Energy assets, compute fabric, sensors, and industrial equipment expose raw state and dispatch potential.",
    functions: ["Asset telemetry", "Power dispatch", "Compute availability"],
    metrics: [
      { label: "Sites", value: "84" },
      { label: "Asset Uptime", value: "99.82%" },
      { label: "Flex Capacity", value: "4.8 GW" },
    ],
    accent: "#1E6B3A",
    glow: "rgba(30, 107, 58, 0.42)",
    position: 0,
  },
  {
    id: "l2-aimeps",
    code: "L2",
    name: "AIMEPS",
    shortName: "AIMEPS",
    description:
      "AI-based measurement, prediction, and optimization system normalizes telemetry into machine-operable intelligence.",
    functions: ["Forecasting", "Anomaly detection", "Optimization signals"],
    metrics: [
      { label: "Inference Latency", value: "28 ms" },
      { label: "Forecast Gain", value: "+12.4%" },
      { label: "Anomaly Coverage", value: "97%" },
    ],
    accent: "#0C447C",
    glow: "rgba(12, 68, 124, 0.42)",
    position: 1,
  },
  {
    id: "l3-gtl-link",
    code: "L3",
    name: "GTL-Link",
    shortName: "GTL-Link",
    description:
      "Digital connectivity mesh synchronizes energy, compute, logistics, and identity channels into a trusted transport layer.",
    functions: ["Inter-layer routing", "State synchronization", "Trust relay"],
    metrics: [
      { label: "Packet Integrity", value: "99.999%" },
      { label: "Cross-Domain Links", value: "312" },
      { label: "Consensus Time", value: "410 ms" },
    ],
    accent: "#3C3489",
    glow: "rgba(60, 52, 137, 0.42)",
    position: 2,
  },
  {
    id: "l4-ashs",
    code: "L4",
    name: "ASHS",
    shortName: "ASHS",
    description:
      "Autonomous supervisory intelligence issues policy, balancing, and recovery decisions across the operating estate.",
    functions: ["Policy orchestration", "Autonomous control", "Scenario recovery"],
    metrics: [
      { label: "Decision Cadence", value: "1.8 s" },
      { label: "Autonomy Rate", value: "86%" },
      { label: "Recovery Window", value: "4.2 min" },
    ],
    accent: "#085041",
    glow: "rgba(8, 80, 65, 0.42)",
    position: 3,
  },
  {
    id: "l5-financial-protocol",
    code: "L5",
    name: "Financial Protocol",
    shortName: "Financial",
    description:
      "Settlement, incentives, and programmable finance convert operating performance into machine-readable economic outcomes.",
    functions: ["Settlement logic", "Incentive routing", "Yield accounting"],
    metrics: [
      { label: "Daily Settlement", value: "$12.4M" },
      { label: "Margin Capture", value: "+8.2%" },
      { label: "Tokenized Flows", value: "31%" },
    ],
    accent: "#854F0B",
    glow: "rgba(133, 79, 11, 0.42)",
    position: 4,
  },
  {
    id: "l6-eop-platform",
    code: "L6",
    name: "EOP Platform",
    shortName: "EOP",
    description:
      "Executive operating platform exposes outcomes, auditability, and investment-ready intelligence to operators and capital partners.",
    functions: ["Executive visibility", "Presentation APIs", "Investor reporting"],
    metrics: [
      { label: "Portfolio ROI", value: "18.9%" },
      { label: "Operational Score", value: "94/100" },
      { label: "Time to Insight", value: "11 s" },
    ],
    accent: "#993556",
    glow: "rgba(153, 53, 86, 0.42)",
    position: 5,
  },
];

