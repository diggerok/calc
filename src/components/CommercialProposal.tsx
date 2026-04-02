"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import html2canvas from "html2canvas-pro";
import type { CalcRowData, CalculatorConfig } from "@/types/calculator";
import { calculatorConfigs } from "@/lib/calculator-configs";
import Image from "next/image";

interface AccessoryData {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface RoomData {
  id: string;
  name: string;
}

interface KPData {
  config: CalculatorConfig;
  rows: CalcRowData[];
  rooms?: RoomData[];
  exchangeRate: number;
  markupType: "markup" | "discount";
  markupPercent: number;
  clientName?: string;
  accessories?: AccessoryData[];
}

export default function CommercialProposal({ data }: { data: KPData }) {
  const { config, rows, exchangeRate, markupType, markupPercent } = data;
  const printRef = useRef<HTMLDivElement>(null);
  const specRef = useRef<HTMLDivElement>(null);

  const [clientName, setClientName] = useState(data.clientName || "");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [managerPhone, setManagerPhone] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((profile) => {
        if (profile.name) setManagerName(profile.name);
        if (profile.kpEmail) setManagerEmail(profile.kpEmail);
        if (profile.phone) setManagerPhone(profile.phone);
      })
      .catch(() => {});
  }, []);

  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [installEnabled, setInstallEnabled] = useState(false);
  const [installAmount, setInstallAmount] = useState(0);
  const [kpDiscountEnabled, setKpDiscountEnabled] = useState(false);
  const [kpDiscountPercent, setKpDiscountPercent] = useState(0);
  const [ralEnabled, setRalEnabled] = useState(false);
  const [ralAmount, setRalAmount] = useState(0);

  const activeRows = rows.filter((r) => r.priceUsd > 0);

  // Доп. инфо в наименовании для деревянных жалюзи
  const hasSlat = config.options.some((o) => o.id === "slat");
  const hasMaterial = config.options.some((o) => o.id === "material");
  const hasColor = config.options.some((o) => o.id === "color");

  const acc = data.accessories?.filter((a) => a.quantity > 0) || [];
  const accTotalUsd = acc.reduce((s, a) => s + a.price * a.quantity, 0);
  const rowsUsd = activeRows.reduce((s, r) => s + r.priceUsd * r.quantity, 0);
  const rowsRub = activeRows.reduce((s, r) => s + r.totalRub, 0);
  const totalUsd = rowsUsd + accTotalUsd;
  const totalRub = rowsRub + Math.round(accTotalUsd * exchangeRate * 100) / 100;
  const markupMultiplier =
    markupType === "markup"
      ? 1 + markupPercent / 100
      : 1 - markupPercent / 100;
  const ralRub = ralEnabled ? ralAmount : 0;
  const afterRalRub = totalRub + ralRub;
  const afterRalUsd = totalUsd + (ralRub / exchangeRate);
  const finalUsd = Math.round(afterRalUsd * markupMultiplier * 100) / 100;
  const finalRub = Math.round(afterRalRub * markupMultiplier * 100) / 100;
  const kpDiscountMultiplier = kpDiscountEnabled ? 1 - kpDiscountPercent / 100 : 1;
  const discountedUsd = Math.round(finalUsd * kpDiscountMultiplier * 100) / 100;
  const discountedRub = Math.round(finalRub * kpDiscountMultiplier * 100) / 100;
  const extrasRub = (deliveryEnabled ? deliveryAmount : 0) + (installEnabled ? installAmount : 0);
  const grandTotalRub = Math.round((discountedRub + extrasRub) * 100) / 100;

  const today = new Date();
  const dateStr = today.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    const prevTitle = document.title;
    const datePart = today.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
    document.title = `Коммерческое предложение для «${clientName || "клиента"}» ${datePart}`;
    window.print();
    document.title = prevTitle;
  };

  const [exporting, setExporting] = useState(false);
  const [showJpegMenu, setShowJpegMenu] = useState(false);

  const renderToJpeg = async (el: HTMLElement, name: string) => {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.download = `${name}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  };

  const handleExportJpeg = useCallback(async (pages: "kp" | "spec" | "all") => {
    setExporting(true);
    setShowJpegMenu(false);
    try {
      const datePart = today.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
      const fileName = `КП ${clientName || "клиент"} ${datePart}`;

      if ((pages === "kp" || pages === "all") && printRef.current) {
        await renderToJpeg(printRef.current, fileName);
      }
      if ((pages === "spec" || pages === "all") && specRef.current) {
        if (pages === "all") await new Promise(r => setTimeout(r, 500));
        await renderToJpeg(specRef.current, `${fileName} — спецификация`);
      }
    } finally {
      setExporting(false);
    }
  }, [clientName, today]);

  return (
    <div>
      {/* Панель редактирования — скрыта при печати */}
      <div className="print:hidden mb-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Данные клиента</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Организация / ФИО
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="ООО «Компания» или Иванов И.И."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Адрес
            </label>
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="Адрес доставки / объекта"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <h2 className="text-lg font-bold text-slate-800 mt-6 mb-4">Дополнительные услуги</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="delivery"
              checked={deliveryEnabled}
              onChange={(e) => setDeliveryEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <label htmlFor="delivery" className="text-sm font-medium text-slate-600">
              Доставка
            </label>
            <input
              type="number"
              value={deliveryAmount || ""}
              onChange={(e) => setDeliveryAmount(parseFloat(e.target.value) || 0)}
              disabled={!deliveryEnabled}
              placeholder="Сумма ₽"
              className="w-32 px-3 py-2 border border-slate-300 rounded-lg disabled:opacity-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-slate-500">₽</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="install"
              checked={installEnabled}
              onChange={(e) => setInstallEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <label htmlFor="install" className="text-sm font-medium text-slate-600">
              Монтаж
            </label>
            <input
              type="number"
              value={installAmount || ""}
              onChange={(e) => setInstallAmount(parseFloat(e.target.value) || 0)}
              disabled={!installEnabled}
              placeholder="Сумма ₽"
              className="w-32 px-3 py-2 border border-slate-300 rounded-lg disabled:opacity-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-slate-500">₽</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="ral"
              checked={ralEnabled}
              onChange={(e) => setRalEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <label htmlFor="ral" className="text-sm font-medium text-slate-600">
              Покраска RAL
            </label>
            <input
              type="number"
              value={ralAmount || ""}
              onChange={(e) => setRalAmount(parseFloat(e.target.value) || 0)}
              disabled={!ralEnabled}
              placeholder="Сумма ₽"
              className="w-32 px-3 py-2 border border-slate-300 rounded-lg disabled:opacity-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-slate-500">₽</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="kpDiscount"
              checked={kpDiscountEnabled}
              onChange={(e) => setKpDiscountEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <label htmlFor="kpDiscount" className="text-sm font-medium text-slate-600">
              Скидка
            </label>
            <input
              type="number"
              value={kpDiscountPercent || ""}
              onChange={(e) => setKpDiscountPercent(parseFloat(e.target.value) || 0)}
              disabled={!kpDiscountEnabled}
              placeholder="%"
              className="w-24 px-3 py-2 border border-slate-300 rounded-lg disabled:opacity-40 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-sm text-slate-500">%</span>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium"
          >
            Печать / PDF
          </button>
          <div className="relative">
            <button
              onClick={() => setShowJpegMenu(!showJpegMenu)}
              disabled={exporting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {exporting ? "Экспорт..." : "Сохранить JPEG"}
            </button>
            {showJpegMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[200px]">
                <button
                  onClick={() => handleExportJpeg("kp")}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 text-slate-700 rounded-t-lg"
                >
                  Только КП
                </button>
                <button
                  onClick={() => handleExportJpeg("spec")}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 text-slate-700"
                >
                  Только спецификация
                </button>
                <button
                  onClick={() => handleExportJpeg("all")}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 text-slate-700 font-medium rounded-b-lg"
                >
                  КП + спецификация
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
          >
            Назад к расчёту
          </button>
        </div>
      </div>

      {/* КП для печати — A4 бланк */}
      <div
        ref={printRef}
        className="relative bg-white print:shadow-none shadow-lg rounded-xl print:rounded-none overflow-hidden max-w-[210mm] mx-auto"
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          minHeight: "297mm",
        }}
      >
        {/* === Декоративный полукруг — верхний левый === */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-180px",
            left: "-180px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            backgroundColor: "#DAEBF5",
          }}
        />

        {/* === Декоративный полукруг — нижний правый === */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-200px",
            right: "-200px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            backgroundColor: "#DAEBF5",
          }}
        />

        {/* Контент поверх декоративных элементов */}
        <div className="relative z-10">
          {/* Шапка — логотип в центре полукруга + реквизиты справа */}
          <div className="relative" style={{ minHeight: "200px" }}>
            {/* Логотип — центрирован в видимой части верхнего полукруга */}
            <div
              className="absolute flex items-center justify-center"
              style={{
                top: "0",
                left: "0",
                width: "340px",
                height: "200px",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-amigo.svg"
                alt="AMIGO Design Boutique"
                width={560}
                height={190}
              />
            </div>
            {/* Реквизиты — справа */}
            <div className="absolute right-12 top-10 text-right text-[11px] text-slate-600 leading-relaxed">
              <div className="font-semibold text-slate-800">
                ИП Кривонос Наталья Анатольевна
              </div>
              <div>г. Краснодар, Первый проезд Стасова 1а</div>
              <div>krasnodar.amigo.ru</div>
              {(managerName || managerPhone || managerEmail) && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  {managerName && (
                    <div className="font-semibold text-slate-800">
                      Менеджер: {managerName}
                    </div>
                  )}
                  {managerPhone && <div>{managerPhone}</div>}
                  {managerEmail && <div>{managerEmail}</div>}
                </div>
              )}
            </div>
          </div>

          {/* Отступ после шапки */}
          <div style={{ height: "16px" }} />

          {/* Заголовок КП */}
          <div className="px-12 pb-4">
            <div className="border-b-2 border-slate-800 pb-2">
              <h1 className="text-xl font-bold text-slate-800 tracking-wide">
                КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ
              </h1>
              <div className="text-sm text-slate-500 mt-1">
                от {dateStr} / {config.title}
              </div>
            </div>
          </div>

          {/* Данные клиента */}
          {(clientName || clientPhone || clientAddress) && (
            <div className="px-12 pb-4">
              <div className="bg-slate-50/80 rounded-lg p-4 text-sm">
                <div className="font-semibold text-slate-700 mb-1">Заказчик:</div>
                {clientName && <div>{clientName}</div>}
                {clientPhone && <div>Тел.: {clientPhone}</div>}
                {clientAddress && <div>Адрес: {clientAddress}</div>}
              </div>
            </div>
          )}

          {/* Таблица позиций */}
          <div className="px-12 pb-6">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr style={{ backgroundColor: "#1B3054", color: "white" }}>
                  <th className="px-2 py-2 border border-[#152744] text-center w-8">
                    №
                  </th>
                  <th className="px-2 py-2 border border-[#152744] text-left">
                    Наименование
                  </th>
                  <th className="px-2 py-2 border border-[#152744] text-center w-16">
                    Ш, мм
                  </th>
                  <th className="px-2 py-2 border border-[#152744] text-center w-16">
                    В, мм
                  </th>
                  <th className="px-2 py-2 border border-[#152744] text-center w-10">
                    Кол.
                  </th>
                  <th className="px-2 py-2 border border-[#152744] text-center w-20">
                    Цена $
                  </th>
                  <th className="px-2 py-2 border border-[#152744] text-center w-24">
                    Сумма $
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const hasRooms = data.rooms && data.rooms.length > 1;
                  const roomGroups = hasRooms
                    ? data.rooms!.map(room => ({
                        room,
                        rows: activeRows.filter(r => r.options?._roomId === room.id),
                      })).filter(g => g.rows.length > 0)
                    : [{ room: null, rows: activeRows }];

                  let globalIdx = 0;

                  return roomGroups.flatMap((group) => {
                    const elements: React.ReactNode[] = [];

                    if (group.room && hasRooms) {
                      elements.push(
                        <tr key={`room-${group.room.id}`} className="bg-[#E8F0F8]">
                          <td colSpan={7} className="px-2 py-2 border border-slate-300 text-xs font-bold text-[#1B3054]">
                            {group.room.name || "Помещение"}
                          </td>
                        </tr>
                      );
                    }

                    group.rows.forEach((row) => {
                      const idx = globalIdx++;
                      const rowPriceUsd = Math.round(row.priceUsd * markupMultiplier * 100) / 100;
                      const rowTotalUsd = Math.round(row.priceUsd * row.quantity * markupMultiplier * 100) / 100;
                      elements.push(
                        <tr key={row.id} className={idx % 2 === 1 ? "bg-[#F0F5FA]" : "bg-white"}>
                          <td className="px-2 py-1.5 border border-slate-300 text-center">{idx + 1}</td>
                          <td className="px-2 py-1.5 border border-slate-300">
                            {row.options?._calcTitle
                              ? <>{row.options._calcTitle}{row.fabric ? ` ${row.fabric}` : ""}{row.fabricColor ? ` ${row.fabricColor}` : ""}{row.category ? ` (кат. ${row.category})` : ""}</>
                              : hasMaterial && row.options["material"] && row.options["material"] !== "—"
                              ? `${["Бамбук", "Дерево", "Павловния"].includes(row.options["material"]) ? "Деревянные жалюзи" : config.id === "vertical-blinds" ? "Вертикальные жалюзи" : "Горизонтальные жалюзи"} ${row.options["material"]} ${row.options["color"] && row.options["color"] !== "—" ? row.options["color"] : ""} ${row.options["slat"] ? row.options["slat"] + "мм" : ""}`.trim()
                              : <>
                                  {row.fabric
                                    ? `${config.group === "Шторы плиссе" ? "Шторы плиссе" : (config.id.startsWith("uni") || config.id.startsWith("kasseta")) ? "Кассетные рулонные шторы " + config.title : "Рулонные шторы " + config.title} ${row.fabric}${row.fabricColor ? " " + row.fabricColor : ""} ${row.category || row.options?.cat ? (row.category || row.options?.cat) + " кат" : ""}`
                                    : <>
                                        {config.id.startsWith("venus")
                                          ? `Кассетные горизонтальные жалюзи ${config.title}`
                                          : config.id === "gzh-blinds"
                                          ? "Горизонтальные жалюзи"
                                          : config.id === "vertical-blinds"
                                          ? "Вертикальные жалюзи"
                                          : config.title}
                                        {row.category ? ` (кат. ${row.category})` : ""}
                                        {hasColor && row.options["color"] && row.options["color"] !== "—" ? ` ${row.options["color"]}` : ""}
                                        {hasSlat && row.options["slat"] && row.options["slat"] !== "—" ? ` ${row.options["slat"]}мм` : ""}
                                      </>
                                  }
                                </>
                            }
                            {row.options?.electric && row.options.electric !== "Нет" && (
                              <>{" "}+ моторизация ({row.options.electric})</>
                            )}
                          </td>
                          <td className="px-2 py-1.5 border border-slate-300 text-center">{row.width ? Math.round(parseFloat(row.width) * 1000) : ""}</td>
                          <td className="px-2 py-1.5 border border-slate-300 text-center">{row.height ? Math.round(parseFloat(row.height) * 1000) : ""}</td>
                          <td className="px-2 py-1.5 border border-slate-300 text-center">{row.quantity}</td>
                          <td className="px-2 py-1.5 border border-slate-300 text-right">{rowPriceUsd.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}</td>
                          <td className="px-2 py-1.5 border border-slate-300 text-right font-medium">{rowTotalUsd.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}</td>
                        </tr>
                      );
                    });

                    if (group.room && hasRooms) {
                      const roomSubtotalUsd = Math.round(group.rows.reduce((s, r) => s + r.priceUsd * r.quantity, 0) * markupMultiplier * 100) / 100;
                      elements.push(
                        <tr key={`subtotal-${group.room.id}`} className="bg-[#E8F0F8]">
                          <td colSpan={6} className="px-2 py-1.5 border border-slate-300 text-right text-xs font-bold text-[#1B3054]">
                            Итого {group.room.name || "Помещение"}:
                          </td>
                          <td className="px-2 py-1.5 border border-slate-300 text-right text-xs font-bold text-[#1B3054]">
                            {roomSubtotalUsd.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    }

                    return elements;
                  });
                })()}
                {acc.length > 0 && (
                  <tr className="bg-slate-100">
                    <td colSpan={7} className="px-2 py-1 border border-slate-300 text-xs font-semibold text-slate-600">
                      Аксессуары электрики
                    </td>
                  </tr>
                )}
                {acc.map((a, idx) => {
                  const aPriceUsd = Math.round(a.price * markupMultiplier * 100) / 100;
                  const aTotalUsd = Math.round(a.price * a.quantity * markupMultiplier * 100) / 100;
                  return (
                    <tr key={a.id} className={idx % 2 === 1 ? "bg-[#F0F5FA]" : "bg-white"}>
                      <td className="px-2 py-1.5 border border-slate-300 text-center">
                        {activeRows.length + idx + 1}
                      </td>
                      <td className="px-2 py-1.5 border border-slate-300" colSpan={3}>
                        {a.name}
                      </td>
                      <td className="px-2 py-1.5 border border-slate-300 text-center">
                        {a.quantity}
                      </td>
                      <td className="px-2 py-1.5 border border-slate-300 text-right">
                        {aPriceUsd.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 border border-slate-300 text-right font-medium">
                        {aTotalUsd.toLocaleString("ru-RU", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Итого */}
            <div className="mt-5 flex justify-end">
              <div className="text-right space-y-1">
                <div className="text-sm text-slate-500">
                  Позиций: {activeRows.reduce((s, r) => s + r.quantity, 0)} шт.
                </div>
                {ralEnabled && ralAmount > 0 && (
                  <div className="text-lg font-bold" style={{ color: "#1B3054" }}>
                    Покраска RAL: {ralAmount.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                  </div>
                )}
                <div className="text-lg font-bold" style={{ color: "#1B3054" }}>
                  Итого: {finalUsd.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} $
                </div>
                <div className="text-sm text-slate-500">
                  Курс: 1 $ = {exchangeRate} ₽
                </div>
                <div className="text-lg font-bold" style={{ color: "#1B3054" }}>
                  Итого: {finalRub.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                </div>
                {kpDiscountEnabled && kpDiscountPercent > 0 && (
                  <div className="text-lg font-bold" style={{ color: "#1B3054" }}>
                    Скидка {kpDiscountPercent}%: −{(finalRub - discountedRub).toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                  </div>
                )}
                {kpDiscountEnabled && kpDiscountPercent > 0 && (
                  <div className="text-lg font-bold" style={{ color: "#1B3054" }}>
                    Со скидкой: {discountedRub.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                  </div>
                )}
                {deliveryEnabled && deliveryAmount > 0 && (
                  <div className="text-lg font-bold" style={{ color: "#1B3054" }}>
                    Доставка: {deliveryAmount.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                  </div>
                )}
                {installEnabled && installAmount > 0 && (
                  <div className="text-lg font-bold" style={{ color: "#1B3054" }}>
                    Монтаж: {installAmount.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                  </div>
                )}
                {(extrasRub > 0 || (kpDiscountEnabled && kpDiscountPercent > 0)) && (
                  <div
                    className="text-2xl font-bold pt-1 border-t border-slate-300 mt-1"
                    style={{ color: "#1B3054" }}
                  >
                    К оплате: {grandTotalRub.toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Подвал — прижат к низу */}
          <div
            className="absolute bottom-0 left-0 right-0 px-12 py-6"
            style={{ zIndex: 10 }}
          >
            <div className="text-xs text-slate-400 leading-relaxed">
              <p>
                Цена действительна в течение 3-х дней.
              </p>
              <p className="mt-1">
                AMIGO Design Boutique | krasnodar.amigo.ru
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* === Спецификация === */}
      <div
        ref={specRef}
        className="bg-white print:shadow-none shadow-lg rounded-xl print:rounded-none overflow-hidden max-w-[210mm] mx-auto mt-8 print:mt-0 print:break-before-page"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <div className="px-12 py-8">
          <div className="border-b-2 border-slate-800 pb-2 mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-wide">СПЕЦИФИКАЦИЯ</h2>
            <div className="text-sm text-slate-500 mt-1">
              к коммерческому предложению от {dateStr}
              {clientName && <> для «{clientName}»</>}
            </div>
          </div>

          {(() => {
            const hasRooms = data.rooms && data.rooms.length > 1;
            const roomGroups = hasRooms
              ? data.rooms!.map(room => ({
                  room,
                  rows: activeRows.filter(r => r.options?._roomId === room.id),
                })).filter(g => g.rows.length > 0)
              : [{ room: null, rows: activeRows }];

            let globalIdx = 0;

            return roomGroups.map((group) => (
              <div key={group.room?.id || "all"}>
                {group.room && hasRooms && (
                  <div className="mb-3 mt-4 first:mt-0">
                    <h3 className="text-sm font-bold text-[#1B3054] border-b border-[#1B3054] pb-1">
                      {group.room.name || "Помещение"}
                    </h3>
                  </div>
                )}
                {group.rows.map((row) => {
                  const idx = globalIdx++;
                  const calcTitle = row.options?._calcTitle || config.title;
                  const rowConfig = row.options?._calcTitle
                    ? Object.values(calculatorConfigs).find(c => c.title === row.options._calcTitle) || config
                    : config;

                  return (
                    <div key={row.id} className="mb-5 pb-4 border-b border-slate-200 last:border-0">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-sm font-bold" style={{ color: "#1B3054" }}>
                          Позиция {idx + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                          {calcTitle}
                          {row.fabric ? ` — ${row.fabric}` : ""}
                          {row.fabricColor ? ` ${row.fabricColor}` : ""}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-0.5 text-xs ml-4">
                        {row.width && (
                          <div className="flex justify-between border-b border-dotted border-slate-200 py-0.5">
                            <span className="text-slate-500">Ширина</span>
                            <span className="font-medium">{Math.round(parseFloat(row.width) * 1000)} мм</span>
                          </div>
                        )}
                        {row.height && (
                          <div className="flex justify-between border-b border-dotted border-slate-200 py-0.5">
                            <span className="text-slate-500">Высота</span>
                            <span className="font-medium">{Math.round(parseFloat(row.height) * 1000)} мм</span>
                          </div>
                        )}
                        {row.category && (
                          <div className="flex justify-between border-b border-dotted border-slate-200 py-0.5">
                            <span className="text-slate-500">Категория</span>
                            <span className="font-medium">{row.category}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-b border-dotted border-slate-200 py-0.5">
                          <span className="text-slate-500">Количество</span>
                          <span className="font-medium">{row.quantity} шт.</span>
                        </div>

                        {rowConfig.options.filter(opt => {
                          const val = row.options[opt.id];
                          if (!val || val === opt.defaultValue || val === "Нет" || val === "—" || val === "0" || opt.id === "_calcTitle" || opt.id === "_roomId") return false;
                          return true;
                        }).map(opt => (
                          <div key={opt.id} className="flex justify-between border-b border-dotted border-slate-200 py-0.5">
                            <span className="text-slate-500">{opt.label}</span>
                            <span className="font-medium">{row.options[opt.id]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}
