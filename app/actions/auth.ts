"use server";

import { redirect } from "next/navigation";
import {
  clearSessionCookie,
  passwordsMatch,
  safeNextPath,
  setSessionCookie,
} from "@/lib/auth";
import { emptyFormState, type FormState } from "@/lib/form-state";

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const nextPath = safeNextPath(String(formData.get("next") ?? "/"));
  if (!passwordsMatch(password)) {
    return { error: "Das Passwort stimmt nicht." };
  }
  await setSessionCookie();
  redirect(nextPath);
  return emptyFormState;
}

export async function logout() {
  await clearSessionCookie();
  redirect("/anmelden");
}
