import type { CalculatorConfig } from "@/types/calculator";

export const plisseRusConfig: CalculatorConfig = {
  id: "plisse-rus",
  title: "Плиссе RUS",
  group: "Плиссе",
  categories: ["0", "Е", "1", "2", "3", "4", "5"],
  maxRows: 10,
  options: [
    { id: "model", label: "Модель", values: ["PR01","PR02"], defaultValue: "PR01" },
    { id: "color", label: "Цвет", values: ["Белый","Коричневый","Черный"], defaultValue: "Белый" },
    { id: "bracket", label: "Кронштейн", values: ["Потолочный","Пластиковый","Подоконный"], defaultValue: "Потолочный" },
  ],
};
