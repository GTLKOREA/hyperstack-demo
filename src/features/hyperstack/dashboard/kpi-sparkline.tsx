import { motion } from "framer-motion";

export function KpiSparkline({
  values,
  activeIndex,
  tone,
}: {
  values: number[];
  activeIndex: number;
  tone: "good" | "watch" | "neutral";
}) {
  const width = 164;
  const height = 52;
  const padding = 6;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const path = points.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${acc} L ${point.x} ${point.y}`;
  }, "");

  const areaPath = `${path} L ${points[points.length - 1]?.x ?? width - padding} ${height - padding} L ${points[0]?.x ?? padding} ${height - padding} Z`;
  const stroke = tone === "good" ? "#39E6D2" : tone === "watch" ? "#F4C95D" : "#57B8FF";
  const activePoint = points[Math.min(activeIndex, points.length - 1)] ?? points[0];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-14 w-full overflow-visible">
      <defs>
        <linearGradient id={`spark-${tone}`} x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id={`spark-area-${tone}`} x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.24" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={path} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" strokeLinecap="round" />
      <motion.path
        d={areaPath}
        fill={`url(#spark-area-${tone})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={`url(#spark-${tone})`}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />
      {points.map((point, index) => (
        <circle
          key={`${point.x}-${point.y}`}
          cx={point.x}
          cy={point.y}
          r={index === activeIndex ? 4.5 : 2.4}
          fill={index === activeIndex ? stroke : "rgba(255,255,255,0.32)"}
        />
      ))}
      {activePoint ? <circle cx={activePoint.x} cy={activePoint.y} r={9} fill={`${stroke}22`} /> : null}
    </svg>
  );
}