"use client";

import { useActionState, useState } from "react";
import { saveSession, deleteSession } from "@/app/actions/sessions";
import { NativeSelect } from "@/components/native-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { emptyFormState } from "@/lib/form-state";
import { SESSION_KINDS } from "@/lib/practice";
import { todayKey } from "@/lib/dates";

export type SessionItem = {
  id: string;
  dateKey: string;
  dateLabel: string;
  title: string;
  kind: string;
  comment: string;
};

function SessionFields({
  clientId,
  session,
  defaults,
}: {
  clientId: string;
  session?: SessionItem;
  defaults?: { date?: string; title?: string; kind?: string };
}) {
  const [state, action, pending] = useActionState(saveSession, emptyFormState);
  const fields = state.fields ?? {};
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="clientId" value={clientId} />
      {session ? <input type="hidden" name="id" value={session.id} /> : null}
      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor={session ? `date-${session.id}` : "session-date"}>Datum</Label>
          <Input
            id={session ? `date-${session.id}` : "session-date"}
            name="date"
            type="date"
            required
            defaultValue={session?.dateKey || defaults?.date || todayKey()}
            className="h-10 bg-background"
          />
          {fields.date ? <p className="text-sm text-destructive">{fields.date}</p> : null}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={session ? `kind-${session.id}` : "session-kind"}>Art</Label>
          <NativeSelect
            id={session ? `kind-${session.id}` : "session-kind"}
            name="kind"
            defaultValue={session?.kind || defaults?.kind || "Folgetermin"}
          >
            {SESSION_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {kind}
              </option>
            ))}
          </NativeSelect>
          {fields.kind ? <p className="text-sm text-destructive">{fields.kind}</p> : null}
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={session ? `title-${session.id}` : "session-title"}>Titel</Label>
        <Input
          id={session ? `title-${session.id}` : "session-title"}
          name="title"
          required
          defaultValue={session?.title || defaults?.title || ""}
          placeholder="Worum ging es?"
          className="h-10 bg-background"
        />
        {fields.title ? <p className="text-sm text-destructive">{fields.title}</p> : null}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={session ? `comment-${session.id}` : "session-comment"}>Kommentar</Label>
        <Textarea
          id={session ? `comment-${session.id}` : "session-comment"}
          name="comment"
          defaultValue={session?.comment || ""}
          placeholder="Was habt ihr besprochen, was ändert sich bis zum nächsten Mal?"
          className="min-h-32 bg-background"
        />
        {fields.comment ? <p className="text-sm text-destructive">{fields.comment}</p> : null}
      </div>
      <DialogFooter className="mt-2">
        <Button type="submit" className="h-10" disabled={pending}>
          {pending ? "Wird gespeichert…" : "Sitzung speichern"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function NewSessionDialog({
  clientId,
  defaults,
}: {
  clientId: string;
  defaults?: { date?: string; title?: string; kind?: string };
}) {
  const [open, setOpen] = useState(Boolean(defaults?.date));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" className="h-10" onClick={() => setOpen(true)}>
        Sitzung hinzufügen
      </Button>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Neue Sitzung</DialogTitle>
          <DialogDescription>Der Kommentar bleibt in der Kachel und lässt sich später aufklappen.</DialogDescription>
        </DialogHeader>
        <SessionFields clientId={clientId} defaults={defaults} />
      </DialogContent>
    </Dialog>
  );
}

export function SessionActions({ clientId, session }: { clientId: string; session: SessionItem }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Button type="button" variant="outline" className="bg-background" onClick={() => setEditOpen(true)}>
        Bearbeiten
      </Button>
      <Button type="button" variant="ghost" onClick={() => setDeleteOpen(true)}>
        Löschen
      </Button>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Sitzung bearbeiten</DialogTitle>
            <DialogDescription>{session.dateLabel}</DialogDescription>
          </DialogHeader>
          <SessionFields clientId={clientId} session={session} />
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sitzung löschen?</DialogTitle>
            <DialogDescription>„{session.title}“ wird aus dem Verlauf entfernt.</DialogDescription>
          </DialogHeader>
          <form action={deleteSession}>
            <input type="hidden" name="id" value={session.id} />
            <input type="hidden" name="clientId" value={clientId} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
                Behalten
              </Button>
              <Button type="submit" variant="destructive">
                Löschen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
