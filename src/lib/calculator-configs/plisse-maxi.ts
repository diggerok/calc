import type { CalculatorConfig } from "@/types/calculator";

export const plisseMaxiConfig: CalculatorConfig = {
  id: "plisse-maxi",
  title: "Плиссе Maxi",
  group: "Плиссе",
  categories: ["1", "2", "3", "4", "5"],
  maxRows: 10,
  options: [
    { id: "model", label: "Модель", values: ["Р8700","Р8705","Р8710","Р8715","Р8720","Р8725","Р8800","Р8805","Р8900","Р8905","Р8910","Р8920"], defaultValue: "Р8700" },
    { id: "color", label: "Цвет", values: ["Белый","Серебро","Бронза","Черный","Коричневый","Антрацит"], defaultValue: "Белый" },
    { id: "bracket", label: "Кронштейн", values: ["Потолочный","Стеновой малый","Стеновой стандартный","Стеновой закрытый","Стеновой регулируемый"], defaultValue: "Потолочный" },
  ],
};
