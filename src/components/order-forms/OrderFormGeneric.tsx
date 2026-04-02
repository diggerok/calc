"use client";

import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas-pro";
import { getOrderFormConfig, type OrderColumn } from "@/lib/order-form-configs";
import { calculatorConfigs } from "@/lib/calculator-configs";
import type { CalcRowData } from "@/types/calculator";

interface OrderData {
  type: string;
  clientName: string;
  rows: CalcRowData[];
}

function getAutoValue(col: OrderColumn, row: CalcRowData, calcTitle: string): string {
  if (!col.auto) return "";
  if (col.auto === "fabric") return row.fabric || "";
  if (col.auto === "fabricColor") return row.fabricColor || "";
  if (col.auto === "width") return row.width || "";
  if (col.auto === "height") return row.height || "";
  if (col.auto === "quantity") return String(row.quantity);
  if (col.auto === "category") return row.category || "";
  if (col.auto === "_title") return calcTitle;
  if (col.auto.startsWith("opt:")) {
    const optIds = col.auto.slice(4).split("|");
    for (const optId of optIds) {
      let val = row.options[optId];
      if (val && val !== "Нет" && val !== "—") {
        // Убираем слово "КАССЕТА" из значения кассеты
        if (optId === "cassette") val = val.replace(/^КАССЕТА\s*/i, "");
        return val;
      }
    }
    return "";
  }
  return "";
}

export default function OrderFormGeneric({ data }: { data: OrderData }) {
  const formRef = useRef<HTMLDivElement>(null);
  const activeRows = data.rows.filter((r) => r.priceUsd > 0);
  const hasElectric = activeRows.some((r) => r.options.electric && r.options.electric !== "Нет");

  const formConfig = getOrderFormConfig(data.type);
  const config = calculatorConfigs[data.type];
  const title = formConfig?.title || config?.title || data.type;
  const columns = formConfig
    ? (hasElectric ? formConfig.electricColumns : formConfig.columns)
    : [];

  const [firmName, setFirmName] = useState("AMIGO Design Boutique");
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("pickup");
  const [docs, setDocs] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Редактируемые значения (для столбцов без auto)
  const [edits, setEdits] = useState<Record<number, Record<string, string>>>(() => {
    const init: Record<number, Record<string, string>> = {};
    activeRows.forEach((r) => {
      const vals: Record<string, string> = {};
      columns.forEach((col) => {
        vals[col.key] = getAutoValue(col, r, title);
      });
      init[r.id] = vals;
    });
    return init;
  });

  const updateEdit = (rowId: number, key: string, value: string) => {
    setEdits((prev) => ({ ...prev, [rowId]: { ...prev[rowId], [key]: value } }));
  };

  const handlePrint = () => window.print();

  const handleExportJpeg = useCallback(async () => {
    if (!formRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(formRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const link = document.createElement("a");
      link.download = `Бланк заказа ${title} ${data.clientName || ""}.jpg`.trim();
      link.href = canvas.toDataURL("image/jpeg", 0.92);
      link.click();
    } finally {
      setExporting(false);
    }
  }, [title, data.clientName]);

  if (!formConfig) {
    return (
      <div className="max-w-4xl mx-auto mt-12 text-center text-slate-400">
        Бланк заказа для «{data.type}» не настроен.
      </div>
    );
  }

  return (
    <div>
      <div className="print:hidden mb-4 flex gap-3 items-center max-w-[210mm] mx-auto">
        <button onClick={handlePrint} className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium">Печать</button>
        <button onClick={handleExportJpeg} disabled={exporting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
          {exporting ? "Экспорт..." : "Сохранить JPEG"}
        </button>
        <button onClick={() => window.history.back()} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Назад</button>
      </div>

      <div
        ref={formRef}
        className="bg-white shadow-lg print:shadow-none max-w-[210mm] mx-auto p-6"
        style={{ fontFamily: "Arial, Helvetica, sans-serif", minHeight: "297mm" }}
      >
        <h2 className="text-center text-base font-bold mb-1">
          Бланк заказа — {title}
        </h2>

        <div className="flex items-center gap-2 mb-3 mt-2 text-xs">
          <span className="font-medium">Фирма:</span>
          <input type="text" value={firmName} onChange={(e) => setFirmName(e.target.value)}
            className="border-b border-slate-400 text-xs px-1 py-0.5 flex-1 print:border-0" />
          {data.clientName && (
            <>
              <span className="font-medium ml-3">Клиент:</span>
              <span>{data.clientName}</span>
            </>
          )}
        </div>

        <table className="w-full border-collapse text-[8px] leading-tight">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-0.5 py-1 text-center" style={{ writingMode: "horizontal-tb" }}>№</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`border border-slate-400 px-0.5 py-2 text-center ${col.wide ? "min-w-[80px]" : ""}`}
                  style={col.wide ? { writingMode: "horizontal-tb" } : { writingMode: "vertical-lr", textOrientation: "mixed" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeRows.map((row, idx) => {
              const rowEdits = edits[row.id] || {};
              return (
                <tr key={row.id}>
                  <td className="border border-slate-400 px-0.5 py-1 text-center">{idx + 1}</td>
                  {columns.map((col) => (
                    <td key={col.key} className={`border border-slate-400 px-0.5 py-1 ${col.wide ? "text-left" : "text-center"}`}
                      style={col.wide ? { maxWidth: "55px" } : undefined}>
                      {col.wide ? (
                        <div className="text-[8px] leading-[1.1] break-words whitespace-normal">
                          {rowEdits[col.key] || "—"}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={rowEdits[col.key] || ""}
                          onChange={(e) => updateEdit(row.id, col.key, e.target.value)}
                          className="w-full text-center text-[8px] border-0 bg-transparent print:p-0"
                          placeholder="—"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            {Array.from({ length: Math.max(0, 13 - activeRows.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                {Array.from({ length: columns.length + 1 }).map((_, j) => (
                  <td key={j} className="border border-slate-400 px-0.5 py-2">&nbsp;</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 text-xs">
          <div className="flex gap-8">
            <span>Подпись_______________</span>
            <span>Печать_______________</span>
          </div>
          <div className="flex gap-8 mt-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={delivery === "delivery"} onChange={() => setDelivery("delivery")} className="print:hidden" />
              <span className={delivery === "delivery" ? "font-bold" : ""}>Доставка</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={delivery === "pickup"} onChange={() => setDelivery("pickup")} className="print:hidden" />
              <span className={delivery === "pickup" ? "font-bold" : ""}>Самовывоз</span>
            </label>
            <label className="flex items-center gap-2 ml-auto">
              <span>*Документы</span>
              <input type="checkbox" checked={docs} onChange={(e) => setDocs(e.target.checked)} className="print:hidden" />
              <span className={docs ? "font-bold" : ""}>{docs ? "ДА" : "НЕТ"}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
