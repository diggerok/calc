import type { SurchargeFn } from "@/types/calculator";

const bntMSurcharge: SurchargeFn = (optId, val, w, h, _base) => {
  switch (optId) {
    case "tube": return val === "43мм" || val === "44мм" ? 6.97 * w : 0;
    case "specialModel": return val.startsWith("MONO") ? 15.97 : val.startsWith("День") ? 14.54 : 0;
    case "mountProfile": return val === "Да" ? 8.71 * w : 0;
    case "color": return val === "Серый" || val === "Черный" ? 5.81 : val === "Матовый" || val === "Хром" || val === "Шампань" ? 41.69 : 0;
    case "bottomRail": return val === "Рейка AMG с тканью" ? 2.69 : val === "Рейка BNT L плоская" || val === "Рейка BNT L скругл." ? 2.035 * w : 0;
    case "adjustablePlug": return val === "Да" ? 4.356 : 0;
    case "weightDecor": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "childSafety": return val === "Да" ? 4.36 : 0;
    case "chain": return val === "Металлическая" ? 3.05 * h * 1.5 : val === "Нержавеющая" ? 6.61 * h * 1.5 : val === "Прозрачная" ? 2.18 : 0;
    case "sideFix": return val === "Да" ? 20 : 0;
    case "spring": return val === "Левая" ? 11.055 : val === "Правая" ? 8.3 : 0;
    case "welding": return val === "Да" ? 5.44 * h : 0;
    default: return 0;
  }
};

const bntLSurcharge: SurchargeFn = (optId, val, w, h, _base) => {
  switch (optId) {
    case "tube": return val === "52мм" ? 7.26 * w : val === "65мм" ? 18.87 * w : val === "75мм" ? 48.39 * w : 0;
    case "specialModel": return val === "MONO M/L" ? 15.97 : val === "DOUBLE L" ? 7.92 : 0;
    case "mountProfile": return val === "Да" ? 29.03 * w : 0;
    case "color": return val === "Серый" || val === "Черный" ? 10.16 : 0;
    case "bottomRail": return val === "Рейка AMG с тканью" ? 2.69 : 0;
    case "adjustablePlug": return val === "Да" ? 4.36 : 0;
    case "weightDecor": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "childSafety": return val === "Да" ? 4.36 : 0;
    case "chain": return val === "Прозрачная" ? 2.18 : val === "Металлическая" ? 3.051 * h * 1.5 : val === "Нержавеющая" ? 6.61 * h * 1.5 : val === "Больш.мех+100" ? 20.32 : val === "Больш.мех+200" ? 21.77 : val === "Больш.мех+250" ? 24.68 : val === "Больш.мех+300" ? 27.58 : 0;
    case "sideFix": return val === "Да" ? 93.97 : 0;
    case "reducer": return val === "Редуктор 52" ? 13.65 : val === "Редуктор 65/75" ? 19.31 : 0;
    case "spring": return val === "Левая" ? 11.06 : val === "Правая" ? 8.30 : 0;
    case "welding": return val === "Да" ? 5.44 * h : 0;
    default: return 0;
  }
};

const kassetaBntMSurcharge: SurchargeFn = (optId, val, w, h, _base) => {
  switch (optId) {
    case "cassette": return val === "КАССЕТА 43мм" || val === "КАССЕТА 44мм" ? 6.97 * w : 0;
    case "guides": return val === "Боковые" ? 34.84 * h : val === "Нижняя" ? 15.97 * w : 0;
    case "mono": return val === "Да" ? 26.36 : 0;
    case "color": return val === "Серый металлик" ? 10.16 : val === "Черный муар" ? 22.81 : 0;
    case "bottomRail": return val === "Рейка AMG с тканью" ? 2.69 : val === "Рейка BNT L плоск" || val === "Рейка BNT L скругл" ? 2.03 * w : 0;
    case "adjustablePlug": return val === "Да" ? 4.36 : 0;
    case "weightDecor": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "childSafety": return val === "Да" ? 4.36 : 0;
    case "chain": return val === "Металлическая" ? 3.051 * h * 1.5 : val === "Нержавеющая" ? 6.61 * h * 1.5 : val === "Прозрачная" ? 2.18 : 0;
    case "sideFix": return val === "Да" ? 20 : 0;
    case "spring": return val === "Левая" ? 11.06 : val === "Правая" ? 8.30 : 0;
    case "welding": return val === "Да" ? 5.44 * h : 0;
    default: return 0;
  }
};

