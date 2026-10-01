import { redirect } from "next/navigation";
import { LoginScreen } from "@/components/login-screen";
import { getSession, safeNextPath, showLocalPasswordHint } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await getSession()) redirect("/");
  const params = await searchParams;
  return <LoginScreen nextPath={safeNextPath(params.next)} showHint={showLocalPasswordHint()} />;
}
