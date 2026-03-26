import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const calculation = await prisma.calculation.findUnique({ where: { id } });

  if (!calculation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Managers can only see their own
  if (session.role !== "admin" && calculation.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(calculation);
}
