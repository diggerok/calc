import type { DynamicValuesFn } from "@/types/calculator";

// DB Blinds: color depends on slat + material
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dbBlindsDynamic: DynamicValuesFn = (optionId, priceData, options) => {
  if (optionId === "color") {
    const slat = options.slat ?? "25";
    const material = options.material ?? "Бамбук";
    const prefix = `${slat}-${material}-`;
    return (priceData.priceTable ?? [])
      .filter((e: { key: string }) => e.key.startsWith(prefix))
      .map((e: { key: string }) => e.key.slice(prefix.length));
  }
  if (optionId === "material") {
    const slat = options.slat ?? "25";
    return slat === "25"
      ? (priceData.materials25 ?? [])
      : (priceData.materials50 ?? []);
  }
  return [];
};

// Venus 16: color list from priceData
const venus16Dynamic: DynamicValuesFn = (optionId, priceData) => {
  if (optionId === "color") {
    return (priceData.colors ?? []).map((c: { name: string }) => c.name);
  }
  return [];
};

// Venus 25: color list from priceData
const venus25Dynamic: DynamicValuesFn = (optionId, priceData) => {
  if (optionId === "color") {
    return (priceData.colors ?? []).map((c: { name: string }) => c.name);
  }
  return [];
};

// GZH: color depends on slat size
const gzhDynamic: DynamicValuesFn = (optionId, priceData, options) => {
  if (optionId === "color") {
    const slat = options.slat ?? "25";
    const key = `colors${slat}`;
    return priceData[key] ?? [];
  }
  return [];
};

// Vertical: category list from priceData
const verticalDynamic: DynamicValuesFn = (optionId, priceData) => {
  if (optionId === "category") {
    return (priceData.categories ?? []).map((c: { name: string }) => c.name);
  }
  return [];
};

// Plisse (shared for all 3 plisse calculators)
const plisseDynamic: DynamicValuesFn = (optionId, priceData) => {
  if (optionId === "model") return (priceData.models ?? []).map((m: {name: string}) => m.name);
  if (optionId === "color") return (priceData.colors ?? []).map((c: {name: string}) => c.name);
  if (optionId === "bracket") return (priceData.brackets ?? []).map((b: {name: string}) => b.name);
  return [];
};

const dynamicMap: Record<string, DynamicValuesFn> = {
  "db-blinds": dbBlindsDynamic,
  "venus16": venus16Dynamic,
  "venus25": venus25Dynamic,
  "gzh-blinds": gzhDynamic,
  "vertical-blinds": verticalDynamic,
  "plisse": plisseDynamic,
  "plisse-maxi": plisseDynamic,
  "plisse-rus": plisseDynamic,
};

export function getDynamicValuesFn(calcId: string): DynamicValuesFn | undefined {
  return dynamicMap[calcId];
}
