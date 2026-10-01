import { PrismaClient } from "@prisma/client";
import { seedDemo } from "./demo";

const prisma = new PrismaClient();

async function main() {
  const replace = !process.argv.includes("--if-empty");
  const result = await seedDemo(prisma, { replace });
  if (result.seeded) {
    console.log("Beispieldaten angelegt: 6 Kunden mit Sitzungen und Terminen.");
    return;
  }
  console.log("Beispieldaten sind schon vorhanden.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
