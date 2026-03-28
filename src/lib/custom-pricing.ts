import { registerCustomPriceFn, lookupBasePrice, type CustomPriceFn } from "./pricing";

// === ДБ (Дерево-Бамбук) ===
// Price = MAX(W*H, 0.8) * pricePerSqm(from key lookup) + options
const dbBlindsPriceFn: CustomPriceFn = (priceData, _cat, w, h, options) => {
  const slat = options.slat ?? "25";
  const material = options.material ?? "Бамбук";
  const color = options.color ?? "—";
  if (color === "—" || !color) return 0;

  const key = `${slat}-${material}-${color}`;
  const entry = priceData.priceTable?.find((e: { key: string }) => e.key === key);
  if (!entry) return 0;

  const area = Math.max(w * h, 0.8);
  let price = area * entry.pricePerSqm;

  // Декоративная лесенка (only for 50mm): +5.888 $/m²
  if (options.decLadder === "Да" && slat === "50") price += area * 5.888;
  // Боковая фиксация: +11.187 $/m²
  if (options.sideFix === "Да") price += area * 11.187;

  return price;
};

// === Venus 16 ===
// Color determines category (1 or 3), then matrix lookup
const venus16PriceFn: CustomPriceFn = (priceData, _cat, w, h, options) => {
  const colorName = options.color ?? "";
  if (!colorName || colorName === "—") return 0;

  const colorEntry = priceData.colors?.find((c: { name: string }) => c.name === colorName);
  if (!colorEntry) return 0;
  const category = String(colorEntry.category);

  const widths = priceData.widths?.[category];
  const heights = priceData.heights?.[category];
  const prices = priceData.prices?.[category];
  if (!widths || !heights || !prices) return 0;

  // Find ceil index
  let wIdx = widths.length - 1;
  for (let i = 0; i < widths.length; i++) { if (widths[i] >= w) { wIdx = i; break; } }
  let hIdx = heights.length - 1;
  for (let i = 0; i < heights.length; i++) { if (heights[i] >= h) { hIdx = i; break; } }

  let price = prices[hIdx]?.[wIdx] ?? 0;

  // Options
  if (options.noStop === "Да") price -= 2.18;
  if (options.reducer === "Да") price += 7.62;
  const cc = options.complColor ?? "Белый";
  if (cc === "Серый") price += 5.22;
  else if (cc === "Коричневый") price += 5.22;
  else if (cc === "Золотой дуб") price += 7.35;
  // Подкладка штапик: $1.45 за пару
  const shimMap: Record<string, number> = { "1 пара (16-20мм)": 1, "2 пары (12-16мм)": 2, "3 пары (8-12мм)": 3, "4 пары (4-8мм)": 4, "5 пар (0-4мм)": 5 };
  const shimPairs = shimMap[options.shim ?? ""] || 0;
  if (shimPairs > 0) price += shimPairs * 1.45;

  return price;
};

// === Venus 25 ===
const venus25PriceFn: CustomPriceFn = (priceData, _cat, w, h, options) => {
  const colorName = options.color ?? "";
  if (!colorName || colorName === "—") return 0;

  const colorEntry = priceData.colors?.find((c: { name: string }) => c.name === colorName);
  if (!colorEntry) return 0;
  const category = String(colorEntry.category);

  const widths = priceData.widths?.[category];
  const heights = priceData.heights?.[category];
  const prices = priceData.prices?.[category];
  if (!widths || !heights || !prices) return 0;

  let wIdx = widths.length - 1;
  for (let i = 0; i < widths.length; i++) { if (widths[i] >= w) { wIdx = i; break; } }
  let hIdx = heights.length - 1;
  for (let i = 0; i < heights.length; i++) { if (heights[i] >= h) { hIdx = i; break; } }

  let price = prices[hIdx]?.[wIdx] ?? 0;

  if (options.noStop === "Да") price -= 2.18;
  if (options.reducer === "Да") price += 7.62;
  const cc = options.complColor ?? "Белый";
  if (cc === "Серый") price += 5.22;
  else if (cc === "Коричневый") price += 5.22;
  else if (cc === "Золотой дуб") price += 7.35;
  // Подкладка штапик: $1.45 за пару
  const shimMap25: Record<string, number> = { "1 пара (16-20мм)": 1, "2 пары (12-16мм)": 2, "3 пары (8-12мм)": 3, "4 пары (4-8мм)": 4, "5 пар (0-4мм)": 5 };
  const shimPairs25 = shimMap25[options.shim ?? ""] || 0;
  if (shimPairs25 > 0) price += shimPairs25 * 1.45;

  return price;
};

