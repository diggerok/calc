import type { CalculatorConfig } from "@/types/calculator";

export const zebraKassetaBntMConfig: CalculatorConfig = {
  id: "zebra-kasseta-bnt-m",
  title: "Зебра Кассета BNT M",
  group: "BNT",
  categories: ["0", "E", "1", "2", "3", "4"],
  maxRows: 10,
  options: [
    { id: "cassette", label: "Кассета", values: ["КАССЕТА 29мм", "КАССЕТА 43мм", "КАССЕТА 44мм"], defaultValue: "КАССЕТА 29мм" },
    { id: "color", label: "Цвет компл.", values: ["Белый", "Серый металлик", "Черный муар"], defaultValue: "Белый" },
    { id: "mono", label: "MONO", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "weightDecor", label: "Грузик декор", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "metalChain", label: "Метал. цепь", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "spring", label: "Пружина", values: ["Нет", "Левая", "Правая"], defaultValue: "Нет" },
    { id: "childSafety", label: "Детская без.", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};
