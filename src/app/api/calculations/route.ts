import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

const createCalcSchema = z.object({
  type: z.string().min(1).max(100),
  name: z.string().max(500).optional().default(""),
  data: z.unknown(),
  totalUsd: z.number().finite(),
  totalRub: z.number().finite(),
  markup: z.number().finite().optional().default(0),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createCalcSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }
  const { type, name, data, totalUsd, totalRub, markup } = parsed.data;

  const calculation = await prisma.calculation.create({
    data: {
      userId: session.userId,
      type,
      name: name || "",
      data: JSON.stringify(data),
      totalUsd,
      totalRub,
      markup,
    },
  });

  return NextResponse.json({ id: calculation.id });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin sees all, managers see only their own
  const where = session.role === "admin" ? {} : { userId: session.userId };

  const calculations = await prisma.calculation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(calculations);
}
