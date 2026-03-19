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

// Register all custom pricing functions
export function initCustomPricing() {
  registerCustomPriceFn("db-blinds", dbBlindsPriceFn);
  registerCustomPriceFn("venus16", venus16PriceFn);
  registerCustomPriceFn("venus25", venus25PriceFn);
  registerCustomPriceFn("gzh-blinds", gzhBlindsPriceFn);
  registerCustomPriceFn("vertical-blinds", verticalBlindsPriceFn);
}
