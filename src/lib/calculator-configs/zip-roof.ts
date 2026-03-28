import type { CalculatorConfig } from "@/types/calculator";

export const zipRoofConfig: CalculatorConfig = {
  id: "zip-roof",
  title: "ZIP ROOF",
  group: "ZIP",
  categories: ["3", "4"],
  pricingMode: "matrix",
  maxRows: 10,
  sizeLimits: {
    "_": { minWidth: 0.93, maxWidth: 3.00, maxHeight: 4.00 },
  },
  options: [
    { id: "ral", label: "Покраска RAL", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "weld", label: "Сварка пог.м", values: [], defaultValue: "0" },
    { id: "corner", label: "Уголок пог.м", values: [], defaultValue: "0" },
  ],
};
