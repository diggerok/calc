import type { CalculatorConfig } from "@/types/calculator";

export const dbBlindsConfig: CalculatorConfig = {
  id: "db-blinds",
  title: "Дерево / Бамбук",
  group: "Жалюзи",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  electricKitKey: "slat",
  options: [
    { id: "slat", label: "Ламель мм", values: ["25", "50"], defaultValue: "25" },
    { id: "material", label: "Вид", values: ["Бамбук", "Дерево", "Павловния"], dynamic: true, defaultValue: "Бамбук" },
    { id: "color", label: "Цвет", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "decLadder", label: "Дек. лесенка", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "sideFix", label: "Бок. фикс.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
  sizeLimits: {
    // 25мм (ручное)
    "25-Дерево":     { minWidth: 0.33, maxWidth: 2.10, maxHeight: 3.00, maxArea: 3.30 },
    "25-Павловния":  { minWidth: 0.33, maxWidth: 2.30, maxHeight: 3.00, maxArea: 4.20 },
    "25-Бамбук":     { minWidth: 0.33, maxWidth: 1.80, maxHeight: 3.00, maxArea: 3.60 },
    // 50мм (ручное)
    "50-Дерево":     { minWidth: 0.42, maxWidth: 2.10, maxHeight: 4.30, maxArea: 3.50 },
    "50-Бамбук":     { minWidth: 0.42, maxWidth: 1.80, maxHeight: 4.30, maxArea: 3.80 },
    "50-Пластик":    { minWidth: 0.42, maxWidth: 2.70, maxHeight: 4.30, maxArea: 3.20 },
    "50-Павловния":  { minWidth: 0.42, maxWidth: 2.30, maxArea: 4.50 },
    // 50мм (электрика) — площадь увеличивается
    "50-Дерево-Э":     { minWidth: 0.59, maxWidth: 2.10, maxHeight: 4.30, maxArea: 9.00 },
    "50-Бамбук-Э":     { minWidth: 0.59, maxWidth: 1.80, maxHeight: 4.30, maxArea: 7.70 },
    "50-Пластик-Э":    { minWidth: 0.59, maxWidth: 2.70, maxHeight: 4.30, maxArea: 5.40 },
    "50-Павловния-Э":  { minWidth: 0.59, maxWidth: 2.30, maxHeight: 4.30, maxArea: 9.90 },
  },
};
