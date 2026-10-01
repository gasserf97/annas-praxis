const palette = [
  { background: "oklch(0.93 0.045 160)", color: "oklch(0.27 0.04 155)", border: "oklch(0.5 0.07 160)" },
  { background: "oklch(0.94 0.045 75)", color: "oklch(0.36 0.06 55)", border: "oklch(0.58 0.09 55)" },
  { background: "oklch(0.93 0.04 215)", color: "oklch(0.3 0.05 220)", border: "oklch(0.5 0.07 220)" },
  { background: "oklch(0.94 0.04 130)", color: "oklch(0.3 0.045 135)", border: "oklch(0.48 0.07 135)" },
  { background: "oklch(0.94 0.05 35)", color: "oklch(0.38 0.08 35)", border: "oklch(0.55 0.1 35)" },
];

export function colorFor(id: string) {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash + id.charCodeAt(index) * (index + 3)) % palette.length;
  }
  return palette[hash];
}
