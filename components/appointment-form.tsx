"use client";

import { useActionState } from "react";
import Link from "next/link";
import { deleteAppointment, saveAppointment } from "@/app/actions/appointments";
import { NativeSelect } from "@/components/native-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { berlinClock } from "@/lib/dates";
import { emptyFormState } from "@/lib/form-state";
import { DURATIONS, LOCATIONS } from "@/lib/practice";

export type AppointmentItem = {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  notes: string;
  location: string;
  startsAt: string;
  endsAt: string;
};

export type ClientOption = { id: string; name: string };

export type AppointmentDraft =
  | { mode: "create"; date: string; time: string; clientId?: string }
  | { mode: "edit"; appointment: AppointmentItem };

function durationMinutes(appointment: AppointmentItem) {
  const minutes = Math.round(
    (new Date(appointment.endsAt).getTime() - new Date(appointment.startsAt).getTime()) / 60000,
  );
  return (DURATIONS as readonly number[]).includes(minutes) ? minutes : 60;
}

export function AppointmentForm({
  draft,
  clients,
  weekKey,
}: {
  draft: AppointmentDraft;
  clients: ClientOption[];
  weekKey: string;
}) {
  const [state, action, pending] = useActionState(saveAppointment, emptyFormState);
  const fields = state.fields ?? {};
  const editing = draft.mode === "edit" ? draft.appointment : null;
  const clock = editing ? berlinClock(new Date(editing.startsAt)) : null;
  const date = draft.mode === "edit" ? clock?.dateKey ?? "" : draft.date;
  const time =
    draft.mode === "edit"
      ? `${String(clock?.hour ?? 9).padStart(2, "0")}:${String(clock?.minute ?? 0).padStart(2, "0")}`
      : draft.time;
  const clientId = draft.mode === "edit" ? draft.appointment.clientId : draft.clientId ?? "";

  if (clients.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Lege zuerst einen Kunden an, danach kannst du ihn einplanen.{" "}
        <Link href="/kunden/neu" className="font-medium text-primary underline-offset-4 hover:underline">
          Kunde anlegen
        </Link>
      </p>
    );
  }

  return (
    <div className="grid gap-4">
      <form action={action} className="grid gap-3">
        {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
        {state.error ? (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
            {state.error}
          </p>
        ) : null}
        <div className="grid gap-1.5">
          <Label htmlFor="appointment-client">Kunde</Label>
          <NativeSelect id="appointment-client" name="clientId" defaultValue={clientId} required>
            <option value="">Bitte wählen</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </NativeSelect>
          {fields.clientId ? <p className="text-sm text-destructive">{fields.clientId}</p> : null}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label htmlFor="appointment-date">Datum</Label>
            <Input id="appointment-date" name="date" type="date" required defaultValue={date} className="h-10 bg-background" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="appointment-time">Beginn</Label>
            <Input id="appointment-time" name="time" type="time" required step={900} defaultValue={time} className="h-10 bg-background" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="appointment-duration">Dauer</Label>
            <NativeSelect id="appointment-duration" name="duration" defaultValue={String(editing ? durationMinutes(editing) : 60)}>
              {DURATIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} Minuten
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="appointment-title">Titel</Label>
            <Input
              id="appointment-title"
              name="title"
              defaultValue={editing?.title ?? ""}
              placeholder="Leer lassen für den Namen"
              className="h-10 bg-background"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="appointment-location">Ort</Label>
            <NativeSelect id="appointment-location" name="location" defaultValue={editing?.location ?? "Praxis"}>
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="appointment-notes">Notiz</Label>
          <Textarea id="appointment-notes" name="notes" defaultValue={editing?.notes ?? ""} className="min-h-20 bg-background" />
        </div>
        <DialogFooter>
          <Button type="submit" className="h-10" disabled={pending}>
            {pending ? "Wird gespeichert…" : editing ? "Termin speichern" : "Termin anlegen"}
          </Button>
        </DialogFooter>
      </form>
      {editing ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
          <Link
            href={`/kunden/${editing.clientId}?sitzung=1&datum=${date}&titel=${encodeURIComponent(editing.title)}`}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Als Sitzung notieren
          </Link>
          <form action={deleteAppointment}>
            <input type="hidden" name="id" value={editing.id} />
            <input type="hidden" name="woche" value={weekKey} />
            <Button type="submit" variant="destructive">
              Termin löschen
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
