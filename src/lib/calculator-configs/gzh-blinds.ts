import type { CalculatorConfig } from "@/types/calculator";

export const gzhBlindsConfig: CalculatorConfig = {
  id: "gzh-blinds",
  title: "ГЖ Алюминий",
  group: "Жалюзи",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  electricKitKey: "slat",
  sizeLimits: {
    "16": { minWidth: 0.25, maxWidth: 2.10, minHeight: 0.30, maxHeight: 3.00, maxArea: 7.0 },
    "25": { minWidth: 0.25, maxWidth: 2.85, minHeight: 0.30, maxHeight: 3.00, maxArea: 7.0 },
    "50": { minWidth: 0.42, maxWidth: 2.70, minHeight: 0.30, maxHeight: 3.30, maxArea: 7.0 },
  },
  options: [
    { id: "slat", label: "Ширина ламели", values: ["16", "25", "50"], defaultValue: "25" },
    { id: "color", label: "Цвет", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "sideFix", label: "Бок. фиксация", values: ["Нет", "16/25мм", "50мм"], defaultValue: "Нет" },
    { id: "holderBottom", label: "Держатель ниж.", values: ["Нет", "Холис", "Тип В Холис", "Магнитный"], defaultValue: "Нет" },
    { id: "pvcFix", label: "ПВХ крепления", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "interCeramics", label: "Межрам. жалюзи", values: ["Нет", "Классические", "С рычагом управл."], defaultValue: "Нет" },
    { id: "complexShape", label: "Сложные формы", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "multiTape", label: "Неск. лент", values: ["Нет", "2 ленты", "3-6 лент"], defaultValue: "Нет" },
    { id: "decLadder50", label: "Дек. лесенка 50", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};
