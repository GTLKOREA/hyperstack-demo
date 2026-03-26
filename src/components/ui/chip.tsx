import type { HTMLAttributes, PropsWithChildren } from "react";

interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "layer";
}

export function Chip({
  tone = "neutral",
  className = "",
  style,
  children,
  ...props
}: PropsWithChildren<ChipProps>) {
  const toneClass = tone === "layer"
    ? "hs-chip border-white/12 bg-white/[0.08] text-white/86 shadow-[0_14px_32px_rgba(0,0,0,0.18)]"
    : "hs-chip border-white/10 bg-white/[0.045] text-white/66 shadow-[0_12px_28px_rgba(0,0,0,0.16)]";

  return (
    <span {...props} style={style} className={`${toneClass} ${className}`.trim()}>
      {children}
    </span>
  );
}