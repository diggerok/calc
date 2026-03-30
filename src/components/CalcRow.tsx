"use client";

import type { CalcRowData, CalculatorConfig, SurchargeFn, DynamicValuesFn } from "@/types/calculator";
import { calculateRowPrice } from "@/lib/pricing";
import { getElectricKitPrice, getAvailableElectricTypes } from "@/lib/electrics";
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
    const box = opts["box"] || "";
    const tube = opts["tube"] || "";
    return config.sizeLimits[`${box}-${tube}`] || config.sizeLimits[`${slat}-${material}`] || config.sizeLimits[material] || config.sizeLimits[slat] || config.sizeLimits["_"] || null;
  };

  const getFabricMaxHeight = (fabricName: string, opts?: Record<string, string>): number | undefined => {
    if (!config.maxHeights) return undefined;
    if (config.maxHeightKeys && opts) {
      // Composite key: "ТКАНЬ::29мм|36мм"
      const optKey = config.maxHeightKeys.map((k) => opts[k] || "").join("|");
      return config.maxHeights[fabricName + "::" + optKey];
    }
    return config.maxHeights[fabricName];
  };

  const recalc = (upd: CalcRowData, opts: Record<string, string>) => {
    const w = parseFloat(String(upd.width)) || 0;
    const h = parseFloat(String(upd.height)) || 0;
    // Проверка: ширина не должна превышать ширину рулона ткани
    const fabric = config.fabrics?.find((f) => f.name === upd.fabric);
    if (fabric && w > fabric.rollWidth / 100) {
      return { ...upd, options: opts, priceUsd: 0, priceRub: 0, totalRub: 0 };
    }
    // Проверка: высота не должна превышать максимум по намотке ткани
    const maxH = getFabricMaxHeight(upd.fabric, opts);
    if (maxH !== undefined && maxH > 0 && h > 0 && h > maxH) {
      return { ...upd, options: opts, priceUsd: 0, priceRub: 0, totalRub: 0 };
    }
    // Ткань недоступна для данного калькулятора (maxH === 0)
    if (maxH === 0) {
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
    let priceUsd = calculateRowPrice(priceData, config, surchargeFn, upd.category, w, h, opts);
    // Доплата за электрику
    if (opts.electric && opts.electric !== "Нет") {
      const kitKey = config.electricKitKey ? (opts[config.electricKitKey] || "") : "";
      priceUsd += getElectricKitPrice(config.id, kitKey, opts.electric);
    }
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
    // При смене трубы/кассеты — сбросить электрику если текущий тип недоступен
    if (config.electricKitKey && optionId === config.electricKitKey && newOptions.electric && newOptions.electric !== "Нет") {
      const available = getAvailableElectricTypes(config.id, value);
      if (!available.includes(newOptions.electric)) newOptions.electric = "Нет";
    }
    // При выборе электрики — сбросить цепи и грузики
    if (optionId === "electric" && value !== "Нет") {
      const chainIds = ["chain", "metalChain", "chainTensioner", "weight", "weightDecor"];
      for (const id of chainIds) {
        if (id in newOptions) {
          const opt = config.options.find((o) => o.id === id);
          if (opt) {
            // Сбросить на "Нет" если есть такое значение, иначе на defaultValue
            newOptions[id] = opt.values.includes("Нет") ? "Нет" : opt.defaultValue;
          }
        }
      }
    }
    onChange(recalc(row, newOptions));
  };

  const currentLimit = getSizeLimit(row.options);
  const fabricMaxH = getFabricMaxHeight(row.fabric, row.options);
  const wNum = parseFloat(row.width) || 0;
  const hNum = parseFloat(row.height) || 0;
  const areaExceeded = !!(currentLimit?.maxArea && wNum > 0 && hNum > 0 && wNum * hNum > currentLimit.maxArea);
  const heightExceeded = !!(currentLimit?.maxHeight && hNum > 0 && hNum > currentLimit.maxHeight);
  const fabricHeightExceeded = fabricMaxH !== undefined && fabricMaxH > 0 && hNum > 0 && hNum > fabricMaxH;
  const fabricUnavailable = fabricMaxH === 0;
  const sizeWarning = areaExceeded || heightExceeded || fabricHeightExceeded || fabricUnavailable;

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
        const fabricMaxWidth = selectedFabric ? selectedFabric.rollWidth / 100 : undefined;
        const maxWidthM = limit?.maxWidth
          ? (fabricMaxWidth ? Math.min(fabricMaxWidth, limit.maxWidth) : limit.maxWidth)
          : fabricMaxWidth;
        const minWidthM = limit?.minWidth;
        const widthNum = parseFloat(row.width) || 0;
        const heightNum = parseFloat(row.height) || 0;
        const widthError = widthNum > 0 && ((maxWidthM && widthNum > maxWidthM) || (minWidthM && widthNum < minWidthM) || (limit?.maxArea && widthNum * heightNum > limit.maxArea));
        const fabricMaxHeight = getFabricMaxHeight(row.fabric, row.options);
        const fabricHUnavail = fabricMaxHeight === 0;
        const fabricHExceeded = fabricMaxHeight !== undefined && fabricMaxHeight > 0 && heightNum > 0 && heightNum > fabricMaxHeight;
        const heightError = heightNum > 0 && ((limit?.maxHeight && heightNum > limit.maxHeight) || (limit?.minHeight && heightNum < limit.minHeight) || (limit?.maxArea && widthNum > 0 && widthNum * heightNum > limit.maxArea)) || fabricHExceeded || fabricHUnavail;
        const widthTitle = limit
          ? `Мин: ${limit.minWidth}м, Макс: ${maxWidthM || limit.maxWidth}м${limit.maxArea ? `, Площадь до ${limit.maxArea}м²` : ""}`
          : maxWidthM ? `Макс. ${maxWidthM}м (ширина рулона ${selectedFabric!.rollWidth}см)` : "";
        const heightTitle = fabricHUnavail
          ? "Ткань недоступна для этого изделия"
          : fabricMaxHeight && fabricMaxHeight > 0
            ? `Макс: ${fabricMaxHeight}м (по намотке)`
            : limit?.maxHeight || limit?.minHeight ? `${limit.minHeight ? `Мин: ${limit.minHeight}м` : ""}${limit.minHeight && limit.maxHeight ? ", " : ""}${limit.maxHeight ? `Макс: ${limit.maxHeight}м` : ""}` : limit?.maxArea ? `Площадь до ${limit.maxArea}м²` : "";
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
        {limit && (
          <div className="text-[9px] text-slate-300 text-center leading-tight mt-0.5">
            {limit.minWidth}–{limit.maxWidth}м
          </div>
        )}
      </td>
      {!config.hideHeight && (
      <td className="px-1 py-1 border border-slate-200">
        <div className="flex items-center gap-1">
          <input
            type="number"
            step="0.01"
            min="0"
            max={fabricMaxHeight !== undefined && fabricMaxHeight > 0 ? fabricMaxHeight : limit?.maxHeight}
            value={row.height}
            onChange={(e) => updateField("height", e.target.value)}
            className={`w-16 text-xs px-1 py-1 border rounded font-medium text-center ${heightError ? "border-red-500 bg-red-50 text-red-700" : "border-slate-300 bg-yellow-50 text-blue-700"}`}
            placeholder="м"
            title={heightTitle}
          />
          {fabricMaxHeight !== undefined && fabricMaxHeight > 0 && (
            <span className={`text-[10px] whitespace-nowrap ${fabricHExceeded ? "text-red-500 font-semibold" : "text-slate-400"}`}>
              ↕{fabricMaxHeight}м
            </span>
          )}
          {fabricHUnavail && (
            <span className="text-[10px] text-red-500 font-semibold whitespace-nowrap">✕</span>
          )}
        </div>
        {limit && (limit.minHeight || limit.maxHeight) && (
          <div className="text-[9px] text-slate-300 text-center leading-tight mt-0.5">
            {limit.minHeight ? `${limit.minHeight}` : "0"}–{limit.maxHeight}м{limit.maxArea ? ` S≤${limit.maxArea}` : ""}
          </div>
        )}
      </td>
      )}
        </>);
      })()}

      {config.options.map((opt) => {
        let values = opt.dynamic && dynamicValuesFn
          ? dynamicValuesFn(opt.id, priceData, row.options)
          : opt.values;
        // Фильтровать варианты электрики по выбранной трубе/кассете
        if (opt.id === "electric") {
          const kitKey = config.electricKitKey ? (row.options[config.electricKitKey] || "") : "";
          values = getAvailableElectricTypes(config.id, kitKey);
        }
        if (values.length === 0) {
          return (
            <td key={opt.id} className="px-1 py-1 border border-slate-200">
              <input
                type="number"
                step={opt.label.match(/шт|кол/i) || opt.id.match(/Tip$|Qty$/) ? "1" : "0.01"}
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
