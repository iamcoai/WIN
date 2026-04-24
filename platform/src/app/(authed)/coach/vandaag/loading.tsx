import { PageBody, PageHeader } from "@/components/ui/page-header";
import { SkeletonCard } from "@/components/ui/skeleton-row";

export default function Loading() {
  return (
    <>
      <PageHeader title="Vandaag" description="Laden…" />
      <PageBody>
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="mt-8 space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-border bg-card animate-shimmer"
            />
          ))}
        </div>
      </PageBody>
    </>
  );
}
