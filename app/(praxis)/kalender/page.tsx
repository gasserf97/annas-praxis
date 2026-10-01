import { WeekCalendar, type AppointmentItem } from "@/components/week-calendar";
import { PageHeader } from "@/components/page-header";
import { formatWeekRange, isDateKey, startOfWeekKey, todayKey } from "@/lib/dates";
import { berlinToUtc, addDays } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/practice";

export const metadata = { title: "Kalender" };

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ woche?: string; kunde?: string }>;
}) {
  const params = await searchParams;
  const anchor = params.woche && isDateKey(params.woche) ? params.woche : todayKey();
  const weekStartKey = startOfWeekKey(anchor);
  const rangeStart = berlinToUtc(weekStartKey, "00:00");
  const rangeEnd = berlinToUtc(addDays(weekStartKey, 7), "00:00");

  const [appointments, clients] = await Promise.all([
    prisma.appointment.findMany({
      where: { startsAt: { gte: rangeStart, lt: rangeEnd } },
      include: { client: true },
      orderBy: { startsAt: "asc" },
    }),
    prisma.client.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] }),
  ]);

  const items: AppointmentItem[] = appointments.map((appointment) => ({
    id: appointment.id,
    clientId: appointment.clientId,
    clientName: fullName(appointment.client),
    title: appointment.title,
    notes: appointment.notes,
    location: appointment.location,
    startsAt: appointment.startsAt.toISOString(),
    endsAt: appointment.endsAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        eyebrow="Planung"
        title="Kalender"
        description={`${formatWeekRange(weekStartKey)}. Klicke in ein Zeitfenster, um einen Kunden einzuplanen.`}
      />
      <WeekCalendar
        weekStartKey={weekStartKey}
        today={todayKey()}
        appointments={items}
        clients={clients.map((client) => ({ id: client.id, name: fullName(client) }))}
        initialClientId={params.kunde}
      />
    </div>
  );
}
