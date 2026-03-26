type FlowStepCardProps = {
  step: string;
  title: string;
  summary: string;
  state?: string;
  active?: boolean;
  compact?: boolean;
};

export function FlowStepCard({ step, title, summary, state, active = false, compact = false }: FlowStepCardProps) {
  return (
    <div
      className={`rounded-[20px] border p-4 transition duration-300 ${
        active
          ? "border-cyan/40 bg-cyan/10 shadow-[0_16px_36px_rgba(95,225,230,0.12)]"
          : "border-white/10 bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">{step}</p>
        {state ? (
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${active ? "bg-cyan/12 text-cyan" : "bg-white/8 text-white/60"}`}>
            {state}
          </span>
        ) : null}
      </div>
      <h3 className="mt-2 text-[1.05rem] font-semibold uppercase tracking-[-0.02em] text-white">{title}</h3>
      <p className={`mt-2 ${compact ? "text-[13px] leading-5" : "text-sm leading-5"} text-white/64`}>{summary}</p>
    </div>
  );
}
