import type { SurchargeFn } from "@/types/calculator";

const bntMSurcharge: SurchargeFn = (optId, val, w, h, _base) => {
  switch (optId) {
    case "tube":
      return val === "43мм" || val === "44мм" ? 6.97 * w : 0;
    case "specialModel":
      return val.startsWith("MONO") ? 15.97 : val.startsWith("День") ? 14.54 : 0;
    case "mountProfile":
      return val === "Да" ? 8.71 * w : 0;
    case "color":
      return val === "Серый" || val === "Черный" ? 5.81
        : val === "Матовый" || val === "Хром" || val === "Шампань" ? 41.69 : 0;
    case "bottomRail":
      return val === "Рейка AMG с тканью" ? 2.69
        : val === "Рейка BNT L плоская" || val === "Рейка BNT L скругл." ? 2.035 * w : 0;
    case "adjustablePlug":
      return val === "Да" ? 4.356 : 0;
    case "weightDecor":
      return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "childSafety":
      return val === "Да" ? 4.36 : 0;
    case "chain":
      return val === "Металлическая" ? 3.05 * h * 1.5
        : val === "Нержавеющая" ? 6.61 * h * 1.5
        : val === "Прозрачная" ? 2.18 : 0;
    case "sideFix":
      return val === "Да" ? 20 : 0;
    case "spring":
      return val === "Левая" ? 11.055 : val === "Правая" ? 8.3 : 0;
    case "welding":
      return val === "Да" ? 5.44 * h : 0;
    default:
      return 0;
  }
};

const surchargeMap: Record<string, SurchargeFn> = {
  "bnt-m": bntMSurcharge,
};

export function getSurchargeFunction(calcId: string): SurchargeFn {
  return surchargeMap[calcId] ?? (() => 0);
}
