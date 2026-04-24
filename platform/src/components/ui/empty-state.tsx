import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "default",
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "default" | "subtle";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-14 text-center",
        tone === "default"
          ? "border-border bg-card"
          : "border-border/60 bg-transparent",
        className,
      )}
    >
      {Icon ? (
        <div className="relative mb-1 flex h-14 w-14 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-primary/10"
          />
          <span
            aria-hidden
            className="absolute inset-2 rounded-full bg-primary/15"
          />
          <Icon
            className="relative h-6 w-6 text-primary"
            strokeWidth={1.75}
          />
        </div>
      ) : null}
      <h3 className="font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {description ? (
        <p className="max-w-sm text-[0.8125rem] leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
