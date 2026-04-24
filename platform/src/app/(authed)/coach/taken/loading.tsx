import { PageBody, PageHeader } from "@/components/ui/page-header";

export default function Loading() {
  return (
    <>
      <PageHeader title="Taken" description="Laden…" />
      <PageBody className="max-w-full">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl border border-border bg-surface-subtle/60 p-3"
            >
              <div className="mb-3 h-5 w-24 rounded bg-muted animate-shimmer" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-16 rounded-xl bg-muted/60 animate-shimmer"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
