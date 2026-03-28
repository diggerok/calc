import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const calculations = await prisma.calculation.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Общая статистика
  const total = calculations.length;
  const totalUsd = calculations.reduce((s, c) => s + c.totalUsd, 0);
  const totalRub = calculations.reduce((s, c) => s + c.totalRub, 0);
  const avgRub = total > 0 ? totalRub / total : 0;

  // По калькуляторам
  const byType: Record<string, { count: number; totalRub: number }> = {};
  for (const c of calculations) {
    if (!byType[c.type]) byType[c.type] = { count: 0, totalRub: 0 };
    byType[c.type].count++;
    byType[c.type].totalRub += c.totalRub;
  }
  const byTypeArr = Object.entries(byType)
    .map(([type, data]) => ({ type, ...data }))
    .sort((a, b) => b.count - a.count);

  // По менеджерам
  const byManager: Record<string, { count: number; totalRub: number }> = {};
  for (const c of calculations) {
    const name = c.user?.name || "Неизвестный";
    if (!byManager[name]) byManager[name] = { count: 0, totalRub: 0 };
    byManager[name].count++;
    byManager[name].totalRub += c.totalRub;
  }
  const byManagerArr = Object.entries(byManager)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.totalRub - a.totalRub);

  // По месяцам
  const byMonth: Record<string, { count: number; totalRub: number }> = {};
  for (const c of calculations) {
    const date = new Date(c.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!byMonth[key]) byMonth[key] = { count: 0, totalRub: 0 };
    byMonth[key].count++;
    byMonth[key].totalRub += c.totalRub;
  }
  const byMonthArr = Object.entries(byMonth)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Последние 10
  const recent = calculations.slice(0, 10).map((c) => ({
    id: c.id,
    type: c.type,
    name: c.name,
    totalRub: c.totalRub,
    manager: c.user?.name || "",
    date: c.createdAt,
  }));

  return NextResponse.json({
    total,
    totalUsd: Math.round(totalUsd * 100) / 100,
    totalRub: Math.round(totalRub * 100) / 100,
    avgRub: Math.round(avgRub * 100) / 100,
    byType: byTypeArr,
    byManager: byManagerArr,
    byMonth: byMonthArr,
    recent,
  });
}
