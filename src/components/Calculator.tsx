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

interface Room {
  id: string;
  name: string;
}

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
  const [rooms, setRooms] = useState<Room[]>([{ id: "room-1", name: "" }]);
  const [rowRoomMap, setRowRoomMap] = useState<Record<number, string>>({});
  const [rows, setRows] = useState<CalcRowData[]>(() => {
    const initial = Array.from({ length: config.maxRows }, (_, i) => createEmptyRow(i + 1, config));
    return initial;
  });
  const [clientName, setClientName] = useState("");
  const [exchangeRate, setExchangeRate] = useState(90);
  const [markupType, setMarkupType] = useState<"markup" | "discount">("markup");
  const [markupPercent, setMarkupPercent] = useState(0);
  const [accessorySelections, setAccessorySelections] = useState<Record<string, number>>({});
  const hasElectric = config.options.some((o) => o.id === "electric");

  // Initialize rowRoomMap for initial rows
  useEffect(() => {
    setRowRoomMap(prev => {
      const next = { ...prev };
      for (const r of rows) {
        if (!next[r.id]) next[r.id] = rooms[0]?.id || "room-1";
      }
      return next;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getRowRoom = (rowId: number) => rowRoomMap[rowId] || rooms[0]?.id || "room-1";

  const addRoom = () => {
    const newRoom: Room = { id: `room-${Date.now()}`, name: "" };
    setRooms(prev => [...prev, newRoom]);
    // Add one empty row for the new room
    setRows(prev => {
      const nextId = Math.max(...prev.map(r => r.id)) + 1;
      const newRow = createEmptyRow(nextId, config);
      setRowRoomMap(m => ({ ...m, [nextId]: newRoom.id }));
      return [...prev, newRow];
    });
  };

  const removeRoom = (roomId: string) => {
    if (rooms.length <= 1) return;
    setRooms(prev => prev.filter(r => r.id !== roomId));
    setRows(prev => prev.filter(r => getRowRoom(r.id) !== roomId));
    setRowRoomMap(prev => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (next[Number(key)] === roomId) delete next[Number(key)];
      }
      return next;
    });
  };

  const renameRoom = (roomId: string, name: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, name } : r));
  };

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
      const { name, data, markup, rate, mType, accessories: acc, rooms: savedRooms, rowRoomMap: savedMap } = JSON.parse(saved);
      if (name) setClientName(name);
      if (rate) setExchangeRate(rate);
      if (acc) setAccessorySelections(acc);
      if (savedRooms) setRooms(savedRooms);
      if (savedMap) setRowRoomMap(savedMap);
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
      // Auto-add row in same room if all rows in that room are filled
      const roomId = getRowRoom(updated.id);
      const roomRows = newRows.filter(r => getRowRoom(r.id) === roomId);
      const allFilled = roomRows.every((r) => r.priceUsd > 0);
      if (allFilled) {
        const nextId = Math.max(...newRows.map((r) => r.id)) + 1;
        const newRow = createEmptyRow(nextId, config);
        setRowRoomMap(m => ({ ...m, [nextId]: roomId }));
        newRows.push(newRow);
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

  const saveCalcState = () => {
    sessionStorage.setItem(`calc-state-${config.id}`, JSON.stringify({
      name: clientName,
      data: rows.filter((r) => r.priceUsd > 0),
      markup: markupPercent,
      mType: markupType,
      rate: exchangeRate,
      accessories: accessorySelections,
      rooms,
      rowRoomMap,
    }));
  };

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
      saveCalcState();
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
    const activeRooms = rooms.filter(room => rows.some(r => getRowRoom(r.id) === room.id && r.priceUsd > 0));
    const kpRows = rows.map(r => ({
      ...r,
      options: { ...r.options, _roomId: getRowRoom(r.id) },
    }));
    const kpData = {
      config,
      rows: kpRows,
      rooms: activeRooms,
      exchangeRate,
      markupType,
      markupPercent,
      clientName,
      accessories: selectedAccessories,
    };
    sessionStorage.setItem("kp-data", JSON.stringify(kpData));
    saveCalcState();
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
            className={`px-3 py-1.5 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!clientName.trim() ? "border-red-400 bg-red-50" : "border-slate-300"}`}
          />
          {!clientName.trim() && (
            <span className="text-xs text-red-500">Введите клиента</span>
          )}
        </div>
      </div>

      <div className={!clientName.trim() ? "opacity-40 pointer-events-none select-none" : ""}>
      {rooms.map((room, roomIdx) => {
        const roomRows = rows.filter(r => getRowRoom(r.id) === room.id);
        const roomSubtotal = roomRows.filter(r => r.priceUsd > 0).reduce((s, r) => s + r.totalRub, 0);
        // Column count for subtotal colspan
        const colCount = 1 + (config.fabrics?.length ? 2 : 0) + (config.categories.length > 0 ? 1 : 0) + 1 + (config.hideHeight ? 0 : 1) + config.options.length + 4;

        return (
          <div key={room.id} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={room.name}
                onChange={e => renameRoom(room.id, e.target.value)}
                placeholder={`Помещение ${roomIdx + 1}`}
                className="px-3 py-1.5 border border-blue-300 rounded-lg text-sm font-semibold text-slate-800 bg-blue-50 focus:ring-2 focus:ring-blue-500 w-64"
              />
              {rooms.length > 1 && (
                <button onClick={() => removeRoom(room.id)} className="text-red-400 hover:text-red-600 text-sm" title="Удалить помещение">✕</button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#1B3054" }} className="text-white">
                    <th className="px-2 py-2 border border-slate-600 text-center w-8">№</th>
                    {config.fabrics && config.fabrics.length > 0 && (
                      <th className="px-2 py-2 border border-slate-600 text-center">Ткань</th>
                    )}
                    {config.fabrics && config.fabrics.length > 0 && (
                      <th className="px-2 py-2 border border-slate-600 text-center">Цвет ткани</th>
                    )}
                    {config.categories.length > 0 && (
                      <th className="px-2 py-2 border border-slate-600 text-center w-16">Кат.</th>
                    )}
                    <th className="px-2 py-2 border border-slate-600 text-center w-20">Ширина<br />м</th>
                    {!config.hideHeight && (
                      <th className="px-2 py-2 border border-slate-600 text-center w-20">Высота<br />м</th>
                    )}
                    {config.options.map((opt) => (
                      <th key={opt.id} className="px-1 py-2 border border-slate-600 text-center text-xs whitespace-nowrap">{opt.label}</th>
                    ))}
                    <th className="px-2 py-2 border border-slate-600 text-center w-14">Кол-во</th>
                    <th className="px-2 py-2 border border-slate-600 text-center w-24">Цена $</th>
                    <th className="px-2 py-2 border border-slate-600 text-center w-24">Цена ₽</th>
                    <th className="px-2 py-2 border border-slate-600 text-center w-28">Итого ₽</th>
                  </tr>
                </thead>
                <tbody>
                  {roomRows.map((row) => (
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
                  {rooms.length > 1 && roomSubtotal > 0 && (
                    <tr className="bg-blue-50">
                      <td colSpan={colCount - 1} className="px-2 py-2 border border-slate-300 text-right text-sm font-bold text-[#1B3054]">
                        Итого {room.name || `Помещение ${roomIdx + 1}`}:
                      </td>
                      <td className="px-2 py-2 border border-slate-300 text-right text-sm font-bold text-[#1B3054]">
                        {roomSubtotal.toFixed(2)} ₽
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      <button onClick={addRoom} className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium text-sm">
        + Добавить помещение
      </button>
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
        <button
          onClick={() => {
            const activeRows = rows.filter((r) => r.priceUsd > 0);
            if (activeRows.length === 0) { showToast("Нет позиций", "error"); return; }
            sessionStorage.setItem("order-data", JSON.stringify({
              type: config.id,
              clientName,
              rows: activeRows,
            }));
            saveCalcState();
            router.push("/order");
          }}
          className="px-6 py-2 text-white rounded-lg hover:opacity-90 font-medium transition-all bg-amber-600 hover:bg-amber-700"
        >
          Бланк заказа
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
