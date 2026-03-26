import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { layers } from "@/data/hyperstack";
import { getLayerColor, getLayerGlow } from "@/utils/hyperstack/layer-colors";
import { useHyperStackStore } from "@/store/use-hyperstack-store";
import type { LayerDefinition, LayerId } from "@/types/hyperstack";

interface LayerStackProps {
  activeLayer: LayerDefinition;
}

export function LayerStack({ activeLayer }: LayerStackProps) {
  const { setSelectedLayer } = useHyperStackStore();
  const [hoveredLayerId, setHoveredLayerId] = useState<LayerId | null>(null);
  const orderedLayers = useMemo(() => layers.slice().reverse(), []);
  const activeIndex = orderedLayers.findIndex((layer) => layer.id === activeLayer.id);

  return (
    <div className="relative flex h-full min-h-[680px] items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(12,68,124,0.14),transparent_24%),radial-gradient(circle_at_bottom,rgba(153,53,86,0.12),transparent_30%),linear-gradient(180deg,rgba(8,14,24,0.98)_0%,rgba(4,8,14,0.98)_100%)] px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-12 h-36 w-[46%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.10),transparent_72%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 h-20 w-[62%] -translate-x-1/2 rounded-full bg-black/55 blur-2xl" />
      <div className="pointer-events-none absolute bottom-[96px] left-1/2 h-[460px] w-[2px] -translate-x-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.22)_52%,rgba(255,255,255,0.02)_100%)]" />

      <div className="relative z-10 flex w-full max-w-[820px] flex-col items-center justify-center [perspective:1800px]">
        {orderedLayers.map((layer, index) => {
          const isActive = layer.id === activeLayer.id;
          const isHovered = layer.id === hoveredLayerId;
          const verticalOffset = index * -34;
          const distanceFromActive = Math.abs(index - activeIndex);
          const dimmed = !isActive && activeIndex >= 0 && distanceFromActive > 2;

          return (
            <motion.button
              key={layer.id}
              type="button"
              layout
              onClick={() => setSelectedLayer(layer.id)}
              onMouseEnter={() => setHoveredLayerId(layer.id)}
              onMouseLeave={() => setHoveredLayerId(null)}
              onFocus={() => setHoveredLayerId(layer.id)}
              onBlur={() => setHoveredLayerId(null)}
              whileHover={{ y: verticalOffset - 8, scale: 1.012 }}
              whileTap={{ scale: 0.994 }}
              animate={{
                y: verticalOffset,
                scale: isActive ? 1.065 : isHovered ? 1.018 : 1,
                opacity: dimmed ? 0.78 : 1,
                zIndex: isActive ? 30 : 18 - index,
                boxShadow: isActive
                  ? `0 34px 94px ${getLayerGlow(layer.id)}`
                  : `0 18px 42px ${getLayerGlow(layer.id).replace("0.42", "0.14")}`,
              }}
              transition={{ type: "spring", stiffness: 210, damping: 24 }}
              className="group relative w-full max-w-[640px] text-left outline-none"
              style={{ transformStyle: "preserve-3d" }}
              aria-pressed={isActive}
            >
              <span
                className="absolute inset-x-7 -bottom-5 h-7 rounded-[24px] blur-xl"
                style={{ background: getLayerGlow(layer.id) }}
              />

              <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                <div
                  className="absolute inset-x-[18px] top-[-14px] h-[20px] rounded-t-[24px] border border-white/12"
                  style={{
                    background: `linear-gradient(180deg, ${getLayerColor(layer.id)}58 0%, ${getLayerColor(layer.id)}2c 100%)`,
                    transform: "rotateX(78deg)",
                    transformOrigin: "center bottom",
                  }}
                />
                <div
                  className="absolute -right-[12px] inset-y-[12px] w-[16px] rounded-r-[20px] border border-white/8"
                  style={{
                    background: `linear-gradient(180deg, ${getLayerColor(layer.id)}36 0%, rgba(255,255,255,0.02) 100%)`,
                    transform: "rotateY(-68deg)",
                    transformOrigin: "left center",
                  }}
                />

                <div
                  className={`relative overflow-hidden rounded-[28px] border px-6 py-5 backdrop-blur-xl transition-all duration-300 ${
                    isActive ? "border-white/24 bg-white/[0.13]" : "border-white/10 bg-white/[0.055]"
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${getLayerColor(layer.id)}40 0%, rgba(255,255,255,0.05) 56%, rgba(255,255,255,0.015) 100%)`,
                    transform: "rotateX(13deg)",
                    transformOrigin: "center bottom",
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.025)_34%,transparent_74%)] opacity-90" />
                  <div className="absolute inset-y-0 left-0 w-2.5" style={{ background: getLayerColor(layer.id) }} />
                  {isActive ? (
                    <div className="absolute inset-0 ring-1 ring-white/16 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_0_0_1px_rgba(255,255,255,0.08)]" />
                  ) : null}

                  <div className="relative flex items-center justify-between gap-5 pl-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-[11px] uppercase tracking-[0.30em] text-white/50">{layer.code}</p>
                        <span className="h-px w-10 bg-white/14" />
                        <p className="text-[10px] uppercase tracking-[0.24em] text-white/44">{getLayerCategory(layer.id)}</p>
                      </div>
                      <h3 className="mt-2 font-display text-[clamp(1.08rem,1.7vw,1.5rem)] font-semibold tracking-[-0.04em] text-white">
                        {getLayerLabel(layer)}
                      </h3>
                      <p className="mt-2 text-sm text-white/76">{getEngineLabel(layer.id)}</p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span
                        className="h-3.5 w-3.5 rounded-full shadow-[0_0_24px_currentColor]"
                        style={{ background: getLayerColor(layer.id), color: getLayerColor(layer.id) }}
                      />
                      <span
                        className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] ${
                          isActive
                            ? "border-white/18 bg-white/[0.12] text-white shadow-[0_0_22px_rgba(255,255,255,0.08)]"
                            : isHovered
                              ? "border-white/14 bg-white/[0.08] text-white/82"
                              : "border-white/10 text-white/58"
                        }`}
                      >
                        {isActive ? "Active Layer" : isHovered ? "Inspect" : "Layer"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function getLayerLabel(layer: LayerDefinition) {
  if (layer.id === "l1-physical") {
    return "Physical Infrastructure";
  }

  if (layer.id === "l5-financial-protocol") {
    return "Financial Protocol";
  }

  if (layer.id === "l6-eop-platform") {
    return "EOP Platform";
  }

  return `${layer.name} ${layer.id === "l2-aimeps" ? "Standard" : layer.id === "l3-gtl-link" ? "Middleware" : "OS"}`;
}

function getLayerCategory(layerId: LayerId) {
  switch (layerId) {
    case "l1-physical":
      return "Infrastructure";
    case "l2-aimeps":
      return "Standardization";
    case "l3-gtl-link":
      return "Interoperability";
    case "l4-ashs":
      return "Autonomy";
    case "l5-financial-protocol":
      return "Financialization";
    case "l6-eop-platform":
      return "Platform";
  }
}

function getEngineLabel(layerId: LayerId) {
  switch (layerId) {
    case "l1-physical":
      return "Energy, compute, sensor, and site control fabric";
    case "l2-aimeps":
      return "Measurement, prediction, and optimization engine";
    case "l3-gtl-link":
      return "Trusted routing and interoperability engine";
    case "l4-ashs":
      return "Autonomous supervisory operating system";
    case "l5-financial-protocol":
      return "Settlement, incentive, and value orchestration engine";
    case "l6-eop-platform":
      return "Executive operating and investor intelligence layer";
  }
}