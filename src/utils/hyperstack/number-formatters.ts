export function formatPercentage(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

export function formatCurrency(value: number, {
  currency = "USD",
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
}: {
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
} = {}) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

export function formatCurrencyMillions(value: number, digits = 1) {
  const prefix = value < 0 ? "-" : "";
  return `${prefix}${formatCurrency(Math.abs(value), { maximumFractionDigits: digits, minimumFractionDigits: digits })}M`;
}

export function formatMultiplier(value: number, digits = 2) {
  return `${value.toFixed(digits)}x`;
}

export function formatScore(value: number, max = 100) {
  return `${Math.round(value)}/${max}`;
}
