import Link from "next/link";
import { Mark } from "@/components/mark";

export default function PraxisNotFound() {
  return (
    <div className="mx-auto max-w-lg py-16">
      <Mark />
      <h1 className="mt-6 font-heading text-4xl">Das gibt es hier nicht</h1>
      <p className="mt-3 text-muted-foreground">Der Kunde oder die Seite ist nicht vorhanden.</p>
      <Link href="/kunden" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">
        Zu den Kunden
      </Link>
    </div>
  );
}
