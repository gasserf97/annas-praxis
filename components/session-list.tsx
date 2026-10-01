import { ChevronDown } from "lucide-react";
import { NewSessionDialog, SessionActions, type SessionItem } from "@/components/session-controls";
import { EmptyState } from "@/components/page-header";

export function SessionList({
  clientId,
  sessions,
  createDefaults,
}: {
  clientId: string;
  sessions: SessionItem[];
  createDefaults?: { date?: string; title?: string; kind?: string };
}) {
  return (
    <section className="grid gap-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-medium">Sitzungen</h2>
          <p className="text-sm text-muted-foreground">
            {sessions.length === 0
              ? "Noch keine Notiz aus einem Gespräch."
              : `${sessions.length} ${sessions.length === 1 ? "Kachel" : "Kacheln"} im Verlauf`}
          </p>
        </div>
        <NewSessionDialog clientId={clientId} defaults={createDefaults} />
      </div>
      {sessions.length === 0 ? (
        <EmptyState
          title="Der Verlauf ist noch leer"
          text="Nach dem Gespräch eine Kachel anlegen. Titel und Datum bleiben sichtbar, der Kommentar klappt auf."
        />
      ) : (
        <div className="grid gap-3">
          {sessions.map((session, index) => (
            <details
              key={session.id}
              open={index === 0}
              className="group rounded-2xl bg-card ring-1 ring-foreground/10 open:ring-primary/30"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-2xl px-4 py-4 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-center text-[11px] leading-tight font-medium text-secondary-foreground">
                  {session.dateKey.slice(8, 10)}.{session.dateKey.slice(5, 7)}.
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{session.title}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{session.kind}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{session.dateLabel}</span>
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-border px-4 py-4">
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {session.comment || "Noch kein Kommentar."}
                </p>
                <SessionActions clientId={clientId} session={session} />
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
