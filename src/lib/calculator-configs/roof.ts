import type { CalculatorConfig } from "@/types/calculator";

export const roofConfig: CalculatorConfig = {
  id: "roof",
  title: "Roof (мансардные)",
  group: "Рулонные шторы",
  categories: ["1", "2", "3", "4", "5"],
  pricingMode: "custom",
  maxRows: 10,
  options: [
    { id: "manufacturer", label: "Производитель", values: ["Velux", "ROTO", "Fakro"], defaultValue: "Velux" },
    { id: "model", label: "Модель окна", values: ["—"], dynamic: true, defaultValue: "—" },
  ],
};
