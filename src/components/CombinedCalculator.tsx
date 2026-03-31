"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { calculatorConfigs, orderedGroups } from "@/lib/calculator-configs";
import { calculateRowPrice } from "@/lib/pricing";
import { getSurchargeFunction } from "@/lib/surcharges";
import { getDynamicValuesFn } from "@/lib/dynamic-values";
import { getElectricKitPrice, getAvailableElectricTypes, accessories } from "@/lib/electrics";
import type { CalculatorConfig, CalcRowData } from "@/types/calculator";
import { showToast } from "./Toast";
import OptionSelect from "./OptionSelect";
import AccessoriesPanel from "./AccessoriesPanel";
import PriceSummary from "./PriceSummary";

interface Room {
  id: string;
  name: string;
}

interface CombinedRow {
  id: number;
  calcId: string;
  row: CalcRowData;
  roomId: string;
}

function createEmptyCalcRow(id: number, config: CalculatorConfig): CalcRowData {
  const options: Record<string, string> = {};
  for (const opt of config.options) {
    options[opt.id] = opt.defaultValue;
  }
  return { id, fabric: "", fabricColor: "", category: "", width: "", height: "", options, quantity: 1, priceUsd: 0, priceRub: 0, totalRub: 0 };
}

interface Props {
  allPriceData: Record<string, unknown>;
}

let roomCounter = 1;

