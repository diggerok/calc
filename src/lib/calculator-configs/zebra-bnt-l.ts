import type { CalculatorConfig } from "@/types/calculator";

export const zebraBntLConfig: CalculatorConfig = {
  id: "zebra-bnt-l",
  title: "Зебра BNT L",
  categories: ["0", "E", "1", "2", "3", "4"],
  maxRows: 10,
  options: [
    { id: "tube", label: "Труба", values: ["КЛАССИКА 43мм", "КЛАССИКА 52мм", "КЛАССИКА 65мм"], defaultValue: "КЛАССИКА 43мм" },
    { id: "specialModel", label: "Спец. модели", values: ["Нет", "MONO BNT M/L", "DOUBLE L"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Металлическая"], defaultValue: "Пластиковая" },
    { id: "weightDecor", label: "Грузик декор", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "childSafety", label: "Детская без.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "reducer", label: "Редуктор", values: ["Нет", "Редуктор 52", "Редуктор 65"], defaultValue: "Нет" },
    { id: "spring", label: "Пружина", values: ["Нет", "Левая", "Правая"], defaultValue: "Нет" },
    { id: "bigMech", label: "Большой мех.", values: ["Нет", "Больш.мех+100", "Больш.мех+200", "Больш.мех+300"], defaultValue: "Нет" },
  ],
};
