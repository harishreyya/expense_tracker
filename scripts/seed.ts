import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function main() {
  const pass = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@local" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@local",
      hashedPassword: pass
    }
  });
  console.log("Seeded user:", user.email);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(()=>prisma.$disconnect());
