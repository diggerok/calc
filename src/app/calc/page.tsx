import Link from "next/link";
import { calculatorGroups } from "@/lib/calculator-configs";

export default function CalcListPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Калькуляторы</h1>
      {Object.entries(calculatorGroups).map(([group, calcs]) => (
        <div key={group} className="mb-8">
          <h2 className="text-lg font-bold text-slate-600 mb-3 border-b border-slate-200 pb-2">
            {group}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {calcs.map((calc) => (
              <Link
                key={calc.id}
                href={`/calc/${calc.id}`}
                className="block p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
              >
                <h3 className="text-sm font-semibold text-slate-800">
                  {calc.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
