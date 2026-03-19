import type { CalculatorConfig } from "@/types/calculator";

export const kassetaBntMConfig: CalculatorConfig = {
  id: "kasseta-bnt-m",
  title: "Кассета BNT M",
  categories: ["E", "1", "2", "3", "4", "5"],
  maxRows: 10,
  options: [
    { id: "cassette", label: "Кассета", values: ["КАССЕТА 29мм", "КАССЕТА 43мм", "КАССЕТА 44мм"], defaultValue: "КАССЕТА 29мм" },
    { id: "guides", label: "Направл.", values: ["Нет", "Боковые", "Нижняя"], defaultValue: "Нет" },
    { id: "mono", label: "MONO", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "color", label: "Цвет компл.", values: ["Белый", "Серый металлик", "Черный муар"], defaultValue: "Белый" },
    { id: "bottomRail", label: "Рейка ниж.", values: ["Рейка AMG", "Рейка AMG с тканью", "Рейка BNT M", "Рейка BNT L плоск", "Рейка BNT L скругл"], defaultValue: "Рейка AMG" },
    { id: "adjustablePlug", label: "Заглуш. Рег.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "weightDecor", label: "Грузик декор", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "childSafety", label: "Детская без.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Металлическая", "Нержавеющая", "Прозрачная"], defaultValue: "Пластиковая" },
    { id: "sideFix", label: "Бок. фикс.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "spring", label: "Пружина", values: ["Нет", "Левая", "Правая"], defaultValue: "Нет" },
    { id: "welding", label: "Сварка", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};