export default function CombinedCalculator({ allPriceData }: Props) {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([{ id: "room-1", name: "" }]);
  const [rows, setRows] = useState<CombinedRow[]>([{ id: 1, calcId: "", row: createEmptyCalcRow(1, { options: [], categories: [] } as unknown as CalculatorConfig), roomId: "room-1" }]);
  const [clientName, setClientName] = useState("");
  const [exchangeRate, setExchangeRate] = useState(90);
  const [markupType, setMarkupType] = useState<"markup" | "discount">("markup");
  const [markupPercent, setMarkupPercent] = useState(0);
  const [accessorySelections, setAccessorySelections] = useState<Record<string, number>>({});

  const addRoom = () => {
    roomCounter++;
    const newRoom: Room = { id: `room-${Date.now()}`, name: "" };
    setRooms(prev => [...prev, newRoom]);
    const nextId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows(prev => [...prev, { id: nextId, calcId: "", row: createEmptyCalcRow(nextId, { options: [], categories: [] } as unknown as CalculatorConfig), roomId: newRoom.id }]);
  };

  const removeRoom = (roomId: string) => {
    if (rooms.length <= 1) return;
    setRooms(prev => prev.filter(r => r.id !== roomId));
    setRows(prev => prev.filter(r => r.roomId !== roomId));
  };

  const renameRoom = (roomId: string, name: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, name } : r));
  };

  const accessoriesTotalUsd = useMemo(() => {
    return accessories.reduce((sum, a) => sum + a.price * (accessorySelections[a.id] || 0), 0);
  }, [accessorySelections]);

  const groupedCalcs = useMemo(() => {
    const result: { label: string; id: string }[] = [];
    for (const [group, calcs] of orderedGroups) {
      for (const c of calcs) {
        result.push({ label: `${group} → ${c.title}`, id: c.id });
      }
    }
    return result;
  }, []);

  const recalcRow = useCallback((calcId: string, row: CalcRowData): CalcRowData => {
    const config = calculatorConfigs[calcId];
    if (!config) return row;
    const priceData = allPriceData[calcId];
    if (!priceData) return row;
    const surchargeFn = getSurchargeFunction(calcId);
    const w = parseFloat(String(row.width)) || 0;
    const h = parseFloat(String(row.height)) || 0;

    // Width check
    const fabric = config.fabrics?.find((f) => f.name === row.fabric);
    if (fabric && w > fabric.rollWidth / 100) {
      return { ...row, priceUsd: 0, priceRub: 0, totalRub: 0 };
    }

    let priceUsd = calculateRowPrice(priceData, config, surchargeFn, row.category, w, h, row.options);
    // Electric
    if (row.options.electric && row.options.electric !== "Нет") {
      const kitKey = config.electricKitKey ? (row.options[config.electricKitKey] || "") : "";
      priceUsd += getElectricKitPrice(calcId, kitKey, row.options.electric);
    }
    const priceRub = Math.round(priceUsd * exchangeRate * 100) / 100;
    const totalRub = Math.round(priceRub * row.quantity * 100) / 100;
    return { ...row, priceUsd, priceRub, totalRub };
  }, [allPriceData, exchangeRate]);

  const handleCalcChange = (rowId: number, newCalcId: string) => {
    setRows(prev => prev.map(r => {
      if (r.id !== rowId) return r;
      const config = calculatorConfigs[newCalcId];
      if (!config) return r;
      return { ...r, calcId: newCalcId, row: createEmptyCalcRow(rowId, config) };
    }));
  };

  const handleRowUpdate = (rowId: number, field: string, value: string | number) => {
    setRows(prev => {
      const newRows = prev.map(r => {
        if (r.id !== rowId || !r.calcId) return r;
        const config = calculatorConfigs[r.calcId];
        if (!config) return r;

        let updatedRow: CalcRowData;
        if (field === "fabric") {
          const fabric = config.fabrics?.find(f => f.name === value);
          const newCat = fabric?.category || r.row.category;
          const newOptions = { ...r.row.options };
          if (fabric && "cat" in newOptions) newOptions.cat = fabric.category;
          updatedRow = { ...r.row, fabric: value as string, category: newCat, options: newOptions };
        } else if (field.startsWith("opt:")) {
          const optId = field.slice(4);
          const newOptions = { ...r.row.options, [optId]: value as string };
          // Reset electric on tube/cassette change
          if (config.electricKitKey && optId === config.electricKitKey && newOptions.electric && newOptions.electric !== "Нет") {
            const available = getAvailableElectricTypes(r.calcId, value as string);
            if (!available.includes(newOptions.electric)) newOptions.electric = "Нет";
          }
          // Reset chains on electric
          if (optId === "electric" && value !== "Нет") {
            for (const id of ["chain", "metalChain", "chainTensioner", "weight", "weightDecor"]) {
              if (id in newOptions) {
                const opt = config.options.find(o => o.id === id);
                if (opt) newOptions[id] = opt.values.includes("Нет") ? "Нет" : opt.defaultValue;
              }
            }
          }
          updatedRow = { ...r.row, options: newOptions };
        } else {
          updatedRow = { ...r.row, [field]: value };
        }
        return { ...r, row: recalcRow(r.calcId, updatedRow) };
      });

      // Auto-add row in same room if all rows in that room are filled
      const currentRow = newRows.find(r => r.id === rowId);
      if (currentRow) {
        const roomRows = newRows.filter(r => r.roomId === currentRow.roomId);
        const allFilled = roomRows.every(r => r.calcId && r.row.priceUsd > 0);
        if (allFilled) {
          const nextId = Math.max(...newRows.map(r => r.id)) + 1;
          newRows.push({ id: nextId, calcId: "", row: createEmptyCalcRow(nextId, { options: [], categories: [] } as unknown as CalculatorConfig), roomId: currentRow.roomId });
        }
      }
      return newRows;
    });
  };

  const handleRemoveRow = (rowId: number) => {
    setRows(prev => {
      const row = prev.find(r => r.id === rowId);
      const filtered = prev.filter(r => r.id !== rowId);
      // Keep at least one row per room
      if (row) {
        const roomRows = filtered.filter(r => r.roomId === row.roomId);
        if (roomRows.length === 0) {
          const nextId = filtered.length > 0 ? Math.max(...filtered.map(r => r.id)) + 1 : 1;
          filtered.push({ id: nextId, calcId: "", row: createEmptyCalcRow(nextId, { options: [], categories: [] } as unknown as CalculatorConfig), roomId: row.roomId });
        }
      }
      return filtered.length > 0 ? filtered : [{ id: 1, calcId: "", row: createEmptyCalcRow(1, { options: [], categories: [] } as unknown as CalculatorConfig), roomId: rooms[0]?.id || "room-1" }];
    });
  };

  const allCalcRows = rows.filter(r => r.row.priceUsd > 0).map(r => r.row);

  const handleExchangeRateChange = useCallback((rate: number) => {
    setExchangeRate(rate);
    setRows(prev => prev.map(r => {
      if (r.row.priceUsd === 0) return r;
      const priceRub = Math.round(r.row.priceUsd * rate * 100) / 100;
      const totalRub = Math.round(priceRub * r.row.quantity * 100) / 100;
      return { ...r, row: { ...r.row, priceRub, totalRub } };
    }));
  }, []);

  const handleSave = async () => {
    const activeRows = allCalcRows;
    if (activeRows.length === 0) return;
    const totalUsd = activeRows.reduce((s, r) => s + r.priceUsd * r.quantity, 0) + accessoriesTotalUsd;
    const totalRub = activeRows.reduce((s, r) => s + r.totalRub, 0) + Math.round(accessoriesTotalUsd * exchangeRate * 100) / 100;
    await fetch("/api/calculations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "combined", name: clientName, data: activeRows, totalUsd, totalRub, markup: markupPercent * (markupType === "discount" ? -1 : 1) }),
    });
    showToast("Расчёт сохранён!");
  };

  const handleCreateKP = () => {
    if (allCalcRows.length === 0) { showToast("Нет позиций для КП", "error"); return; }
    const selectedAccessories = accessories.filter(a => (accessorySelections[a.id] || 0) > 0).map(a => ({ id: a.id, name: a.name, price: a.price, quantity: accessorySelections[a.id] }));
    // Build combined config for KP
    const activeRooms = rooms.filter(room => rows.some(r => r.roomId === room.id && r.row.priceUsd > 0));
    const kpData = {
      config: { id: "combined", title: "Сборный расчёт", group: "", categories: [], options: [], maxRows: 100 },
      rows: rows.filter(r => r.row.priceUsd > 0).map(r => {
        const config = calculatorConfigs[r.calcId];
        return { ...r.row, options: { ...r.row.options, _calcTitle: config?.title || "", _roomId: r.roomId } };
      }),
      rooms: activeRooms,
      exchangeRate, markupType, markupPercent, clientName,
      accessories: selectedAccessories,
    };
    sessionStorage.setItem("kp-data", JSON.stringify(kpData));
    router.push("/kp");
  };

  const getRoomSubtotal = (roomId: string) => {
    return rows.filter(r => r.roomId === roomId && r.row.priceUsd > 0).reduce((s, r) => s + r.row.totalRub, 0);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Сборный расчёт</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Клиент:</label>
          <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="ООО «Компания» или ФИО" className={`px-3 py-1.5 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 ${!clientName.trim() ? "border-red-400 bg-red-50" : "border-slate-300"}`} />
          {!clientName.trim() && (
            <span className="text-xs text-red-500">Введите клиента</span>
          )}
        </div>
      </div>

      <div className={!clientName.trim() ? "opacity-40 pointer-events-none select-none" : ""}>
      <div className="space-y-6">
        {rooms.map((room, roomIdx) => {
          const roomRows = rows.filter(r => r.roomId === room.id);
          const subtotal = getRoomSubtotal(room.id);
          let globalIdx = 0;
          for (let i = 0; i < roomIdx; i++) {
            globalIdx += rows.filter(r => r.roomId === rooms[i].id).length;
          }

          return (
            <div key={room.id} className="border border-blue-200 rounded-xl bg-blue-50/30 p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🏠</span>
                <input
                  type="text"
                  value={room.name}
                  onChange={e => renameRoom(room.id, e.target.value)}
                  placeholder={`Помещение ${roomIdx + 1}`}
                  className="px-3 py-1.5 border border-blue-300 rounded-lg text-sm font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 w-64"
                />
                {subtotal > 0 && (
                  <span className="text-sm font-mono font-bold text-blue-700 ml-auto mr-2">
                    Итого: {subtotal.toFixed(2)} ₽
                  </span>
                )}
                {rooms.length > 1 && (
                  <button onClick={() => removeRoom(room.id)} className="text-red-400 hover:text-red-600 text-sm" title="Удалить помещение">✕</button>
                )}
              </div>

              <div className="space-y-3">
                {roomRows.map((cr) => {
          const config = cr.calcId ? calculatorConfigs[cr.calcId] : null;
          const dynamicValuesFn = config ? getDynamicValuesFn(cr.calcId) : undefined;
          const priceData = allPriceData[cr.calcId];

          return (
            <div key={cr.id} className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm animate-fade-in-scale">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-bold text-slate-500 w-6">{cr.id}</span>
                <select
                  value={cr.calcId}
                  onChange={e => handleCalcChange(cr.id, e.target.value)}
                  className="text-sm px-2 py-1.5 border border-slate-300 rounded-lg bg-blue-50 text-blue-800 font-semibold min-w-[200px]"
                >
                  <option value="">— Выберите изделие —</option>
                  {groupedCalcs.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>

                {config && (
                  <>
                    {config.fabrics && config.fabrics.length > 0 && (
                      <>
                        <input
                          list={`cfab-${cr.id}`}
                          value={cr.row.fabric}
                          onChange={e => handleRowUpdate(cr.id, "fabric", e.target.value)}
                          className="w-28 text-xs px-2 py-1.5 border border-slate-300 rounded bg-yellow-50 text-blue-700 font-medium"
                          placeholder="Ткань"
                        />
                        <datalist id={`cfab-${cr.id}`}>
                          {config.fabrics.map(f => <option key={f.name} value={f.name}>{f.name} ({f.category}, {f.rollWidth}см)</option>)}
                        </datalist>
                        <input
                          type="text"
                          value={cr.row.fabricColor}
                          onChange={e => handleRowUpdate(cr.id, "fabricColor", e.target.value)}
                          className="w-20 text-xs px-2 py-1.5 border border-slate-300 rounded bg-yellow-50 text-blue-700 font-medium"
                          placeholder="Цвет"
                        />
                      </>
                    )}

                    {config.categories.length > 0 && (
                      <select
                        value={cr.row.category}
                        onChange={e => handleRowUpdate(cr.id, "category", e.target.value)}
                        className="text-xs px-1 py-1.5 border border-slate-300 rounded bg-yellow-50 text-blue-700 font-medium"
                      >
                        <option value="">Кат.</option>
                        {config.categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    )}

                    {(() => {
                      const getSizeLimit = (opts: Record<string, string>) => {
                        if (!config.sizeLimits) return null;
                        const slat = opts["slat"] || "";
                        const material = opts["material"] || "";
                        const box = opts["box"] || "";
                        const tube = opts["tube"] || "";
                        return config.sizeLimits[`${box}-${tube}`] || config.sizeLimits[`${slat}-${material}`] || config.sizeLimits[material] || config.sizeLimits[slat] || config.sizeLimits["_"] || null;
                      };
                      const limit = getSizeLimit(cr.row.options);
                      const selectedFabric = config.fabrics?.find(f => f.name === cr.row.fabric);
                      const fabricMaxWidth = selectedFabric ? selectedFabric.rollWidth / 100 : undefined;
                      const maxWidthM = limit?.maxWidth
                        ? (fabricMaxWidth ? Math.min(fabricMaxWidth, limit.maxWidth) : limit.maxWidth)
                        : fabricMaxWidth;
                      const widthNum = parseFloat(cr.row.width) || 0;
                      const heightNum = parseFloat(cr.row.height) || 0;
                      const widthError = widthNum > 0 && ((maxWidthM && widthNum > maxWidthM) || (limit?.minWidth && widthNum < limit.minWidth) || (limit?.maxArea && heightNum > 0 && widthNum * heightNum > limit.maxArea));
                      const heightError = heightNum > 0 && ((limit?.maxHeight && heightNum > limit.maxHeight) || (limit?.minHeight && heightNum < limit.minHeight) || (limit?.maxArea && widthNum > 0 && widthNum * heightNum > limit.maxArea));
                      return (<>
                        <div className="flex flex-col items-center">
                          <input type="number" step="0.01" min={limit?.minWidth || 0} max={maxWidthM} value={cr.row.width} onChange={e => handleRowUpdate(cr.id, "width", e.target.value)} className={`w-16 text-xs px-2 py-1.5 border rounded font-medium text-center ${widthError ? "border-red-500 bg-red-50 text-red-700" : "border-slate-300 bg-yellow-50 text-blue-700"}`} placeholder="Ш, м" />
                          {limit && (
                            <div className="text-[9px] text-slate-300 text-center leading-tight mt-0.5">
                              {limit.minWidth}–{maxWidthM || limit.maxWidth}м
                            </div>
                          )}
                        </div>
                        {!config.hideHeight && (
                          <div className="flex flex-col items-center">
                            <input type="number" step="0.01" min={limit?.minHeight || 0} max={limit?.maxHeight} value={cr.row.height} onChange={e => handleRowUpdate(cr.id, "height", e.target.value)} className={`w-16 text-xs px-2 py-1.5 border rounded font-medium text-center ${heightError ? "border-red-500 bg-red-50 text-red-700" : "border-slate-300 bg-yellow-50 text-blue-700"}`} placeholder="В, м" />
                            {limit && limit.maxHeight && (
                              <div className="text-[9px] text-slate-300 text-center leading-tight mt-0.5">
                                до {limit.maxHeight}м
                              </div>
                            )}
                            {limit?.maxArea && (
                              <div className="text-[9px] text-slate-300 text-center leading-tight">
                                до {limit.maxArea}м²
                              </div>
                            )}
                          </div>
                        )}
                      </>);
                    })()}

                    <input type="number" min="1" value={cr.row.quantity} onChange={e => handleRowUpdate(cr.id, "quantity", parseInt(e.target.value) || 1)} className="w-12 text-xs px-1 py-1.5 border border-slate-300 rounded bg-yellow-50 text-blue-700 font-medium text-center" />
                  </>
                )}

                {cr.row.priceUsd > 0 && (
                  <span className="text-sm font-mono font-bold text-green-700 ml-auto">
                    {cr.row.totalRub.toFixed(2)} ₽
                  </span>
                )}

                <button onClick={() => handleRemoveRow(cr.id)} className="ml-1 text-red-400 hover:text-red-600 text-lg" title="Удалить">×</button>
              </div>

              {config && config.options.length > 0 && (
                <div className="flex flex-wrap gap-1.5 ml-8">
                  {config.options.map(opt => {
                    let values = opt.dynamic && dynamicValuesFn
                      ? dynamicValuesFn(opt.id, priceData, cr.row.options)
                      : opt.values;
                    if (opt.id === "electric") {
                      const kitKey = config.electricKitKey ? (cr.row.options[config.electricKitKey] || "") : "";
                      values = getAvailableElectricTypes(cr.calcId, kitKey);
                    }
                    if (values.length === 0) {
                      return (
                        <div key={opt.id} className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400">{opt.label}:</span>
                          <input type="number" step="0.01" min="0" value={cr.row.options[opt.id] ?? opt.defaultValue} onChange={e => handleRowUpdate(cr.id, "opt:" + opt.id, e.target.value)} className="w-14 text-xs px-1 py-0.5 border border-slate-300 rounded bg-amber-50 text-blue-700 font-medium text-center" />
                        </div>
                      );
                    }
                    return (
                      <div key={opt.id} className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">{opt.label}:</span>
                        <select
                          value={cr.row.options[opt.id] ?? opt.defaultValue}
                          onChange={e => handleRowUpdate(cr.id, "opt:" + opt.id, e.target.value)}
                          className="text-xs px-1 py-0.5 border border-slate-300 rounded bg-amber-50 text-blue-700 font-medium"
                        >
                          {values.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={addRoom} className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium text-sm">
        + Добавить помещение
      </button>
      </div>

      <PriceSummary
        rows={allCalcRows}
        exchangeRate={exchangeRate}
        markupType={markupType}
        markupPercent={markupPercent}
        accessoriesTotalUsd={accessoriesTotalUsd}
        onMarkupTypeChange={setMarkupType}
        onMarkupPercentChange={setMarkupPercent}
        onExchangeRateChange={handleExchangeRateChange}
      />

      <div className="mt-4 flex gap-3">
        <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Сохранить расчёт</button>
        <button onClick={handleCreateKP} className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium">Создать КП</button>
      </div>

      <AccessoriesPanel selections={accessorySelections} exchangeRate={exchangeRate} onChange={setAccessorySelections} />
    </div>
  );
}
