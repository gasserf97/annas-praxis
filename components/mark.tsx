import { cn } from "cn";

export function Mark({
  className,
  compact = false,
  inverse = false,
}: {
  className?: string;
  compact?: boolean;
  inverse?: boolean;
}) {
  const square = inverse ? "#f6f1e7" : "#2f5d50";
  const leaf = inverse ? "#2f5d50" : "#f6f1e7";
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-primary", className)}>
      <svg aria-hidden viewBox="0 0 32 32" className="size-8 shrink-0">
        <rect width="32" height="32" rx="10" fill={square} />
        <path d="M16.2 6.5c.3 3.2-1.2 5.4-3.2 7.2-1.7 1.5-3.5 3.2-3.5 6.1a6.5 6.5 0 0 0 13 0c0-2.9-1.8-4.6-3.5-6.1-2-1.8-3.5-4-3-7.2-.1 0 .1 0 .2 0z" fill={leaf} />
        <path d="M16 14.2c.8 1.8.7 3.6-.2 6.2" stroke={inverse ? "#f6f1e7" : "#1c3b32"} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      </svg>
      {compact ? null : (
        <span className="font-heading text-lg leading-none tracking-tight text-foreground">Annas Praxis</span>
      )}
    </span>
  );
}
