import type { CalculatorConfig } from "@/types/calculator";

export const kassetaBntLConfig: CalculatorConfig = {
  id: "kasseta-bnt-l",
  title: "Кассета BNT L",
  group: "BNT",
  categories: ["E", "1", "2", "3", "4", "5"],
  maxRows: 10,
  options: [
    { id: "cassette", label: "Кассета", values: ["КАССЕТА 43мм", "КАССЕТА 52мм", "КАССЕТА 65мм", "КАССЕТА 75мм"], defaultValue: "КАССЕТА 43мм" },
    { id: "guides", label: "Направл.", values: ["Нет", "Боковые", "Нижняя"], defaultValue: "Нет" },
    { id: "specialModel", label: "Спец. модели", values: ["Нет", "MONO L", "DOUBLE L"], defaultValue: "Нет" },
    { id: "bottomRail", label: "Рейка ниж.", values: ["Рейка AMG", "Рейка AMG с тканью"], defaultValue: "Рейка AMG" },
    { id: "adjustablePlug", label: "Заглуш. Рег.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "weightDecor", label: "Грузик декор", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "childSafety", label: "Детская без.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Металлическая", "Нержавеющая", "Прозрачная"], defaultValue: "Пластиковая" },
    { id: "bigMechanism", label: "Больш. мех.", values: ["Нет", "Прозр. цепь", "Петля 200см", "Петля 250см", "Петля 300см"], defaultValue: "Нет" },
    { id: "reducer", label: "Редуктор", values: ["Нет", "Редуктор 52", "Редуктор 65/75"], defaultValue: "Нет" },
    { id: "spring", label: "Пружина", values: ["Нет", "Левая", "Правая"], defaultValue: "Нет" },
    { id: "welding", label: "Сварка", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};
