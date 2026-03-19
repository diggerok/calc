import type { CalculatorConfig } from "@/types/calculator";

export const dbBlindsConfig: CalculatorConfig = {
  id: "db-blinds",
  title: "Дерево / Бамбук",
  group: "Жалюзи",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  options: [
    { id: "slat", label: "Ламель мм", values: ["25", "50"], defaultValue: "25" },
    { id: "material", label: "Вид", values: ["Бамбук", "Дерево", "Павловния", "Пластик", "Пластик_Классик", "Пластик_Модерно"], defaultValue: "Бамбук" },
    { id: "color", label: "Цвет", values: ["—"], defaultValue: "—" },
    { id: "decLadder", label: "Дек. лесенка", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "sideFix", label: "Бок. фикс.", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};
