import type { CalculatorConfig } from "@/types/calculator";

export const romanRailsConfig: CalculatorConfig = {
  id: "roman-rails",
  title: "Римские карнизы",
  group: "Шторы",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  electricKitKey: "type",
  options: [
    { id: "bracket", label: "Кронштейн", values: ["—"], dynamic: true, defaultValue: "—" },
    { id: "type", label: "Тип", values: ["Стандарт", "Мини", "Макси"], defaultValue: "Стандарт" },
    { id: "tilt", label: "Наклон.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Нет", "Металл", "Нерж"], defaultValue: "Нет" },
    { id: "dayNight", label: "День/Ночь", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "rod", label: "Стержень", values: ["Нет", "3мм", "5мм", "Прозр. 5мм"], defaultValue: "Нет" },
    { id: "rodLength", label: "Длина стерж. м", values: [], defaultValue: "0" },
    { id: "rodTip", label: "Наконечник 3мм", values: [], defaultValue: "0" },
    { id: "weightBar", label: "Утяжелитель", values: ["ПВХ", "Алюминий"], defaultValue: "ПВХ" },
    { id: "extraLace", label: "Доп. шнуронамотка", values: [], defaultValue: "0" },
    { id: "velcro", label: "Застёжка 25мм loop", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};
