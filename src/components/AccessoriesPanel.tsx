"use client";

import { accessories } from "@/lib/electrics";

export interface AccessorySelection {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface AccessoriesPanelProps {
  selections: Record<string, number>;
  exchangeRate: number;
  onChange: (selections: Record<string, number>) => void;
}

export default function AccessoriesPanel({ selections, exchangeRate, onChange }: AccessoriesPanelProps) {
  const categories = [...new Set(accessories.map((a) => a.category))];

  const updateQty = (id: string, qty: number) => {
    const next = { ...selections };
    if (qty <= 0) {
      delete next[id];
    } else {
      next[id] = qty;
    }
    onChange(next);
  };

  const totalUsd = accessories.reduce((sum, a) => sum + a.price * (selections[a.id] || 0), 0);
  const totalRub = Math.round(totalUsd * exchangeRate * 100) / 100;

  return (
    <div className="mt-6 border border-slate-200 rounded-lg p-4 bg-slate-50">
      <h3 className="text-sm font-bold text-slate-700 mb-3">Аксессуары электрики</h3>
      {categories.map((cat) => (
        <div key={cat} className="mb-3">
          <h4 className="text-xs font-semibold text-slate-500 mb-1">{cat}</h4>
          <div className="grid gap-1">
            {accessories
              .filter((a) => a.category === cat)
              .map((a) => {
                const qty = selections[a.id] || 0;
                return (
                  <div key={a.id} className="flex items-center gap-2 text-xs">
                    <input
                      type="number"
                      min="0"
                      value={qty || ""}
                      onChange={(e) => updateQty(a.id, parseInt(e.target.value) || 0)}
                      className="w-12 px-1 py-0.5 border border-slate-300 rounded text-center bg-white"
                      placeholder="0"
                    />
                    <span className="flex-1 text-slate-700">{a.name}</span>
                    <span className="text-slate-500 font-mono whitespace-nowrap">${a.price.toFixed(2)}</span>
                    {qty > 0 && (
                      <span className="text-green-700 font-mono font-semibold whitespace-nowrap">
                        = {(Math.round(a.price * qty * exchangeRate * 100) / 100).toFixed(2)} ₽
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
      {totalUsd > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-300 text-sm font-semibold text-right">
          Аксессуары: ${totalUsd.toFixed(2)} / {totalRub.toFixed(2)} ₽
        </div>
      )}
    </div>
  );
}
