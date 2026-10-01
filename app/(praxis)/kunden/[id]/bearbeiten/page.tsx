import { notFound } from "next/navigation";
import { ClientForm, type ClientFormValues } from "@/components/client-form";
import { DeleteClientButton } from "@/components/delete-client";
import { PageHeader } from "@/components/page-header";
import { formatNumber } from "@/lib/dates";
import { parseList } from "@/lib/lists";
import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/practice";

export const metadata = { title: "Kunde bearbeiten" };

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  const values: ClientFormValues = {
    id: client.id,
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email,
    phone: client.phone,
    dateOfBirth: client.dateOfBirth,
    street: client.street,
    postalCode: client.postalCode,
    city: client.city,
    heightCm: client.heightCm ? String(client.heightCm) : "",
    weightKg: client.weightKg ? formatNumber(client.weightKg) : "",
    diet: client.diet,
    allergies: parseList(client.allergies),
    intolerances: parseList(client.intolerances),
    goals: parseList(client.goals),
    goalNotes: client.goalNotes,
    medications: client.medications,
    notes: client.notes,
  };

  return (
    <div>
      <PageHeader
        eyebrow="Kartei"
        title={`${fullName(client)} bearbeiten`}
        description="Änderungen gelten sofort für Kalender, Sitzungen und den Datenschutzlink."
      />
      <ClientForm values={values} cancelHref={`/kunden/${client.id}`} />
      <div className="mt-10 rounded-2xl border border-dashed border-destructive/40 p-5">
        <h2 className="font-heading text-xl">Kunde entfernen</h2>
        <p className="mt-2 mb-4 max-w-xl text-sm text-muted-foreground">
          Damit verschwinden auch Sitzungen, Termine und die Einwilligung.
        </p>
        <DeleteClientButton id={client.id} name={fullName(client)} />
      </div>
    </div>
  );
}
