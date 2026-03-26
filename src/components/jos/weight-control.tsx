"use client";

import type { CategoryMode, WeightState } from "@/lib/jos-types";

type WeightControlProps = {
  mode: CategoryMode;
  weights: WeightState;
  onChange: (key: keyof WeightState, value: number) => void;
};

const controls: Array<{ key: keyof WeightState; label: string; hint: string }> = [
  { key: "business", label: "Business weight", hint: "Weekday executive bias" },
  { key: "private", label: "Private weight", hint: "Weekend and personal attention" },
  { key: "project", label: "Project weight", hint: "Strategic program lift" },
  { key: "communication", label: "Communication weight", hint: "Follow-up and relationship response" },
];

export function WeightControl({ mode, weights, onChange }: WeightControlProps) {
  return (
    <section className="jos-glass p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Weight Control</p>
      <div className="mt-2 flex items-center justify-between">
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--ink-strong)]">Priority tuning</h3>
        <span className="rounded-full bg-[var(--panel-strong)] px-3 py-1 text-xs font-medium capitalize text-[var(--muted)]">{mode} mode</span>
      </div>
      <div className="mt-5 space-y-5">
        {controls.map((control) => (
          <label key={control.key} className="block rounded-[22px] border border-[var(--line)] bg-white/75 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--ink-strong)]">{control.label}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{control.hint}</p>
              </div>
              <span className="text-sm font-semibold text-[var(--accent)]">{weights[control.key]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights[control.key]}
              onChange={(event) => onChange(control.key, Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--panel-strong)] accent-[var(--accent)]"
            />
          </label>
        ))}
      </div>
    </section>
  );
}

