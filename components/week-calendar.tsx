"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppointmentForm, type AppointmentDraft, type AppointmentItem, type ClientOption } from "@/components/appointment-form";

export type { AppointmentItem };
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { colorFor } from "@/lib/colors";
import { addDays, berlinClock, formatTime, formatWeekdayShort } from "@/lib/dates";
import { cn } from "cn";

const START_HOUR = 8;
const END_HOUR = 20;
const ROW = 52;

function minutesFromStart(iso: string) {
  const clock = berlinClock(new Date(iso));
  return (clock.hour - START_HOUR) * 60 + clock.minute;
}

export function WeekCalendar({
  weekStartKey,
  today,
  appointments,
  clients,
  initialClientId,
}: {
  weekStartKey: string;
  today: string;
  appointments: AppointmentItem[];
  clients: ClientOption[];
  initialClientId?: string;
}) {
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const key = addDays(weekStartKey, index);
        return { key, label: formatWeekdayShort(key), number: key.slice(8, 10) };
      }),
    [weekStartKey],
  );
  const [selected, setSelected] = useState(days.some((day) => day.key === today) ? today : weekStartKey);
  const [draft, setDraft] = useState<AppointmentDraft | null>(() => {
    if (initialClientId && clients.some((client) => client.id === initialClientId)) {
      return { mode: "create", date: today, time: "09:00", clientId: initialClientId };
    }
    return null;
  });
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setNow(new Date()), 0);
    const interval = window.setInterval(() => setNow(new Date()), 60000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, []);

  const byDay = new Map<string, AppointmentItem[]>();
  for (const appointment of appointments) {
    const key = berlinClock(new Date(appointment.startsAt)).dateKey;
    const list = byDay.get(key) ?? [];
    list.push(appointment);
    byDay.set(key, list);
  }

  const selectedItems = (byDay.get(selected) ?? []).slice().sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const nowClock = now ? berlinClock(now) : null;
  const showNow = nowClock && days.some((day) => day.key === nowClock.dateKey);
  const nowTop = nowClock ? ((nowClock.hour + nowClock.minute / 60 - START_HOUR) * ROW) : 0;

  function openCreate(date: string, time: string) {
    setDraft({ mode: "create", date, time, clientId: initialClientId });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button nativeButton={false} variant="outline" className="bg-card" render={<Link href={`/kalender?woche=${addDays(weekStartKey, -7)}`} />}>
            Zurück
          </Button>
          <Button nativeButton={false} variant="outline" className="bg-card" render={<Link href="/kalender" />}>
            Heute
          </Button>
          <Button nativeButton={false} variant="outline" className="bg-card" render={<Link href={`/kalender?woche=${addDays(weekStartKey, 7)}`} />}>
            Weiter
          </Button>
        </div>
        <Button type="button" className="h-10" onClick={() => openCreate(selected, "09:00")}>
          Termin anlegen
        </Button>
      </div>

      <div className="md:hidden">
        <div className="flex gap-2 overflow-x-auto pb-3">
          {days.map((day) => (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelected(day.key)}
              className={cn(
                "min-w-16 rounded-2xl px-3 py-2 text-center",
                selected === day.key ? "bg-primary text-primary-foreground" : "bg-card ring-1 ring-foreground/10",
              )}
            >
              <span className="block text-xs">{day.label}</span>
              <span className="font-heading text-lg">{day.number}</span>
            </button>
          ))}
        </div>
        {selectedItems.length === 0 ? (
          <p className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            Keine Termine an diesem Tag. Leg einen an oder tippe in der Wochenansicht in ein Zeitfenster.
          </p>
        ) : (
          <ul className="grid gap-2">
            {selectedItems.map((appointment) => {
              const color = colorFor(appointment.clientId);
              return (
                <li key={appointment.id}>
                  <button
                    type="button"
                    onClick={() => setDraft({ mode: "edit", appointment })}
                    className="w-full rounded-2xl px-4 py-3 text-left ring-1"
                    style={{ background: color.background, color: color.color, borderColor: color.border }}
                  >
                    <span className="block text-xs">
                      {formatTime(new Date(appointment.startsAt))}–{formatTime(new Date(appointment.endsAt))} · {appointment.location}
                    </span>
                    <span className="mt-1 block font-medium">{appointment.clientName}</span>
                    {appointment.title !== appointment.clientName ? (
                      <span className="block text-sm">{appointment.title}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10 md:block">
        <div className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))] border-b">
          <div />
          {days.map((day) => (
            <div key={day.key} className={cn("px-2 py-3 text-center", day.key === today && "bg-secondary/70")}>
              <div className="text-xs text-muted-foreground">{day.label}</div>
              <div className={cn("mx-auto mt-1 grid size-8 place-items-center rounded-full font-heading text-lg", day.key === today && "bg-primary text-primary-foreground")}>
                {day.number}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))]">
          <div className="relative" style={{ height: (END_HOUR - START_HOUR) * ROW }}>
            {Array.from({ length: END_HOUR - START_HOUR }, (_, index) => (
              <div key={index} className="absolute right-2 -translate-y-2 text-xs text-muted-foreground" style={{ top: index * ROW }}>
                {String(START_HOUR + index).padStart(2, "0")}:00
              </div>
            ))}
          </div>
          {days.map((day) => {
            const items = byDay.get(day.key) ?? [];
            return (
              <div key={day.key} className={cn("relative border-l", day.key === today && "bg-secondary/40")} style={{ height: (END_HOUR - START_HOUR) * ROW }}>
                {Array.from({ length: END_HOUR - START_HOUR }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`${day.label} ${String(START_HOUR + index).padStart(2, "0")}:00`}
                    className="absolute inset-x-0 border-t border-border/80 hover:bg-primary/5"
                    style={{ top: index * ROW, height: ROW }}
                    onClick={() => openCreate(day.key, `${String(START_HOUR + index).padStart(2, "0")}:00`)}
                  />
                ))}
                {showNow && nowClock?.dateKey === day.key && nowTop > 0 && nowTop < (END_HOUR - START_HOUR) * ROW ? (
                  <div className="pointer-events-none absolute right-0 left-0 z-20 border-t-2 border-primary" style={{ top: nowTop }} />
                ) : null}
                {layoutItems(items).map(({ item, column, count }) => {
                  const start = minutesFromStart(item.startsAt);
                  const end = minutesFromStart(item.endsAt);
                  if (end <= 0 || start >= (END_HOUR - START_HOUR) * 60) return null;
                  const top = (Math.max(start, 0) / 60) * ROW;
                  const height = Math.max(((Math.min(end, (END_HOUR - START_HOUR) * 60) - Math.max(start, 0)) / 60) * ROW, 28);
                  const color = colorFor(item.clientId);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDraft({ mode: "edit", appointment: item })}
                      className="absolute z-10 overflow-hidden rounded-lg px-1.5 py-1 text-left ring-1"
                      style={{
                        top,
                        height,
                        left: `calc(${(column / count) * 100}% + 3px)`,
                        width: `calc(${100 / count}% - 6px)`,
                        background: color.background,
                        color: color.color,
                        borderColor: color.border,
                      }}
                    >
                      <span className="block truncate text-[11px] leading-tight font-medium">{item.clientName}</span>
                      {height > 36 ? (
                        <span className="block truncate text-[10px] opacity-80">
                          {formatTime(new Date(item.startsAt))} · {item.location}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={draft !== null} onOpenChange={(open) => { if (!open) setDraft(null); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft?.mode === "edit" ? "Termin bearbeiten" : "Termin anlegen"}</DialogTitle>
            <DialogDescription>Nur vorhandene Kunden können eingeplant werden.</DialogDescription>
          </DialogHeader>
          {draft ? (
            <AppointmentForm
              key={draft.mode === "edit" ? draft.appointment.id : `${draft.date}-${draft.time}-${draft.clientId ?? ""}`}
              draft={draft}
              clients={clients}
              weekKey={weekStartKey}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function layoutItems(items: AppointmentItem[]) {
  const sorted = items.slice().sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const columnEnds: number[] = [];
  const placed: { item: AppointmentItem; column: number }[] = [];
  for (const item of sorted) {
    const start = new Date(item.startsAt).getTime();
    const end = new Date(item.endsAt).getTime();
    let column = columnEnds.findIndex((columnEnd) => columnEnd <= start);
    if (column === -1) {
      column = columnEnds.length;
      columnEnds.push(end);
    } else {
      columnEnds[column] = end;
    }
    placed.push({ item, column });
  }
  const count = Math.max(columnEnds.length, 1);
  return placed.map((entry) => ({ ...entry, count }));
}
