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
  contactTag,
  customField,
  deal,
  document,
  tag,
  task,
  user,
  workshopAttendee,
  workshop,
} from "@/lib/db/schema";
import { ActivityForm } from "./activity-form";
import { FollowUpButton } from "@/components/crm/follow-up-button";
import { DocumentsPanel } from "@/components/crm/documents-panel";
import { Phone, Mail, Building2, MessageSquare, Calendar, Briefcase } from "lucide-react";

const TYPE_ICON: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  note: MessageSquare,
  task: Briefcase,
  stage_change: Briefcase,
  custom: MessageSquare,
};

const TYPE_LABEL: Record<string, string> = {
  call: "Telefoon",
  email: "E-mail",
  meeting: "Meeting",
  note: "Notitie",
  task: "Taak",
  stage_change: "Stage-wijziging",
  custom: "Event",
};

export default async function ContactDetail({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;
  const [c] = await db.select().from(contact).where(eq(contact.id, contactId)).limit(1);
  if (!c) notFound();

  const tagRows = await db
    .select({ id: tag.id, name: tag.name, color: tag.color })
    .from(contactTag)
    .innerJoin(tag, eq(tag.id, contactTag.tagId))
    .where(eq(contactTag.contactId, contactId));

  const deals = await db
    .select()
    .from(deal)
    .where(eq(deal.contactId, contactId))
    .orderBy(desc(deal.updatedAt));

  const tasks = await db
    .select()
    .from(task)
    .where(eq(task.contactId, contactId))
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
    .where(eq(activity.contactId, contactId))
    .orderBy(desc(activity.occurredAt));

  const workshopAttended = await db
    .select({
      id: workshop.id,
      title: workshop.title,
      startsAt: workshop.startsAt,
      status: workshopAttendee.status,
    })
    .from(workshopAttendee)
    .innerJoin(workshop, eq(workshop.id, workshopAttendee.workshopId))
    .where(eq(workshopAttendee.contactId, contactId));

  const contactCustomFields = await db
    .select()
    .from(customField)
    .where(eq(customField.entity, "contact"))
    .orderBy(asc(customField.position));

  const cfValues = (c.customFields as Record<string, unknown>) ?? {};

  const documents = await db
    .select({
      id: document.id,
      name: document.name,
      description: document.description,
      mimeType: document.mimeType,
      sizeBytes: document.sizeBytes,
      createdAt: document.createdAt,
    })
    .from(document)
    .where(eq(document.contactId, contactId))
    .orderBy(desc(document.createdAt));

  const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ") || "—";

  return (
    <>
      <PageHeader
        title={fullName}
        description={[c.jobTitle, c.company].filter(Boolean).join(" · ") || c.email || undefined}
        actions={<FollowUpButton contactId={contactId} defaultTitle={`Check-in met ${fullName}`} />}
      />
      <PageBody className="max-w-6xl">
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left: timeline */}
          <div className="space-y-5 lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Tijdlijn</CardTitle>
                  <CardDescription>Notities, calls, meetings, e-mails</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ActivityForm contactId={contactId} />
                <div className="space-y-3 pt-3">
                  {activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nog geen activiteit — voeg hierboven een notitie toe.
                    </p>
                  ) : (
                    activities.map((a) => {
                      const Icon = TYPE_ICON[a.type] ?? MessageSquare;
                      return (
                        <div key={a.id} className="flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 rounded-lg border border-border bg-card/50 p-3">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="font-medium">
                                {a.title ?? TYPE_LABEL[a.type]}
                              </span>
                              <span className="text-muted-foreground">
                                {new Intl.DateTimeFormat("nl-NL", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }).format(new Date(a.occurredAt))}
                              </span>
                            </div>
                            {a.content ? (
                              <p className="mt-1 text-sm">{a.content}</p>
                            ) : null}
                            {a.authorName ? (
                              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                                door {a.authorName}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Deals</CardTitle>
                <CardDescription>{deals.length} gelinkt aan dit contact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {deals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Geen deals.</p>
                ) : (
                  deals.map((d) => (
                    <Link
                      key={d.id}
                      href={{ pathname: `/admin/crm/deals/${d.id}` }}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{d.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {d.status}
                          {d.amountCents
                            ? ` · €${(d.amountCents / 100).toLocaleString("nl-NL")}`
                            : ""}
                        </p>
                      </div>
                      <Badge variant={d.status === "won" ? "default" : d.status === "lost" ? "destructive" : "secondary"}>
                        {d.status}
                      </Badge>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            {tasks.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Gelinkte taken</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {tasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-md border border-border p-2.5 text-sm"
                    >
                      <span>{t.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {t.column}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {workshopAttended.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Workshops</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {workshopAttended.map((w) => (
                    <Link
                      key={w.id}
                      href={{ pathname: `/admin/workshops/${w.id}` }}
                      className="flex items-center justify-between rounded-md border border-border p-2.5 text-sm hover:bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{w.title}</p>
                        {w.startsAt ? (
                          <p className="text-xs text-muted-foreground">
                            {new Intl.DateTimeFormat("nl-NL").format(new Date(w.startsAt))}
                          </p>
                        ) : null}
                      </div>
                      <Badge variant="outline">{w.status}</Badge>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            <DocumentsPanel
              docs={documents.map((d) => ({
                ...d,
                createdAt: d.createdAt.toISOString(),
              }))}
              entity={{ contactId }}
            />
          </div>

          {/* Right: profile + tags + custom fields */}
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {c.email ? (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${c.email}`} className="hover:underline">
                      {c.email}
                    </a>
                  </div>
                ) : null}
                {c.phone ? (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${c.phone}`} className="hover:underline">
                      {c.phone}
                    </a>
                  </div>
                ) : null}
                {c.company ? (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    {c.company}
                  </div>
                ) : null}
                <div className="pt-2">
                  <Badge
                    variant={
                      c.lifecycle === "customer"
                        ? "default"
                        : c.lifecycle === "prospect"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {c.lifecycle}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {tagRows.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-1.5">
                  {tagRows.map((t) => (
                    <Badge key={t.id} variant="outline">{t.name}</Badge>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {contactCustomFields.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Eigen velden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {contactCustomFields.map((cf) => {
                    const v = cfValues[cf.key];
                    return (
                      <div key={cf.id} className="flex flex-col gap-0.5">
                        <span className="text-xs font-medium text-muted-foreground">
                          {cf.label}
                        </span>
                        <span>
                          {v == null || v === "" ? (
                            <span className="text-muted-foreground/60">—</span>
                          ) : Array.isArray(v) ? (
                            <span className="flex flex-wrap gap-1">
                              {v.map((x) => (
                                <Badge key={String(x)} variant="outline" className="text-xs">
                                  {String(x)}
                                </Badge>
                              ))}
                            </span>
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

            {c.notes ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notities</CardTitle>
                </CardHeader>
                <CardContent className="whitespace-pre-wrap text-sm">
                  {c.notes}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </PageBody>
    </>
  );
}
