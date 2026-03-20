import type { CalculatorConfig } from "@/types/calculator";

export const miniConfig: CalculatorConfig = {
  id: "mini",
  title: "Mini",
  group: "Рулонка",
  categories: ["E", "1", "2", "3", "4", "5"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "color", label: "Цвет компл.", values: ["Белый", "Дуб", "Т.серый", "Черный"], defaultValue: "Белый" },
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "metalChain", label: "Метал. цепь", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chainTensioner", label: "Натяж. цепи", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};

export const miniZebraConfig: CalculatorConfig = {
  id: "mini-zebra",
  title: "Mini Зебра",
  group: "Рулонка",
  categories: ["0", "E", "1", "2", "3", "4"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "metalChain", label: "Метал. цепь", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};

export const mgConfig: CalculatorConfig = {
  id: "mg",
  title: "MG",
  group: "Рулонка",
  categories: ["E", "1", "2", "3", "4", "5"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "color", label: "Цвет компл.", values: ["Белый", "Коричневый", "Черный"], defaultValue: "Белый" },
    { id: "rail", label: "Рейка ниж.", values: ["Стандарт", "AMG с тканью"], defaultValue: "Стандарт" },
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "mountProfile", label: "Монт. проф", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "box", label: "Короб", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Металлическая", "Сплошная прозр"], defaultValue: "Пластиковая" },
  ],
};

export const uni1Config: CalculatorConfig = {
  id: "uni1",
  title: "Uni 1",
  group: "Рулонка",
  categories: ["E", "1", "2", "3", "4", "5"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "metalChain", label: "Метал. цепь", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};

export const uni1ZebraConfig: CalculatorConfig = {
  id: "uni1-zebra",
  title: "Uni 1 Зебра",
  group: "Рулонка",
  categories: ["0", "E", "1", "2", "3", "4"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "color", label: "Цвет фурн.", values: ["Белый", "Коричневый", "Черный"], defaultValue: "Белый" },
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "metalChain", label: "Метал. цепь", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chainTensioner", label: "Натяж. цепи", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};

export const uni2Config: CalculatorConfig = {
  id: "uni2",
  title: "Uni 2",
  group: "Рулонка",
  categories: ["E", "1", "2", "3", "4", "5"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "color", label: "Цвет фурн.", values: ["Белый", "Коричневый", "Зол.дуб", "Серебро", "Т.серый", "Черный", "Бел.дуб"], defaultValue: "Белый" },
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "metalChain", label: "Метал. цепь", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chainTensioner", label: "Натяж. цепи", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};

export const uni2ZebraConfig: CalculatorConfig = {
  id: "uni2-zebra",
  title: "Uni 2 Зебра",
  group: "Рулонка",
  categories: ["0", "E", "1", "2", "3", "4"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "color", label: "Цвет фурн.", values: ["Белый", "Коричневый", "Зол.дуб", "Серебро", "Т.серый", "Черный", "Бел.дуб"], defaultValue: "Белый" },
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "metalChain", label: "Метал. цепь", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chainTensioner", label: "Натяж. цепи", values: ["Нет", "Да"], defaultValue: "Нет" },
  ],
};

export const uni2SpringConfig: CalculatorConfig = {
  id: "uni2-spring",
  title: "Uni 2 Пружина",
  group: "Рулонка",
  categories: ["E", "1", "2", "3", "4", "5"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [],
};
