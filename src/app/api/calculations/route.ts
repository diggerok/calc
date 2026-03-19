import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, data, totalUsd, totalRub, markup } = body;

  // For MVP, use a default user (no auth yet)
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@blinds.local",
        passwordHash: "",
        role: "admin",
      },
    });
  }

  const calculation = await prisma.calculation.create({
    data: {
      userId: user.id,
      type,
      data: JSON.stringify(data),
      totalUsd,
      totalRub,
      markup,
    },
  });

  return NextResponse.json({ id: calculation.id });
}

export async function GET() {
  const calculations = await prisma.calculation.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(calculations);
}
