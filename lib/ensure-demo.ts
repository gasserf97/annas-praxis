import { seedDemo } from "@/prisma/demo";
import { prisma } from "@/lib/prisma";

export async function ensureDemo() {
  await seedDemo(prisma, { replace: false });
}
