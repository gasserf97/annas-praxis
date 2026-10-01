import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const source = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: {
    default: "Annas Praxis",
    template: "%s · Annas Praxis",
  },
  description: "Praxissoftware für die Ernährungsberatung: Kunden, Einwilligung, Sitzungen und Kalender.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${source.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
