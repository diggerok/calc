import type { CalculatorConfig } from "@/types/calculator";

export const mgsZebraConfig: CalculatorConfig = {
  id: "mgs-zebra",
  title: "MGS Зебра",
  group: "Рулонка",
  categories: ["0", "E", "1", "2", "3", "4"],
  pricingMode: "matrix",
  maxRows: 10,
  maxHeightKeys: ["box"],
  options: [
    { id: "color", label: "Цвет компл.", values: ["Белый", "Коричневый"], defaultValue: "Белый" },
    { id: "box", label: "Короб", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Металлическая"], defaultValue: "Пластиковая" },
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};
