export type IntroStat = {
  label: string;
  value: string;
  detail: string;
  accent: string;
};

export type DemoStage = {
  step: string;
  title: string;
  summary: string;
};

export type InvestorSignal = {
  title: string;
  description: string;
};

export const introStats: IntroStat[] = [
  {
    label: "Asset Classes",
    value: "$120B+",
    detail: "Addressable infrastructure value that can become finance-readable.",
    accent: "text-cyan",
  },
  {
    label: "Data to Capital",
    value: "4 Layers",
    detail: "Registration, operations, digital twin, and financialization.",
    accent: "text-gold",
  },
  {
    label: "IR Readiness",
    value: "<5 Min",
    detail: "A compressed narrative built for conviction, not feature browsing.",
    accent: "text-coral",
  },
];

export const demoStages: DemoStage[] = [
  {
    step: "01",
    title: "Asset Registration",
    summary: "A real-world infrastructure asset becomes a digital profile with traceable metadata.",
  },
  {
    step: "02",
    title: "Operational Intelligence",
    summary: "Performance, uptime, risk, and efficiency data accumulate as investable evidence.",
  },
  {
    step: "03",
    title: "Digital Twin",
    summary: "Complex operational state becomes visual, readable, and decision-ready.",
  },
  {
    step: "04",
    title: "Financialization",
    summary: "Verified asset data converts into a bankable investment structure.",
  },
];

export const investorSignals: InvestorSignal[] = [
  {
    title: "Infrastructure becomes investable",
    description: "HyperStack reframes industrial assets as structured financial products, not static equipment.",
  },
  {
    title: "Operational proof compounds value",
    description: "Live performance data creates trust, strengthens valuation, and lowers interpretation friction.",
  },
  {
    title: "Platform economics scale",
    description: "Each onboarded asset strengthens a repeatable capital-market layer rather than a one-off deployment.",
  },
];