// === ГЖ Алюминий ===
const gzhBlindsPriceFn: CustomPriceFn = (priceData, _cat, w, h, options) => {
  const slat = options.slat ?? "25";
  const color = options.color ?? "";
  if (!color || color === "—") return 0;

  const entry = priceData.priceTable?.find(
    (e: { slat: string; color: string }) => String(e.slat) === slat && e.color === color
  );
  if (!entry) return 0;

  const area = Math.max(w * h, 1);
  let price = area * entry.pricePerSqm;

  // Боковая фиксация
  if (options.sideFix === "16/25мм") price += area * 7.42;
  else if (options.sideFix === "50мм") price += area * 10.17;
  // Держатель нижнего карниза
  if (options.holderBottom === "Тип В Холис") price += 0.13;
  else if (options.holderBottom === "Магнитный") price += 2.34;
  // ПВХ крепления
  if (options.pvcFix === "Да") price += 15.65;
  // Межрамные жалюзи
  if (options.interCeramics === "Классические") price += area * 2.72;
  else if (options.interCeramics === "С рычагом управл.") price += 22.32;
  // Сложные формы
  if (options.complexShape === "Да") price *= 2;
  // Несколько лент
  if (options.multiTape === "2 ленты") price *= 1.5;
  else if (options.multiTape === "3-6 лент") price *= 2;
  // Декоративная лесенка 50мм
  if (options.decLadder50 === "Да" && slat === "50") price += area * 4.87;

  return price;
};

// === Вертикальные ===
const verticalBlindsPriceFn: CustomPriceFn = (priceData, _cat, w, h, options) => {
  if (w <= 0 || h <= 0) return 0;
  const material = options.material ?? "Ткань";
  const model = options.model ?? "";
  if (!model || model === "—") return 0;
  const area = Math.max(w * h, priceData.minArea || 1);
  let pricePerUnit = 0;
  let price = 0;

  if (material === "Ткань") {
    const cat = priceData.fabricNames?.[model];
    pricePerUnit = cat ? (priceData.fabric?.[cat] ?? 0) : 0;
    price = area * pricePerUnit;
  } else if (material === "Нитяные") {
    pricePerUnit = priceData.thread?.[model] ?? 0;
    price = w * pricePerUnit; // за погонный метр (ширина)
  } else if (material === "Пластик") {
    pricePerUnit = priceData.plastic?.[model] ?? 0;
    price = area * pricePerUnit;
  } else if (material === "Алюминий") {
    pricePerUnit = priceData.aluminium?.[model] ?? 0;
    price = area * pricePerUnit;
  }

  if (pricePerUnit === 0) return 0;

  // Опции
  if (options.lamelOnly === "Да") price += area * (-1.125);
  if (options.metalFurn === "Да") price += area * 10.17;
  if (options.transparentSet === "Да") price += 1.98;
  if (options.decorCornice === "Да") price += w * 1.82;
  if (options.tilted === "Да") price *= 2; // +100% за наклонные

  return price;
};

// === Плиссе ===
// Base price from matrix by cat, + model/color/bracket surcharges, + extras
const plissePriceFn: CustomPriceFn = (priceData, _cat, w, h, options) => {
  const cat = options.cat ?? "Е";
  const base = lookupBasePrice(priceData, cat, w, h);
  if (base === 0) return 0;

  let price = base;

  // Model surcharge
  const modelName = options.model ?? "";
  const modelEntry = priceData.models?.find((m: { name: string }) => m.name === modelName);
  if (modelEntry) price += modelEntry.surcharge;

  // Color surcharge * width
  const colorName = options.color ?? "";
  const colorEntry = priceData.colors?.find((c: { name: string }) => c.name === colorName);
  if (colorEntry) price += colorEntry.surcharge * w;

  // Bracket surcharge
  const bracketName = options.bracket ?? "";
  const bracketEntry = priceData.brackets?.find((b: { name: string }) => b.name === bracketName);
  if (bracketEntry) price += bracketEntry.surcharge;

  // Cord with loops
  if (options.cord === "Да") price += 19.05;
  // Reinforced profile
  if (options.reinforced === "Да") price += 28.59;
  // Mounting profile
  if (options.mountProfile === "Да") price += 33.72 * w;
  // Metal handle
  const handleCount = parseInt(options.handle ?? "0", 10) || 0;
  price += handleCount * 9.52;

  return price;
};

