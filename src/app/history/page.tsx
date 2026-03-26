"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CalcRecord {
  id: string;
  type: string;
  name: string;
  data: string;
  totalUsd: number;
  totalRub: number;
  markup: number;
  createdAt: string;
  user?: { name: string; email: string };
}

interface WeekGroup {
  label: string;
  records: CalcRecord[];
}

interface MonthGroup {
  label: string;
  weeks: WeekGroup[];
  totalRecords: number;
  isCurrent: boolean;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

function buildGroups(records: CalcRecord[]): MonthGroup[] {
  const now = new Date();
  const currentWeekStart = getWeekStart(now);
  const prevWeekStart = new Date(currentWeekStart);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const currentMonthKey = getMonthKey(now);

  // Group by month, then by week inside
  const monthMap = new Map<
    string,
    { month: number; year: number; weekMap: Map<string, WeekGroup> }
  >();

  for (const rec of records) {
    const date = new Date(rec.createdAt);
    const mk = getMonthKey(date);
    const weekStart = getWeekStart(date);

    if (!monthMap.has(mk)) {
      monthMap.set(mk, {
        month: date.getMonth(),
        year: date.getFullYear(),
        weekMap: new Map(),
      });
    }

    const wk = weekStart.toISOString();
    const mEntry = monthMap.get(mk)!;

    if (!mEntry.weekMap.has(wk)) {
      let weekLabel: string;
      if (weekStart.getTime() === currentWeekStart.getTime()) {
        weekLabel = "Текущая неделя";
      } else if (weekStart.getTime() === prevWeekStart.getTime()) {
        weekLabel = "Прошлая неделя";
      } else {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const fmtStart = weekStart.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
        });
        const fmtEnd = weekEnd.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
        });
        weekLabel = `${fmtStart} — ${fmtEnd}`;
      }
      mEntry.weekMap.set(wk, { label: weekLabel, records: [] });
    }

    mEntry.weekMap.get(wk)!.records.push(rec);
  }

  // Convert to sorted arrays
  const result: MonthGroup[] = [];
  const sortedMonths = Array.from(monthMap.entries()).sort(
    (a, b) => b[0].localeCompare(a[0]) // newest first
  );

  for (const [mk, mEntry] of sortedMonths) {
    const isCurrent = mk === currentMonthKey;
    const weeks = Array.from(mEntry.weekMap.values()).sort((a, b) => {
      // Sort weeks newest first by first record date
      const aDate = new Date(a.records[0].createdAt).getTime();
      const bDate = new Date(b.records[0].createdAt).getTime();
      return bDate - aDate;
    });
    const totalRecords = weeks.reduce((s, w) => s + w.records.length, 0);

    result.push({
      label: isCurrent
        ? "Текущий месяц"
        : `${MONTH_NAMES[mEntry.month]} ${mEntry.year}`,
      weeks,
      totalRecords,
      isCurrent,
    });
  }

  return result;
}

export default function HistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<CalcRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMonths, setOpenMonths] = useState<Set<string>>(new Set(["Текущий месяц"]));
  const [openWeeks, setOpenWeeks] = useState<Set<string>>(new Set(["Текущая неделя"]));
  const hasManager = records.some((r) => r.user);

  useEffect(() => {
    fetch("/api/calculations")
      .then((r) => r.json())
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  const toggleMonth = (label: string) => {
    setOpenMonths((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const toggleWeek = (label: string) => {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const handleOpen = (rec: CalcRecord) => {
    sessionStorage.setItem(
      "load-calc",
      JSON.stringify({
        id: rec.id,
        type: rec.type,
        name: rec.name,
        data: JSON.parse(rec.data),
        markup: rec.markup,
      })
    );
    router.push(`/calc/${rec.type}`);
  };

  if (loading) return <div className="text-slate-500 py-10 text-center">Загрузка...</div>;

  const months = buildGroups(records);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        История расчётов
      </h1>
      {records.length === 0 ? (
        <p className="text-slate-500">Нет сохранённых расчётов</p>
      ) : (
        <div className="space-y-4">
          {months.map((month) => {
            const monthOpen = openMonths.has(month.label);
            return (
              <div
                key={month.label}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >
                {/* Month header */}
                <button
                  onClick={() => toggleMonth(month.label)}
                  className="w-full px-5 py-3 flex items-center justify-between bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-mono">
                      {monthOpen ? "−" : "+"}
                    </span>
                    <span className="font-bold text-base">
                      {month.label}
                    </span>
                    <span className="text-xs bg-slate-500 px-2 py-0.5 rounded-full">
                      {month.totalRecords}
                    </span>
                  </div>
                </button>

                {monthOpen && (
                  <div className="divide-y divide-slate-100">
                    {month.weeks.map((week) => {
                      const weekOpen = openWeeks.has(week.label);
                      return (
                        <div key={week.label}>
                          {/* Week header */}
                          <button
                            onClick={() => toggleWeek(week.label)}
                            className="w-full px-5 py-2.5 flex items-center gap-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                          >
                            <span className="text-slate-400 font-mono">
                              {weekOpen ? "−" : "+"}
                            </span>
                            <span className="font-semibold text-slate-600 text-sm">
                              {week.label}
                            </span>
                            <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                              {week.records.length}
                            </span>
                          </button>

                          {weekOpen && (
                            <table className="w-full text-sm">
                              <thead className="bg-slate-100/50">
                                <tr>
                                  <th className="px-5 py-2 text-left text-xs text-slate-500">Дата</th>
                                  <th className="px-4 py-2 text-left text-xs text-slate-500">Клиент</th>
                                  <th className="px-4 py-2 text-left text-xs text-slate-500">Тип</th>
                                  {hasManager && (
                                    <th className="px-4 py-2 text-left text-xs text-slate-500">Менеджер</th>
                                  )}
                                  <th className="px-4 py-2 text-right text-xs text-slate-500">Итого $</th>
                                  <th className="px-4 py-2 text-right text-xs text-slate-500">Итого ₽</th>
                                  <th className="px-4 py-2 text-right text-xs text-slate-500">Наценка</th>
                                </tr>
                              </thead>
                              <tbody>
                                {week.records.map((rec) => (
                                  <tr
                                    key={rec.id}
                                    onClick={() => handleOpen(rec)}
                                    className="border-t border-slate-100 hover:bg-blue-50 cursor-pointer"
                                  >
                                    <td className="px-5 py-2.5 text-slate-500">
                                      {new Date(rec.createdAt).toLocaleString("ru", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </td>
                                    <td className="px-4 py-2.5 font-medium">
                                      {rec.name || <span className="text-slate-400">—</span>}
                                    </td>
                                    <td className="px-4 py-2.5 text-blue-600">{rec.type}</td>
                                    {hasManager && (
                                      <td className="px-4 py-2.5 text-slate-500">
                                        {rec.user?.name || "—"}
                                      </td>
                                    )}
                                    <td className="px-4 py-2.5 text-right font-mono">
                                      {rec.totalUsd.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-mono">
                                      {rec.totalRub.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-2.5 text-right">
                                      {rec.markup > 0
                                        ? `+${rec.markup}%`
                                        : rec.markup < 0
                                          ? `${rec.markup}%`
                                          : "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
