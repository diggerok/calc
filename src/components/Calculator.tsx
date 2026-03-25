"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { CalcRowData, CalculatorConfig, PriceData } from "@/types/calculator";
import { getSurchargeFunction } from "@/lib/surcharges";
import { initCustomPricing } from "@/lib/custom-pricing";
import { getDynamicValuesFn } from "@/lib/dynamic-values";
import CalcRow from "./CalcRow";
import PriceSummary from "./PriceSummary";

initCustomPricing();

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
    fabric: "",
    fabricColor: "",
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
  const router = useRouter();
  const surchargeFn = useMemo(() => getSurchargeFunction(config.id), [config.id]);
  const dynamicValuesFn = useMemo(() => getDynamicValuesFn(config.id), [config.id]);
  const [rows, setRows] = useState<CalcRowData[]>(() =>
    Array.from({ length: config.maxRows }, (_, i) =>
      createEmptyRow(i + 1, config)
    )
  );
  const [exchangeRate, setExchangeRate] = useState(90);
  const [markupType, setMarkupType] = useState<"markup" | "discount">("markup");
  const [markupPercent, setMarkupPercent] = useState(0);

  const handleRowChange = (updated: CalcRowData) => {
    setRows((prev) => {
      const newRows = prev.map((r) => (r.id === updated.id ? updated : r));
      const allFilled = newRows.every((r) => r.priceUsd > 0);
      if (allFilled) {
        const nextId = Math.max(...newRows.map((r) => r.id)) + 1;
        newRows.push(createEmptyRow(nextId, config));
      }
      return newRows;
    });
  };

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

  const handleCreateKP = () => {
    const activeRows = rows.filter((r) => r.priceUsd > 0);
    if (activeRows.length === 0) {
      alert("Нет позиций для КП. Заполните хотя бы одну строку.");
      return;
    }
    const kpData = {
      config,
      rows,
      exchangeRate,
      markupType,
      markupPercent,
    };
    sessionStorage.setItem("kp-data", JSON.stringify(kpData));
    router.push("/kp");
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
              {config.fabrics && config.fabrics.length > 0 && (
                <th className="px-2 py-2 border border-slate-600 text-center">
                  Ткань
                </th>
              )}
              {config.fabrics && config.fabrics.length > 0 && (
                <th className="px-2 py-2 border border-slate-600 text-center">
                  Цвет ткани
                </th>
              )}
              {config.categories.length > 0 && (
                <th className="px-2 py-2 border border-slate-600 text-center w-16">
                  Кат.
                </th>
              )}
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
                dynamicValuesFn={dynamicValuesFn}
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
        <button
          onClick={handleCreateKP}
          className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium"
        >
          Создать КП
        </button>
      </div>
    </div>
  );
}
