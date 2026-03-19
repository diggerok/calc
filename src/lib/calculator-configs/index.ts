import { bntMConfig } from "./bnt-m";
import type { CalculatorConfig } from "@/types/calculator";

export const calculatorConfigs: Record<string, CalculatorConfig> = {
  "bnt-m": bntMConfig,
};

export const calculatorList = Object.values(calculatorConfigs).map((c) => ({
  id: c.id,
  title: c.title,
}));
