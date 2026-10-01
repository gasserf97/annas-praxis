"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-heading text-3xl">Die Seite konnte nicht geladen werden</h1>
      <p className="mt-3 text-muted-foreground">
        Versuch es noch einmal. Wenn es so bleibt, prüfe die Datenbankverbindung.
      </p>
      <Button type="button" className="mt-6 h-10" onClick={() => reset()}>
        Erneut versuchen
      </Button>
    </div>
  );
}
