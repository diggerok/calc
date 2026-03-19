"use client";

import { useState, useCallback, useMemo } from "react";
import type { CalcRowData, CalculatorConfig, PriceData } from "@/types/calculator";
import { getSurchargeFunction } from "@/lib/surcharges";
import CalcRow from "./CalcRow";
import PriceSummary from "./PriceSummary";

interface CalculatorProps {
  config: CalculatorConfig;
  priceData: PriceData;
}

function createEmptyRow(id: number, config: CalculatorConfig): CalcRowData {
  const options: Record<string, string> = {};
  for (const opt of config.options) {
    options[opt.id] = opt.defaultValue;
  }
  return {
    id,
    category: "",
    width: "",
    height: "",
    options,
    quantity: 1,
    priceUsd: 0,
    priceRub: 0,
    totalRub: 0,
  };
}

export default function Calculator({ config, priceData }: CalculatorProps) {
  const surchargeFn = useMemo(() => getSurchargeFunction(config.id), [config.id]);
  const [rows, setRows] = useState<CalcRowData[]>(() =>
    Array.from({ length: config.maxRows }, (_, i) =>
      createEmptyRow(i + 1, config)
    )
  );
  const [exchangeRate, setExchangeRate] = useState(90);
  const [markupType, setMarkupType] = useState<"markup" | "discount">("markup");
  const [markupPercent, setMarkupPercent] = useState(0);

  const handleRowChange = useCallback((updated: CalcRowData) => {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  }, []);

  const handleExchangeRateChange = useCallback(
    (rate: number) => {
      setExchangeRate(rate);
      setRows((prev) =>
        prev.map((r) => {
          if (r.priceUsd === 0) return r;
          const priceRub = Math.round(r.priceUsd * rate * 100) / 100;
          const totalRub = Math.round(priceRub * r.quantity * 100) / 100;
          return { ...r, priceRub, totalRub };
        })
      );
    },
    []
  );

  const handleSave = async () => {
    const activeRows = rows.filter((r) => r.priceUsd > 0);
    if (activeRows.length === 0) return;

    const totalUsd = activeRows.reduce((s, r) => s + r.priceUsd * r.quantity, 0);
    const totalRub = activeRows.reduce((s, r) => s + r.totalRub, 0);

    const res = await fetch("/api/calculations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: config.id,
        data: activeRows,
        totalUsd,
        totalRub,
        markup: markupPercent * (markupType === "discount" ? -1 : 1),
      }),
    });

    if (res.ok) {
      alert("Расчёт сохранён!");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-4">{config.title}</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-700 text-white">
              <th className="px-2 py-2 border border-slate-600 text-center w-8">
                №
              </th>
              <th className="px-2 py-2 border border-slate-600 text-center w-16">
                Кат.
              </th>
              <th className="px-2 py-2 border border-slate-600 text-center w-20">
                Ширина
                <br />м
              </th>
              <th className="px-2 py-2 border border-slate-600 text-center w-20">
                Высота
                <br />м
              </th>
              {config.options.map((opt) => (
                <th
                  key={opt.id}
                  className="px-1 py-2 border border-slate-600 text-center text-xs whitespace-nowrap"
                >
                  {opt.label}
                </th>
              ))}
              <th className="px-2 py-2 border border-slate-600 text-center w-14">
                Кол-во
              </th>
              <th className="px-2 py-2 border border-slate-600 text-center w-24">
                Цена $
              </th>
              <th className="px-2 py-2 border border-slate-600 text-center w-24">
                Цена ₽
              </th>
              <th className="px-2 py-2 border border-slate-600 text-center w-28">
                Итого ₽
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <CalcRow
                key={row.id}
                row={row}
                config={config}
                priceData={priceData}
                surchargeFn={surchargeFn}
                exchangeRate={exchangeRate}
                onChange={handleRowChange}
              />
            ))}
          </tbody>
        </table>
      </div>

      <PriceSummary
        rows={rows}
        exchangeRate={exchangeRate}
        markupType={markupType}
        markupPercent={markupPercent}
        onMarkupTypeChange={setMarkupType}
        onMarkupPercentChange={setMarkupPercent}
        onExchangeRateChange={handleExchangeRateChange}
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Сохранить расчёт
        </button>
      </div>
    </div>
  );
}
