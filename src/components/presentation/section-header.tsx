import { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  badge?: string;
  action?: ReactNode;
};

export function SectionHeader({ eyebrow, title, badge, action }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-white/46">{eyebrow}</p>
        <h2 className="mt-2 text-[clamp(1.9rem,2vw,2.8rem)] font-semibold uppercase tracking-[-0.035em] text-white">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        {badge ? (
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            {badge}
          </span>
        ) : null}
        {action}
      </div>
    </div>
  );
}
