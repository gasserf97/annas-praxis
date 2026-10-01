import { headers } from "next/headers";

export async function requestOrigin() {
  const headerList = await headers();
  const host = (headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:43123")
    .split(",")[0]
    .trim();
  const forwarded = headerList.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwarded || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${proto}://${host}`;
}
