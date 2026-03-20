"use client";

import type { CalcRowData, CalculatorConfig, SurchargeFn, DynamicValuesFn } from "@/types/calculator";
import { calculateRowPrice } from "@/lib/pricing";
import OptionSelect from "./OptionSelect";

interface CalcRowProps {
  row: CalcRowData;
  config: CalculatorConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  priceData: any;
  surchargeFn: SurchargeFn;
  dynamicValuesFn?: DynamicValuesFn;
  exchangeRate: number;
  onChange: (updated: CalcRowData) => void;
}

export default function CalcRow({
  row,
  config,
  priceData,
  surchargeFn,
  dynamicValuesFn,
  exchangeRate,
  onChange,
}: CalcRowProps) {
  const recalc = (upd: CalcRowData, opts: Record<string, string>) => {
    const w = parseFloat(String(upd.width)) || 0;
    const h = parseFloat(String(upd.height)) || 0;
    const priceUsd = calculateRowPrice(priceData, config, surchargeFn, upd.category, w, h, opts);
    const priceRub = Math.round(priceUsd * exchangeRate * 100) / 100;
    const totalRub = Math.round(priceRub * upd.quantity * 100) / 100;
    return { ...upd, options: opts, priceUsd, priceRub, totalRub };
  };

  const updateField = (field: string, value: string | number) => {
    const updated = { ...row, [field]: value };
    onChange(recalc(updated, updated.options));
  };

  const updateOption = (optionId: string, value: string) => {
    const newOptions = { ...row.options, [optionId]: value };
    onChange(recalc(row, newOptions));
  };

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-2 py-1 border border-slate-200 text-center text-sm text-slate-500">
        {row.id}
      </td>
      {config.categories.length > 0 && (
        <td className="px-1 py-1 border border-slate-200">
          <select
            value={row.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="w-full text-xs px-1 py-1 border border-slate-300 rounded bg-yellow-50 text-blue-700 font-medium"
          >
            <option value="">—</option>
            {config.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </td>
      )}
      <td className="px-1 py-1 border border-slate-200">
        <input
          type="number"
          step="0.01"
          min="0"
          value={row.width}
          onChange={(e) => updateField("width", e.target.value)}
          className="w-16 text-xs px-1 py-1 border border-slate-300 rounded bg-yellow-50 text-blue-700 font-medium text-center"
          placeholder="м"
        />
      </td>
      <td className="px-1 py-1 border border-slate-200">
        <input
          type="number"
          step="0.01"
          min="0"
          value={row.height}
          onChange={(e) => updateField("height", e.target.value)}
          className="w-16 text-xs px-1 py-1 border border-slate-300 rounded bg-yellow-50 text-blue-700 font-medium text-center"
          placeholder="м"
        />
      </td>

      {config.options.map((opt) => {
        const values = opt.dynamic && dynamicValuesFn
          ? dynamicValuesFn(opt.id, priceData, row.options)
          : opt.values;
        if (values.length === 0) {
          return (
            <td key={opt.id} className="px-1 py-1 border border-slate-200">
              <input
                type="number"
                step="0.01"
                min="0"
                value={row.options[opt.id] ?? opt.defaultValue}
                onChange={(e) => updateOption(opt.id, e.target.value)}
                title={opt.label}
                className="w-16 text-xs px-1 py-1 border border-slate-300 rounded bg-amber-50 text-blue-700 font-medium text-center focus:ring-1 focus:ring-blue-400 focus:outline-none"
                placeholder="0"
              />
            </td>
          );
        }
        return (
          <OptionSelect
            key={opt.id}
            label={opt.label}
            value={row.options[opt.id] ?? opt.defaultValue}
            options={values}
            onChange={(val) => updateOption(opt.id, val)}
          />
        );
      })}

      <td className="px-1 py-1 border border-slate-200">
        <input
          type="number"
          min="1"
          value={row.quantity}
          onChange={(e) =>
            updateField("quantity", parseInt(e.target.value) || 1)
          }
          className="w-12 text-xs px-1 py-1 border border-slate-300 rounded bg-yellow-50 text-blue-700 font-medium text-center"
        />
      </td>
      <td className="px-2 py-1 border border-slate-200 text-right text-sm bg-green-50 font-mono">
        {row.priceUsd > 0 ? row.priceUsd.toFixed(2) : ""}
      </td>
      <td className="px-2 py-1 border border-slate-200 text-right text-sm bg-green-50 font-mono">
        {row.priceRub > 0 ? row.priceRub.toFixed(2) : ""}
      </td>
      <td className="px-2 py-1 border border-slate-200 text-right text-sm bg-green-50 font-mono font-bold">
        {row.totalRub > 0 ? row.totalRub.toFixed(2) : ""}
      </td>
    </tr>
  );
}
