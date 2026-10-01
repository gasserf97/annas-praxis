# Annas Praxis

Praxissoftware für eine Ernährungsberaterin. Anna legt Kunden an, hält Allergien, Unverträglichkeiten und Ziele fest, lässt die Datenschutz-Einwilligung online unterschreiben, dokumentiert Sitzungen als aufklappbare Kacheln und plant Termine im Kalender.

Die Anwendung läuft lokal mit SQLite und lässt sich über die mitgelieferte `render.yaml` auf [Render](https://render.com) bereitstellen.

## Lokal starten

Voraussetzungen: Node.js 22.

```bash
npm install
cp .env.example .env
npm run db:setup
npm run dev
```

Die Praxis ist dann unter [http://127.0.0.1:43123](http://127.0.0.1:43123) erreichbar.

Das lokale Passwort steht in `.env` als `PRACTICE_PASSWORD` und ist in der Vorlage `praxis`. Kundinnen und Kunden melden sich nicht an. Sie öffnen den persönlichen Link unter `/einwilligung/…`, den Anna aus der Akte kopiert.

`npm run db:setup` legt Beispieldaten an: sechs Kunden, Sitzungen, Termine in der aktuellen Woche und ein paar bereits unterschriebene Einwilligungen. Ein erneuter Aufruf ersetzt diese Daten.

## Was die Praxis kann

- Kunden anlegen und bearbeiten: Kontakt, Adresse, Größe, Gewicht, Ernährungsform, Allergien, Unverträglichkeiten, Ziele, Medikamente, Notizen
- Datenschutztext mit Unterschrift auf einem öffentlichen Link, ohne Zugang zur Praxis
- Sitzungsverlauf als Kacheln, die sich auf- und zuklappen lassen
- Wochenkalender, um die eigenen Kunden in Praxis, online oder beim Hausbesuch einzuplanen

Zeiten gelten für Europe/Berlin.

## Auf Render veröffentlichen

1. Dieses Git-Repository mit Render verbinden.
2. **New → Blueprint** wählen. Render liest `render.yaml`.
3. Der Web-Service braucht den Plan **Starter**, weil die SQLite-Datei auf einer Festplatte unter `/var/data` liegt. Mehrere Instanzen würden sich die Datei nicht teilen.
4. Nach dem ersten Deploy das erzeugte `PRACTICE_PASSWORD` im Render-Dashboard unter Environment öffnen. Damit meldest du dich an. `SESSION_SECRET` bleibt geheim.

Der Datenschutztext ist eine Vorlage und keine Rechtsberatung. Vor dem echten Einsatz sollte ihn jemand mit Datenschutzrecht prüfen.

## Skripte

| Befehl | Bedeutung |
| --- | --- |
| `npm run dev` | Entwicklungsserver auf Port 43123 |
| `npm run db:setup` | Datenbank anlegen und Beispieldaten laden |
| `npm run build` | Produktionsbuild |
| `npm start` | Produktionsstart, legt die SQLite-Datei bei Bedarf an |
