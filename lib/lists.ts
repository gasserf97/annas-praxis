export function parseList(value: string) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  } catch {
    return [];
  }
}

export function readList(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || raw.trim() === "") return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const items = parsed
      .map((item) => String(item).trim())
      .filter(Boolean)
      .slice(0, 30);
    if (items.some((item) => item.length > 40)) return null;
    return items;
  } catch {
    return null;
  }
}
