import type { CalculatorConfig } from "@/types/calculator";

export const venus25Config: CalculatorConfig = {
  id: "venus25",
  title: "Venus 25 мм",
  group: "Жалюзи",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  options: [
    { id: "color", label: "Цвет", values: ["—"], defaultValue: "—" },
    { id: "noStop", label: "Без стопора", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "reducer", label: "С редуктором", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "complColor", label: "Цвет компл.", values: ["Белый", "Серый", "Коричневый", "Золотой дуб"], defaultValue: "Белый" },
  ],
};
