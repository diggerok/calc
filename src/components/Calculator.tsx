"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CalcRowData, CalculatorConfig, PriceData } from "@/types/calculator";
import { getSurchargeFunction } from "@/lib/surcharges";
import { initCustomPricing } from "@/lib/custom-pricing";
import { getDynamicValuesFn } from "@/lib/dynamic-values";
import CalcRow from "./CalcRow";
import { showToast } from "./Toast";
import PriceSummary from "./PriceSummary";
import AccessoriesPanel from "./AccessoriesPanel";
import { accessories } from "@/lib/electrics";

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
  const [clientName, setClientName] = useState("");
  const [exchangeRate, setExchangeRate] = useState(90);
  const [markupType, setMarkupType] = useState<"markup" | "discount">("markup");
  const [markupPercent, setMarkupPercent] = useState(0);
  const [accessorySelections, setAccessorySelections] = useState<Record<string, number>>({});
  const hasElectric = config.options.some((o) => o.id === "electric");

  const accessoriesTotalUsd = useMemo(() => {
    return accessories.reduce((sum, a) => sum + a.price * (accessorySelections[a.id] || 0), 0);
  }, [accessorySelections]);

  // Загрузка сохранённого расчёта (из истории или при возврате с КП)
  useEffect(() => {
    const stateKey = `calc-state-${config.id}`;
    const fromKP = sessionStorage.getItem(stateKey);
    const fromHistory = sessionStorage.getItem("load-calc");
    const saved = fromKP || fromHistory;
    if (fromKP) sessionStorage.removeItem(stateKey);
    if (fromHistory) sessionStorage.removeItem("load-calc");
    if (!saved) return;
    try {
      const { name, data, markup, rate, mType, accessories: acc } = JSON.parse(saved);
      if (name) setClientName(name);
      if (rate) setExchangeRate(rate);
      if (acc) setAccessorySelections(acc);
      if (markup !== undefined) {
        if (mType) {
          setMarkupType(mType);
          setMarkupPercent(Math.abs(markup));
        } else if (markup < 0) {
          setMarkupType("discount");
          setMarkupPercent(Math.abs(markup));
        } else {
          setMarkupType("markup");
          setMarkupPercent(markup);
        }
      }
      if (Array.isArray(data) && data.length > 0) {
        const loadedRows: CalcRowData[] = data.map((r: CalcRowData, i: number) => ({
          ...createEmptyRow(i + 1, config),
          ...r,
          id: i + 1,
        }));
        const nextId = loadedRows.length + 1;
        loadedRows.push(createEmptyRow(nextId, config));
        setRows(loadedRows);
      }
    } catch {
      // ignore parse errors
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

    const totalUsd = activeRows.reduce((s, r) => s + r.priceUsd * r.quantity, 0) + (hasElectric ? accessoriesTotalUsd : 0);
    const accRub = Math.round((hasElectric ? accessoriesTotalUsd : 0) * exchangeRate * 100) / 100;
    const totalRub = activeRows.reduce((s, r) => s + r.totalRub, 0) + accRub;

    const res = await fetch("/api/calculations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: config.id,
        name: clientName,
        data: activeRows,
        totalUsd,
        totalRub,
        markup: markupPercent * (markupType === "discount" ? -1 : 1),
      }),
    });

    if (res.ok) {
      showToast("Расчёт сохранён!");
    }
  };

  const handleCreateKP = () => {
    const activeRows = rows.filter((r) => r.priceUsd > 0);
    if (activeRows.length === 0) {
      showToast("Нет позиций для КП", "error");
      return;
    }
    const selectedAccessories = accessories
      .filter((a) => (accessorySelections[a.id] || 0) > 0)
      .map((a) => ({ id: a.id, name: a.name, price: a.price, quantity: accessorySelections[a.id] }));
    const kpData = {
      config,
      rows,
      exchangeRate,
      markupType,
      markupPercent,
      clientName,
      accessories: selectedAccessories,
    };
    sessionStorage.setItem("kp-data", JSON.stringify(kpData));
    // Сохраняем состояние калькулятора для возврата
    sessionStorage.setItem(`calc-state-${config.id}`, JSON.stringify({
      name: clientName,
      data: rows.filter((r) => r.priceUsd > 0),
      markup: markupPercent,
      mType: markupType,
      rate: exchangeRate,
      accessories: accessorySelections,
    }));
    router.push("/kp");
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold" style={{ color: "#1B3054" }}>{config.title}</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Клиент:</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="ООО «Компания» или ФИО"
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ backgroundColor: "#1B3054" }} className="text-white">
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
              {!config.hideHeight && (
              <th className="px-2 py-2 border border-slate-600 text-center w-20">
                Высота
                <br />м
              </th>
              )}
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
        accessoriesTotalUsd={hasElectric ? accessoriesTotalUsd : 0}
        onMarkupTypeChange={setMarkupType}
        onMarkupPercentChange={setMarkupPercent}
        onExchangeRateChange={handleExchangeRateChange}
      />

      <div className="mt-4 flex gap-3">
        <button
          onClick={handleSave}
          className="px-6 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all"
          style={{ backgroundColor: "#2a4a7f" }}
        >
          Сохранить расчёт
        </button>
        <button
          onClick={handleCreateKP}
          className="px-6 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all"
          style={{ backgroundColor: "#1B3054" }}
        >
          Создать КП
        </button>
      </div>

      {hasElectric && (
        <AccessoriesPanel
          selections={accessorySelections}
          exchangeRate={exchangeRate}
          onChange={setAccessorySelections}
        />
      )}
    </div>
  );
}
