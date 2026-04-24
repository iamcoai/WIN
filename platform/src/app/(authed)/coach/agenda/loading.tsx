import { PageBody, PageHeader } from "@/components/ui/page-header";

export default function Loading() {
  return (
    <>
      <PageHeader title="Agenda" description="Laden…" />
      <PageBody className="max-w-full">
        <div className="mb-4 h-14 rounded-xl border border-border bg-card animate-shimmer" />
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="h-10 border-b border-border bg-muted/30" />
          <div className="grid grid-cols-7">
            {Array.from({ length: 42 }).map((_, i) => (
              <div
                key={i}
                className={`min-h-[5.5rem] border-b border-r border-border p-1.5 ${
                  (i + 1) % 7 === 0 ? "border-r-0" : ""
                } ${i >= 35 ? "border-b-0" : ""}`}
              >
                <div className="mb-1 h-4 w-4 rounded-full bg-muted animate-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </PageBody>
    </>
  );
}
