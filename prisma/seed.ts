import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "prisma/dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const adminEmail = "admin@amigo.ru";
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    const hash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "Дмитрий",
        email: adminEmail,
        passwordHash: hash,
        role: "admin",
      },
    });
    console.log("Admin created: admin@amigo.ru / admin123");
  } else {
    console.log("Admin already exists");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
