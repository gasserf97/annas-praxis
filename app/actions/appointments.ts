"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { berlinToUtc, isDateKey, isTimeKey } from "@/lib/dates";
import { fieldErrors, type FormState } from "@/lib/form-state";
import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/practice";
import { appointmentSchema } from "@/lib/validators";

function refresh() {
  revalidatePath("/");
  revalidatePath("/kalender");
  revalidatePath("/kunden");
}

export async function saveAppointment(_state: FormState, formData: FormData): Promise<FormState> {
  await requireSession();
  const parsed = appointmentSchema.safeParse({
    clientId: formData.get("clientId"),
    date: formData.get("date"),
    time: formData.get("time"),
    duration: formData.get("duration"),
    title: formData.get("title"),
    location: formData.get("location"),
    notes: formData.get("notes"),
  });
  if (!parsed.success) {
    return { error: "Bitte prüfe die markierten Felder.", fields: fieldErrors(parsed.error) };
  }
  if (!isDateKey(parsed.data.date) || !isTimeKey(parsed.data.time)) {
    return { error: "Datum oder Uhrzeit ist ungültig." };
  }

  const client = await prisma.client.findUnique({ where: { id: parsed.data.clientId } });
  if (!client) return { error: "Bitte einen vorhandenen Kunden wählen.", fields: { clientId: "Dieser Kunde fehlt." } };

  const startsAt = berlinToUtc(parsed.data.date, parsed.data.time);
  const endsAt = new Date(startsAt.getTime() + parsed.data.duration * 60 * 1000);
  const id = String(formData.get("id") ?? "");
  const conflict = await prisma.appointment.findFirst({
    where: {
      id: id ? { not: id } : undefined,
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
    },
  });
  if (conflict) {
    return { error: "In diesem Zeitraum liegt schon ein Termin." };
  }

  const data = {
    clientId: client.id,
    startsAt,
    endsAt,
    title: parsed.data.title || fullName(client),
    location: parsed.data.location,
    notes: parsed.data.notes,
  };

  if (id) {
    const existing = await prisma.appointment.findUnique({ where: { id } });
    if (!existing) return { error: "Dieser Termin ist nicht mehr vorhanden." };
    await prisma.appointment.update({ where: { id }, data });
  } else {
    await prisma.appointment.create({ data });
  }
  refresh();
  revalidatePath(`/kunden/${client.id}`);
  redirect(`/kalender?woche=${parsed.data.date}`);
}

export async function deleteAppointment(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  const week = String(formData.get("woche") ?? "");
  if (!id) return;
  await prisma.appointment.delete({ where: { id } }).catch(() => undefined);
  refresh();
  redirect(week ? `/kalender?woche=${week}` : "/kalender");
}
