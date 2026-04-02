import { bntMConfig } from "./bnt-m";
import { bntLConfig } from "./bnt-l";
import { kassetaBntMConfig } from "./kasseta-bnt-m";
import { kassetaBntLConfig } from "./kasseta-bnt-l";
import { zebraBntMConfig } from "./zebra-bnt-m";
import { zebraBntLConfig } from "./zebra-bnt-l";
import { zebraKassetaBntMConfig } from "./zebra-kasseta-bnt-m";
import { miniConfig, miniZebraConfig, mgConfig, uni1Config, uni1ZebraConfig, uni2Config, uni2ZebraConfig, uni2SpringConfig } from "./mini";
import { plisseConfig } from "./plisse";
import { plisseMaxiConfig } from "./plisse-maxi";
import { plisseRusConfig } from "./plisse-rus";
import { dbBlindsConfig } from "./db-blinds";
import { venus16Config } from "./venus16";
import { venus25Config } from "./venus25";
import { gzhBlindsConfig } from "./gzh-blinds";
import { verticalBlindsConfig } from "./vertical-blinds";
import { zipConfig } from "./zip";
import { lockConfig } from "./lock";
import { zipRoofConfig } from "./zip-roof";
import { romanBlindsConfig } from "./roman-blinds";
import { romanRailsConfig } from "./roman-rails";
import { liftConfig } from "./lift";
import { curtainsConfig } from "./curtains";
import { curtainRailsConfig } from "./curtain-rails";
import { mirageConfig } from "./mirage";
import { mgsZebraConfig } from "./mgs-zebra";
import { amgConfig, amgLConfig, amgXlConfig } from "./amg";
import { roofConfig } from "./roof";
import type { CalculatorConfig, FabricItem } from "@/types/calculator";
import fabricsRoller from "@/lib/price-data/fabrics-roller.json";
import fabricsZebra from "@/lib/price-data/fabrics-zebra.json";
import fabricsPlisse from "@/lib/price-data/fabrics-plisse.json";
import fabricsRoman from "@/lib/price-data/fabrics-roman.json";
import maxHeightsData from "@/lib/price-data/max-heights.json";

const rollerFabrics: FabricItem[] = fabricsRoller;
const zebraFabrics: FabricItem[] = fabricsZebra;
const plisseFabrics: FabricItem[] = fabricsPlisse;

// Привязываем максимальные высоты по намотке ткани
const allMaxHeights = maxHeightsData as Record<string, Record<string, number | null>>;
function buildMaxHeights(cfg: CalculatorConfig): Record<string, number> {
  const result: Record<string, number> = {};
  const prefix = cfg.maxHeightKeys ? cfg.id + "|" : "";
  for (const [fabric, limits] of Object.entries(allMaxHeights)) {
    if (prefix) {
      // Composite keys: "bnt-m|29мм|36мм" → store as "ТКАНЬ::29мм|36мм"
      for (const [key, val] of Object.entries(limits)) {
        if (key.startsWith(prefix)) {
          const optKey = key.slice(prefix.length); // "29мм|36мм"
          result[fabric + "::" + optKey] = val as number;
        }
      }
    } else if (cfg.id in limits) {
      result[fabric] = limits[cfg.id] as number;
    }
  }
  return result;
}
for (const cfg of [uni1Config, uni2Config, uni2SpringConfig, miniConfig, mgConfig, uni1ZebraConfig, uni2ZebraConfig, miniZebraConfig, bntMConfig, bntLConfig, kassetaBntMConfig, kassetaBntLConfig, zebraBntMConfig, zebraBntLConfig, zebraKassetaBntMConfig, amgConfig, amgLConfig, amgXlConfig, mgsZebraConfig]) {
  cfg.maxHeights = buildMaxHeights(cfg);
}

