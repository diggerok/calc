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
    case "chain": return val === "Прозрачная" ? 2.18 : val === "Металлическая" ? 3.051 * h * 1.5 : val === "Нержавеющая" ? 6.61 * h * 1.5 : 0;
    case "bigMechanism": return val === "Прозр. цепь" ? 20.32 : val === "Петля 200см" ? 21.77 : val === "Петля 250см" ? 24.68 : val === "Петля 300см" ? 27.58 : 0;
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
    case "bigMechanism": return val === "Прозр. цепь" ? 20.32 : val === "Петля 200см" ? 21.77 : val === "Петля 250см" ? 24.68 : val === "Петля 300см" ? 27.58 : 0;
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
    case "chainTensioner": return val === "Да" ? 1.14 : 0;
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
    case "color":
      if (val === "Белый") return 0;
      if (val === "Коричневый") return 6;
      if (val === "Зол.дуб, св.дуб, махагон") return 24;
      if (val === "Серебро") return 29.99;
      if (val === "Темно-серый") return 8.4;
      if (val === "Бел.дуб, Зол.дуб субл.Рус") return 8.4;
      if (val === "Черный") return 8.4;
      return 0;
    case "chainTensioner":
      if (val === "Белый") return 1.14;
      if (val === "Дуб, кор., т.серый, черный") return 1.14;
      return 0;
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

// === ZIP / LOCK ===
const zipLockSurcharge: SurchargeFn = (optId, val, w, h, basePrice) => {
  switch (optId) {
    case "tube": return val === "78" ? 54.03 * w : 0;
    case "box": return val === "120" ? 51.46 * w : 0;
    case "control": return val === "Крэнк" ? 45.02 : val === "Пружина" ? 154.39 : val === "Цепь" ? 3.05 * (h + 1) : val === "Цепь нерж" ? 6.56 * (h + 1) : 0;
    case "crankZip": return val !== "Нет" ? 13.52 : 0;
    case "ral": return val === "Да" ? basePrice * 0.15 : 0;
    case "weld": return (parseFloat(val) || 0) * 5.44;
    case "corner": return (parseFloat(val) || 0) * 52.11;
    default: return 0;
  }
};

const zipRoofSurcharge: SurchargeFn = (optId, val, _w, _h, basePrice) => {
  switch (optId) {
    case "ral": return val === "Да" ? basePrice * 0.15 : 0;
    case "weld": return (parseFloat(val) || 0) * 5.44;
    case "corner": return (parseFloat(val) || 0) * 52.11;
    default: return 0;
  }
};

// === Римские шторы ===
const romanBlindsSurcharge: SurchargeFn = (optId, val, w, h, basePrice) => {
  switch (optId) {
    case "bracket":
      if (val === "Пружинный") return 0.51;
      if (val === "Стен. 5см") return 1.99;
      if (val === "Стен. 10см") return 2.64;
      if (val === "Стен. 14см") return 3.06;
      if (val === "Стен. 24см") return 3.84;
      if (val === "Стеновой Мини") return 6.10;
      return 0;
    case "type":
      if (val === "Макси") return 71.19 * w;
      if (val === "Мини") return 0; // Мини расчёт по матрице
      return 0;
    case "weight": return val === "Алюминий" ? 1.72 * w : 0;
    case "chain": {
      if (val === "Пластик" || val === "Нет" || h <= 0) return 0;
      // Металл/Нерж: длина = 2/3 высоты изделия
      const chainLen = h * 2 / 3;
      return val === "Металл" ? 3.05 * chainLen : val === "Нерж" ? 6.61 * chainLen : 0;
    }
    case "weightDecor": return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    case "fabricOnly": return val === "Да" ? -13 * w : 0;
    case "tilt": return val === "Да" ? 71.19 : 0;
    case "dayNight": return val === "Да" ? basePrice : 0;
    case "sideFix": return 0; // бесплатно для Мини
    case "kant": return val === "30мм" ? 17.55 * w : val === "50мм" ? 21.06 * w : 0;
    default: return 0;
  }
};

