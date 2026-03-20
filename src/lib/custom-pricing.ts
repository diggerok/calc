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
  if (options.noStop === "Да") price -= 2.18; // without stopper = discount
  if (options.reducer === "Да") price += 7.62;
  const cc = options.complColor ?? "Белый";
  if (cc === "Серый") price += 5.22;
  else if (cc === "Коричневый") price += 5.22;
  else if (cc === "Золотой дуб") price += 7.35;

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

  return price;
};

// === ГЖ Алюминий ===
// Price = MAX(W*H, 1) * pricePerSqm(from slat+color key) + options
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

  // Боковая фиксация: +11.187 $/m²
  if (options.sideFix === "Да") price += area * 11.187;

  return price;
};

// === Вертикальные ===
// Price by category: either per m² (W*H) or per running meter (W)
const verticalBlindsPriceFn: CustomPriceFn = (priceData, _cat, w, h, options) => {
  const catName = options.category ?? "";
  if (!catName || catName === "—") return 0;

  const entry = priceData.categories?.find((c: { name: string }) => c.name === catName);
  if (!entry) return 0;

  let price: number;
  if (entry.type === "пог.м.") {
    price = w * entry.price;
  } else {
    price = Math.max(w * h, 1.66) * entry.price;
  }

  // Options
  if (options.metalFurn === "Да") price += 3.54 * w;
  if (options.transparentSet === "Да") price += 2.37 * w;
  if (options.decorCornice === "Да") price += 9.76 * w;
  if (options.tilted === "Да") price += 71.19;
  if (options.lamelOnly === "Да") price -= 6.0 * w; // discount for lamels only

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
// Price based on length lookup (uses width as length, height is ignored)
const romanRailsPriceFn: CustomPriceFn = (priceData, _cat, w, _h, options) => {
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

  // Bracket surcharge * rings
  const bracket = options.bracket ?? "Стандартный";
  const bracketPrices: Record<string, number> = {
    "Пружинный": 0.51,
    "Стен. 5см": 1.99,
    "Стен. 10см": 2.64,
    "Стен. 14см": 3.06,
    "Стен. 24см": 3.84,
  };
  price += (bracketPrices[bracket] ?? 0) * numRings;

  // Type surcharge
  const type = options.type ?? "Стандарт";
  if (type === "Мини") price += basePrice * 0.1;
  else if (type === "Макси") price += 71.19 * w;

  // Tilt
  if (options.tilt === "Да") price += 3.05;

  // Chain
  const chain = options.chain ?? "Нет";
  if (chain === "Металл") price += 3.05 * (w + 1);
  else if (chain === "Нерж") price += 6.61 * (w + 1);

  // Day/Night doubles base price
  if (options.dayNight === "Да") price += basePrice;

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
}
