export interface CalculatorOption {
  id: string;
  label: string;
  values: string[];
  defaultValue: string;
  dynamic?: boolean; // values loaded from priceData based on other options
}

// Function to resolve dynamic option values from priceData + current options
export type DynamicValuesFn = (
  optionId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  priceData: any,
  options: Record<string, string>
) => string[];

export type PricingMode = "matrix" | "custom";

export interface CalculatorConfig {
  id: string;
  title: string;
  group: string;
  categories: string[];
  options: CalculatorOption[];
  maxRows: number;
  pricingMode?: PricingMode;
}

export type SurchargeFn = (
  optionId: string,
  value: string,
  width: number,
  height: number,
  basePrice: number
) => number;

export interface PriceData {
  widths: number[];
  heights: number[];
  prices: Record<string, number[][]>;
}

export interface CalcRowData {
  id: number;
  category: string;
  width: string;
  height: string;
  options: Record<string, string>;
  quantity: number;
  priceUsd: number;
  priceRub: number;
  totalRub: number;
}

export interface CalcState {
  rows: CalcRowData[];
  exchangeRate: number;
  markupType: "markup" | "discount";
  markupPercent: number;
}