const amgSurcharge: SurchargeFn = (optId, val, w, h, _base, opts) => {
  const tube = opts?.tube || "32";
  const model = opts?.model || "Классика";
  // Наценка модель+труба считается через "model", "tube" не добавляет отдельно
  if (optId === "model") {
    switch (val) {
      case "Классика": return tube === "45" ? 22.57 : 0;
      case "Кассета": return tube === "45" ? 37.25 * w : 30.44 * w;
      case "Пружина": return 13.80;
      case "День/Ночь": return tube === "45" ? 26.33 : 15.05;
      case "MONO": return (tube === "45" ? 22.57 : 0) + 13.80;
      case "DOUBLE": return (tube === "45" ? 22.57 : 0) + 13.80;
      default: return 0;
    }
  }
  // tube обрабатывается через model, не считаем дважды
  if (optId === "tube") return 0;
  if (optId === "mountProfile") return val === "Да" ? 10.04 * w : 0;
  if (optId === "bottomRail") return val === "AMG с тканью" ? 2.69 : 0;
  if (optId === "fabricInsert") return val === "Да" ? 8.78 : 0;
  if (optId === "welding") return val === "Да" ? 5.44 * h : 0;
  if (optId === "chain") return val === "Металлическая" ? 3.05 * h * 1.5 : val === "Нержавеющая" ? 6.61 * h * 1.5 : 0;
  if (optId === "weight") return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
  if (optId === "color") {
    if (val === "Белый") return 0;
    return (tube === "45" || model === "Кассета" && tube === "45") ? 10.17 : 7.63;
  }
  if (optId === "extBracket45") return val === "Да" ? 6.27 : 0;
  if (optId === "guides") return val === "Боковые" ? 37.63 * h : val === "Нижняя" ? 12.54 * w : 0;
  if (optId === "pocket") return val === "Да" ? 5.44 : 0;
  return 0;
};

const amgLSurcharge: SurchargeFn = (optId, val, w, h, _base) => {
  if (optId === "model") {
    switch (val) {
      case "Классика 65": return 7.32 * w;
      case "Кассета": return 42.71 * w;
      case "MONO": return 14.81;
      case "DOUBLE": return 8.64;
      default: return 0; // Классика 51 = база
    }
  }
  if (optId === "mountProfile") return val === "Да" ? 9.77 * w : 0;
  if (optId === "bottomRail") return val === "AMG с тканью" ? 2.69 : 0;
  if (optId === "weight") return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
  if (optId === "chain") return val === "Металлическая (4.5×6мм)" ? 3.05 * h * 1.5 : val === "Нержавеющая" ? 6.61 * h * 1.5 : 0;
  if (optId === "welding") return val === "Да" ? 5.44 * h : 0;
  if (optId === "pocket") return val === "Да" ? 5.44 * w : 0;
  return 0;
};

const amgXlSurcharge: SurchargeFn = (optId, val, _w, _h, _base) => {
  if (optId === "bottomRail") return val === "AMG с тканью" ? 2.69 : 0;
  if (optId === "weight") return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
  if (optId === "chain") return val === "Металлическая" ? 3.05 : val === "Прозрачная" ? 2.18 : 0;
  return 0;
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
  "zip": zipLockSurcharge,
  "lock": zipLockSurcharge,
  "zip-roof": zipRoofSurcharge,
  "roman-blinds": romanBlindsSurcharge,
  "amg": amgSurcharge,
  "amg-l": amgLSurcharge,
  "amg-xl": amgXlSurcharge,
  "mgs-zebra": (optId, val, w, h, basePrice) => {
    if (optId === "color") return val === "Коричневый" ? basePrice * 0.15 : 0;
    if (optId === "box") return val === "Да" ? 7.18 * w : 0;
    if (optId === "chain") return val === "Металлическая" ? 3.05 * h * 1.5 : 0;
    if (optId === "weight") return val === "Декор" ? 1.32 : val === "Дизайн" ? 3.56 : 0;
    return 0;
  },
  "mirage": (optId, val, _w, h) => {
    if (optId === "fabricInsert") return val === "Да" ? 7.61 : 0;
    if (optId === "chain") return val === "Металлическая с замком" ? 3.05 * h * 1.5 : 0;
    return 0;
  },
};

export function getSurchargeFunction(calcId: string): SurchargeFn {
  return surchargeMap[calcId] ?? (() => 0);
}
