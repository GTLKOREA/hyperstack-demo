import { formatCurrency, formatCurrencyMillions, formatMultiplier, formatPercentage, formatScore } from "@/utils/hyperstack/number-formatters";

export interface KpiDisplayOptions {
  unit: string;
  digits?: number;
}

export function formatKpiValue(value: number, { unit, digits = 1 }: KpiDisplayOptions) {
  if (unit === "%") {
    return formatPercentage(value, digits);
  }

  if (unit === "$/MWh") {
    return formatCurrency(value, { maximumFractionDigits: 0, minimumFractionDigits: 0 });
  }

  if (unit === "USD_M") {
    return formatCurrencyMillions(value, digits);
  }

  if (unit === "x") {
    return formatMultiplier(value, digits);
  }

  if (unit === "/100") {
    return formatScore(value);
  }

  return `${value.toFixed(digits)} ${unit}`.trim();
}

export function formatKpiDelta(delta: number, unit: string, digits = 1) {
  const prefix = delta > 0 ? "+" : "";

  if (unit === "%") {
    return `${prefix}${delta.toFixed(digits)}%`;
  }

  if (unit === "$/MWh") {
    return `${prefix}${formatCurrency(delta, { maximumFractionDigits: 0, minimumFractionDigits: 0 })}`;
  }

  if (unit === "USD_M") {
    return `${prefix}${formatCurrencyMillions(delta, digits)}`;
  }

  if (unit === "x") {
    return `${prefix}${formatMultiplier(delta, digits)}`;
  }

  if (unit === "/100") {
    return `${prefix}${Math.round(delta)}`;
  }

  return `${prefix}${delta.toFixed(digits)} ${unit}`.trim();
}

