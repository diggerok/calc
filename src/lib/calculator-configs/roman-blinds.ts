import type { CalculatorConfig } from "@/types/calculator";

export const romanBlindsConfig: CalculatorConfig = {
  id: "roman-blinds",
  title: "Римские шторы",
  group: "Римские шторы",
  categories: ["E", "1", "2", "3", "4"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "weight", label: "Утяж.", values: ["ПВХ", "Алюминий"], defaultValue: "ПВХ" },
    { id: "type", label: "Тип", values: ["Стандарт", "Мини", "Макси"], defaultValue: "Стандарт" },
    { id: "tilt", label: "Наклон.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "fabricOnly", label: "Только ткань", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Нет", "Металл", "Нерж"], defaultValue: "Нет" },
    { id: "weightDecor", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "kant", label: "Канты", values: ["Нет", "30мм", "50мм"], defaultValue: "Нет" },
  ],
};
