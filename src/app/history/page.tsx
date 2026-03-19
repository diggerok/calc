"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CalcRecord {
  id: string;
  type: string;
  totalUsd: number;
  totalRub: number;
  markup: number;
  createdAt: string;
}

export default function HistoryPage() {
  const [records, setRecords] = useState<CalcRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/calculations")
      .then((r) => r.json())
      .then(setRecords)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500">Загрузка...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        История расчётов
      </h1>
      {records.length === 0 ? (
        <p className="text-slate-500">Нет сохранённых расчётов</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left">Дата</th>
                <th className="px-4 py-3 text-left">Тип</th>
                <th className="px-4 py-3 text-right">Итого $</th>
                <th className="px-4 py-3 text-right">Итого ₽</th>
                <th className="px-4 py-3 text-right">Наценка/Скидка</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    {new Date(rec.createdAt).toLocaleString("ru")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/calc/${rec.type}`}
                      className="text-blue-600 hover:underline"
                    >
                      {rec.type}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {rec.totalUsd.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {rec.totalRub.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
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
        </div>
      )}
    </div>
  );
}
