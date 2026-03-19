import type { CalculatorConfig, SurchargeFn } from "@/types/calculator";

function findCeilIndex(arr: number[], value: number): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= value) return i;
  }
  return arr.length - 1;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lookupBasePrice(priceData: any, category: string, width: number, height: number): number {
  if (!priceData.prices?.[category]) return 0;
  const matrix = priceData.prices[category];
  const wIdx = findCeilIndex(priceData.widths, width);
  const hIdx = findCeilIndex(priceData.heights, height);
  if (hIdx >= matrix.length || wIdx >= (matrix[hIdx]?.length ?? 0)) return 0;
  return matrix[hIdx][wIdx] ?? 0;
}

export type CustomPriceFn = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  priceData: any, category: string, width: number, height: number, options: Record<string, string>
) => number;

const customPriceFns: Record<string, CustomPriceFn> = {};
export function registerCustomPriceFn(calcId: string, fn: CustomPriceFn) {
  customPriceFns[calcId] = fn;
}

export function calculateRowPrice(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  priceData: any,
  config: CalculatorConfig,
  surchargeFn: SurchargeFn,
  category: string,
  width: number,
  height: number,
  options: Record<string, string>
): number {
  if (!width || !height) return 0;

  // Custom pricing mode
  const customFn = customPriceFns[config.id];
  if (config.pricingMode === "custom" && customFn) {
    const price = customFn(priceData, category, width, height, options);
    return Math.round(price * 100) / 100;
  }

  // Standard matrix mode
  if (!category) return 0;
  const basePrice = lookupBasePrice(priceData, category, width, height);
  if (basePrice === 0) return 0;

  let surchargeTotal = 0;
  for (const opt of config.options) {
    const val = options[opt.id] ?? opt.defaultValue;
    surchargeTotal += surchargeFn(opt.id, val, width, height, basePrice);
  }
  return Math.round((basePrice + surchargeTotal) * 100) / 100;
}
