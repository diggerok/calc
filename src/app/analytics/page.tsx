"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { calculatorConfigs } from "@/lib/calculator-configs";

interface AnalyticsData {
  total: number;
  totalUsd: number;
  totalRub: number;
  avgRub: number;
  byType: { type: string; count: number; totalRub: number }[];
  byManager: { name: string; count: number; totalRub: number }[];
  byMonth: { month: string; count: number; totalRub: number }[];
  recent: { id: string; type: string; name: string; totalRub: number; manager: string; date: string }[];
}

const monthNames: Record<string, string> = {
  "01": "Январь", "02": "Февраль", "03": "Март", "04": "Апрель",
  "05": "Май", "06": "Июнь", "07": "Июль", "08": "Август",
  "09": "Сентябрь", "10": "Октябрь", "11": "Ноябрь", "12": "Декабрь",
};

function formatMonth(m: string) {
  const [year, month] = m.split("-");
  return `${monthNames[month] || month} ${year}`;
}

function getCalcTitle(type: string) {
  return calculatorConfigs[type]?.title || type;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400 animate-pulse text-lg">Загрузка аналитики...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-red-500 text-center mt-10">Ошибка загрузки данных</div>;
  }

  const maxByType = Math.max(...data.byType.map((t) => t.count), 1);
  const maxByMonth = Math.max(...data.byMonth.map((m) => m.totalRub), 1);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#1B3054" }}>Аналитика</h1>
        <Link href="/calc" className="text-sm hover:underline" style={{ color: "#2a4a7f" }}>
          ← К калькуляторам
        </Link>
      </div>

      {/* Карточки общей статистики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-stagger">
        <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: "#DAEBF5" }}>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Всего расчётов</div>
          <div className="text-3xl font-bold mt-1" style={{ color: "#1B3054" }}>{data.total}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: "#DAEBF5" }}>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Общая сумма $</div>
          <div className="text-3xl font-bold mt-1" style={{ color: "#1B3054" }}>{data.totalUsd.toLocaleString("ru-RU")}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: "#DAEBF5" }}>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Общая сумма ₽</div>
          <div className="text-3xl font-bold mt-1" style={{ color: "#1B3054" }}>{data.totalRub.toLocaleString("ru-RU")}</div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: "#DAEBF5" }}>
          <div className="text-xs text-slate-400 uppercase tracking-wide">Средний чек ₽</div>
          <div className="text-3xl font-bold mt-1" style={{ color: "#1B3054" }}>{data.avgRub.toLocaleString("ru-RU")}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* По калькуляторам */}
        <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: "#DAEBF5" }}>
          <h2 className="text-sm font-bold mb-4" style={{ color: "#1B3054" }}>По калькуляторам</h2>
          <div className="space-y-2">
            {data.byType.map((t) => (
              <div key={t.type} className="flex items-center gap-3">
                <div className="w-28 text-xs text-slate-600 truncate" title={getCalcTitle(t.type)}>
                  {getCalcTitle(t.type)}
                </div>
                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(t.count / maxByType) * 100}%`,
                      backgroundColor: "#1B3054",
                    }}
                  />
                </div>
                <div className="text-xs font-mono text-slate-500 w-8 text-right">{t.count}</div>
                <div className="text-xs font-mono text-slate-400 w-24 text-right">
                  {t.totalRub.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* По менеджерам */}
        <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: "#DAEBF5" }}>
          <h2 className="text-sm font-bold mb-4" style={{ color: "#1B3054" }}>По менеджерам</h2>
          <div className="space-y-3">
            {data.byManager.map((m) => (
              <div key={m.name} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold" style={{ color: "#1B3054" }}>{m.name}</div>
                  <div className="text-xs text-slate-400">{m.count} расчётов</div>
                </div>
                <div className="text-lg font-bold" style={{ color: "#1B3054" }}>
                  {m.totalRub.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* По месяцам */}
      {data.byMonth.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border mb-8" style={{ borderColor: "#DAEBF5" }}>
          <h2 className="text-sm font-bold mb-4" style={{ color: "#1B3054" }}>Динамика по месяцам</h2>
          <div className="flex items-end gap-2" style={{ height: "160px" }}>
            {data.byMonth.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] font-mono text-slate-400">
                  {m.count}
                </div>
                <div
                  className="w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${(m.totalRub / maxByMonth) * 120}px`,
                    backgroundColor: "#1B3054",
                    minHeight: "4px",
                  }}
                />
                <div className="text-[9px] text-slate-400 text-center leading-tight mt-1">
                  {formatMonth(m.month).split(" ")[0].slice(0, 3)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Последние расчёты */}
      <div className="bg-white rounded-xl p-5 shadow-sm border" style={{ borderColor: "#DAEBF5" }}>
        <h2 className="text-sm font-bold mb-4" style={{ color: "#1B3054" }}>Последние расчёты</h2>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#1B3054" }} className="text-white">
              <th className="px-3 py-2 text-left rounded-tl-lg">Дата</th>
              <th className="px-3 py-2 text-left">Калькулятор</th>
              <th className="px-3 py-2 text-left">Клиент</th>
              <th className="px-3 py-2 text-left">Менеджер</th>
              <th className="px-3 py-2 text-right rounded-tr-lg">Сумма ₽</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.map((r, idx) => (
              <tr key={r.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="px-3 py-2 text-slate-500">
                  {new Date(r.date).toLocaleDateString("ru-RU")}
                </td>
                <td className="px-3 py-2 font-medium" style={{ color: "#1B3054" }}>
                  {getCalcTitle(r.type)}
                </td>
                <td className="px-3 py-2 text-slate-600">{r.name || "—"}</td>
                <td className="px-3 py-2 text-slate-600">{r.manager}</td>
                <td className="px-3 py-2 text-right font-mono font-semibold">
                  {r.totalRub.toLocaleString("ru-RU")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
