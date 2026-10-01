export default function Loading() {
  return (
    <div className="grid gap-4">
      <div className="h-10 w-64 animate-pulse rounded-xl bg-muted" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
