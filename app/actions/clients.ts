"use server";

import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/auth";
import { fieldErrors, type FormState } from "@/lib/form-state";
import { readList } from "@/lib/lists";
import { prisma } from "@/lib/prisma";
import { clientSchema } from "@/lib/validators";

function refresh(clientId?: string) {
  revalidatePath("/");
  revalidatePath("/kunden");
  revalidatePath("/kalender");
  if (clientId) {
    revalidatePath(`/kunden/${clientId}`);
    revalidatePath(`/kunden/${clientId}/bearbeiten`);
  }
}

function optionalMeasure(raw: FormDataEntryValue | null, min: number, max: number) {
  const value = String(raw ?? "").trim().replace(",", ".");
  if (!value) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max) return Number.NaN;
  return number;
}

export async function saveClient(_state: FormState, formData: FormData): Promise<FormState> {
  await requireSession();
  const parsed = clientSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    dateOfBirth: formData.get("dateOfBirth"),
    street: formData.get("street"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    diet: formData.get("diet"),
    goalNotes: formData.get("goalNotes"),
    medications: formData.get("medications"),
    notes: formData.get("notes"),
  });
  const fields = parsed.success ? {} : fieldErrors(parsed.error);
  const height = optionalMeasure(formData.get("heightCm"), 40, 250);
  const weight = optionalMeasure(formData.get("weightKg"), 20, 400);
  if (typeof height === "number" && Number.isNaN(height)) {
    fields.heightCm = "Bitte eine Größe zwischen 40 und 250 cm angeben.";
  }
  if (typeof weight === "number" && Number.isNaN(weight)) {
    fields.weightKg = "Bitte ein Gewicht zwischen 20 und 400 kg angeben.";
  }

  const allergies = readList(formData.get("allergies"));
  const intolerances = readList(formData.get("intolerances"));
  const goals = readList(formData.get("goals"));
  if (!allergies) fields.allergies = "Die Allergien konnten nicht gelesen werden.";
  if (!intolerances) fields.intolerances = "Die Unverträglichkeiten konnten nicht gelesen werden.";
  if (!goals) fields.goals = "Die Ziele konnten nicht gelesen werden.";

  if (!parsed.success || Object.keys(fields).length > 0 || !allergies || !intolerances || !goals) {
    return { error: "Bitte prüfe die markierten Felder.", fields };
  }

  const id = String(formData.get("id") ?? "");
  const data = {
    ...parsed.data,
    heightCm: typeof height === "number" && !Number.isNaN(height) ? Math.round(height) : null,
    weightKg: typeof weight === "number" && !Number.isNaN(weight) ? weight : null,
    allergies: JSON.stringify(allergies),
    intolerances: JSON.stringify(intolerances),
    goals: JSON.stringify(goals),
  };

  if (id) {
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) return { error: "Dieser Kunde ist nicht mehr vorhanden." };
    await prisma.client.update({ where: { id }, data });
    refresh(id);
    redirect(`/kunden/${id}`);
  }

  const client = await prisma.client.create({
    data: {
      ...data,
      consent: {
        create: {
          token: randomBytes(24).toString("base64url"),
        },
      },
    },
  });
  refresh(client.id);
  redirect(`/kunden/${client.id}`);
}

export async function deleteClient(formData: FormData) {
  await requireSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.client.delete({ where: { id } }).catch(() => undefined);
  refresh(id);
  redirect("/kunden");
}
