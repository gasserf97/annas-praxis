import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "praxis_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/anmelden" || pathname.startsWith("/einwilligung")) {
    return NextResponse.next();
  }
  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/anmelden";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)"],
};
