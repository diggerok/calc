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

export interface FabricItem {
  name: string;
  category: string;
  rollWidth: number;
}

export interface SizeLimit {
  minWidth: number;
  maxWidth: number;
  minHeight?: number;
  maxHeight?: number;
  maxArea?: number;
}

export interface CalculatorConfig {
  id: string;
  title: string;
  group: string;
  categories: string[];
  options: CalculatorOption[];
  maxRows: number;
  pricingMode?: PricingMode;
  fabrics?: FabricItem[];
  sizeLimits?: Record<string, SizeLimit>; // key = "slat-material" or similar
  maxHeights?: Record<string, number>; // fabric name -> max height in meters (0 = unavailable)
  maxHeightKeys?: string[]; // option IDs that form the maxHeights lookup key (e.g. ["tube", "bracket"])
  electricKitKey?: string; // option ID whose value maps to electric kit lookup (e.g. "tube")
  hideHeight?: boolean; // hide height column (e.g. for LIFT)
}

export interface ElectricKit {
  name: string;
  price: number;
}

export interface AccessoryItem {
  id: string;
  category: string;
  name: string;
  price: number;
}

export type SurchargeFn = (
  optionId: string,
  value: string,
  width: number,
  height: number,
  basePrice: number,
  options?: Record<string, string>
) => number;

export interface PriceData {
  widths: number[];
  heights: number[];
  prices: Record<string, number[][]>;
}

export interface CalcRowData {
  id: number;
  fabric: string;
  fabricColor: string;
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
