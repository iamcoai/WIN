import { cn } from "@/lib/utils";

export function SkeletonRow({
  className,
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 rounded-md bg-muted animate-shimmer"
          style={{ width: `${80 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-muted animate-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded-md bg-muted animate-shimmer" />
          <div className="h-3 w-full rounded-md bg-muted animate-shimmer" />
          <div className="h-3 w-4/5 rounded-md bg-muted animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs">
      <div className="h-10 border-b border-border bg-muted/30" />
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-0"
        >
          <div className="h-7 w-7 shrink-0 rounded-full bg-muted animate-shimmer" />
          <div className="h-3 w-48 rounded-md bg-muted animate-shimmer" />
          <div className="h-3 w-32 rounded-md bg-muted animate-shimmer" />
          <div className="ml-auto h-3 w-16 rounded-md bg-muted animate-shimmer" />
        </div>
      ))}
    </div>
  );
}
