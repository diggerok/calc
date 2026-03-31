import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  phone: z.string().max(30).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, email: true, phone: true },
  });

  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
  }

  const { name, phone } = parsed.data;
  await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
    },
  });

  return NextResponse.json({ ok: true });
}