// === Плиссе Макси ===
const plisseMaxiPriceFn: CustomPriceFn = (priceData, _cat, w, h, options) => {
  const cat = options.cat ?? "1";
  const base = lookupBasePrice(priceData, cat, w, h);
  if (base === 0) return 0;

  let price = base;

  const modelName = options.model ?? "";
  const modelEntry = priceData.models?.find((m: { name: string }) => m.name === modelName);
  if (modelEntry) price += modelEntry.surcharge;

  const colorName = options.color ?? "";
  const colorEntry = priceData.colors?.find((c: { name: string }) => c.name === colorName);
  if (colorEntry) price += colorEntry.surcharge * w;

  const bracketName = options.bracket ?? "";
  const bracketEntry = priceData.brackets?.find((b: { name: string }) => b.name === bracketName);
  if (bracketEntry) price += bracketEntry.surcharge;

  return price;
};

// === Плиссе RUS ===
// Color surcharge is flat (no * width)
const plisseRusPriceFn: CustomPriceFn = (priceData, _cat, w, h, options) => {
  const cat = options.cat ?? "1";
  const base = lookupBasePrice(priceData, cat, w, h);
  if (base === 0) return 0;

  let price = base;

  const modelName = options.model ?? "";
  const modelEntry = priceData.models?.find((m: { name: string }) => m.name === modelName);
  if (modelEntry) price += modelEntry.surcharge;

  // Color surcharge WITHOUT width multiplication for RUS
  const colorName = options.color ?? "";
  const colorEntry = priceData.colors?.find((c: { name: string }) => c.name === colorName);
  if (colorEntry) price += colorEntry.surcharge;

  const bracketName = options.bracket ?? "";
  const bracketEntry = priceData.brackets?.find((b: { name: string }) => b.name === bracketName);
  if (bracketEntry) price += bracketEntry.surcharge;

  return price;
};

// === Римские карнизы ===
// Price based on length lookup (width = length of rail, height for chain calc)
const romanRailsPriceFn: CustomPriceFn = (priceData, _cat, w, h, options) => {
  if (w <= 0) return 0;
  const lengths: number[] = priceData.lengths;
  const prices: number[] = priceData.prices;
  const rings: number[] = priceData.rings;
  if (!lengths || !prices || !rings) return 0;

  // Find ceiling match for width in lengths array
  let idx = lengths.length - 1;
  for (let i = 0; i < lengths.length; i++) {
    if (lengths[i] >= w) { idx = i; break; }
  }

  let price = prices[idx] ?? 0;
  const basePrice = price;
  const numRings = rings[idx] ?? 0;

  // Bracket surcharge * rings (or flat for Mini)
  const bracket = options.bracket ?? "Стандартный";
  if (bracket === "Стеновой Мини") {
    price += 6.10;
  } else {
    const bracketPrices: Record<string, number> = {
      "Пружинный": 0.51,
      "Стен. 5см": 1.99,
      "Стен. 10см": 2.64,
      "Стен. 14см": 3.06,
      "Стен. 24см": 3.84,
    };
    price += (bracketPrices[bracket] ?? 0) * numRings;
  }

  // Type surcharge
  const type = options.type ?? "Стандарт";
  if (type === "Мини") price += basePrice * 0.1;
  else if (type === "Макси") price += 71.19 * w;

  // Tilt
  if (options.tilt === "Да") price += 3.05;

  // Chain — length depends on height
  const chain = options.chain ?? "Нет";
  if (chain !== "Нет" && h > 0) {
    // Пластиковая цепь-петля: длина по таблице от высоты
    const chainLengthTable = [
      [0.9, 0.5], [1.1, 0.8], [1.4, 1.0], [1.6, 1.3], [2.0, 1.5],
      [2.4, 1.8], [2.6, 2.0], [2.8, 2.3], [3.0, 2.5], [4.0, 2.8],
    ];
    let chainLen = h * 2 / 3; // default for metal = 2/3 height
    if (chain === "Металл" || chain === "Нерж") {
      chainLen = h * 2 / 3;
    } else {
      // plastic chain lookup
      for (const [maxH, len] of chainLengthTable) {
        if (h <= maxH) { chainLen = len; break; }
      }
    }
    const chainPrice = chain === "Металл" ? 3.05 : chain === "Нерж" ? 6.61 : 0;
    price += chainPrice * chainLen;
  }

  // Day/Night doubles base price
  if (options.dayNight === "Да") price += basePrice;

  // Стержень фиберглассовый
  const rod = options.rod ?? "Нет";
  const rodLen = parseFloat(options.rodLength) || 0;
  if (rod !== "Нет" && rodLen > 0) {
    const rodPrices: Record<string, number> = { "3мм": 0.53, "5мм": 0.62, "Прозр. 5мм": 0.78 };
    price += (rodPrices[rod] ?? 0) * rodLen;
  }
  // Наконечник на стержень 3мм
  const rodTipQty = parseInt(options.rodTip) || 0;
  if (rodTipQty > 0) price += rodTipQty * 0.035;
  // Утяжелитель
  if (options.weightBar === "Алюминий") price += 1.72 * w;
  // Доп. шнуронамотка
  const extraLaceQty = parseInt(options.extraLace) || 0;
  if (extraLaceQty > 0) price += extraLaceQty * 1.83;
  // Застёжка самокл. белая 25мм loop
  if (options.velcro === "Да") price += 0.57 * w;

  return price;
};

