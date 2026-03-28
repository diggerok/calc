import type { CalculatorConfig } from "@/types/calculator";

export const amgConfig: CalculatorConfig = {
  id: "amg",
  title: "AMG",
  group: "AMG",
  categories: ["E", "1", "2", "3", "4", "5"],
  pricingMode: "matrix",
  maxRows: 10,
  electricKitKey: "tube",
  maxHeightKeys: ["model", "tube"],
  options: [
    { id: "model", label: "Модель", values: ["Классика", "Кассета", "Пружина", "День/Ночь", "DOUBLE", "MONO"], defaultValue: "Классика" },
    { id: "tube", label: "Труба", values: ["32", "45"], defaultValue: "32" },
    { id: "mountProfile", label: "Монт. проф", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "bottomRail", label: "Рейка ниж.", values: ["AMG", "AMG с тканью", "UNI/MINI"], defaultValue: "AMG" },
    { id: "fabricInsert", label: "Ткан. вставка", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "welding", label: "Сварка", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Металлическая", "Нержавеющая"], defaultValue: "Пластиковая" },
    { id: "chainTensioner", label: "Натяж. цепи", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "color", label: "Цвет компл.", values: ["Белый", "Серый", "Антрацит", "Черный"], defaultValue: "Белый" },
    { id: "sideFix", label: "Бок. фикс.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "wallBracket", label: "Стен. кронш.", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "extBracket45", label: "Кронш. удл. 45", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "guides", label: "Направляющие", values: ["Нет", "Боковые", "Нижняя"], defaultValue: "Нет" },
    { id: "pocket", label: "Карман+рейка", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};

export const amgLConfig: CalculatorConfig = {
  id: "amg-l",
  title: "AMG L",
  group: "AMG",
  categories: ["E", "1", "2", "3", "4", "5"],
  pricingMode: "matrix",
  maxRows: 10,
  electricKitKey: "model",
  options: [
    { id: "model", label: "Модель", values: ["Классика 51", "Классика 65", "Кассета", "MONO", "DOUBLE"], defaultValue: "Классика 51" },
    { id: "mountProfile", label: "Монт. проф", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "color", label: "Цвет компл.", values: ["Белый"], defaultValue: "Белый" },
    { id: "bottomRail", label: "Рейка ниж.", values: ["AMG", "AMG с тканью", "BNT L плоская", "BNT L скругл."], defaultValue: "AMG" },
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "chain", label: "Цепь", values: ["Пластиковая (4.5×6мм)", "Металлическая (4.5×6мм)", "Нержавеющая"], defaultValue: "Пластиковая (4.5×6мм)" },
    { id: "chainTensioner", label: "Натяж. цепи", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "welding", label: "Сварка", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "pocket", label: "Карман+рейка", values: ["Нет", "Да"], defaultValue: "Нет" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};

export const amgXlConfig: CalculatorConfig = {
  id: "amg-xl",
  title: "AMG XL",
  group: "AMG",
  categories: ["E", "1", "2", "3", "4", "5"],
  pricingMode: "matrix",
  maxRows: 10,
  options: [
    { id: "color", label: "Цвет компл.", values: ["Белый", "Серый", "Черный"], defaultValue: "Белый" },
    { id: "bottomRail", label: "Рейка ниж.", values: ["AMG", "AMG с тканью"], defaultValue: "AMG" },
    { id: "weight", label: "Грузик цепи", values: ["Стандарт", "Декор", "Дизайн"], defaultValue: "Стандарт" },
    { id: "chain", label: "Цепь", values: ["Пластиковая", "Металлическая", "Нержавеющая"], defaultValue: "Пластиковая" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};
