import type { CalculatorConfig } from "@/types/calculator";

export const bntLConfig: CalculatorConfig = {
  id: "bnt-l",
  title: "Рулонные шторы BNT L",
  group: "BNT",
  categories: ["E", "1", "2", "3", "4", "5"],
  maxRows: 10,
  options: [
    { id: "tube", label: "Труба", values: ["43мм", "52мм", "65мм", "75мм"], defaultValue: "43мм" },
    { id: "specialModel", label: "Спец. модели", values: ["Нет", "MONO M/L", "DOUBLE L"], defaultValue: "Нет" },
    { id: "mountProfile", label: "Монт. проф", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "color", label: "Цвет компл.", values: ["Белый", "Серый", "Черный"], defaultValue: "Белый" },
    { id: "bottomRail", label: "Рейка ниж.", values: ["Рейка AMG", "Рейка AMG с тканью"], defaultValue: "Рейка AMG" },
    { id: "adjustablePlug", label: "Заглуш. Рег.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "weightDecor", label: "Грузик декор", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "childSafety", label: "Детская без.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Прозрачная", "Металлическая", "Нержавеющая", "Больш.мех+100", "Больш.мех+200", "Больш.мех+250", "Больш.мех+300"], defaultValue: "Пластиковая" },
    { id: "sideFix", label: "Бок. фикс.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "reducer", label: "Редуктор", values: ["Нет", "Редуктор 52", "Редуктор 65/75"], defaultValue: "Нет" },
    { id: "spring", label: "Пружина", values: ["Нет", "Левая", "Правая"], defaultValue: "Нет" },
    { id: "welding", label: "Сварка", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};
