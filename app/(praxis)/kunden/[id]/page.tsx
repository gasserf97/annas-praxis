import Link from "next/link";
import { notFound } from "next/navigation";
import { renewConsent } from "@/app/actions/consent";
import { CopyButton } from "@/components/copy-button";
import { SessionList } from "@/components/session-list";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ageFromDob, dateKeyInBerlin, formatLongDate, formatNumber, formatTime, todayKey } from "@/lib/dates";
import { parseList } from "@/lib/lists";
import { requestOrigin } from "@/lib/origin";
import { prisma } from "@/lib/prisma";
import { fullName, PRACTICE } from "@/lib/practice";

export const metadata = { title: "Kunde" };

function ChipList({ items, tone = "neutral" }: { items: string[]; tone?: "neutral" | "alert" }) {
  if (items.length === 0) return <p className="text-sm text-muted-foreground">Nichts hinterlegt.</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={
            tone === "alert"
              ? "rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
              : "rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
          }
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 text-sm">{value || "Nicht hinterlegt"}</dd>
    </div>
  );
}

export default async function ClientPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sitzung?: string; datum?: string; titel?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      consent: true,
      sessions: { orderBy: { date: "desc" } },
      appointments: { where: { endsAt: { gte: new Date() } }, orderBy: { startsAt: "asc" }, take: 3 },
    },
  });
  if (!client || !client.consent) notFound();

  const origin = await requestOrigin();
  const link = `${origin}/einwilligung/${client.consent.token}`;
  const signed = client.consent.status === "signed";
  const age = ageFromDob(client.dateOfBirth, todayKey());
  const address = [client.street, [client.postalCode, client.city].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  return (
    <div>
      <PageHeader
        eyebrow="Kunde"
        title={fullName(client)}
        description={[age !== null ? `${age} Jahre` : "", client.city, client.diet].filter(Boolean).join(" · ") || "Akte ohne weitere Stammdaten"}
        action={
          <>
            <Button nativeButton={false} variant="outline" className="h-10 bg-card" render={<Link href={`/kalender?kunde=${client.id}`} />}>
              Einplanen
            </Button>
            <Button nativeButton={false} className="h-10" render={<Link href={`/kunden/${client.id}/bearbeiten`} />}>
              Bearbeiten
            </Button>
          </>
        }
      />

      {!signed ? (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-accent px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">Die Datenschutz-Einwilligung ist noch nicht unterschrieben. Schick {client.firstName} den Link.</p>
          <CopyButton value={link} />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Stammdaten</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <Fact label="E-Mail" value={client.email} />
                <Fact label="Telefon" value={client.phone} />
                <Fact label="Geburtsdatum" value={client.dateOfBirth ? new Intl.DateTimeFormat("de-DE").format(new Date(`${client.dateOfBirth}T12:00:00`)) : ""} />
                <Fact label="Adresse" value={address} />
                <Fact label="Größe" value={client.heightCm ? `${client.heightCm} cm` : ""} />
                <Fact label="Gewicht" value={client.weightKg ? `${formatNumber(client.weightKg)} kg` : ""} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allergien und Unverträglichkeiten</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <p className="mb-2 text-sm font-medium">Allergien</p>
                <ChipList items={parseList(client.allergies)} tone="alert" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Unverträglichkeiten</p>
                <ChipList items={parseList(client.intolerances)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ziele</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ChipList items={parseList(client.goals)} />
              <p className="text-sm whitespace-pre-wrap">{client.goalNotes || "Kein Freitext zum Ziel."}</p>
            </CardContent>
          </Card>

          <SessionList
            clientId={client.id}
            sessions={client.sessions.map((session) => ({
              id: session.id,
              dateKey: dateKeyInBerlin(session.date),
              dateLabel: formatLongDate(session.date),
              title: session.title,
              kind: session.kind,
              comment: session.comment,
            }))}
            createDefaults={
              query.sitzung
                ? {
                    date: query.datum,
                    title: query.titel,
                    kind: "Folgetermin",
                  }
                : undefined
            }
          />
        </div>

        <div className="grid content-start gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Datenschutz</CardTitle>
              <CardDescription>
                {signed ? "Unterschrieben und in der Akte abgelegt." : "Der persönliche Link führt auf das Dokument."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {signed ? <Badge>Unterschrieben</Badge> : <Badge variant="outline">Ausstehend</Badge>}
              {signed && client.consent.signedAt ? (
                <p className="text-sm">
                  {client.consent.signerName} am {formatLongDate(client.consent.signedAt)}, {formatTime(client.consent.signedAt)}. Dokumentversion {client.consent.documentVersion}.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground break-all">{link}</p>
              )}
              {client.consent.signatureData ? (
                <div className="rounded-xl bg-white p-3 ring-1 ring-foreground/10">
                  {/* Data-URLs are not a fit for next/image. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={client.consent.signatureData} alt={`Unterschrift von ${client.consent.signerName}`} className="max-h-28 w-full object-contain" />
                </div>
              ) : null}
              <CopyButton value={link} label={signed ? "Link zur Bestätigung" : "Link kopieren"} />
              <form action={renewConsent}>
                <input type="hidden" name="clientId" value={client.id} />
                <Button type="submit" variant="outline" className="w-full bg-background">
                  {signed ? "Unterschrift widerrufen und neu anfordern" : "Link erneuern"}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Der Text ist eine Vorlage für {PRACTICE.name}, keine Rechtsberatung. Ein neuer Link macht den alten ungültig.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nächste Termine</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {client.appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nichts geplant.</p>
              ) : (
                client.appointments.map((appointment) => (
                  <Link key={appointment.id} href={`/kalender?woche=${dateKeyInBerlin(appointment.startsAt)}`} className="text-sm hover:underline">
                    {formatLongDate(appointment.startsAt)}, {formatTime(appointment.startsAt)} · {appointment.location}
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medikamente und Notizen</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm whitespace-pre-wrap">
              <p>{client.medications || "Keine Medikamente hinterlegt."}</p>
              <p className="text-muted-foreground">{client.notes || "Keine Notizen."}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
