export type ViewId =
  | "value-flow"
  | "architecture"
  | "sequence"
  | "comparison"
  | "dashboard"
  | "map";

export type LayerId =
  | "l1-physical"
  | "l2-aimeps"
  | "l3-gtl-link"
  | "l4-ashs"
  | "l5-financial-protocol"
  | "l6-eop-platform";

export type FlowId = "data-upstream" | "control-downstream" | "financial-flow";

export type ScenarioId =
  | "normal-operation"
  | "black-start"
  | "peak-load"
  | "kpi-settlement";

export interface LayerMetric {
  label: string;
  value: string;
}

export interface LayerDefinition {
  id: LayerId;
  code: string;
  name: string;
  shortName: string;
  description: string;
  functions: string[];
  metrics: LayerMetric[];
  accent: string;
  glow: string;
  position: number;
}

export interface FlowDefinition {
  id: FlowId;
  name: string;
  direction: string;
  description: string;
  color: string;
  sourceLayer: LayerId;
  targetLayer: LayerId;
}

export interface EventLogEntry {
  time: string;
  severity: "info" | "signal" | "alert";
  message: string;
}

export interface ScenarioKpi {
  label: string;
  value: string;
  delta: string;
  trend: number[];
  tone: "good" | "watch" | "neutral";
}

export interface MapNode {
  id: string;
  name: string;
  x: number;
  y: number;
  region: string;
  load: number;
  status: string;
}

export interface ScenarioEvent {
  id: string;
  title: string;
  caption: string;
  timestamp: string;
  layerId: LayerId;
  flowId: FlowId;
  highlightLayers: LayerId[];
  metrics: Array<{ label: string; value: string }>;
  log: EventLogEntry;
}

export interface ScenarioDefinition {
  id: ScenarioId;
  name: string;
  summary: string;
  outlook: string;
  accent: string;
  captionLead: string;
  kpis: ScenarioKpi[];
  logs: EventLogEntry[];
  events: ScenarioEvent[];
  mapNodes: MapNode[];
  comparison: {
    resilience: number;
    throughput: number;
    margin: number;
    autonomy: number;
  };
}
