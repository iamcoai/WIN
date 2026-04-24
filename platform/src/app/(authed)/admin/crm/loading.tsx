import { PageBody, PageHeader } from "@/components/ui/page-header";
import { SkeletonTable } from "@/components/ui/skeleton-row";

export default function Loading() {
  return (
    <>
      <PageHeader title="CRM — Contacten" description="Laden…" />
      <PageBody className="max-w-full">
        <div className="mb-5 h-14 rounded-xl border border-border bg-card animate-shimmer" />
        <SkeletonTable rows={8} />
      </PageBody>
    </>
  );
}
