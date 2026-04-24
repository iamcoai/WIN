import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 border-b border-win-charcoal/10 bg-win-cream/60 px-5 py-6 sm:flex-row sm:items-center sm:justify-between md:px-8",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-win-charcoal">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-win-charcoal/70">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : null}
    </header>
  );
}

export function PageBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8", className)}>
      {children}
    </div>
  );
}
