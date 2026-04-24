import { asc, eq, inArray } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { db } from "@/lib/db";
import {
  pipeline,
  pipelineStage,
  deal,
  contact,
  dealTag,
  tag,
} from "@/lib/db/schema";
import { PipelineBoard } from "./pipeline-board";

export default async function PipelinePage() {
  // Default pipeline — MVP loads first one
  const [pipe] = await db
    .select()
    .from(pipeline)
    .orderBy(asc(pipeline.position))
    .limit(1);

  if (!pipe) {
    return (
      <PageBody>
        <p className="text-sm text-muted-foreground">Geen pipeline ingesteld.</p>
      </PageBody>
    );
  }

  const stages = await db
    .select()
    .from(pipelineStage)
    .where(eq(pipelineStage.pipelineId, pipe.id))
    .orderBy(asc(pipelineStage.position));

  const deals = await db
    .select()
    .from(deal)
    .where(eq(deal.pipelineId, pipe.id))
    .orderBy(asc(deal.position));

  const contactIds = [...new Set(deals.map((d) => d.contactId).filter(Boolean))] as string[];
  const contacts = contactIds.length
    ? await db.select().from(contact).where(inArray(contact.id, contactIds))
    : [];
  const contactById = new Map(contacts.map((c) => [c.id, c]));

  const dealIds = deals.map((d) => d.id);
  const dealTags = dealIds.length
    ? await db.select().from(dealTag).where(inArray(dealTag.dealId, dealIds))
    : [];
  const tagRows = dealTags.length
    ? await db
        .select()
        .from(tag)
        .where(inArray(tag.id, [...new Set(dealTags.map((x) => x.tagId))]))
    : [];
  const tagById = new Map(tagRows.map((t) => [t.id, t]));
  const tagsByDeal = new Map<string, string[]>();
  for (const dt of dealTags) {
    if (!tagsByDeal.has(dt.dealId)) tagsByDeal.set(dt.dealId, []);
    tagsByDeal.get(dt.dealId)!.push(dt.tagId);
  }

  const totalValue = deals.reduce((sum, d) => sum + (d.amountCents ?? 0), 0);
  const openDeals = deals.filter((d) => d.status === "open").length;

  // Data for the client board
  const boardData = {
    pipelineId: pipe.id,
    pipelineName: pipe.name,
    stages: stages.map((s) => ({
      id: s.id,
      name: s.name,
      color: s.color,
      position: s.position,
      isWon: s.isWon,
      isLost: s.isLost,
      probability: s.probability,
    })),
    deals: deals.map((d) => ({
      id: d.id,
      title: d.title,
      stageId: d.stageId,
      amountCents: d.amountCents,
      currency: d.currency,
      position: d.position,
      status: d.status,
      expectedCloseAt: d.expectedCloseAt ? d.expectedCloseAt.toISOString() : null,
      contact: d.contactId ? contactById.get(d.contactId) ?? null : null,
      tags: (tagsByDeal.get(d.id) ?? [])
        .map((tid) => tagById.get(tid))
        .filter(Boolean)
        .map((t) => ({ id: t!.id, name: t!.name, color: t!.color })),
    })),
  };

  return (
    <>
      <PageHeader
        title={`Pipeline — ${pipe.name}`}
        description={`${openDeals} openstaande deals · €${(totalValue / 100).toLocaleString("nl-NL", { maximumFractionDigits: 0 })} totaal in pipeline · sleep kaarten en kolommen om te herordenen`}
      />
      <PageBody className="max-w-full">
        <PipelineBoard data={boardData} />
      </PageBody>
    </>
  );
}
