import type { CalculatorConfig } from "@/types/calculator";

export const mirageConfig: CalculatorConfig = {
  id: "mirage",
  title: "Мираж",
  group: "AMG",
  categories: ["E", "3"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "fabricInsert", label: "Ткан. вставка", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Металлическая с замком"], defaultValue: "Пластиковая" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};
