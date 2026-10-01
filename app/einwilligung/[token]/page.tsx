import { ConsentForm } from "@/components/consent-form";
import { Mark } from "@/components/mark";
import { privacySections } from "@/lib/privacy";
import { prisma } from "@/lib/prisma";
import { PRACTICE, fullName } from "@/lib/practice";
import { formatLongDate, formatTime } from "@/lib/dates";

export const dynamic = "force-dynamic";

export const metadata = { title: "Datenschutz unterschreiben" };

export default async function ConsentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const consent = await prisma.consent.findUnique({
    where: { token },
    include: { client: true },
  });

  if (!consent) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-16">
        <Mark />
        <h1 className="mt-8 font-heading text-4xl">Dieser Link ist ungültig</h1>
        <p className="mt-3 text-muted-foreground">
          Bitte frag in der Praxis nach einem neuen Link. Alte Links werden ungültig, sobald ein neuer erzeugt wird.
        </p>
      </main>
    );
  }

  const signed = consent.status === "signed";

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <Mark />
      <p className="mt-8 text-sm text-muted-foreground">
        {PRACTICE.street}, {PRACTICE.postalCode} {PRACTICE.city}
      </p>
      <h1 className="mt-2 font-heading text-4xl font-medium text-balance">Datenschutz und Einwilligung</h1>
      <p className="mt-3 text-muted-foreground">
        Hallo {consent.client.firstName}, bitte lies die Hinweise und unterschreibe, wenn du einverstanden bist. Die Praxis sieht die Unterschrift in deiner Akte.
      </p>

      <article className="mt-8 grid gap-5 rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:p-8">
        {privacySections.map((section) => (
          <section key={section.title}>
            <h2 className="font-heading text-xl">{section.title}</h2>
            <p className="mt-2 text-sm leading-6">{section.body}</p>
          </section>
        ))}
        <p className="text-xs text-muted-foreground">Dokumentversion {PRACTICE.documentVersion}</p>
      </article>

      <section className="mt-6 rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:p-8">
        {signed ? (
          <div>
            <h2 className="font-heading text-2xl">Unterschrift liegt vor</h2>
            <p className="mt-2 text-sm leading-6">
              {consent.signerName || fullName(consent.client)} hat am{" "}
              {consent.signedAt ? `${formatLongDate(consent.signedAt)} um ${formatTime(consent.signedAt)}` : "einem früheren Zeitpunkt"}{" "}
              eingewilligt. Du musst nichts weiter tun.
            </p>
            {consent.signatureData ? (
              <div className="mt-4 rounded-xl bg-white p-3 ring-1 ring-foreground/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={consent.signatureData} alt={`Unterschrift von ${consent.signerName}`} className="max-h-32 w-full object-contain" />
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <h2 className="mb-4 font-heading text-2xl">Unterschreiben</h2>
            <ConsentForm token={consent.token} signerName={fullName(consent.client)} />
          </div>
        )}
      </section>
    </main>
  );
}
