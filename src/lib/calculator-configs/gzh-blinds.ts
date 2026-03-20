import type { CalculatorConfig } from "@/types/calculator";

export const gzhBlindsConfig: CalculatorConfig = {
  id: "gzh-blinds",
  title: "ГЖ Алюминий",
  group: "Жалюзи",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  options: [
    { id: "slat", label: "Ширина ламели", values: ["16", "25", "50"], defaultValue: "25" },
    { id: "color", label: "Цвет", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "sideFix", label: "Бок. фиксация", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};
