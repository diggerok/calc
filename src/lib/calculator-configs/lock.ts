import type { CalculatorConfig } from "@/types/calculator";

export const lockConfig: CalculatorConfig = {
  id: "lock",
  title: "Lock система",
  group: "ZIP",
  categories: ["3", "4"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "tube", label: "Труба", values: ["63", "78"], defaultValue: "63" },
    { id: "box", label: "Короб", values: ["100", "120"], defaultValue: "100" },
    { id: "control", label: "Управл.", values: ["Нет", "Крэнк", "Пружина", "Цепь", "Цепь нерж"], defaultValue: "Нет" },
    { id: "ral", label: "Покраска RAL", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "weld", label: "Сварка пог.м", values: [], defaultValue: "0" },
    { id: "corner", label: "Уголок пог.м", values: [], defaultValue: "0" },
  ],
};
