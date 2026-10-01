"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { berlinToUtc, isDateKey } from "@/lib/dates";
import { fieldErrors, type FormState } from "@/lib/form-state";
import { prisma } from "@/lib/prisma";
import { sessionSchema } from "@/lib/validators";

function refresh(clientId: string) {
  revalidatePath("/");
  revalidatePath(`/kunden/${clientId}`);
}

export async function saveSession(_state: FormState, formData: FormData): Promise<FormState> {
  await requireSession();
  const clientId = String(formData.get("clientId") ?? "");
  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) return { error: "Dieser Kunde ist nicht mehr vorhanden." };

  const parsed = sessionSchema.safeParse({
    date: formData.get("date"),
    title: formData.get("title"),
    kind: formData.get("kind"),
    comment: formData.get("comment"),
  });
  if (!parsed.success || !isDateKey(String(formData.get("date") ?? ""))) {
    return {
      error: "Bitte prüfe die markierten Felder.",
      fields: parsed.success ? { date: "Bitte ein Datum wählen." } : fieldErrors(parsed.error),
    };
  }

  const data = {
    clientId,
    date: berlinToUtc(parsed.data.date, "12:00"),
    title: parsed.data.title,
    kind: parsed.data.kind,
    comment: parsed.data.comment,
  };
  const id = String(formData.get("id") ?? "");
  if (id) {
    const existing = await prisma.session.findFirst({ where: { id, clientId } });
    if (!existing) return { error: "Diese Sitzung ist nicht mehr vorhanden." };
    await prisma.session.update({ where: { id }, data });
  } else {
    await prisma.session.create({ data });
  }
  refresh(clientId);
  redirect(`/kunden/${clientId}`);
}

export async function deleteSession(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  if (!id || !clientId) return;
  await prisma.session.deleteMany({ where: { id, clientId } });
  refresh(clientId);
  redirect(`/kunden/${clientId}`);
}
