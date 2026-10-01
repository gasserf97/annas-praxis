import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { colorFor } from "@/lib/colors";
import { formatLongDate, formatTime } from "@/lib/dates";
import { parseList } from "@/lib/lists";
import { prisma } from "@/lib/prisma";
import { fullName, initials } from "@/lib/practice";

export const metadata = { title: "Kunden" };

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLocaleLowerCase("de");
  const clients = await prisma.client.findMany({
    include: {
      consent: true,
      appointments: {
        where: { endsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
        take: 1,
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
  const filtered = query
    ? clients.filter((client) => {
        const haystack = [
          fullName(client),
          client.email,
          client.city,
          client.diet,
          ...parseList(client.allergies),
          ...parseList(client.goals),
        ]
          .join(" ")
          .toLocaleLowerCase("de");
        return haystack.includes(query);
      })
    : clients;

  return (
    <div>
      <PageHeader
        eyebrow="Kartei"
        title="Kunden"
        description="Stammdaten, Allergien und Ziele. Die Einwilligung hängt an jedem Datensatz."
        action={
          <Button nativeButton={false} className="h-10" render={<Link href="/kunden/neu" />}>
            Neuer Kunde
          </Button>
        }
      />

      <form action="/kunden" className="mb-5 flex flex-col gap-2 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Name, Ort, Allergie oder Ziel"
          aria-label="Kunden suchen"
          className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <Button type="submit" variant="outline" className="h-10 bg-card">
          Suchen
        </Button>
        {q ? (
          <Button nativeButton={false} variant="ghost" className="h-10" render={<Link href="/kunden" />}>
            Zurücksetzen
          </Button>
        ) : null}
      </form>

      {clients.length === 0 ? (
        <EmptyState
          title="Noch keine Kunden"
          text="Leg die erste Person an. Danach kannst du den Datenschutzlink schicken und Termine setzen."
          action={
            <Button nativeButton={false} render={<Link href="/kunden/neu" />}>
              Kunde anlegen
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState title="Nichts gefunden" text={`Kein Kunde passt zu „${q.trim()}“.`} />
      ) : (
        <ul className="grid gap-3">
          {filtered.map((client) => {
            const color = colorFor(client.id);
            const allergies = parseList(client.allergies);
            const next = client.appointments[0];
            const signed = client.consent?.status === "signed";
            return (
              <li key={client.id}>
                <Link
                  href={`/kunden/${client.id}`}
                  className="flex gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10 hover:ring-primary/40"
                >
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-medium"
                    style={{ background: color.background, color: color.color }}
                  >
                    {initials(client)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{fullName(client)}</span>
                      {signed ? <Badge>Unterschrieben</Badge> : <Badge variant="outline">Einwilligung offen</Badge>}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {[client.city, client.diet, allergies.slice(0, 2).join(", ")].filter(Boolean).join(" · ") || "Noch wenige Angaben"}
                    </span>
                    {next ? (
                      <span className="mt-1 block text-sm">
                        Nächster Termin: {formatLongDate(next.startsAt)}, {formatTime(next.startsAt)}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
