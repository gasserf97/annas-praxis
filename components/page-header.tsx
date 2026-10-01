import { cn } from "cn";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1 text-sm text-muted-foreground">{eyebrow}</p> : null}
        <h1 className="font-heading text-3xl font-medium tracking-tight text-balance sm:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  text,
  action,
  className,
}: {
  title: string;
  text: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-dashed border-border bg-card/70 px-6 py-10 text-center", className)}>
      <h2 className="font-heading text-xl font-medium">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{text}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}
