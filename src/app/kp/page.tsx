"use client";

import { useEffect, useState } from "react";
import CommercialProposal from "@/components/CommercialProposal";
import type { CalcRowData, CalculatorConfig } from "@/types/calculator";

interface KPData {
  config: CalculatorConfig;
  rows: CalcRowData[];
  exchangeRate: number;
  markupType: "markup" | "discount";
  markupPercent: number;
  accessories?: { id: string; name: string; price: number; quantity: number }[];
}

export default function KPPage() {
  const [data, setData] = useState<KPData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("kp-data");
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800 mb-2">Нет данных для КП</h1>
          <p className="text-slate-500 mb-4">
            Создайте коммерческое предложение из калькулятора.
          </p>
          <a
            href="/calc"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            К калькуляторам
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 print:bg-white print:p-0">
      <CommercialProposal data={data} />
    </div>
  );
}
