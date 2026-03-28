import type { CalculatorConfig } from "@/types/calculator";

export const venus25Config: CalculatorConfig = {
  id: "venus25",
  title: "Venus 25 мм",
  group: "Жалюзи",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  sizeLimits: {
    "_": { minWidth: 0.25, maxWidth: 1.80, minHeight: 0.30, maxHeight: 2.40 },
  },
  options: [
    { id: "color", label: "Цвет", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "noStop", label: "Без стопора", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "reducer", label: "С редуктором", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "complColor", label: "Цвет компл.", values: ["Белый", "Серый", "Коричневый", "Золотой дуб"], defaultValue: "Белый" },
    { id: "shim", label: "Подкладка штапик", values: ["Нет", "1 пара (16-20мм)", "2 пары (12-16мм)", "3 пары (8-12мм)", "4 пары (4-8мм)", "5 пар (0-4мм)"], defaultValue: "Нет" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};
