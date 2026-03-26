import { layers } from "@/data/hyperstack";
import type { LayerDefinition, LayerId } from "@/types/hyperstack";

const layerMap = new Map<LayerId, LayerDefinition>(layers.map((layer) => [layer.id, layer]));

export function getLayerColor(layerId: LayerId) {
  return layerMap.get(layerId)?.accent ?? "#FFFFFF";
}

export function getLayerGlow(layerId: LayerId) {
  return layerMap.get(layerId)?.glow ?? "rgba(255,255,255,0.24)";
}

export function getLayerPalette(layerId: LayerId) {
  const layer = layerMap.get(layerId);
  return {
    color: layer?.accent ?? "#FFFFFF",
    glow: layer?.glow ?? "rgba(255,255,255,0.24)",
    name: layer?.name ?? "Layer",
    code: layer?.code ?? "LX",
  };
}

