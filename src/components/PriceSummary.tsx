"use client";

import type { CalcRowData } from "@/types/calculator";

interface PriceSummaryProps {
  rows: CalcRowData[];
  exchangeRate: number;
  markupType: "markup" | "discount";
  markupPercent: number;
  accessoriesTotalUsd?: number;
  onMarkupTypeChange: (type: "markup" | "discount") => void;
  onMarkupPercentChange: (percent: number) => void;
  onExchangeRateChange: (rate: number) => void;
}

export default function PriceSummary({
  rows,
  exchangeRate,
  markupType,
  markupPercent,
  accessoriesTotalUsd = 0,
  onMarkupTypeChange,
  onMarkupPercentChange,
  onExchangeRateChange,
}: PriceSummaryProps) {
  const rowsUsd = rows.reduce((s, r) => s + r.priceUsd * r.quantity, 0);
  const rowsRub = rows.reduce((s, r) => s + r.totalRub, 0);
  const accRub = Math.round(accessoriesTotalUsd * exchangeRate * 100) / 100;
  const totalUsd = rowsUsd + accessoriesTotalUsd;
  const totalRub = rowsRub + accRub;

  const markupMultiplier =
    markupType === "markup"
      ? 1 + markupPercent / 100
      : 1 - markupPercent / 100;
  const finalUsd = Math.round(totalUsd * markupMultiplier * 100) / 100;
  const finalRub = Math.round(totalRub * markupMultiplier * 100) / 100;
  const markupAmountRub = Math.round((finalRub - totalRub) * 100) / 100;

  return (
    <div className="mt-4 space-y-3">
      {/* Controls */}
      <div className="flex items-center gap-4 text-sm">
        <label className="font-bold text-slate-700">Курс $:</label>
        <input
          type="number"
          value={exchangeRate}
          onChange={(e) =>
            onExchangeRateChange(parseFloat(e.target.value) || 90)
          }
          className="w-20 px-2 py-1 border border-slate-300 rounded text-blue-700 font-bold bg-yellow-50"
        />
        <select
          value={markupType}
          onChange={(e) =>
            onMarkupTypeChange(e.target.value as "markup" | "discount")
          }
          className="px-2 py-1 border border-slate-300 rounded text-blue-700 font-bold bg-yellow-50"
        >
          <option value="markup">Наценка</option>
          <option value="discount">Скидка</option>
        </select>
        <input
          type="number"
          value={markupPercent}
          onChange={(e) =>
            onMarkupPercentChange(parseFloat(e.target.value) || 0)
          }
          className="w-16 px-2 py-1 border border-slate-300 rounded text-blue-700 font-bold bg-yellow-50"
        />
        <span className="text-slate-600 font-bold">%</span>
      </div>

      {/* Totals */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-slate-500">ИТОГО{accessoriesTotalUsd > 0 ? " (изделия + аксессуары)" : ""}</div>
            <div className="text-lg font-bold">
              {totalUsd.toFixed(2)} $ / {totalRub.toFixed(2)} ₽
            </div>
            {accessoriesTotalUsd > 0 && (
              <div className="text-xs text-slate-400 mt-0.5">
                аксессуары: {accessoriesTotalUsd.toFixed(2)} $ / {accRub.toFixed(2)} ₽
              </div>
            )}
          </div>
          <div>
            <div className="text-slate-500">
              {markupType === "markup" ? "Наценка" : "Скидка"} {markupPercent}%
            </div>
            <div className="text-lg font-bold">
              {markupAmountRub >= 0 ? "+" : ""}
              {markupAmountRub.toFixed(2)} ₽
            </div>
          </div>
          <div>
            <div className="text-slate-500">ИТОГО К ОПЛАТЕ</div>
            <div className="text-2xl font-bold text-blue-800">
              {finalUsd.toFixed(2)} $ / {finalRub.toFixed(2)} ₽
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
