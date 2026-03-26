import { ReactNode } from "react";

type CompactKpiCardProps = {
  label: string;
  value: string;
  detail?: string;
  accentClass?: string;
  badge?: string;
  icon?: ReactNode;
};

export function CompactKpiCard({ label, value, detail, accentClass = "text-white", badge, icon }: CompactKpiCardProps) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.05] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/46">{label}</p>
          <p className={`mt-1.5 truncate text-[clamp(2rem,2.45vw,3.4rem)] font-semibold uppercase tracking-[-0.055em] ${accentClass}`}>
            {value}
          </p>
        </div>
        {badge ? (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/64">
            {badge}
          </span>
        ) : icon ? (
          icon
        ) : null}
      </div>
      {detail ? <p className="mt-1.5 line-clamp-1 text-[13px] leading-5 text-white/60">{detail}</p> : null}
    </div>
  );
}