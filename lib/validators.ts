import { z } from "zod";
import { DIETS, DURATIONS, LOCATIONS, SESSION_KINDS } from "@/lib/practice";

const text = (max: number) =>
  z.string().trim().max(max, { error: `Bitte höchstens ${max} Zeichen.` });

export const clientSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { error: "Bitte einen Vornamen angeben." })
    .max(80, { error: "Der Vorname ist zu lang." }),
  lastName: z
    .string()
    .trim()
    .min(1, { error: "Bitte einen Nachnamen angeben." })
    .max(80, { error: "Der Nachname ist zu lang." }),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((value) => value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      error: "Bitte eine gültige E-Mail angeben.",
    }),
  phone: text(40),
  dateOfBirth: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value), {
      error: "Bitte ein gültiges Geburtsdatum angeben.",
    }),
  street: text(120),
  postalCode: text(12),
  city: text(80),
  diet: z.string().trim().refine((value) => value === "" || (DIETS as readonly string[]).includes(value), {
    error: "Bitte eine Ernährungsform aus der Liste wählen.",
  }),
  goalNotes: text(2000),
  medications: text(2000),
  notes: text(4000),
});

export const sessionSchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Bitte ein Datum wählen." }),
  title: z
    .string()
    .trim()
    .min(2, { error: "Bitte einen kurzen Titel angeben." })
    .max(120, { error: "Der Titel ist zu lang." }),
  kind: z.enum(SESSION_KINDS, { error: "Bitte eine Art der Sitzung wählen." }),
  comment: text(4000),
});

export const appointmentSchema = z.object({
  clientId: z.string().trim().min(1, { error: "Bitte einen Kunden wählen." }),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Bitte ein Datum wählen." }),
  time: z.string().trim().regex(/^\d{2}:\d{2}$/, { error: "Bitte eine Uhrzeit wählen." }),
  duration: z.coerce
    .number()
    .refine((value) => (DURATIONS as readonly number[]).includes(value), {
      error: "Bitte eine Dauer wählen.",
    }),
  title: text(120),
  location: z.enum(LOCATIONS, { error: "Bitte einen Ort wählen." }),
  notes: text(2000),
});

export const consentSchema = z.object({
  signerName: z
    .string()
    .trim()
    .min(2, { error: "Bitte den vollen Namen eintragen." })
    .max(120, { error: "Der Name ist zu lang." }),
  accepted: z.literal("ja", { error: "Bitte die Einwilligung ankreuzen." }),
  signature: z
    .string()
    .trim()
    .min(100, { error: "Bitte im Feld unterschreiben." })
    .refine((value) => value.startsWith("data:image/png"), {
      error: "Die Unterschrift konnte nicht gelesen werden.",
    }),
});
