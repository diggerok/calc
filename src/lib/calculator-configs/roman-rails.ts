import type { CalculatorConfig } from "@/types/calculator";

export const romanRailsConfig: CalculatorConfig = {
  id: "roman-rails",
  title: "Римские карнизы",
  group: "Римские шторы",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  options: [
    { id: "bracket", label: "Кронштейн", values: ["Стандартный", "Пружинный", "Стен. 5см", "Стен. 10см", "Стен. 14см", "Стен. 24см"], defaultValue: "Стандартный" },
    { id: "type", label: "Тип", values: ["Стандарт", "Мини", "Макси"], defaultValue: "Стандарт" },
    { id: "tilt", label: "Наклон.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Нет", "Металл", "Нерж"], defaultValue: "Нет" },
    { id: "dayNight", label: "День/Ночь", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};
