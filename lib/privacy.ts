import { PRACTICE } from "@/lib/practice";

export const privacySections = [
  {
    title: "Wer ist verantwortlich?",
    body: `${PRACTICE.practitioner}, ${PRACTICE.role}, erreicht unter ${PRACTICE.name}, ${PRACTICE.street}, ${PRACTICE.postalCode} ${PRACTICE.city}, ${PRACTICE.email}, Telefon ${PRACTICE.phone}.`,
  },
  {
    title: "Welche Daten werden verarbeitet?",
    body: "Kontaktdaten und Stammdaten, Angaben zur Ernährung und Gesundheit, die du für die Beratung mitteilst (zum Beispiel Allergien, Unverträglichkeiten, Ziele, Größe, Gewicht, Medikamente und Gesprächsnotizen), Termine sowie der Zeitpunkt und die Unterschrift dieser Einwilligung.",
  },
  {
    title: "Wofür?",
    body: "Die Daten werden genutzt, um die Ernährungsberatung vorzubereiten und durchzuführen, Termine zu planen und zu dokumentieren, dass du in die Verarbeitung eingewilligt hast.",
  },
  {
    title: "Auf welcher Grundlage?",
    body: "Die Verarbeitung beruht auf deiner Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Soweit Gesundheitsdaten betroffen sind, zusätzlich auf Art. 9 Abs. 2 lit. a DSGVO.",
  },
  {
    title: "Wie lange?",
    body: "Die Daten bleiben für die Dauer der Beratung gespeichert und danach so lange, wie gesetzliche Aufbewahrungspflichten das verlangen. Danach werden sie gelöscht, sofern du nicht früher eine Löschung verlangst und keine Pflicht entgegensteht.",
  },
  {
    title: "Wer erhält die Daten?",
    body: "Die Daten bleiben in dieser Praxissoftware. Sie werden nicht zu Werbezwecken weitergegeben. Eine Weitergabe an Dritte erfolgt nur, wenn du sie verlangst oder eine gesetzliche Pflicht besteht.",
  },
  {
    title: "Welche Rechte hast du?",
    body: "Du kannst Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung verlangen. Du kannst die Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, zum Beispiel per Nachricht an die Praxis. Ohne die dafür nötigen Angaben kann die Beratung nicht fortgesetzt werden. Außerdem hast du das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren.",
  },
] as const;
