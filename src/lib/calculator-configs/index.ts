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
import type { CalculatorConfig, FabricItem } from "@/types/calculator";
import fabricsRoller from "@/lib/price-data/fabrics-roller.json";
import fabricsZebra from "@/lib/price-data/fabrics-zebra.json";
import fabricsPlisse from "@/lib/price-data/fabrics-plisse.json";

const rollerFabrics: FabricItem[] = fabricsRoller;
const zebraFabrics: FabricItem[] = fabricsZebra;
const plisseFabrics: FabricItem[] = fabricsPlisse;

// Привязываем ткани к рулонным калькуляторам (не зебра, не плиссе)
for (const cfg of [miniConfig, mgConfig, uni1Config, uni2Config, uni2SpringConfig, bntMConfig, bntLConfig, kassetaBntMConfig, kassetaBntLConfig]) {
  cfg.fabrics = rollerFabrics.filter((f) => cfg.categories.includes(f.category));
}

// Привязываем ткани зебра
for (const cfg of [miniZebraConfig, uni1ZebraConfig, uni2ZebraConfig, zebraBntMConfig, zebraBntLConfig, zebraKassetaBntMConfig]) {
  cfg.fabrics = zebraFabrics.filter((f) => cfg.categories.includes(f.category));
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
};

export const calculatorList = Object.values(calculatorConfigs).map((c) => ({
  id: c.id,
  title: c.title,
  group: c.group,
}));

// Define group order explicitly
const groupOrder = ["Рулонка", "BNT", "ZIP", "Шторы плиссе", "Римские шторы", "Жалюзи"];

export const calculatorGroups = calculatorList.reduce<
  Record<string, { id: string; title: string }[]>
>((acc, c) => {
  (acc[c.group] ??= []).push(c);
  return acc;
}, {});

export const orderedGroups = groupOrder
  .filter((g) => calculatorGroups[g])
  .map((g) => [g, calculatorGroups[g]] as const);
