import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { addDays, berlinToUtc, formatLongDate, formatTime, greeting, startOfWeekKey, todayKey } from "@/lib/dates";
import { requestOrigin } from "@/lib/origin";
import { fullName, PRACTICE } from "@/lib/practice";

export const metadata = { title: "Übersicht" };

export default async function DashboardPage() {
  const now = new Date();
  const today = todayKey(now);
  const weekStart = berlinToUtc(startOfWeekKey(today), "00:00");
  const weekEnd = berlinToUtc(addDays(startOfWeekKey(today), 7), "00:00");
  const origin = await requestOrigin();

  const [clientCount, pending, weekCount, upcoming, recent] = await Promise.all([
    prisma.client.count(),
    prisma.consent.findMany({
      where: { status: "pending" },
      include: { client: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.appointment.count({ where: { startsAt: { gte: weekStart, lt: weekEnd } } }),
    prisma.appointment.findMany({
      where: { endsAt: { gte: now } },
      include: { client: true },
      orderBy: { startsAt: "asc" },
      take: 5,
    }),
    prisma.session.findMany({
      include: { client: true },
      orderBy: { date: "desc" },
      take: 4,
    }),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow={formatLongDate(now)}
        title={`${greeting(now)}, ${PRACTICE.practitioner}`}
        description="Was heute ansteht, wem die Einwilligung noch fehlt, und was in den letzten Sitzungen besprochen wurde."
        action={
          <Button nativeButton={false} className="h-10" render={<Link href="/kunden/neu" />}>
            Neuer Kunde
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Kunden</CardDescription>
            <CardTitle className="font-heading text-4xl">{clientCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Einwilligungen offen</CardDescription>
            <CardTitle className="font-heading text-4xl">{pending.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Termine diese Woche</CardDescription>
            <CardTitle className="font-heading text-4xl">{weekCount}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Nächste Termine</CardTitle>
            <CardDescription>Die kommenden Gespräche aus dem Kalender.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Kein Termin steht an.{" "}
                <Link href="/kalender" className="font-medium text-primary underline-offset-4 hover:underline">
                  Kalender öffnen
                </Link>
              </p>
            ) : (
              upcoming.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/kalender?woche=${todayKey(appointment.startsAt)}`}
                  className="flex items-center justify-between gap-3 rounded-xl bg-muted/60 px-3 py-3 hover:bg-muted"
                >
                  <span>
                    <span className="block font-medium">{fullName(appointment.client)}</span>
                    <span className="text-sm text-muted-foreground">
                      {appointment.title !== fullName(appointment.client) ? `${appointment.title} · ` : ""}
                      {appointment.location}
                    </span>
                  </span>
                  <span className="text-right text-sm">
                    <span className="block">{formatLongDate(appointment.startsAt)}</span>
                    <span className="text-muted-foreground">{formatTime(appointment.startsAt)}</span>
                  </span>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Offene Einwilligungen</CardTitle>
            <CardDescription>Diese Personen haben den Datenschutz noch nicht unterschrieben.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {pending.length === 0 ? (
              <p className="text-sm text-muted-foreground">Alle vorliegenden Einwilligungen sind unterschrieben.</p>
            ) : (
              pending.map((consent) => (
                <div key={consent.id} className="rounded-xl bg-accent/70 px-3 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/kunden/${consent.clientId}`} className="font-medium hover:underline">
                      {fullName(consent.client)}
                    </Link>
                    <Badge variant="outline">Ausstehend</Badge>
                  </div>
                  <div className="mt-3">
                    <CopyButton value={`${origin}/einwilligung/${consent.token}`} />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Letzte Sitzungen</CardTitle>
          <CardDescription>Die jüngsten Kommentare aus den Kundenverläufen.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sobald du eine Sitzung festhältst, erscheint sie hier.</p>
          ) : (
            recent.map((session) => (
              <Link key={session.id} href={`/kunden/${session.clientId}`} className="rounded-xl px-1 py-2 hover:bg-muted">
                <span className="text-sm text-muted-foreground">
                  {formatLongDate(session.date)} · {session.kind}
                </span>
                <span className="mt-0.5 block font-medium">
                  {fullName(session.client)} · {session.title}
                </span>
                <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
                  {session.comment || "Noch kein Kommentar."}
                </span>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