// === LIFT система ===
// 1D lookup by width (length of rail), + bracket surcharge
const liftPriceFn: CustomPriceFn = (priceData, _cat, w, _h, options) => {
  if (w <= 0) return 0;
  const lengths: number[] = priceData.lengths;
  const prices: number[] = priceData.prices;
  if (!lengths || !prices) return 0;

  // Find exact or next larger length
  let idx = lengths.findIndex((l: number) => l >= w);
  if (idx === -1) idx = lengths.length - 1; // cap at max

  let price = prices[idx];

  // Двухрядный кронштейн: +bracketDouble за штуку
  if (options.bracket === "Стеновой двухрядный") {
    const qty = parseInt(options.bracketQty) || 0;
    price += qty * (priceData.bracketDouble || 1.02);
  }

  return price;
};

// === Портьеры ===
// Price per running meter by category, width or height based cut, fold coefficient
const curtainsPriceFn: CustomPriceFn = (priceData, cat, w, h, options) => {
  if (w <= 0 || h <= 0) return 0;
  const ppm = priceData.pricePerMeter?.[cat];
  if (!ppm) return 0;

  const cut = options.cut || "По ширине";
  const fold = parseFloat(options.fold) || 1.5;

  let price: number;
  if (cut === "По высоте") {
    // По высоте: цена = стоимость за п.м. × высота
    price = ppm * Math.max(h, priceData.minArea || 1);
  } else {
    // По ширине: цена = стоимость за п.м. × ширина × коэф. складок
    const metrage = w * fold;
    price = ppm * Math.max(metrage, priceData.minArea || 1);
  }

  // Подкладка — как 2-е изделие той же формулы но другой категории
  if (options.lining === "Да") {
    const liningCat = options.liningCat || "E";
    const liningPpm = priceData.pricePerMeter?.[liningCat] || 0;
    if (liningPpm > 0) {
      if (cut === "По высоте") {
        price += liningPpm * Math.max(h, priceData.minArea || 1);
      } else {
        price += liningPpm * Math.max(w * fold, priceData.minArea || 1);
      }
    }
  }

  return price;
};

