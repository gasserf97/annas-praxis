"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TagField({
  name,
  label,
  hint,
  placeholder,
  defaultTags,
  suggestions = [],
  error,
  tone = "neutral",
}: {
  name: string;
  label: string;
  hint?: string;
  placeholder: string;
  defaultTags: string[];
  suggestions?: string[];
  error?: string;
  tone?: "neutral" | "alert";
}) {
  const [tags, setTags] = useState(defaultTags);
  const [draft, setDraft] = useState("");

  function add(value: string) {
    const next = value.trim();
    if (!next || next.length > 40) return;
    if (tags.some((tag) => tag.toLowerCase() === next.toLowerCase())) {
      setDraft("");
      return;
    }
    setTags([...tags, next]);
    setDraft("");
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={`${name}-input`}>{label}</Label>
      <input type="hidden" name={name} value={JSON.stringify(tags)} />
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => setTags(tags.filter((item) => item !== tag))}
                className={
                  tone === "alert"
                    ? "inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
                    : "inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                }
              >
                {tag}
                <X className="size-3" />
                <span className="sr-only">entfernen</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Noch nichts hinterlegt.</p>
      )}
      <div className="flex gap-2">
        <Input
          id={`${name}-input`}
          value={draft}
          placeholder={placeholder}
          className="h-10 bg-card"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add(draft);
            }
          }}
        />
        <Button type="button" variant="outline" className="h-10 bg-card" onClick={() => add(draft)}>
          Hinzufügen
        </Button>
      </div>
      {suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => {
            const active = tags.some((tag) => tag.toLowerCase() === suggestion.toLowerCase());
            return (
              <button
                key={suggestion}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  if (active) setTags(tags.filter((tag) => tag.toLowerCase() !== suggestion.toLowerCase()));
                  else add(suggestion);
                }}
                className={
                  active
                    ? "rounded-full bg-primary px-2.5 py-1 text-xs text-primary-foreground"
                    : "rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                }
              >
                {suggestion}
              </button>
            );
          })}
        </div>
      ) : null}
      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
