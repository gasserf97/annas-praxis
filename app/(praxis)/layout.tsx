import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth";
import { ensureDemo } from "@/lib/ensure-demo";

export const dynamic = "force-dynamic";

export default async function PraxisLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  await ensureDemo();
  return <AppShell>{children}</AppShell>;
}
