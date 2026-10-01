import { AppShell } from "@/components/app-shell";
import { requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PraxisLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  return <AppShell>{children}</AppShell>;
}
