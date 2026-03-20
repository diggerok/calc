import type { CalculatorConfig } from "@/types/calculator";

export const verticalBlindsConfig: CalculatorConfig = {
  id: "vertical-blinds",
  title: "Вертикальные",
  group: "Жалюзи",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  options: [
    { id: "category", label: "Категория ткани", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "metalFurn", label: "Металл. фурн.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "transparentSet", label: "Прозр. компл.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "decorCornice", label: "Декор. карниз", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "tilted", label: "Наклонные", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "lamelOnly", label: "Только ламели", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};
