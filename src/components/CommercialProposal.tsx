"use client";

import { useState, useRef } from "react";
import type { CalcRowData, CalculatorConfig } from "@/types/calculator";
import Image from "next/image";

interface KPData {
  config: CalculatorConfig;
  rows: CalcRowData[];
  exchangeRate: number;
  markupType: "markup" | "discount";
  markupPercent: number;
}

interface ManagerInfo {
  email: string;
  phone: string;
}

const MANAGERS: Record<string, ManagerInfo> = {
  "Екатерина": { email: "ekaterina@krasnodar.amigo.ru", phone: "+7 (900) 000-00-01" },
  "Наталья": { email: "natalya@krasnodar.amigo.ru", phone: "+7 (900) 000-00-02" },
  "Другой": { email: "", phone: "" },
};

export default function CommercialProposal({ data }: { data: KPData }) {
  const { config, rows, exchangeRate, markupType, markupPercent } = data;
  const printRef = useRef<HTMLDivElement>(null);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [managerKey, setManagerKey] = useState("Екатерина");
  const [managerEmail, setManagerEmail] = useState(MANAGERS["Екатерина"].email);
  const [managerPhone, setManagerPhone] = useState(MANAGERS["Екатерина"].phone);

  const [deliveryEnabled, setDeliveryEnabled] = useState(false);
  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [installEnabled, setInstallEnabled] = useState(false);
  const [installAmount, setInstallAmount] = useState(0);
  const [kpDiscountEnabled, setKpDiscountEnabled] = useState(false);
  const [kpDiscountPercent, setKpDiscountPercent] = useState(0);

  const activeRows = rows.filter((r) => r.priceUsd > 0);

  // Доп. инфо в наименовании для деревянных жалюзи
  const hasSlat = config.options.some((o) => o.id === "slat");
  const hasMaterial = config.options.some((o) => o.id === "material");
  const hasColor = config.options.some((o) => o.id === "color");

  const totalUsd = activeRows.reduce((s, r) => s + r.priceUsd * r.quantity, 0);
  const totalRub = activeRows.reduce((s, r) => s + r.totalRub, 0);
  const markupMultiplier =
    markupType === "markup"
      ? 1 + markupPercent / 100
      : 1 - markupPercent / 100;
  const finalUsd = Math.round(totalUsd * markupMultiplier * 100) / 100;
  const finalRub = Math.round(totalRub * markupMultiplier * 100) / 100;
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
    window.print();
  };

  const handleManagerChange = (key: string) => {
    setManagerKey(key);
    const info = MANAGERS[key];
    setManagerEmail(info?.email || "");
    setManagerPhone(info?.phone || "");
  };

  return (
    <div>
      {/* Панель редактирования — скрыта при печати */}
      <div className="print:hidden mb-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Данные клиента</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Менеджер
            </label>
            <div className="flex gap-2">
              <select
                value={managerKey}
                onChange={(e) => handleManagerChange(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.keys(MANAGERS).map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <input
                type="email"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                placeholder="email менеджера"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Телефон менеджера
            </label>
            <input
              type="tel"
              value={managerPhone}
              onChange={(e) => setManagerPhone(e.target.value)}
              placeholder="+7 (___) ___-__-__"
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
              <Image
                src="/logo-amigo.svg"
                alt="AMIGO Design Boutique"
                width={280}
                height={95}
              />
            </div>
            {/* Реквизиты — справа */}
            <div className="absolute right-12 top-10 text-right text-[11px] text-slate-600 leading-relaxed">
              <div className="font-semibold text-slate-800">
                ИП Кривонос Наталья Анатольевна
              </div>
              <div>г. Краснодар, Первый проезд Стасова 1а</div>
              <div>krasnodar.amigo.ru</div>
              {managerKey !== "Другой" && (
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <div className="font-semibold text-slate-800">
                    Менеджер: {managerKey}
                  </div>
                  {managerPhone && <div>{managerPhone}</div>}
                  {managerEmail && <div>{managerEmail}</div>}
                </div>
              )}
              {managerKey === "Другой" && (managerPhone || managerEmail) && (
                <div className="mt-2 pt-2 border-t border-slate-200">
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
                {activeRows.map((row, idx) => {
                  const rowPriceUsd =
                    Math.round(row.priceUsd * markupMultiplier * 100) / 100;
                  const rowTotalUsd =
                    Math.round(row.priceUsd * row.quantity * markupMultiplier * 100) / 100;
                  return (
                    <tr
                      key={row.id}
                      className={idx % 2 === 1 ? "bg-[#F0F5FA]" : "bg-white"}
                    >
                      <td className="px-2 py-1.5 border border-slate-300 text-center">
                        {idx + 1}
                      </td>
                      <td className="px-2 py-1.5 border border-slate-300">
                        {hasMaterial && row.options["material"] && row.options["material"] !== "—"
                          ? `${["Бамбук", "Дерево", "Павловния"].includes(row.options["material"]) ? "Деревянные жалюзи" : "Горизонтальные жалюзи"} ${row.options["material"]} ${row.options["color"] && row.options["color"] !== "—" ? row.options["color"] : ""} ${row.options["slat"] ? row.options["slat"] + "мм" : ""}`.trim()
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
                      </td>
                      <td className="px-2 py-1.5 border border-slate-300 text-center">
                        {row.width ? Math.round(parseFloat(row.width) * 1000) : ""}
                      </td>
                      <td className="px-2 py-1.5 border border-slate-300 text-center">
                        {row.height ? Math.round(parseFloat(row.height) * 1000) : ""}
                      </td>
                      <td className="px-2 py-1.5 border border-slate-300 text-center">
                        {row.quantity}
                      </td>
                      <td className="px-2 py-1.5 border border-slate-300 text-right">
                        {rowPriceUsd.toLocaleString("ru-RU", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-2 py-1.5 border border-slate-300 text-right font-medium">
                        {rowTotalUsd.toLocaleString("ru-RU", {
                          minimumFractionDigits: 2,
                        })}
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
    </div>
  );
}
