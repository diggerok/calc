"use client";

import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas-pro";
import type { CalcRowData } from "@/types/calculator";

interface OrderData {
  type: string;
  clientName: string;
  rows: CalcRowData[];
}

const EMPTY_EXTRA = {
  control: "",       // Управление (сторона)
  controlLen: "ст",  // Длина управления
  colorFurn: "",     // Цвет фурнитуры
  roll: "",          // Рулон
  installType: "",   // Тип установки
  ring: "",          // Кольцо подкладочное
  sideFix: "",       // Боковая фиксация
  hiddenGuide: "",   // Скрытая направляющая
  chainTensioner: "", // Натяжитель цепи
  electricDevice: "", // Устройство управления / канал (электрика)
};

export default function OrderFormMini({ data }: { data: OrderData }) {
  const formRef = useRef<HTMLDivElement>(null);
  const activeRows = data.rows.filter((r) => r.priceUsd > 0);

  const hasElectric = activeRows.some((r) => r.options.electric && r.options.electric !== "Нет");

  const [firmName, setFirmName] = useState("AMIGO Design Boutique");
  const [extras, setExtras] = useState<Record<number, typeof EMPTY_EXTRA>>(() => {
    const init: Record<number, typeof EMPTY_EXTRA> = {};
    activeRows.forEach((r) => {
      init[r.id] = { ...EMPTY_EXTRA };
      if (r.options.color && r.options.color !== "—") init[r.id].colorFurn = r.options.color;
      if (r.options.chain && r.options.chain !== "Нет") init[r.id].control = "правое";
      if (r.options.chainTensioner === "Да") init[r.id].chainTensioner = "Да";
      if (r.options.sideFix === "Да") init[r.id].sideFix = "Да";
      if (r.options.electric && r.options.electric !== "Нет") {
        init[r.id].electricDevice = r.options.electric;
      }
    });
    return init;
  });
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("pickup");
  const [docs, setDocs] = useState(true);
  const [exporting, setExporting] = useState(false);

  const updateExtra = (rowId: number, field: string, value: string) => {
    setExtras((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [field]: value },
    }));
  };

  const title = data.type === "mini-zebra" ? "MINI-Зебра" : "MINI";

  const handlePrint = () => {
    window.print();
  };

  const handleExportJpeg = useCallback(async () => {
    if (!formRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(formRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const link = document.createElement("a");
      link.download = `Бланк заказа ${title} ${data.clientName || ""}.jpg`.trim();
      link.href = canvas.toDataURL("image/jpeg", 0.92);
      link.click();
    } finally {
      setExporting(false);
    }
  }, [title, data.clientName]);

  return (
    <div>
      {/* Панель управления — скрыта при печати */}
      <div className="print:hidden mb-4 flex gap-3 items-center max-w-[210mm] mx-auto">
        <button onClick={handlePrint} className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium">
          Печать
        </button>
        <button onClick={handleExportJpeg} disabled={exporting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">
          {exporting ? "Экспорт..." : "Сохранить JPEG"}
        </button>
        <button onClick={() => window.history.back()} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">
          Назад
        </button>
      </div>

      {/* Бланк A4 */}
      <div
        ref={formRef}
        className="bg-white shadow-lg print:shadow-none max-w-[210mm] mx-auto p-8"
        style={{ fontFamily: "Arial, Helvetica, sans-serif", minHeight: "297mm" }}
      >
        <h2 className="text-center text-lg font-bold mb-1">
          Бланк заказа на рулонные шторы {title}
        </h2>

        <div className="flex items-center gap-2 mb-4 mt-3">
          <span className="text-sm font-medium">Название фирмы:</span>
          <input
            type="text"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
            className="border-b border-slate-400 text-sm px-1 py-0.5 flex-1 print:border-0"
          />
          {data.clientName && (
            <>
              <span className="text-sm font-medium ml-4">Клиент:</span>
              <span className="text-sm">{data.clientName}</span>
            </>
          )}
        </div>

        {/* Таблица заказа */}
        <table className="w-full border-collapse text-[9px] leading-tight">
          <thead>
            <tr className="bg-slate-100" style={{ writingMode: "vertical-lr", textOrientation: "mixed" }}>
              <th className="border border-slate-400 px-0.5 py-2 text-center" style={{ writingMode: "horizontal-tb" }}>№</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Вид изделия</th>
              <th className="border border-slate-400 px-1 py-2" style={{ writingMode: "horizontal-tb" }}>Наимено-<br/>вание<br/>ткани</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Цвет ткани</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Ширина изд. (м)</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Ширина ткани (м)</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Высота (м)</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Кол-во (шт.)</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Управление (сторона)</th>
              {!hasElectric && <th className="border border-slate-400 px-0.5 py-2 text-center">Длина управления</th>}
              <th className="border border-slate-400 px-0.5 py-2 text-center">Цвет фурнитуры</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Рулон</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Тип установки</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Кольцо подкладочное</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Боковая фиксация</th>
              <th className="border border-slate-400 px-0.5 py-2 text-center">Скрытая направляющая</th>
              {hasElectric
                ? <th className="border border-slate-400 px-0.5 py-2 text-center">Устройство управления / канал</th>
                : <th className="border border-slate-400 px-0.5 py-2 text-center">Натяжитель цепи</th>
              }
            </tr>
          </thead>
          <tbody>
            {activeRows.map((row, idx) => {
              const ex = extras[row.id] || EMPTY_EXTRA;
              const fabricRollW = row.options._fabricRollWidth;
              return (
                <tr key={row.id}>
                  <td className="border border-slate-400 px-1 py-1 text-center">{idx + 1}</td>
                  <td className="border border-slate-400 px-1 py-1">{title}</td>
                  <td className="border border-slate-400 px-1 py-1">{row.fabric || ""}</td>
                  <td className="border border-slate-400 px-1 py-1">{row.fabricColor || ""}</td>
                  <td className="border border-slate-400 px-1 py-1 text-center">{row.width || ""}</td>
                  <td className="border border-slate-400 px-1 py-1 text-center">{fabricRollW ? (parseFloat(fabricRollW) / 100).toFixed(2) : ""}</td>
                  <td className="border border-slate-400 px-1 py-1 text-center">{row.height || ""}</td>
                  <td className="border border-slate-400 px-1 py-1 text-center">{row.quantity}</td>
                  <td className="border border-slate-400 px-1 py-1 text-center">
                    <input type="text" value={ex.control} onChange={(e) => updateExtra(row.id, "control", e.target.value)}
                      className="w-full text-center text-[10px] border-0 bg-transparent print:p-0" placeholder="—" />
                  </td>
                  {!hasElectric && (
                  <td className="border border-slate-400 px-1 py-1 text-center">
                    <input type="text" value={ex.controlLen} onChange={(e) => updateExtra(row.id, "controlLen", e.target.value)}
                      className="w-full text-center text-[10px] border-0 bg-transparent print:p-0" placeholder="ст" />
                  </td>
                  )}
                  <td className="border border-slate-400 px-1 py-1 text-center">
                    <input type="text" value={ex.colorFurn} onChange={(e) => updateExtra(row.id, "colorFurn", e.target.value)}
                      className="w-full text-center text-[10px] border-0 bg-transparent print:p-0" placeholder="—" />
                  </td>
                  <td className="border border-slate-400 px-1 py-1 text-center">
                    <input type="text" value={ex.roll} onChange={(e) => updateExtra(row.id, "roll", e.target.value)}
                      className="w-full text-center text-[10px] border-0 bg-transparent print:p-0" placeholder="—" />
                  </td>
                  <td className="border border-slate-400 px-1 py-1 text-center">
                    <input type="text" value={ex.installType} onChange={(e) => updateExtra(row.id, "installType", e.target.value)}
                      className="w-full text-center text-[10px] border-0 bg-transparent print:p-0" placeholder="—" />
                  </td>
                  <td className="border border-slate-400 px-1 py-1 text-center">
                    <input type="text" value={ex.ring} onChange={(e) => updateExtra(row.id, "ring", e.target.value)}
                      className="w-full text-center text-[10px] border-0 bg-transparent print:p-0" placeholder="—" />
                  </td>
                  <td className="border border-slate-400 px-1 py-1 text-center">
                    <input type="text" value={ex.sideFix} onChange={(e) => updateExtra(row.id, "sideFix", e.target.value)}
                      className="w-full text-center text-[10px] border-0 bg-transparent print:p-0" placeholder="—" />
                  </td>
                  <td className="border border-slate-400 px-1 py-1 text-center">
                    <input type="text" value={ex.hiddenGuide} onChange={(e) => updateExtra(row.id, "hiddenGuide", e.target.value)}
                      className="w-full text-center text-[10px] border-0 bg-transparent print:p-0" placeholder="—" />
                  </td>
                  {hasElectric ? (
                  <td className="border border-slate-400 px-1 py-1 text-center min-w-[80px]">
                    <input type="text" value={ex.electricDevice} onChange={(e) => updateExtra(row.id, "electricDevice", e.target.value)}
                      className="w-full text-center text-[8px] border-0 bg-transparent print:p-0" placeholder="—" />
                  </td>
                  ) : (
                  <td className="border border-slate-400 px-1 py-1 text-center">
                    <input type="text" value={ex.chainTensioner} onChange={(e) => updateExtra(row.id, "chainTensioner", e.target.value)}
                      className="w-full text-center text-[10px] border-0 bg-transparent print:p-0" placeholder="—" />
                  </td>
                  )}
                </tr>
              );
            })}
            {/* Пустые строки до 13 */}
            {Array.from({ length: Math.max(0, 13 - activeRows.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                {Array.from({ length: hasElectric ? 16 : 17 }).map((_, j) => (
                  <td key={j} className="border border-slate-400 px-1 py-2.5">&nbsp;</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Подвал */}
        <div className="mt-6 text-sm">
          <div className="flex gap-8">
            <span>Подпись_______________</span>
            <span>Печать_______________</span>
          </div>
          <div className="flex gap-8 mt-4">
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
