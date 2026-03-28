import type { CalculatorConfig } from "@/types/calculator";

export const romanBlindsConfig: CalculatorConfig = {
  id: "roman-blinds",
  title: "Римские шторы",
  group: "Шторы",
  categories: ["E", "1", "2", "3", "4"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "bracket", label: "Кронштейн", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "type", label: "Тип", values: ["Стандарт", "Мини", "Макси"], defaultValue: "Стандарт" },
    { id: "weight", label: "Утяжелитель", values: ["Пластиковый", "Алюминий"], defaultValue: "Пластиковый" },
    { id: "chain", label: "Цепь", values: ["Пластик", "Металл", "Нерж"], defaultValue: "Пластик" },
    { id: "weightDecor", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "fabricOnly", label: "Только ткань", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "tilt", label: "Наклонные", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "dayNight", label: "День/Ночь", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "sideFix", label: "Бок. фикс. Мини", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "tunnel", label: "Вид тоннелей", values: ["Тесьма", "Внешний", "Скрытый"], defaultValue: "Тесьма" },
    { id: "kant", label: "Канты", values: ["Нет", "30мм", "50мм"], defaultValue: "Нет" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};
