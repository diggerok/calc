import type { CalculatorConfig } from "@/types/calculator";

export const plisseConfig: CalculatorConfig = {
  id: "plisse",
  title: "Плиссе",
  group: "Шторы плиссе",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  options: [
    { id: "model", label: "Модель", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "cat", label: "Кат. ткани", values: ["0", "Е", "1", "2", "3", "4", "5"], defaultValue: "Е" },
    { id: "color", label: "Цвет", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "bracket", label: "Кронштейн", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "cord", label: "Шнур с петлями", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "reinforced", label: "Усил. профиль", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "mountProfile", label: "Монт. профиль", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "handle", label: "Ручка мет.", values: [], defaultValue: "0" },
  ],
};