// === Шторные карнизы ===
const curtainRailsPriceFn: CustomPriceFn = (priceData, _cat, w, _h, options) => {
  if (w <= 0) return 0;
  const model = options.model ?? "LITE";

  let price = 0;
  if (model === "Телескопический") {
    price = priceData.telescope?.price ?? 0;
  } else {
    const key = model === "LITE" ? "lite" : model === "AMIGO Радио+АКБ" ? "akb" : "amigo";
    const lengths: number[] = priceData[key]?.lengths ?? [];
    const prices: number[] = priceData[key]?.prices ?? [];
    let idx = lengths.length - 1;
    for (let i = 0; i < lengths.length; i++) { if (lengths[i] >= w) { idx = i; break; } }
    price = prices[idx] ?? 0;
  }

  if (price === 0) return 0;

  // Открытие шторы
  const opening = options.opening ?? "От управления";
  if (opening === "От центра") price += 19.38;
  else if (opening === "От центра со смещ.") price += 28.50;
  else if (opening === "От двух центров") price += 60.96;

  // Кронштейны
  const bracket = options.bracket ?? "Потолочный станд.";
  const bQty = parseInt(options.bracketQty) || 0;
  const bracketPrices: Record<string, number> = {
    "Потолочный пружин.": 1.66,
    "Стеновой однорядн.": 3.24,
    "Стеновой двухрядн.": 3.80,
    "Стен. 5см": 1.99,
    "Стен. 10см": 2.64,
    "Стен. 14см": 3.06,
    "Стен. 24см": 3.84,
  };
  price += (bracketPrices[bracket] ?? 0) * bQty;

  // Доп. бегунки
  const runners = parseInt(options.extraRunners) || 0;
  if (runners > 0) price += runners * 0.54;

  // Крючки
  const hooks = parseInt(options.hooks) || 0;
  if (hooks > 0) price += hooks * 0.0235;

  // Заглушка укороченная
  const caps = parseInt(options.shortCap) || 0;
  if (caps > 0) price += caps * 2.10;

  // Соединители
  const conn = options.connector ?? "Нет";
  const connQty = parseInt(options.connectorQty) || 0;
  if (conn !== "Нет" && connQty > 0) {
    const connPrice = conn === "Прямой" ? 5.95 : 22.735; // 90 и 135 одна цена
    price += connPrice * connQty;
  }

  // Гибка
  const bending = parseFloat(options.bending) || 0;
  if (bending > 0) price += bending * 32.04;

  // Переход радиуса
  const radiusTrans = parseInt(options.radiusTransition) || 0;
  if (radiusTrans > 0) price += radiusTrans * 16.02;

  // Привод AMIGO Wi-Fi + обратная связь (только для AMIGO радио)
  if (options.amigoWifi === "Да") price += 32.04;

  // B-track скрытые кронштейны
  const bTrack = parseFloat(options.bTrack) || 0;
  if (bTrack > 0) price += bTrack * 5.09;

  // Наклонный карниз
  if (options.tiltRail === "Да") price += 61.02;

  // Длина добора в наклонном карнизе
  const tiltExtra = parseFloat(options.tiltExtra) || 0;
  if (tiltExtra > 0) price += tiltExtra * 15.26;

  // Бесшумная комплектация B-track
  const silent = options.silentKit ?? "Нет";
  if (silent === "От центра") price += 17.29 + 3.05 * w;
  else if (silent === "От/к управлению") price += 10.17 + 3.05 * w;

  // Доп. бесшумный бегунок
  const silentRunner = parseInt(options.silentRunner) || 0;
  if (silentRunner > 0) price += silentRunner * 1.02;

  // Цвет (чёрный — только для приводов Amigo)
  if (options.color === "Черный") price += 35.6 * w;

  return price;
};

// Register all custom pricing functions
export function initCustomPricing() {
  registerCustomPriceFn("db-blinds", dbBlindsPriceFn);
  registerCustomPriceFn("venus16", venus16PriceFn);
  registerCustomPriceFn("venus25", venus25PriceFn);
  registerCustomPriceFn("gzh-blinds", gzhBlindsPriceFn);
  registerCustomPriceFn("vertical-blinds", verticalBlindsPriceFn);
  registerCustomPriceFn("plisse", plissePriceFn);
  registerCustomPriceFn("plisse-maxi", plisseMaxiPriceFn);
  registerCustomPriceFn("plisse-rus", plisseRusPriceFn);
  registerCustomPriceFn("roman-rails", romanRailsPriceFn);
  registerCustomPriceFn("lift", liftPriceFn);
  registerCustomPriceFn("curtains", curtainsPriceFn);
  registerCustomPriceFn("curtain-rails", curtainRailsPriceFn);
}
