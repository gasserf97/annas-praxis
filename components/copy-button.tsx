"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({ value, label = "Link kopieren" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      className="h-10 bg-card"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setFailed(false);
          setDone(true);
          window.setTimeout(() => setDone(false), 2000);
        } catch {
          setFailed(true);
        }
      }}
    >
      {done ? <Check /> : <Copy />}
      {done ? "Kopiert" : failed ? "Bitte manuell kopieren" : label}
    </Button>
  );
}
