"use client";

import { useEffect, useState } from "react";
import { PageFrame } from "@/components/presentation/page-frame";
import { useAutoDemo } from "@/components/presentation/auto-demo-provider";

type NumberBlock = {
  target: number;
  overshoot?: number;
  prefix?: string;
  suffix?: string;
  decimals: number;
  label: string;
  accent: string;
  glow: string;
  displayValue?: string;
};

const numberBlocks: NumberBlock[] = [
  {
    target: 2.4,
    overshoot: 2.45,
    prefix: "$",
    suffix: "B",
    decimals: 1,
    label: "TOTAL INVESTABLE VALUE",
    accent: "text-gold",
    glow: "shadow-[0_0_56px_rgba(244,184,96,0.22),0_24px_60px_rgba(0,0,0,0.22)]",
  },
  {
    target: 18.6,
    overshoot: 18.9,
    prefix: "",
    suffix: "%",
    decimals: 1,
    label: "EXPECTED INVESTOR RETURN",
    accent: "text-cyan",
    glow: "shadow-[0_0_56px_rgba(95,225,230,0.2),0_24px_60px_rgba(0,0,0,0.22)]",
  },
  {
    target: 15,
    overshoot: 15.4,
    prefix: "",
    suffix: "%",
    decimals: 0,
    displayValue: "12-15%",
    label: "ANNUAL CASH YIELD",
    accent: "text-coral",
    glow: "shadow-[0_0_56px_rgba(255,122,89,0.18),0_24px_60px_rgba(0,0,0,0.22)]",
  },
];

const flowSteps = ["ASSET", "DATA", "TWIN", "REVENUE", "RETURN"];
const sectionOrder = ["kpi", "flow", "cta"] as const;
const liveStatuses = ["Updating", "Synced"] as const;

function animatedMetricValue(value: number, config: NumberBlock, index: number, settled: boolean) {
  if (index === 2 && config.displayValue) {
    return settled ? config.displayValue : `${value.toFixed(config.decimals)}${config.suffix ?? ""}`;
  }

  return `${config.prefix ?? ""}${value.toFixed(config.decimals)}${config.suffix ?? ""}`;
}

