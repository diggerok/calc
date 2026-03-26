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
  const getSizeLimit = (opts: Record<string, string>) => {
    if (!config.sizeLimits) return null;
    const slat = opts["slat"] || "";
    const material = opts["material"] || "";
    return config.sizeLimits[`${slat}-${material}`] || null;
  };

  const recalc = (upd: CalcRowData, opts: Record<string, string>) => {
    const w = parseFloat(String(upd.width)) || 0;
    const h = parseFloat(String(upd.height)) || 0;
    // Проверка: ширина не должна превышать ширину рулона ткани
    const fabric = config.fabrics?.find((f) => f.name === upd.fabric);
    if (fabric && w > fabric.rollWidth / 100) {
      return { ...upd, options: opts, priceUsd: 0, priceRub: 0, totalRub: 0 };
    }
    // Проверка ограничений размеров (дерево/бамбук) — жёсткие ограничения (ширина/высота)
    const limit = getSizeLimit(opts);
    if (limit && w > 0) {
      if (w < limit.minWidth || w > limit.maxWidth) {
        return { ...upd, options: opts, priceUsd: 0, priceRub: 0, totalRub: 0 };
      }
      // Высота и площадь — цена считается, но подсвечивается красным в UI
    }
    const priceUsd = calculateRowPrice(priceData, config, surchargeFn, upd.category, w, h, opts);
    const priceRub = Math.round(priceUsd * exchangeRate * 100) / 100;
    const totalRub = Math.round(priceRub * upd.quantity * 100) / 100;
    return { ...upd, options: opts, priceUsd, priceRub, totalRub };
  };

  const updateField = (field: string, value: string | number) => {
    const updated = { ...row, [field]: value };
    onChange(recalc(updated, updated.options));
  };

  const updateFabric = (fabricName: string) => {
    const fabric = config.fabrics?.find((f) => f.name === fabricName);
    const newCategory = fabric?.category || row.category;
    const newOptions = { ...row.options };
    // Для плиссе категория хранится в options.cat
    if (fabric && "cat" in newOptions) {
      newOptions.cat = fabric.category;
    }
    const updated = {
      ...row,
      fabric: fabricName,
      category: newCategory,
    };
    onChange(recalc(updated, newOptions));
  };

  const updateOption = (optionId: string, value: string) => {
    const newOptions = { ...row.options, [optionId]: value };
    onChange(recalc(row, newOptions));
  };

  const currentLimit = getSizeLimit(row.options);
  const wNum = parseFloat(row.width) || 0;
  const hNum = parseFloat(row.height) || 0;
  const areaExceeded = !!(currentLimit?.maxArea && wNum > 0 && hNum > 0 && wNum * hNum > currentLimit.maxArea);
  const heightExceeded = !!(currentLimit?.maxHeight && hNum > 0 && hNum > currentLimit.maxHeight);
  const sizeWarning = areaExceeded || heightExceeded;

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-2 py-1 border border-slate-200 text-center text-sm text-slate-500">
        {row.id}
      </td>
      {config.fabrics && config.fabrics.length > 0 && (() => {
        const selectedFabric = config.fabrics!.find((f) => f.name === row.fabric);
        return (
          <td className="px-1 py-1 border border-slate-200">
            <div className="flex items-center gap-1">
              <input
                list={`fabrics-${row.id}`}
                value={row.fabric}
                onChange={(e) => updateFabric(e.target.value)}
                className="w-28 text-xs px-1 py-1 border border-slate-300 rounded bg-yellow-50 text-blue-700 font-medium"
                placeholder="Ткань"
              />
              {selectedFabric && (
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {selectedFabric.rollWidth}см
                </span>
              )}
            </div>
            <datalist id={`fabrics-${row.id}`}>
              {config.fabrics!.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name} (кат.{f.category}, {f.rollWidth}см)
                </option>
              ))}
            </datalist>
          </td>
        );
      })()}
      {config.fabrics && config.fabrics.length > 0 && (
        <td className="px-1 py-1 border border-slate-200">
          <input
            type="text"
            value={row.fabricColor}
            onChange={(e) => updateField("fabricColor", e.target.value)}
            className="w-20 text-xs px-1 py-1 border border-slate-300 rounded bg-yellow-50 text-blue-700 font-medium text-center"
            placeholder="Цвет"
          />
        </td>
      )}
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
      {(() => {
        const selectedFabric = config.fabrics?.find((f) => f.name === row.fabric);
        const limit = getSizeLimit(row.options);
        const maxWidthM = selectedFabric ? selectedFabric.rollWidth / 100 : limit?.maxWidth;
        const minWidthM = limit?.minWidth;
        const widthNum = parseFloat(row.width) || 0;
        const heightNum = parseFloat(row.height) || 0;
        const widthError = widthNum > 0 && ((maxWidthM && widthNum > maxWidthM) || (minWidthM && widthNum < minWidthM) || (limit?.maxArea && widthNum * heightNum > limit.maxArea));
        const heightError = heightNum > 0 && ((limit?.maxHeight && heightNum > limit.maxHeight) || (limit?.maxArea && widthNum > 0 && widthNum * heightNum > limit.maxArea));
        const widthTitle = limit
          ? `Мин: ${limit.minWidth}м, Макс: ${limit.maxWidth}м${limit.maxArea ? `, Площадь до ${limit.maxArea}м²` : ""}`
          : maxWidthM ? `Макс. ${maxWidthM}м (ширина рулона ${selectedFabric!.rollWidth}см)` : "";
        const heightTitle = limit?.maxHeight ? `Макс: ${limit.maxHeight}м` : limit?.maxArea ? `Площадь до ${limit.maxArea}м²` : "";
        return (<>
      <td className="px-1 py-1 border border-slate-200">
        <input
          type="number"
          step="0.01"
          min={minWidthM || 0}
          max={maxWidthM}
          value={row.width}
          onChange={(e) => updateField("width", e.target.value)}
          className={`w-16 text-xs px-1 py-1 border rounded font-medium text-center ${widthError ? "border-red-500 bg-red-50 text-red-700" : "border-slate-300 bg-yellow-50 text-blue-700"}`}
          placeholder="м"
          title={widthTitle}
        />
      </td>
      <td className="px-1 py-1 border border-slate-200">
        <input
          type="number"
          step="0.01"
          min="0"
          max={limit?.maxHeight}
          value={row.height}
          onChange={(e) => updateField("height", e.target.value)}
          className={`w-16 text-xs px-1 py-1 border rounded font-medium text-center ${heightError ? "border-red-500 bg-red-50 text-red-700" : "border-slate-300 bg-yellow-50 text-blue-700"}`}
          placeholder="м"
          title={heightTitle}
        />
      </td>
        </>);
      })()}

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
      <td className={`px-2 py-1 border border-slate-200 text-right text-sm font-mono ${sizeWarning ? "bg-red-50 text-red-600" : "bg-green-50"}`}>
        {row.priceUsd > 0 ? row.priceUsd.toFixed(2) : ""}
      </td>
      <td className={`px-2 py-1 border border-slate-200 text-right text-sm font-mono ${sizeWarning ? "bg-red-50 text-red-600" : "bg-green-50"}`}>
        {row.priceRub > 0 ? row.priceRub.toFixed(2) : ""}
      </td>
      <td className={`px-2 py-1 border border-slate-200 text-right text-sm font-mono font-bold ${sizeWarning ? "bg-red-50 text-red-600" : "bg-green-50"}`}>
        {row.totalRub > 0 ? row.totalRub.toFixed(2) : ""}
      </td>
    </tr>
  );
}
