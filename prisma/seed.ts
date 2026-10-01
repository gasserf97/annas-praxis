import { randomBytes } from "crypto";
import { PrismaClient } from "@prisma/client";
import { addDays, berlinToUtc, todayKey } from "../lib/dates";

const prisma = new PrismaClient();

function signature(name: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="520" height="150" viewBox="0 0 520 150"><text x="16" y="96" font-family="Georgia, serif" font-size="52" fill="#24352c">${name}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function token() {
  return randomBytes(24).toString("base64url");
}

async function main() {
  await prisma.appointment.deleteMany();
  await prisma.session.deleteMany();
  await prisma.consent.deleteMany();
  await prisma.client.deleteMany();

  const today = todayKey();
  const noon = (offset: number) => berlinToUtc(addDays(today, offset), "12:00");
  const at = (offset: number, time: string) => berlinToUtc(addDays(today, offset), time);

  const lena = await prisma.client.create({
    data: {
      firstName: "Lena",
      lastName: "Hoffmann",
      email: "lena.hoffmann@example.com",
      phone: "0171 2201844",
      dateOfBirth: "1991-04-16",
      street: "Brüsseler Straße 18",
      postalCode: "50674",
      city: "Köln",
      heightCm: 168,
      weightKg: 74.2,
      diet: "Vegetarisch",
      allergies: JSON.stringify(["Nüsse"]),
      intolerances: JSON.stringify(["Laktose"]),
      goals: JSON.stringify(["Abnehmen", "Mehr Energie"]),
      goalNotes: "Etwa 4 kg in drei Monaten, ohne das Abendessen mit Freunden aufzugeben.",
      medications: "Keine Dauermedikation.",
      notes: "Arbeitet im Schichtdienst, isst unter der Woche oft spät.",
      consent: {
        create: {
          token: token(),
          status: "signed",
          signerName: "Lena Hoffmann",
          signatureData: signature("Lena Hoffmann"),
          signedAt: noon(-24),
          documentVersion: "1.0",
        },
      },
      sessions: {
        create: [
          {
            date: noon(-21),
            kind: "Erstgespräch",
            title: "Anamnese und Ziel",
            comment:
              "Lena möchte etwa 4 kg abnehmen, ohne sich stark einzuschränken. Nüsse sind eine echte Allergie, Laktose verträgt sie nur in kleinen Mengen. Abendessen fällt oft nach 21 Uhr. Wir starten mit einem festen Frühstück und einer Pause zwischen Mittag und Abend.",
          },
          {
            date: noon(-14),
            kind: "Folgetermin",
            title: "Frühstück und Einkauf",
            comment:
              "Haferflocken mit Sojajoghurt und Beeren klappen an Arbeitstagen. Der Hunger am Nachmittag kommt, wenn das Mittagessen nur ein belegtes Brötchen war. Einkaufsliste für die Spätschicht mitgenommen: Skyr-Alternative, Körnerbrot, Apfel, Hummus.",
          },
          {
            date: noon(-7),
            kind: "Verlaufskontrolle",
            title: "Erste Kilo und Restaurant",
            comment:
              "Gewicht 73,0 kg, minus 1,2 kg. Im Restaurant bestellt sie jetzt das vegetarische Gericht und lässt die Sahnesoße weg. Nüsse in Pesto weiter meiden. Nächster Schritt: zwei Abende pro Woche mit einer Schüssel-Mahlzeit vor der Schicht.",
          },
        ],
      },
    },
  });

  const markus = await prisma.client.create({
    data: {
      firstName: "Markus",
      lastName: "Berger",
      email: "markus.berger@example.com",
      phone: "0151 7783201",
      dateOfBirth: "1986-11-02",
      street: "Aachener Straße 240",
      postalCode: "50931",
      city: "Köln",
      heightCm: 184,
      weightKg: 81,
      diet: "Mischkost",
      allergies: JSON.stringify([]),
      intolerances: JSON.stringify(["Laktose"]),
      goals: JSON.stringify(["Sportliche Leistung", "Mehr Energie"]),
      goalNotes: "Trainiert dreimal die Woche für einen Halbmarathon im Frühjahr.",
      medications: "",
      notes: "Trinkt wenig an Bürotagen.",
      consent: { create: { token: token(), status: "pending" } },
    },
  });

  const sofia = await prisma.client.create({
    data: {
      firstName: "Sofia",
      lastName: "Aydin",
      email: "sofia.aydin@example.com",
      phone: "0160 4412908",
      dateOfBirth: "1995-07-28",
      street: "Venloer Straße 312",
      postalCode: "50823",
      city: "Köln",
      heightCm: 162,
      weightKg: 58.4,
      diet: "Vegan",
      allergies: JSON.stringify([]),
      intolerances: JSON.stringify([]),
      goals: JSON.stringify(["Mehr Energie", "Alltag leichter machen"]),
      goalNotes: "Nachmittags bricht die Konzentration ein. Möchte vegan bleiben.",
      medications: "Vitamin B12 nach ärztlicher Absprache.",
      notes: "Isst mittags oft nur einen Salat ohne Beilage.",
      consent: {
        create: {
          token: token(),
          status: "signed",
          signerName: "Sofia Aydin",
          signatureData: signature("Sofia Aydin"),
          signedAt: noon(-10),
          documentVersion: "1.0",
        },
      },
      sessions: {
        create: [
          {
            date: noon(-10),
            kind: "Erstgespräch",
            title: "Energie am Nachmittag",
            comment:
              "Sofia isst vegan und lässt mittags oft die sättigende Beilage weg. Wir ergänzen Hülsenfrüchte oder Getreide und eine feste Snack-Zeit um 15:30 Uhr. B12 nimmt sie bereits. Keine Allergien bekannt.",
          },
          {
            date: noon(-3),
            kind: "Folgetermin",
            title: "Mittagessen mit Beilage",
            comment:
              "Die Linsenschüssel klappt an drei Tagen. An den anderen Tagen bleibt es beim Salat, dann kommt der Einbruch zurück. Nächste Woche planen wir zwei Gerichte zum Vorbereiten am Sonntag.",
          },
        ],
      },
    },
  });

  const petra = await prisma.client.create({
    data: {
      firstName: "Petra",
      lastName: "Klein",
      email: "petra.klein@example.com",
      phone: "0221 5550192",
      dateOfBirth: "1968-01-09",
      street: "Neusser Straße 54",
      postalCode: "50670",
      city: "Köln",
      heightCm: 160,
      weightKg: 79.5,
      diet: "Mischkost",
      allergies: JSON.stringify(["Schalentiere"]),
      intolerances: JSON.stringify([]),
      goals: JSON.stringify(["Verdauung", "Abnehmen"]),
      goalNotes: "Möchte sich nach dem Essen weniger aufgebläht fühlen und langsam abnehmen.",
      medications: "Schilddrüsenhormon, morgens nüchtern.",
      notes: "Arzt hat zur Ernährung beraten lassen, keine Diätvorgabe von dort.",
      consent: { create: { token: token(), status: "pending" } },
      sessions: {
        create: [
          {
            date: noon(-5),
            kind: "Erstgespräch",
            title: "Verdauung und Rhythmus",
            comment:
              "Petra reagiert auf sehr fette Abendessen mit Völlegefühl. Schalentiere meidet sie komplett. Wir verschieben die größere Mahlzeit auf den Mittag und lassen abends die Sahnesoße weg. Einwilligung schickt sie noch.",
          },
        ],
      },
    },
  });

  const jonas = await prisma.client.create({
    data: {
      firstName: "Jonas",
      lastName: "Weber",
      email: "jonas.weber@example.com",
      phone: "0176 8802145",
      dateOfBirth: "1998-09-21",
      street: "Eifelstraße 8",
      postalCode: "50677",
      city: "Köln",
      heightCm: 178,
      weightKg: 70,
      diet: "Flexitarisch",
      allergies: JSON.stringify([]),
      intolerances: JSON.stringify([]),
      goals: JSON.stringify(["Zunehmen", "Sportliche Leistung"]),
      goalNotes: "Krafttraining viermal pro Woche, möchte 3 kg zunehmen.",
      medications: "",
      notes: "Vergisst das Frühstück, wenn er früh im Studio ist.",
      consent: {
        create: {
          token: token(),
          status: "signed",
          signerName: "Jonas Weber",
          signatureData: signature("Jonas Weber"),
          signedAt: noon(-18),
          documentVersion: "1.0",
        },
      },
      sessions: {
        create: [
          {
            date: noon(-12),
            kind: "Folgetermin",
            title: "Frühstück nach dem Training",
            comment:
              "Jonas kommt nüchtern aus dem Studio und isst erst am späten Vormittag. Wir legen einen Shake und ein Käsebrot direkt in die Tasche. Ziel bleibt eine langsame Zunahme, nicht nur mehr Proteinpulver.",
          },
        ],
      },
    },
  });

  await prisma.client.create({
    data: {
      firstName: "Amira",
      lastName: "Saleh",
      email: "amira.saleh@example.com",
      phone: "0157 3390188",
      dateOfBirth: "1993-12-03",
      street: "Siegburger Straße 120",
      postalCode: "50679",
      city: "Köln",
      heightCm: 170,
      weightKg: 66,
      diet: "Pescetarisch",
      allergies: JSON.stringify(["Sesam"]),
      intolerances: JSON.stringify(["Fruktose"]),
      goals: JSON.stringify(["Alltag leichter machen", "Verdauung"]),
      goalNotes: "Viele Fertigsnacks enthalten Sesam oder Fruchtzucker. Sie möchte eine kurze Liste sicherer Lebensmittel.",
      medications: "",
      notes: "Hat zwei Kinder, kocht abends für alle und isst die Reste.",
      consent: { create: { token: token(), status: "pending" } },
    },
  });

  await prisma.appointment.createMany({
    data: [
      {
        clientId: lena.id,
        startsAt: at(0, "09:00"),
        endsAt: at(0, "10:00"),
        title: "Verlauf mit Lena",
        location: "Praxis",
        notes: "Gewicht und die zwei Schüssel-Abende besprechen.",
      },
      {
        clientId: sofia.id,
        startsAt: at(0, "11:30"),
        endsAt: at(0, "12:15"),
        title: "Mealprep mit Sofia",
        location: "Online",
        notes: "Zwei vegane Gerichte für die Woche festlegen.",
      },
      {
        clientId: markus.id,
        startsAt: at(1, "15:00"),
        endsAt: at(1, "16:30"),
        title: "Erstgespräch Markus",
        location: "Praxis",
        notes: "Einwilligung ist noch offen.",
      },
      {
        clientId: jonas.id,
        startsAt: at(-1, "10:00"),
        endsAt: at(-1, "10:45"),
        title: "Frühstück nach dem Training",
        location: "Praxis",
        notes: "",
      },
      {
        clientId: petra.id,
        startsAt: at(2, "17:00"),
        endsAt: at(2, "17:45"),
        title: "Verdauung Petra",
        location: "Praxis",
        notes: "",
      },
      {
        clientId: sofia.id,
        startsAt: at(4, "09:30"),
        endsAt: at(4, "10:15"),
        title: "Kontrolle Sofia",
        location: "Online",
        notes: "",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
