import type { CalculatorConfig } from "@/types/calculator";

export const verticalBlindsConfig: CalculatorConfig = {
  id: "vertical-blinds",
  title: "Вертикальные",
  group: "Жалюзи",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  sizeLimits: {
    "Ткань": { minWidth: 0.20, maxWidth: 6.00, minHeight: 0.50, maxHeight: 4.00, maxArea: 20 },
    "Алюминий": { minWidth: 0.20, maxWidth: 4.50, minHeight: 0.50, maxHeight: 4.00, maxArea: 15 },
    "Пластик": { minWidth: 0.20, maxWidth: 4.00, minHeight: 0.30, maxHeight: 3.50, maxArea: 14 },
    "Нитяные": { minWidth: 0.20, maxWidth: 6.00, maxHeight: 3.00, maxArea: 20 },
  },
  options: [
    { id: "material", label: "Материал", values: ["Ткань", "Нитяные", "Пластик", "Алюминий"], defaultValue: "Ткань" },
    { id: "model", label: "Модель", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "lamelOnly", label: "Только ламели", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "metalFurn", label: "Металл. фурн.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "transparentSet", label: "Прозр. компл.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "decorCornice", label: "Декор. карниз", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "tilted", label: "Наклонные", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};
