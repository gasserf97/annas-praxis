import { ClientForm, emptyClient } from "@/components/client-form";
import { PageHeader } from "@/components/page-header";

export const metadata = { title: "Neuer Kunde" };

export default function NewClientPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Kartei"
        title="Neuen Kunden anlegen"
        description="Name und Kontakt reichen für den Start. Allergien und Ziele kannst du gleich oder später ergänzen. Der Link zur Datenschutz-Unterschrift entsteht automatisch."
      />
      <ClientForm values={emptyClient} cancelHref="/kunden" />
    </div>
  );
}
