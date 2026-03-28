import type { CalculatorConfig } from "@/types/calculator";

export const bntMConfig: CalculatorConfig = {
  id: "bnt-m",
  title: "Рулонные шторы BNT M",
  group: "BNT",
  categories: ["E", "1", "2", "3", "4", "5"],
  maxRows: 10,
  maxHeightKeys: ["tube", "bracket"],
  electricKitKey: "tube",
  options: [
    { id: "tube", label: "Труба", values: ["29мм", "43мм", "44мм"], defaultValue: "29мм" },
    { id: "bracket", label: "Кронштейн", values: ["36мм", "41мм", "60мм"], defaultValue: "36мм" },
    { id: "specialModel", label: "Спец. модели", values: ["Нет", "MONO BNT M", "День/Ночь 29мм", "День/Ночь 43мм", "День/Ночь 44мм"], defaultValue: "Нет" },
    { id: "mountProfile", label: "Монт. проф", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "color", label: "Цвет компл.", values: ["Белый Пластик", "Серый", "Черный", "Матовый", "Хром", "Шампань"], defaultValue: "Белый Пластик" },
    { id: "bottomRail", label: "Рейка ниж.", values: ["Рейка AMG/BNT M", "Рейка AMG с тканью", "Рейка BNT L плоская", "Рейка BNT L скругл."], defaultValue: "Рейка AMG/BNT M" },
    { id: "adjustablePlug", label: "Заглуш. Рег.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "weightDecor", label: "Грузик декор", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "childSafety", label: "Детская без.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Металлическая", "Нержавеющая", "Прозрачная"], defaultValue: "Пластиковая" },
    { id: "sideFix", label: "Бок. фикс.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "spring", label: "Пружина", values: ["Нет", "Левая", "Правая"], defaultValue: "Нет" },
    { id: "welding", label: "Сварка", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "electric", label: "Электрика", values: ["Нет", "Провод", "Радио", "Радио+АКБ", "Радио+RS485"], defaultValue: "Нет" },
  ],
};
