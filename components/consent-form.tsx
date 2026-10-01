"use client";

import { useActionState } from "react";
import { signConsent } from "@/app/actions/consent";
import { SignaturePad } from "@/components/signature-pad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emptyFormState } from "@/lib/form-state";

export function ConsentForm({ token, signerName }: { token: string; signerName: string }) {
  const [state, action, pending] = useActionState(signConsent, emptyFormState);
  const fields = state.fields ?? {};

  return (
    <form action={action} className="grid gap-5">
      <input type="hidden" name="token" value={token} />
      {state.error ? (
        <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <label className="flex items-start gap-3 rounded-xl bg-secondary/70 px-4 py-3 text-sm leading-6">
        <input name="accepted" value="ja" type="checkbox" className="mt-1 size-4 accent-[oklch(0.42_0.062_162)]" required />
        <span>Ich habe die Hinweise gelesen und willige in die Verarbeitung meiner Daten für die Ernährungsberatung ein.</span>
      </label>
      {fields.accepted ? <p className="text-sm text-destructive">{fields.accepted}</p> : null}
      <div className="grid gap-1.5">
        <Label htmlFor="signerName">Voller Name</Label>
        <Input id="signerName" name="signerName" defaultValue={signerName} required className="h-10 bg-white" />
        {fields.signerName ? <p className="text-sm text-destructive">{fields.signerName}</p> : null}
      </div>
      <div className="grid gap-1.5">
        <Label>Unterschrift</Label>
        <SignaturePad />
        {fields.signature ? <p className="text-sm text-destructive">{fields.signature}</p> : null}
      </div>
      <Button type="submit" size="lg" className="h-11" disabled={pending}>
        {pending ? "Wird gespeichert…" : "Verbindlich unterschreiben"}
      </Button>
    </form>
  );
}
