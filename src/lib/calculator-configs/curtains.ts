import type { CalculatorConfig } from "@/types/calculator";

export const curtainsConfig: CalculatorConfig = {
  id: "curtains",
  title: "Портьеры",
  group: "Шторы",
  categories: ["E", "1", "2", "3", "4"],
  pricingMode: "custom",
  maxRows: 10,
  options: [
    { id: "cut", label: "Раскрой", values: ["По ширине", "По высоте"], defaultValue: "По ширине" },
    { id: "fold", label: "Коэф. складок", values: ["1.1", "1.5", "2.0"], defaultValue: "1.5" },
    { id: "lining", label: "Подкладка", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "liningCat", label: "Кат. подклада", values: ["E", "1", "2", "3", "4"], defaultValue: "E" },
  ],
};
