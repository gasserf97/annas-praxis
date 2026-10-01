"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emptyFormState } from "@/lib/form-state";

export function LoginForm({ nextPath, showHint }: { nextPath: string; showHint: boolean }) {
  const [state, action, pending] = useActionState(login, emptyFormState);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={nextPath} />
      <div className="grid gap-1.5">
        <Label htmlFor="password">Passwort</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-11 bg-background"
        />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      {showHint ? (
        <p className="rounded-xl bg-secondary px-3 py-2 text-sm text-secondary-foreground">
          Lokale Demo: Das Passwort ist <span className="font-medium">praxis</span>.
        </p>
      ) : null}
      <Button type="submit" size="lg" className="h-11" disabled={pending}>
        {pending ? "Wird geprüft…" : "In die Praxis"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Kundinnen und Kunden kommen hier nicht hinein. Sie unterschreiben über ihren eigenen Link.
      </p>
    </form>
  );
}

export function LoginScreen({ nextPath, showHint }: { nextPath: string; showHint: boolean }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Mark className="text-primary-foreground [&_span]:text-primary-foreground" />
        <div>
          <p className="font-heading text-5xl leading-tight font-medium text-balance">
            Die Akte, die Unterschrift und der nächste Termin an einem Ort.
          </p>
          <ul className="mt-8 grid gap-3 text-sm text-primary-foreground/90">
            <li>Kunden mit Allergien, Zielen und Gesprächsnotizen</li>
            <li>Datenschutz, den die Kunden selbst unterschreiben</li>
            <li>Kalender nur mit den eigenen Kunden</li>
          </ul>
        </div>
        <p className="text-sm text-primary-foreground/75">Ernährungsberatung · Köln</p>
      </section>
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Mark />
          </div>
          <h1 className="font-heading text-4xl font-medium">Anmelden</h1>
          <p className="mt-2 mb-8 text-muted-foreground">Nur für Anna und die Praxis.</p>
          <LoginForm nextPath={nextPath} showHint={showHint} />
        </div>
      </section>
    </main>
  );
}
