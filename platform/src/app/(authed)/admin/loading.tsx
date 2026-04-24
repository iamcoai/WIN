import { PageBody, PageHeader } from "@/components/ui/page-header";
import { SkeletonCard } from "@/components/ui/skeleton-row";

export default function Loading() {
  return (
    <>
      <PageHeader title="Dashboard" description="Laden…" />
      <PageBody>
        <div className="mb-8 grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-border bg-card animate-shimmer"
            />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </PageBody>
    </>
  );
}
