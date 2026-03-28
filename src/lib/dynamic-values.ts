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

// Vertical: model depends on material
const verticalDynamic: DynamicValuesFn = (optionId, priceData, options) => {
  if (optionId === "model") {
    const material = options.material ?? "Ткань";
    if (material === "Ткань") return Object.keys(priceData.fabricNames ?? {});
    if (material === "Нитяные") return Object.keys(priceData.thread ?? {});
    if (material === "Пластик") return Object.keys(priceData.plastic ?? {});
    if (material === "Алюминий") return Object.keys(priceData.aluminium ?? {});
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

// Roman rails: bracket depends on type
const romanRailsDynamic: DynamicValuesFn = (optionId, _priceData, options) => {
  if (optionId === "bracket") {
    const type = options.type ?? "Стандарт";
    if (type === "Мини") return ["На штапик Мини", "Стеновой Мини"];
    return ["Стандартный", "Пружинный", "Стен. 5см", "Стен. 10см", "Стен. 14см", "Стен. 24см"];
  }
  return [];
};

// Roman blinds: bracket depends on type (same as roman-rails)
const romanBlindsDynamic: DynamicValuesFn = (optionId, _priceData, options) => {
  if (optionId === "bracket") {
    const type = options.type ?? "Стандарт";
    if (type === "Мини") return ["На штапик Мини", "Стеновой Мини"];
    return ["Стандартный", "Пружинный", "Стен. 5см", "Стен. 10см", "Стен. 14см", "Стен. 24см"];
  }
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
  "roman-rails": romanRailsDynamic,
  "roman-blinds": romanBlindsDynamic,
};

export function getDynamicValuesFn(calcId: string): DynamicValuesFn | undefined {
  return dynamicMap[calcId];
}
