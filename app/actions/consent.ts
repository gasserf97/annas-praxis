"use server";

import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { fieldErrors, type FormState } from "@/lib/form-state";
import { prisma } from "@/lib/prisma";
import { PRACTICE } from "@/lib/practice";
import { consentSchema } from "@/lib/validators";

export async function signConsent(_state: FormState, formData: FormData): Promise<FormState> {
  const token = String(formData.get("token") ?? "");
  const consent = await prisma.consent.findUnique({ where: { token } });
  if (!consent) return { error: "Dieser Link ist nicht mehr gültig." };
  if (consent.status === "signed") {
    redirect(`/einwilligung/${token}`);
  }

  const parsed = consentSchema.safeParse({
    signerName: formData.get("signerName"),
    accepted: formData.get("accepted"),
    signature: formData.get("signature"),
  });
  if (!parsed.success) {
    return { error: "Die Einwilligung ist noch unvollständig.", fields: fieldErrors(parsed.error) };
  }
  if (parsed.data.signature.length > 1_500_000) {
    return { error: "Die Unterschrift ist zu groß. Bitte neu zeichnen.", fields: { signature: "Bitte kürzer unterschreiben." } };
  }

  const headerList = await headers();
  const ip = (headerList.get("x-forwarded-for") ?? "").split(",")[0]?.trim().slice(0, 80) ?? "";
  const agent = (headerList.get("user-agent") ?? "").slice(0, 300);

  await prisma.consent.update({
    where: { id: consent.id },
    data: {
      status: "signed",
      signerName: parsed.data.signerName,
      signatureData: parsed.data.signature,
      signedAt: new Date(),
      signerIp: ip,
      signerAgent: agent,
      documentVersion: PRACTICE.documentVersion,
    },
  });
  revalidatePath(`/kunden/${consent.clientId}`);
  revalidatePath("/");
  redirect(`/einwilligung/${token}`);
}

export async function renewConsent(formData: FormData) {
  await requireSession();
  const clientId = String(formData.get("clientId") ?? "");
  if (!clientId) return;
  const token = randomBytes(24).toString("base64url");
  await prisma.consent.upsert({
    where: { clientId },
    create: { clientId, token, documentVersion: PRACTICE.documentVersion },
    update: {
      token,
      status: "pending",
      signerName: "",
      signatureData: "",
      signedAt: null,
      signerIp: "",
      signerAgent: "",
      documentVersion: PRACTICE.documentVersion,
    },
  });
  revalidatePath(`/kunden/${clientId}`);
  revalidatePath("/");
}
