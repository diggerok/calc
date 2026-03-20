import type { CalculatorConfig } from "@/types/calculator";

export const plisseMaxiConfig: CalculatorConfig = {
  id: "plisse-maxi",
  title: "Плиссе Макси",
  group: "Шторы плиссе",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  options: [
    { id: "model", label: "Модель", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "cat", label: "Кат. ткани", values: ["1", "2", "3", "4", "5"], defaultValue: "1" },
    { id: "color", label: "Цвет", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "bracket", label: "Кронштейн", values: ["—"], dynamic: true, defaultValue: "—" },
  ],
};
