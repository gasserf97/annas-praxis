import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "praxis_session";

const FOURTEEN_DAYS = 60 * 60 * 24 * 14;

function secret() {
  return process.env.SESSION_SECRET || "local-dev-secret-annas-praxis";
}

export function practicePassword() {
  return process.env.PRACTICE_PASSWORD || "praxis";
}

export function showLocalPasswordHint() {
  return process.env.NODE_ENV !== "production";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(left, left);
    return false;
  }
  return timingSafeEqual(left, right);
}

export function passwordsMatch(input: string) {
  return safeEqual(input, practicePassword());
}

export function createSessionToken() {
  const expires = Date.now() + FOURTEEN_DAYS * 1000;
  const payload = `v1.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [version, expires, signature] = parts;
  if (version !== "v1") return false;
  const payload = `${version}.${expires}`;
  const expected = sign(payload);
  if (!safeEqual(signature, expected)) return false;
  const expiry = Number(expires);
  return Number.isFinite(expiry) && expiry > Date.now();
}

export function safeNextPath(value: string | null | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/";
  }
  return value;
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireSession() {
  if (!(await getSession())) redirect("/anmelden");
}

export async function setSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: FOURTEEN_DAYS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