const kassetaBntLSurcharge: SurchargeFn = (optId, val, w, h, _base) => {
  switch (optId) {
    case "cassette": return val === "КАССЕТА 52мм" ? 7.26 * w : val === "КАССЕТА 65мм" ? 18.87 * w : val === "КАССЕТА 75мм" ? 48.39 * w : 0;
    case "guides": return val === "Боковые" ? 45.30 * h : val === "Нижняя" ? 19.16 * w : 0;
    case "specialModel": return val === "MONO L" ? 19.16 : val === "DOUBLE L" ? 9.51 : 0;
    case "bottomRail": return val === "Рейка AMG с тканью" ? 2.69 : 0;
    case "adjustablePlug": return val === "Да" ? 4.36 : 0;
    case "weightDecor": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "childSafety": return val === "Да" ? 4.36 : 0;
    case "chain": return val === "Металлическая" ? 3.051 * h * 1.5 : val === "Нержавеющая" ? 6.61 * h * 1.5 : val === "Прозрачная" ? 2.18 : 0;
    case "reducer": return val === "Редуктор 52" ? 13.65 : val === "Редуктор 65/75" ? 19.31 : 0;
    case "spring": return val === "Левая" ? 11.06 : val === "Правая" ? 8.30 : 0;
    case "welding": return val === "Да" ? 5.44 * h : 0;
    default: return 0;
  }
};

const zebraBntMSurcharge: SurchargeFn = (optId, val, w, h, _base) => {
  switch (optId) {
    case "tube": return val === "КЛАССИКА 44мм" ? 6.97 * w : 0;
    case "color": return val === "Серый" || val === "Черный" ? 5.81 : 0;
    case "specialModel": return val === "MONO BNT M/L" ? 15.97 : 0;
    case "chain": return val === "Металлическая" ? 3.05 * h * 1.5 : val === "Прозрачная" ? 2.18 : 0;
    case "weightDecor": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "childSafety": return val === "Да" ? 4.36 : 0;
    case "spring": return val === "Левая" ? 11.06 : val === "Правая" ? 8.30 : 0;
    default: return 0;
  }
};

const zebraBntLSurcharge: SurchargeFn = (optId, val, w, h, _base) => {
  switch (optId) {
    case "tube": return val === "КЛАССИКА 52мм" ? 7.26 * w : val === "КЛАССИКА 65мм" ? 18.87 * w : 0;
    case "specialModel": return val === "MONO BNT M/L" ? 15.97 : val === "DOUBLE L" ? 7.92 : 0;
    case "chain": return val === "Металлическая" ? 3.051 * h * 1.5 : 0;
    case "weightDecor": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "childSafety": return val === "Да" ? 4.36 : 0;
    case "reducer": return val === "Редуктор 52" ? 13.65 : val === "Редуктор 65" ? 19.31 : 0;
    case "spring": return val === "Левая" ? 11.06 : val === "Правая" ? 8.30 : 0;
    case "bigMech": return val === "Больш.мех+100" ? 21.77 : val === "Больш.мех+200" ? 24.68 : val === "Больш.мех+300" ? 27.58 : 0;
    default: return 0;
  }
};

const zebraKassetaBntMSurcharge: SurchargeFn = (optId, val, w, h, _base) => {
  switch (optId) {
    case "cassette": return val === "КАССЕТА 43мм" || val === "КАССЕТА 44мм" ? 6.97 * w : 0;
    case "color": return val === "Серый металлик" ? 10.16 : val === "Черный муар" ? 22.81 : 0;
    case "mono": return val === "Да" ? 26.36 * w : 0;
    case "weightDecor": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "metalChain": return val === "Да" ? 3.05 * h * 1.5 : 0;
    case "spring": return val === "Левая" ? 11.06 : val === "Правая" ? 8.30 : 0;
    case "childSafety": return val === "Да" ? 4.36 : 0;
    default: return 0;
  }
};

const surchargeMap: Record<string, SurchargeFn> = {
  "bnt-m": bntMSurcharge,
  "bnt-l": bntLSurcharge,
  "kasseta-bnt-m": kassetaBntMSurcharge,
  "kasseta-bnt-l": kassetaBntLSurcharge,
  "zebra-bnt-m": zebraBntMSurcharge,
  "zebra-bnt-l": zebraBntLSurcharge,
  "zebra-kasseta-bnt-m": zebraKassetaBntMSurcharge,
};

export function getSurchargeFunction(calcId: string): SurchargeFn {
  return surchargeMap[calcId] ?? (() => 0);
}
