import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "border-b border-border bg-surface/50 px-5 py-7 md:px-10 md:py-9",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {breadcrumb ? (
            <div className="mb-1.5 text-[0.75rem] font-medium text-muted-foreground">
              {breadcrumb}
            </div>
          ) : null}
          <h1 className="text-[1.625rem] font-semibold tracking-[-0.015em] text-foreground md:text-[1.875rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>
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
    <div
      className={cn(
        "mx-auto max-w-6xl px-5 py-6 md:px-10 md:py-10 animate-fade-in",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Toolbar — thin sub-header under PageHeader for filters/tabs/actions.
 * Use when PageBody needs a sticky filter row.
 */
export function PageToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-14 z-20 border-b border-border bg-background/80 px-5 py-2.5 backdrop-blur-md md:px-10",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2">
        {children}
      </div>
    </div>
  );
}
