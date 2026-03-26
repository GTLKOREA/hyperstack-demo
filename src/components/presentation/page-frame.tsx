"use client";

import { ReactNode } from "react";
import { useAutoDemo } from "@/components/presentation/auto-demo-provider";

type PageFrameProps = {
  eyebrow: string;
  title: string;
  status?: string;
  children: ReactNode;
};

export function PageFrame({ eyebrow, title, status, children }: PageFrameProps) {
  const { autoMode, currentStep, totalSteps, countdown, isPaused } = useAutoDemo();

  return (
    <main className="presentation-root h-screen overflow-hidden bg-[#040816] text-white">
      <div className="presentation-safe demo-page-enter relative h-full overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-16%] h-[24rem] w-[24rem] rounded-full bg-cyan/12 blur-3xl" />
          <div className="absolute right-[-6%] top-[6%] h-[18rem] w-[18rem] rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute bottom-[-8%] left-[34%] h-[16rem] w-[16rem] rounded-full bg-coral/10 blur-3xl" />
        </div>

        <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(4,8,22,0.72)] p-3 shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan">{eyebrow}</p>
              <h1 className="mt-1.5 text-[clamp(3rem,3.4vw,4.5rem)] font-semibold uppercase leading-[0.94] tracking-[-0.06em] text-white">
                {title}
              </h1>
            </div>
            <div className="flex items-center gap-2.5">
              {status ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/62">
                  {status}
                </div>
              ) : null}
              {autoMode ? (
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_12px_rgba(95,225,230,0.9)]" />
                  AUTO DEMO MODE ON
                  <span className="text-white/48">STEP {currentStep} / {totalSteps}</span>
                  <span className="text-white/72">{isPaused ? "PAUSED" : `NEXT IN ${String(countdown).padStart(2, "0")}s`}</span>
                </div>
              ) : null}
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    </main>
  );
}
