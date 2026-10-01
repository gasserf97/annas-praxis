import Link from "next/link";
import { Mark } from "@/components/mark";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
      <Mark />
      <h1 className="mt-8 font-heading text-4xl">Diese Seite gibt es nicht</h1>
      <p className="mt-3 text-muted-foreground">Der Link führt ins Leere. Zurück zur Praxis oder zur Anmeldung.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">
          Zur Übersicht
        </Link>
        <Link href="/anmelden" className="rounded-lg bg-card px-4 py-2 text-sm ring-1 ring-foreground/10">
          Anmelden
        </Link>
      </div>
    </main>
  );
}
