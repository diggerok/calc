import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "prisma/dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const adminEmail = "dvkrivonos@gmail.com";
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existing) {
    const hash = await bcrypt.hash("Digdog771", 10);
    await prisma.user.create({
      data: {
        name: "Дмитрий",
        email: adminEmail,
        passwordHash: hash,
        role: "admin",
      },
    });
    console.log("Admin created: dvkrivonos@gmail.com");
  } else {
    console.log("Admin already exists");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
