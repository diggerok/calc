import Link from "next/link";
import { calculatorList } from "@/lib/calculator-configs";

export default function CalcListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Калькуляторы</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculatorList.map((calc) => (
          <Link
            key={calc.id}
            href={`/calc/${calc.id}`}
            className="block p-6 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <h2 className="text-lg font-semibold text-slate-800">
              {calc.title}
            </h2>
            <p className="text-sm text-slate-500 mt-1">Открыть калькулятор</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
