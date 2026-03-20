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

// === РУЛОНКА (Mini/MG/Uni) ===
const miniSurcharge: SurchargeFn = (optId, val, _w, h, _base) => {
  switch (optId) {
    case "color": return val === "Дуб" || val === "Т.серый" || val === "Черный" ? 4.49 : 0;
    case "weight": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "metalChain": return val === "Да" ? 3.05 * (h + 1) : 0;
    case "chainTensioner": return val === "Да" ? 1.14 : 0;
    default: return 0;
  }
};

const miniZebraSurcharge: SurchargeFn = (optId, val, _w, h, _base) => {
  switch (optId) {
    case "weight": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "metalChain": return val === "Да" ? 3.05 * (h + 1) : 0;
    default: return 0;
  }
};

const mgSurcharge: SurchargeFn = (optId, val, w, h, _base) => {
  switch (optId) {
    case "color": return val === "Коричневый" ? 5.09 : val === "Черный" ? 10.17 : 0;
    case "rail": return val === "AMG с тканью" ? 2.69 : 0;
    case "weight": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "mountProfile": return val === "Да" ? 4.56 * w : 0;
    case "box": return val === "Да" ? 9.69 * w : 0;
    case "chain": return val === "Металлическая" ? 3.05 * (h + 1) : val === "Сплошная прозр" ? 2.18 : 0;
    default: return 0;
  }
};

const uni1Surcharge: SurchargeFn = (optId, val, _w, h, _base) => {
  switch (optId) {
    case "weight": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "metalChain": return val === "Да" ? 3.05 * (h + 1) : 0;
    default: return 0;
  }
};

const uni1ZebraSurcharge: SurchargeFn = (optId, val, _w, h, _base) => {
  switch (optId) {
    case "color": return val === "Коричневый" ? 5.09 : val === "Черный" ? 10.17 : 0;
    case "weight": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "metalChain": return val === "Да" ? 3.05 * (h + 1) : 0;
    case "chainTensioner": return val === "Да" ? 1.14 : 0;
    default: return 0;
  }
};

const uni2Surcharge: SurchargeFn = (optId, val, _w, h, _base) => {
  switch (optId) {
    case "color": return val === "Коричневый" ? 6 : val === "Зол.дуб" ? 24 : val === "Серебро" ? 29.99 : (val === "Т.серый" || val === "Черный" || val === "Бел.дуб") ? 8.40 : 0;
    case "weight": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "metalChain": return val === "Да" ? 3.05 * (h + 1) : 0;
    case "chainTensioner": return val === "Да" ? 1.14 : 0;
    default: return 0;
  }
};

const uni2ZebraSurcharge: SurchargeFn = (optId, val, _w, h, _base) => {
  switch (optId) {
    case "color": return val === "Коричневый" ? 6 : val === "Зол.дуб" ? 24 : val === "Серебро" ? 29.99 : (val === "Т.серый" || val === "Черный" || val === "Бел.дуб") ? 8.40 : 0;
    case "weight": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "metalChain": return val === "Да" ? 3.05 * (h + 1) : 0;
    case "chainTensioner": return val === "Да" ? 1.14 : 0;
    default: return 0;
  }
};

// === ПЛИССЕ ===
const plisseModels: Record<string, number> = {
  "Р1615":0,"Р1600":11.11,"Р1602":20.26,"Р1610":15.52,"Р1612":20.26,"Р1620":9.26,
  "Р1622":11.68,"Р1626":11.68,"Р1634":37.02,"Р1635":68.77,"Р1636":29.27,"Р1637":55.71,
  "Р1650":55.71,"Р1652":68.77,"Р1662":46.54,"Р1663":55.71,"Р4612":20.26,"Р4615":20.26,
  "Р1700":20.26,"Р1702":11.11,"Р1705":16.75,"Р1710":36.3,"Р1712":28.74,"Р1715":28.74,
  "Р1720":11.32,"Р1722":11.68,"Р1725":11.68,"Р1730":80.21,
};
const plisseColors: Record<string, number> = {"Белый":0,"Серебро":26.44,"Бронза":26.44,"Черный":26.44,"Коричневый":26.44,"Антрацит":26.44};
const plisseBrackets: Record<string, number> = {
  "Потолочный / подоконный":0,"Магнитный подоконный":5.51,"На штапик":0,
  "Стеновой малый":0,"Стеновой стандартный":0,"Стеновой закрытый":0,
  "Стеновой регулируемый":18.15,"На створку ПВХ":27.24,"Накидной металлический":0,
  "Для монт.профиля 20мм":1.7,"Для монт.профиля 27мм":2.17,
};

const plisseSurcharge: SurchargeFn = (optId, val, w, _h, _base) => {
  switch (optId) {
    case "model": return plisseModels[val] ?? 0;
    case "color": return (plisseColors[val] ?? 0) * w;
    case "bracket": return plisseBrackets[val] ?? 0;
    case "cordLoops": return val === "Да" ? 19.05 : 0;
    case "reinforced": return val === "Да" ? 28.59 : 0;
    case "mountProfile": return val === "Да" ? 33.72 * w : 0;
    case "metalHandle": return (parseInt(val) || 0) * 9.52;
    default: return 0;
  }
};

const plisseMaxiModels: Record<string, number> = {
  "Р8700":0,"Р8705":13.06,"Р8710":78.26,"Р8715":100.34,"Р8720":123.75,
  "Р8725":146.66,"Р8800":71.58,"Р8805":92.75,"Р8900":58.53,"Р8905":78.58,
  "Р8910":127.95,"Р8920":91.15,
};
const plisseMaxiBrackets: Record<string, number> = {
  "Потолочный":0,"Стеновой малый":0,"Стеновой стандартный":0,
  "Стеновой закрытый":0,"Стеновой регулируемый":18.15,
};

const plisseMaxiSurcharge: SurchargeFn = (optId, val, w, _h, _base) => {
  switch (optId) {
    case "model": return plisseMaxiModels[val] ?? 0;
    case "color": return (plisseColors[val] ?? 0) * w;
    case "bracket": return plisseMaxiBrackets[val] ?? 0;
    default: return 0;
  }
};

const plisseRusColors: Record<string, number> = {"Белый":0,"Коричневый":11.19,"Черный":11.19};
const plisseRusBrackets: Record<string, number> = {"Потолочный":0,"Пластиковый":0,"Подоконный":0};

const plisseRusSurcharge: SurchargeFn = (optId, val, _w, _h, _base) => {
  switch (optId) {
    case "model": return 0; // PR01 and PR02 both have 0 surcharge
    case "color": return plisseRusColors[val] ?? 0;
    case "bracket": return plisseRusBrackets[val] ?? 0;
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
  "mini": miniSurcharge,
  "mini-zebra": miniZebraSurcharge,
  "mg": mgSurcharge,
  "uni1": uni1Surcharge,
  "uni1-zebra": uni1ZebraSurcharge,
  "uni2": uni2Surcharge,
  "uni2-zebra": uni2ZebraSurcharge,
  "uni2-spring": () => 0,
  "plisse": plisseSurcharge,
  "plisse-maxi": plisseMaxiSurcharge,
  "plisse-rus": plisseRusSurcharge,
};

export function getSurchargeFunction(calcId: string): SurchargeFn {
  return surchargeMap[calcId] ?? (() => 0);
}
