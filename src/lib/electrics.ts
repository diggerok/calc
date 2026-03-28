import electricsData from "@/lib/price-data/electrics.json";
import type { ElectricKit, AccessoryItem } from "@/types/calculator";

const kits = electricsData.kits as Record<string, Record<string, Record<string, ElectricKit>>>;

/**
 * Get electric kit price for a calculator + option value + electric type
 */
export function getElectricKitPrice(calcId: string, kitKey: string, electricType: string): number {
  if (electricType === "Нет") return 0;
  const calcKits = kits[calcId];
  if (!calcKits) return 0;
  const keyKits = calcKits[kitKey || "_"];
  if (!keyKits) return 0;
  const kit = keyKits[electricType];
  return kit?.price ?? 0;
}

/**
 * Get electric kit info
 */
export function getElectricKit(calcId: string, kitKey: string, electricType: string): ElectricKit | null {
  if (electricType === "Нет") return null;
  const calcKits = kits[calcId];
  if (!calcKits) return null;
  const keyKits = calcKits[kitKey || "_"];
  if (!keyKits) return null;
  return keyKits[electricType] ?? null;
}

/**
 * Get available electric types for a calculator + option value
 */
export function getAvailableElectricTypes(calcId: string, kitKey: string): string[] {
  const types = ["Нет"];
  const calcKits = kits[calcId];
  if (!calcKits) return types;
  const keyKits = calcKits[kitKey || "_"];
  if (!keyKits) return types;
  return ["Нет", ...Object.keys(keyKits)];
}

export const accessories: AccessoryItem[] = electricsData.accessories;
