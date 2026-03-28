import Link from "next/link";
import { orderedGroups } from "@/lib/calculator-configs";

export default function CalcListPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold" style={{ color: "#1B3054" }}>Калькуляторы</h1>
        <Link
          href="/combined"
          className="px-5 py-2 text-white rounded-lg font-medium text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: "#1B3054" }}
        >
          Сборный расчёт
        </Link>
      </div>
      {orderedGroups.map(([group, calcs]) => (
        <div key={group} className="mb-8">
          <h2 className="text-lg font-bold mb-3 pb-2 border-b-2 text-center" style={{ color: "#1B3054", borderColor: "#DAEBF5" }}>
            {group}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 animate-stagger">
            {calcs.map((calc) => (
              <Link
                key={calc.id}
                href={`/calc/${calc.id}`}
                className="bg-white border rounded-xl shadow-sm card-hover group"
                style={{ borderColor: "#DAEBF5", display: "block", textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60px", padding: "16px" }}>
                  <span className="text-sm font-semibold group-hover:text-blue-700 transition-colors" style={{ color: "#1B3054", textAlign: "center" }}>
                    {calc.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
