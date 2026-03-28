import type { CalculatorConfig } from "@/types/calculator";

export const liftConfig: CalculatorConfig = {
  id: "lift",
  title: "LIFT система",
  group: "Шторы",
  categories: [],
  pricingMode: "custom",
  maxRows: 10,
  hideHeight: true,
  electricKitKey: "motor",
  options: [
    { id: "bracket", label: "Кронштейн", values: ["Стеновой однорядный", "Стеновой двухрядный"], defaultValue: "Стеновой однорядный" },
    { id: "bracketQty", label: "Кол-во кронш.", values: [], defaultValue: "0" },
    { id: "motor", label: "Мотор", values: ["DM35", "DM45"], defaultValue: "DM35" },
    { id: "electric", label: "Электрика", values: ["Нет"], defaultValue: "Нет" },
  ],
};
