export interface CalculatorOption {
  id: string;
  label: string;
  values: string[];
  defaultValue: string;
}

export interface CalculatorConfig {
  id: string;
  title: string;
  group: string;
  categories: string[];
  options: CalculatorOption[];
  maxRows: number;
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
