import { layers } from "@/data/hyperstack";
import { getLayerColor } from "@/utils/hyperstack/layer-colors";
import type { LayerDefinition } from "@/types/hyperstack";

interface LayerLegendProps {
  activeLayer: LayerDefinition;
}

export function LayerLegend({ activeLayer }: LayerLegendProps) {
  return (
    <div className="hs-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="hs-eyebrow">Layer Legend</p>
          <p className="mt-2 text-sm leading-6 text-white/68">
            HyperStack integrates infrastructure, standardization, AI control, and financialization into one operating system.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/50">
          6 Layers
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {layers
          .slice()
          .reverse()
          .map((layer) => {
            const isActive = layer.id === activeLayer.id;
            return (
              <div
                key={layer.id}
                className={`flex items-center gap-3 rounded-[18px] border px-3 py-3 transition ${
                  isActive ? "border-white/18 bg-white/[0.09]" : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full shadow-[0_0_16px_currentColor]"
                  style={{ background: getLayerColor(layer.id), color: getLayerColor(layer.id) }}
                />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{layer.code}</p>
                  <p className="mt-1 text-sm font-medium text-white">{getLegendLabel(layer)}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function getLegendLabel(layer: LayerDefinition) {
  switch (layer.id) {
    case "l1-physical":
      return "Physical Infrastructure";
    case "l2-aimeps":
      return "AIMEPS Standard";
    case "l3-gtl-link":
      return "GTL-Link Middleware";
    case "l4-ashs":
      return "ASHS OS";
    case "l5-financial-protocol":
      return "Financial Protocol";
    case "l6-eop-platform":
      return "EOP Platform";
  }
}