export function IntroShell() {
  const { navigateTo, countdown } = useAutoDemo();
  const [showNumbers, setShowNumbers] = useState(false);
  const [showHeadline, setShowHeadline] = useState(false);
  const [showFlow, setShowFlow] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [activeFlow, setActiveFlow] = useState(0);
  const [activeSection, setActiveSection] = useState<(typeof sectionOrder)[number]>("kpi");
  const [sectionCountdown, setSectionCountdown] = useState(4);
  const [animatedValues, setAnimatedValues] = useState<number[]>(() => numberBlocks.map(() => 0));
  const [valueGlow, setValueGlow] = useState(false);
  const [lastUpdatedSeconds, setLastUpdatedSeconds] = useState(0);
  const [liveStatus, setLiveStatus] = useState<(typeof liveStatuses)[number]>("Updating");

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setShowNumbers(true), 100),
      window.setTimeout(() => setShowHeadline(true), 650),
      window.setTimeout(() => setShowFlow(true), 1200),
      window.setTimeout(() => setShowCta(true), 2500),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    const flowTimer = window.setInterval(() => {
      setActiveFlow((prev) => (prev + 1) % flowSteps.length);
    }, 1500);

    return () => window.clearInterval(flowTimer);
  }, []);

  useEffect(() => {
    let frameId = 0;
    const start = performance.now();
    const duration = 760;

    const tick = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);

      setAnimatedValues(
        numberBlocks.map((block) => {
          const overshootTarget = block.overshoot ?? block.target;
          if (progress < 0.82) {
            const local = progress / 0.82;
            const eased = 1 - Math.pow(1 - local, 3);
            return Number((overshootTarget * eased).toFixed(block.decimals));
          }

          const settle = (progress - 0.82) / 0.18;
          const value = overshootTarget + (block.target - overshootTarget) * settle;
          return Number(value.toFixed(block.decimals));
        })
      );

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        setValueGlow(true);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const sectionTimer = window.setInterval(() => {
      setActiveSection((prev) => sectionOrder[(sectionOrder.indexOf(prev) + 1) % sectionOrder.length]);
      setSectionCountdown(4);
    }, 4000);

    const countdownTimer = window.setInterval(() => {
      setSectionCountdown((prev) => (prev <= 1 ? 4 : prev - 1));
    }, 1000);

    return () => {
      window.clearInterval(sectionTimer);
      window.clearInterval(countdownTimer);
    };
  }, []);

  useEffect(() => {
    const updateTimer = window.setInterval(() => {
      setLiveStatus("Updating");
      setLastUpdatedSeconds(0);
      window.setTimeout(() => {
        setLiveStatus("Synced");
      }, 900);
    }, 3200);

    const elapsedTimer = window.setInterval(() => {
      setLastUpdatedSeconds((prev) => (prev >= 3 ? 3 : prev + 1));
    }, 1000);

    return () => {
      window.clearInterval(updateTimer);
      window.clearInterval(elapsedTimer);
    };
  }, []);

  const subtleProgressWidth = `${Math.max(8, ((4 - sectionCountdown) / 4) * 100)}%`;

  return (
    <PageFrame
      eyebrow="AUTO DEMO MODE"
      title="INVESTABLE FINANCIAL ASSETS"
      status={`NEXT SCENE IN ${String(Math.max(0, countdown)).padStart(2, "0")}s`}
    >
      <div className="grid h-full min-h-0 grid-cols-12 gap-4">
        <section className="col-span-12 grid min-h-0 grid-rows-[auto_auto_1fr_auto] gap-5">
          <div className="presentation-panel rounded-[24px] px-5 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-cyan shadow-[0_0_12px_rgba(95,225,230,0.9)]" />
                <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-cyan">
                  AUTO DEMO MODE
                </p>
                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/58">
                  KPI -&gt; FLOW -&gt; CTA
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan via-gold to-coral transition-all duration-500"
                    style={{ width: subtleProgressWidth }}
                  />
                </div>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/56">
                  {activeSection}
                </span>
              </div>
            </div>
          </div>

          <div className="grid min-h-0 grid-cols-12 gap-4">
            <div className="col-span-12 rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(95,225,230,0.16),transparent_35%),linear-gradient(180deg,rgba(9,11,23,0.96),rgba(6,8,18,0.92))] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.36)] lg:col-span-8">
              <div className="space-y-6">
                <div className={`space-y-3 transition-all duration-700 ${showHeadline ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.32em] text-gold/80">
                    HYPERSTACK FINANCIAL OS
                  </p>
                  <h2 className="max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-white lg:text-[4.5rem]">
                    Assets that can be read by capital.
                  </h2>
                  <p className="max-w-2xl text-base leading-relaxed text-white/68 lg:text-lg">
                    Turn real-world infrastructure into decision-ready financial products with live data, digital twin context, and investor-grade narrative compression.
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  {numberBlocks.map((block, index) => {
                    const settled = valueGlow;
                    return (
                      <div
                        key={block.label}
                        className={`rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition-all duration-700 ${showNumbers ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"} ${settled ? block.glow : ""}`}
                        style={{ transitionDelay: `${index * 120}ms` }}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                          {block.label}
                        </p>
                        <div className={`mt-4 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl ${block.accent}`}>
                          {animatedMetricValue(animatedValues[index] ?? 0, block, index, settled)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
              <div className={`presentation-panel flex-1 rounded-[28px] p-5 transition-all duration-700 ${showFlow ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/46">Live system state</p>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                    {liveStatus}
                  </span>
                </div>
                <div className="mt-5 space-y-3">
                  {flowSteps.map((step, index) => (
                    <div
                      key={step}
                      className={`rounded-[20px] border px-4 py-3 transition-all duration-500 ${
                        index === activeFlow
                          ? "border-cyan/60 bg-cyan/10 text-white shadow-[0_0_22px_rgba(95,225,230,0.14)]"
                          : "border-white/8 bg-white/[0.03] text-white/46"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium tracking-[0.18em]">{step}</span>
                        <span className="text-[11px] uppercase tracking-[0.18em]">
                          {index === activeFlow ? "Active" : "Queued"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/58">
                  Last sync {lastUpdatedSeconds}s ago
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigateTo("/investor")}
                className={`rounded-[26px] border border-gold/30 bg-gold/12 px-5 py-4 text-left transition-all duration-700 hover:border-gold/50 hover:bg-gold/18 ${showCta ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">Investor brief</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">Open the capital story</p>
                <p className="mt-2 text-sm leading-relaxed text-white/62">
                  Move into the board-level narrative with operational proof, revenue architecture, and timing signals.
                </p>
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
