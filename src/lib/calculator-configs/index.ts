import { bntMConfig } from "./bnt-m";
import { bntLConfig } from "./bnt-l";
import { kassetaBntMConfig } from "./kasseta-bnt-m";
import { kassetaBntLConfig } from "./kasseta-bnt-l";
import { zebraBntMConfig } from "./zebra-bnt-m";
import { zebraBntLConfig } from "./zebra-bnt-l";
import { zebraKassetaBntMConfig } from "./zebra-kasseta-bnt-m";
import type { CalculatorConfig } from "@/types/calculator";

export const calculatorConfigs: Record<string, CalculatorConfig> = {
  "bnt-m": bntMConfig,
  "bnt-l": bntLConfig,
  "kasseta-bnt-m": kassetaBntMConfig,
  "kasseta-bnt-l": kassetaBntLConfig,
  "zebra-bnt-m": zebraBntMConfig,
  "zebra-bnt-l": zebraBntLConfig,
  "zebra-kasseta-bnt-m": zebraKassetaBntMConfig,
};

export const calculatorList = Object.values(calculatorConfigs).map((c) => ({
  id: c.id,
  title: c.title,
}));
