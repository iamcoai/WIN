import { notFound } from "next/navigation";
import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import {
  activity,
  contact,
  customField,
  deal,
  dealTag,
  pipelineStage,
  tag,
  task,
  user,
} from "@/lib/db/schema";
import { ActivityForm } from "../../contacts/[contactId]/activity-form";

export default async function DealDetail({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  const [d] = await db.select().from(deal).where(eq(deal.id, dealId)).limit(1);
  if (!d) notFound();

  const [c] = d.contactId
    ? await db.select().from(contact).where(eq(contact.id, d.contactId)).limit(1)
    : [null];

  const [stage] = await db
    .select()
    .from(pipelineStage)
    .where(eq(pipelineStage.id, d.stageId))
    .limit(1);

  const dealTags = await db
    .select({ name: tag.name, color: tag.color })
    .from(dealTag)
    .innerJoin(tag, eq(tag.id, dealTag.tagId))
    .where(eq(dealTag.dealId, dealId));

  const linkedTasks = await db
    .select()
    .from(task)
    .where(eq(task.dealId, dealId))
    .orderBy(asc(task.dueAt));

  const activities = await db
    .select({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      content: activity.content,
      occurredAt: activity.occurredAt,
      authorName: user.name,
    })
    .from(activity)
    .leftJoin(user, eq(user.id, activity.authorId))
    .where(eq(activity.dealId, dealId))
    .orderBy(desc(activity.occurredAt));

  const dealCFs = await db
    .select()
    .from(customField)
    .where(eq(customField.entity, "deal"))
    .orderBy(asc(customField.position));
  const cfValues = (d.customFields as Record<string, unknown>) ?? {};

  return (
    <>
      <PageHeader
        title={d.title}
        description={
          c
            ? `${[c.firstName, c.lastName].filter(Boolean).join(" ")}${c.company ? ` · ${c.company}` : ""}`
            : undefined
        }
        actions={
          <div className="flex gap-2">
            <Badge variant="outline">{stage?.name ?? "—"}</Badge>
            <Badge
              variant={
                d.status === "won"
                  ? "default"
                  : d.status === "lost"
                    ? "destructive"
                    : "secondary"
              }
            >
              {d.status}
            </Badge>
          </div>
        }
      />
      <PageBody className="max-w-5xl">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activiteit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActivityForm dealId={dealId} contactId={d.contactId ?? undefined} />
                <div className="space-y-3 pt-3">
                  {activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nog geen activiteit.</p>
                  ) : (
                    activities.map((a) => (
                      <div key={a.id} className="rounded-lg border border-border bg-card/50 p-3">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-medium">{a.title ?? a.type}</span>
                          <span className="text-muted-foreground">
                            {new Intl.DateTimeFormat("nl-NL", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(a.occurredAt))}
                          </span>
                        </div>
                        {a.content ? <p className="mt-1 text-sm">{a.content}</p> : null}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {linkedTasks.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Taken</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {linkedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-md border border-border p-2.5 text-sm"
                    >
                      <span>{t.title}</span>
                      <Badge variant="outline">{t.column}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Bedrag</p>
                  <p className="text-lg font-semibold">
                    {d.amountCents
                      ? `€${(d.amountCents / 100).toLocaleString("nl-NL")}`
                      : "—"}
                  </p>
                </div>
                {d.expectedCloseAt ? (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Verwachte sluitdatum</p>
                    <p>
                      {new Intl.DateTimeFormat("nl-NL").format(new Date(d.expectedCloseAt))}
                    </p>
                  </div>
                ) : null}
                {c ? (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Contact</p>
                    <Link
                      href={{ pathname: `/admin/crm/contacts/${c.id}` }}
                      className="text-primary hover:underline"
                    >
                      {[c.firstName, c.lastName].filter(Boolean).join(" ")}
                    </Link>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {dealTags.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {dealTags.map((t) => (
                    <Badge key={t.name} variant="outline">{t.name}</Badge>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {dealCFs.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Eigen velden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {dealCFs.map((cf) => {
                    const v = cfValues[cf.key];
                    return (
                      <div key={cf.id} className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-muted-foreground">
                          {cf.label}
                        </span>
                        <span>
                          {v == null || v === "" ? (
                            <span className="text-muted-foreground/60">—</span>
                          ) : (
                            String(v)
                          )}
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ) : null}

            {d.notes ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notities</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap text-sm">
                  {d.notes}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </PageBody>
    </>
  );
}
