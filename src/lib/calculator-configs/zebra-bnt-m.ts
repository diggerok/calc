import type { CalculatorConfig } from "@/types/calculator";

export const zebraBntMConfig: CalculatorConfig = {
  id: "zebra-bnt-m",
  title: "Зебра BNT M",
  group: "BNT",
  categories: ["0", "E", "1", "2", "3", "4"],
  maxRows: 10,
  maxHeightKeys: ["tube", "bracket"],
  electricKitKey: "tube",
  options: [
    { id: "tube", label: "Труба", values: ["КЛАССИКА 29мм", "КЛАССИКА 44мм"], defaultValue: "КЛАССИКА 29мм" },
    { id: "bracket", label: "Кронштейн", values: ["36мм", "41мм", "60мм"], defaultValue: "36мм" },
    { id: "color", label: "Цвет компл.", values: ["Белый", "Серый", "Черный"], defaultValue: "Белый" },
    { id: "specialModel", label: "Спец. модели", values: ["Нет", "MONO BNT M/L"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Металлическая", "Прозрачная"], defaultValue: "Пластиковая" },
    { id: "weightDecor", label: "Грузик декор", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "childSafety", label: "Детская без.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "spring", label: "Пружина", values: ["Нет", "Левая", "Правая"], defaultValue: "Нет" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};