// Привязываем ткани к рулонным калькуляторам (не зебра, не плиссе)
for (const cfg of [miniConfig, mgConfig, uni1Config, uni2Config, uni2SpringConfig, bntMConfig, bntLConfig, kassetaBntMConfig, kassetaBntLConfig, amgConfig, amgLConfig, amgXlConfig, roofConfig]) {
  cfg.fabrics = rollerFabrics.filter((f) => cfg.categories.includes(f.category));
}

// ZIP/LOCK — только ткани СКРИН OTD
for (const cfg of [zipConfig, lockConfig, zipRoofConfig]) {
  cfg.fabrics = rollerFabrics.filter((f) => cfg.categories.includes(f.category) && f.name.startsWith("СКРИН OTD"));
}

// Привязываем ткани зебра
for (const cfg of [miniZebraConfig, uni1ZebraConfig, uni2ZebraConfig, zebraBntMConfig, zebraBntLConfig, zebraKassetaBntMConfig, mgsZebraConfig]) {
  cfg.fabrics = zebraFabrics.filter((f) => cfg.categories.includes(f.category));
}

// Привязываем ткани римских штор и портьер
const romanFabrics: FabricItem[] = fabricsRoman;
for (const cfg of [romanBlindsConfig, curtainsConfig]) {
  cfg.fabrics = romanFabrics.filter((f) => cfg.categories.includes(f.category));
}

// Привязываем ткани плиссе (категории в options.cat)
const plisseCategories = ["0", "E", "1", "2", "3", "4", "5"];
for (const cfg of [plisseConfig, plisseMaxiConfig, plisseRusConfig]) {
  cfg.fabrics = plisseFabrics.filter((f) => plisseCategories.includes(f.category));
}

export const calculatorConfigs: Record<string, CalculatorConfig> = {
  "mini": miniConfig,
  "mini-zebra": miniZebraConfig,
  "mg": mgConfig,
  "uni1": uni1Config,
  "uni1-zebra": uni1ZebraConfig,
  "uni2": uni2Config,
  "uni2-zebra": uni2ZebraConfig,
  "uni2-spring": uni2SpringConfig,
  "bnt-m": bntMConfig,
  "bnt-l": bntLConfig,
  "kasseta-bnt-m": kassetaBntMConfig,
  "kasseta-bnt-l": kassetaBntLConfig,
  "zebra-bnt-m": zebraBntMConfig,
  "zebra-bnt-l": zebraBntLConfig,
  "zebra-kasseta-bnt-m": zebraKassetaBntMConfig,
  "plisse": plisseConfig,
  "plisse-maxi": plisseMaxiConfig,
  "plisse-rus": plisseRusConfig,
  "db-blinds": dbBlindsConfig,
  "venus16": venus16Config,
  "venus25": venus25Config,
  "gzh-blinds": gzhBlindsConfig,
  "vertical-blinds": verticalBlindsConfig,
  "zip": zipConfig,
  "lock": lockConfig,
  "zip-roof": zipRoofConfig,
  "roman-blinds": romanBlindsConfig,
  "roman-rails": romanRailsConfig,
  "lift": liftConfig,
  "curtains": curtainsConfig,
  "mirage": mirageConfig,
  "amg": amgConfig,
  "amg-l": amgLConfig,
  "amg-xl": amgXlConfig,
  "curtain-rails": curtainRailsConfig,
  "mgs-zebra": mgsZebraConfig,
  "roof": roofConfig,
};

export const calculatorList = Object.values(calculatorConfigs).map((c) => ({
  id: c.id,
  title: c.title,
  group: c.group,
}));

// Define group order explicitly
const groupOrder = ["Рулонка", "Рулонные шторы", "BNT", "AMG", "ZIP", "Шторы плиссе", "Шторы", "Жалюзи"];

export const calculatorGroups = calculatorList.reduce<
  Record<string, { id: string; title: string }[]>
>((acc, c) => {
  (acc[c.group] ??= []).push(c);
  return acc;
}, {});

export const orderedGroups = groupOrder
  .filter((g) => calculatorGroups[g])
  .map((g) => [g, calculatorGroups[g]] as const);
