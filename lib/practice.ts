export const PRACTICE = {
  name: "Annas Praxis",
  practitioner: "Anna",
  role: "Ernährungsberaterin",
  street: "Lindengasse 12",
  postalCode: "50674",
  city: "Köln",
  email: "anna@annas-praxis.de",
  phone: "0221 987654",
  documentVersion: "1.0",
};

export const DIETS = [
  "Mischkost",
  "Flexitarisch",
  "Pescetarisch",
  "Vegetarisch",
  "Vegan",
  "Andere",
] as const;

export const SESSION_KINDS = [
  "Erstgespräch",
  "Folgetermin",
  "Verlaufskontrolle",
  "Abschluss",
] as const;

export const LOCATIONS = ["Praxis", "Online", "Hausbesuch"] as const;

export const DURATIONS = [30, 45, 60, 90] as const;

export const GOAL_SUGGESTIONS = [
  "Abnehmen",
  "Zunehmen",
  "Mehr Energie",
  "Sportliche Leistung",
  "Verdauung",
  "Alltag leichter machen",
];

export const ALLERGY_SUGGESTIONS = [
  "Nüsse",
  "Erdnüsse",
  "Milch",
  "Ei",
  "Soja",
  "Weizen",
  "Fisch",
  "Schalentiere",
  "Sesam",
];

export const INTOLERANCE_SUGGESTIONS = [
  "Laktose",
  "Fruktose",
  "Gluten",
  "Histamin",
  "Sorbit",
];

export function fullName(person: { firstName: string; lastName: string }) {
  return `${person.firstName} ${person.lastName}`.trim();
}

export function initials(person: { firstName: string; lastName: string }) {
  const first = person.firstName.trim().charAt(0);
  const last = person.lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase();
}
