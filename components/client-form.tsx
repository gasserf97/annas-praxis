"use client";

import { useActionState } from "react";
import Link from "next/link";
import { saveClient } from "@/app/actions/clients";
import { NativeSelect } from "@/components/native-select";
import { TagField } from "@/components/tag-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emptyFormState } from "@/lib/form-state";
import {
  ALLERGY_SUGGESTIONS,
  DIETS,
  GOAL_SUGGESTIONS,
  INTOLERANCE_SUGGESTIONS,
} from "@/lib/practice";

export type ClientFormValues = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  street: string;
  postalCode: string;
  city: string;
  heightCm: string;
  weightKg: string;
  diet: string;
  allergies: string[];
  intolerances: string[];
  goals: string[];
  goalNotes: string;
  medications: string;
  notes: string;
};

export const emptyClient: ClientFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  street: "",
  postalCode: "",
  city: "",
  heightCm: "",
  weightKg: "",
  diet: "",
  allergies: [],
  intolerances: [],
  goals: [],
  goalNotes: "",
  medications: "",
  notes: "",
};

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export function ClientForm({ values, cancelHref }: { values: ClientFormValues; cancelHref: string }) {
  const [state, action, pending] = useActionState(saveClient, emptyFormState);
  const fields = state.fields ?? {};

  return (
    <form action={action} className="grid gap-8">
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
      {state.error ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <section className="grid gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-heading text-xl">Person</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Vorname" name="firstName" error={fields.firstName}>
            <Input id="firstName" name="firstName" defaultValue={values.firstName} className="h-10 bg-background" required />
          </Field>
          <Field label="Nachname" name="lastName" error={fields.lastName}>
            <Input id="lastName" name="lastName" defaultValue={values.lastName} className="h-10 bg-background" required />
          </Field>
          <Field label="E-Mail" name="email" error={fields.email}>
            <Input id="email" name="email" type="email" defaultValue={values.email} className="h-10 bg-background" autoComplete="email" />
          </Field>
          <Field label="Telefon" name="phone" error={fields.phone}>
            <Input id="phone" name="phone" defaultValue={values.phone} className="h-10 bg-background" autoComplete="tel" />
          </Field>
          <Field label="Geburtsdatum" name="dateOfBirth" error={fields.dateOfBirth}>
            <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={values.dateOfBirth} className="h-10 bg-background" />
          </Field>
          <Field label="Ernährungsform" name="diet" error={fields.diet}>
            <NativeSelect id="diet" name="diet" defaultValue={values.diet}>
              <option value="">Keine Angabe</option>
              {DIETS.map((diet) => (
                <option key={diet} value={diet}>
                  {diet}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-heading text-xl">Adresse</h2>
        <Field label="Straße" name="street" error={fields.street}>
          <Input id="street" name="street" defaultValue={values.street} className="h-10 bg-background" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <Field label="PLZ" name="postalCode" error={fields.postalCode}>
            <Input id="postalCode" name="postalCode" defaultValue={values.postalCode} className="h-10 bg-background" />
          </Field>
          <Field label="Ort" name="city" error={fields.city}>
            <Input id="city" name="city" defaultValue={values.city} className="h-10 bg-background" />
          </Field>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-heading text-xl">Körper</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Größe in cm" name="heightCm" error={fields.heightCm}>
            <Input id="heightCm" name="heightCm" inputMode="numeric" defaultValue={values.heightCm} className="h-10 bg-background" />
          </Field>
          <Field label="Gewicht in kg" name="weightKg" error={fields.weightKg}>
            <Input id="weightKg" name="weightKg" inputMode="decimal" defaultValue={values.weightKg} className="h-10 bg-background" />
          </Field>
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-heading text-xl">Allergien, Unverträglichkeiten, Ziele</h2>
        <TagField
          name="allergies"
          label="Allergien"
          placeholder="Allergie eintragen"
          defaultTags={values.allergies}
          suggestions={ALLERGY_SUGGESTIONS}
          error={fields.allergies}
          tone="alert"
          hint="Echte Allergien, die in der Beratung immer sichtbar bleiben sollen."
        />
        <TagField
          name="intolerances"
          label="Unverträglichkeiten"
          placeholder="Unverträglichkeit eintragen"
          defaultTags={values.intolerances}
          suggestions={INTOLERANCE_SUGGESTIONS}
          error={fields.intolerances}
        />
        <TagField
          name="goals"
          label="Ziele"
          placeholder="Ziel eintragen"
          defaultTags={values.goals}
          suggestions={GOAL_SUGGESTIONS}
          error={fields.goals}
        />
        <Field label="Was soll sich verändern?" name="goalNotes" error={fields.goalNotes}>
          <Textarea id="goalNotes" name="goalNotes" defaultValue={values.goalNotes} className="min-h-28 bg-background" />
        </Field>
      </section>

      <section className="grid gap-4 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
        <h2 className="font-heading text-xl">Weiteres</h2>
        <Field label="Medikamente und Ergänzungen" name="medications" error={fields.medications}>
          <Textarea id="medications" name="medications" defaultValue={values.medications} className="min-h-24 bg-background" />
        </Field>
        <Field label="Notizen" name="notes" error={fields.notes}>
          <Textarea id="notes" name="notes" defaultValue={values.notes} className="min-h-28 bg-background" />
        </Field>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="lg" className="h-10 px-4" disabled={pending}>
          {pending ? "Wird gespeichert…" : values.id ? "Änderungen speichern" : "Kunde anlegen"}
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10 bg-card px-4" nativeButton={false} render={<Link href={cancelHref} />}>
          Abbrechen
        </Button>
      </div>
    </form>
  );
}
