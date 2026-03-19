import type { PriceData, CalculatorConfig, SurchargeFn } from "@/types/calculator";

function findCeilIndex(arr: number[], value: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= value) return i;
  }
  return arr.length - 1;
}

export function lookupBasePrice(
  priceData: PriceData,
  category: string,
  width: number,
  height: number
): number {
  const matrix = priceData.prices[category];
  if (!matrix) return 0;

  const wIdx = findCeilIndex(priceData.widths, width);
  const hIdx = findCeilIndex(priceData.heights, height);

  if (hIdx >= matrix.length) return 0;
  if (wIdx >= (matrix[hIdx]?.length ?? 0)) return 0;

  return matrix[hIdx][wIdx] ?? 0;
}

export function calculateRowPrice(
  priceData: PriceData,
  config: CalculatorConfig,
  surchargeFn: SurchargeFn,
  category: string,
  width: number,
  height: number,
  options: Record<string, string>
): number {
  if (!category || !width || !height) return 0;

  const basePrice = lookupBasePrice(priceData, category, width, height);
  if (basePrice === 0) return 0;

  let surchargeTotal = 0;
  for (const opt of config.options) {
    const val = options[opt.id] ?? opt.defaultValue;
    surchargeTotal += surchargeFn(opt.id, val, width, height, basePrice);
  }

  return Math.round((basePrice + surchargeTotal) * 100) / 100;
}
