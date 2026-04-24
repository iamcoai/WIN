import { notFound } from "next/navigation";
import Link from "next/link";
import { and, asc, desc, eq, gte, inArray, sql } from "drizzle-orm";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import {
  afspraak,
  user,
  contact,
  userTraject,
  traject,
  trajectModule,
  opdracht,
  opdrachtResponse,
  chatMessage,
  chatThread,
  habit,
  habitLog,
  activity,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";
import { FollowUpButton } from "@/components/crm/follow-up-button";
import { SessionNotesPad } from "./session-notes-pad";
import { cn } from "@/lib/utils";

export default async function SessionPrepPage({
  params,
}: {
  params: Promise<{ afspraakId: string }>;
}) {
  const { afspraakId } = await params;
  const me = await getCurrentUser();
  if (!me) return null;

  const [session] = await db
    .select()
    .from(afspraak)
    .where(eq(afspraak.id, afspraakId))
    .limit(1);
  if (!session) notFound();

  const [clientUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.clientId))
    .limit(1);

  // Try to find a matching contact (by email)
  const [clientContact] = clientUser?.email
    ? await db.select().from(contact).where(eq(contact.email, clientUser.email)).limit(1)
    : [null];

  // Traject the client is on
  const [enrollment] = await db
    .select({
      status: userTraject.status,
      progress: userTraject.progress,
      trajectId: userTraject.trajectId,
      startedAt: userTraject.startedAt,
    })
    .from(userTraject)
    .where(and(eq(userTraject.userId, session.clientId), eq(userTraject.status, "active")))
    .limit(1);

  const [trajectRow] = enrollment
    ? await db.select().from(traject).where(eq(traject.id, enrollment.trajectId)).limit(1)
    : [null];

  const modules = enrollment
    ? await db
        .select()
        .from(trajectModule)
        .where(eq(trajectModule.trajectId, enrollment.trajectId))
        .orderBy(asc(trajectModule.position))
    : [];

  const moduleIds = modules.map((m) => m.id);
  const opdrachten = moduleIds.length
    ? await db.select().from(opdracht).where(inArray(opdracht.moduleId, moduleIds))
    : [];
  const responses = opdrachten.length
    ? await db
        .select()
        .from(opdrachtResponse)
        .where(
          and(
            eq(opdrachtResponse.userId, session.clientId),
            inArray(
              opdrachtResponse.opdrachtId,
              opdrachten.map((o) => o.id),
            ),
          ),
        )
    : [];
  const responsesByOp = new Map(responses.map((r) => [r.opdrachtId, r]));

  // Progress: module is "current" if client has done < 50% of opdrachten in it
  const moduleStatus = modules.map((m) => {
    const ops = opdrachten.filter((o) => o.moduleId === m.id);
    const done = ops.filter((o) => {
      const r = responsesByOp.get(o.id);
      return r?.status === "submitted" || r?.status === "approved";
    }).length;
    return {
      ...m,
      done,
      total: ops.length,
      pct: ops.length ? Math.round((done / ops.length) * 100) : 0,
    };
  });
  const currentModule = moduleStatus.find((m) => m.total > 0 && m.pct < 100) ?? moduleStatus[0];

  // Recent chat (last 8)
  const [thread] = await db
    .select()
    .from(chatThread)
    .where(eq(chatThread.clientId, session.clientId))
    .limit(1);
  const recentMessages = thread
    ? await db
        .select()
        .from(chatMessage)
        .where(eq(chatMessage.threadId, thread.id))
        .orderBy(desc(chatMessage.createdAt))
        .limit(8)
    : [];

  // Recent meetings/notes-type activities on the contact
  const lastActivities = clientContact
    ? await db
        .select({
          id: activity.id,
          type: activity.type,
          title: activity.title,
          content: activity.content,
          occurredAt: activity.occurredAt,
        })
        .from(activity)
        .where(
          and(
            eq(activity.contactId, clientContact.id),
            inArray(activity.type, ["note", "meeting", "call"]),
          ),
        )
        .orderBy(desc(activity.occurredAt))
        .limit(5)
    : [];

  // Habits last 7 days
  const habits = await db
    .select()
    .from(habit)
    .where(and(eq(habit.userId, session.clientId), eq(habit.archived, false)));

  const weekAgoDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();
  const habitLogs = habits.length
    ? await db
        .select()
        .from(habitLog)
        .where(
          and(
            eq(habitLog.userId, session.clientId),
            gte(habitLog.date, weekAgoDate as unknown as string),
          ),
        )
    : [];

  const logsByHabit = new Map<string, Map<string, boolean>>();
  for (const l of habitLogs) {
    if (!logsByHabit.has(l.habitId)) logsByHabit.set(l.habitId, new Map());
    logsByHabit.get(l.habitId)!.set(String(l.date), l.completed);
  }

  const startTime = new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(session.startAt));

  return (
    <>
      <PageHeader
        title={`Sessie — ${clientUser?.name ?? "cliënt"}`}
        description={startTime}
        breadcrumb={
          <Link
            href={{ pathname: "/coach/sessies" }}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Sessies
          </Link>
        }
        actions={
          <div className="flex items-center gap-2">
            <Badge
              variant={
                session.status === "scheduled"
                  ? "default"
                  : session.status === "completed"
                    ? "secondary"
                    : "outline"
              }
            >
              {session.status}
            </Badge>
            {clientContact ? (
              <FollowUpButton contactId={clientContact.id} variant="outline" />
            ) : null}
          </div>
        }
      />
      <PageBody className="max-w-6xl">
        <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
          {/* Left: context */}
          <div className="space-y-5">
            {/* Quick facts */}
            <Card size="sm">
              <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 text-[0.8125rem]">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {new Intl.DateTimeFormat("nl-NL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(session.startAt))}
                  {" – "}
                  {new Intl.DateTimeFormat("nl-NL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(session.endAt))}
                </span>
                {session.location ? (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {session.location}
                  </span>
                ) : null}
                {clientContact ? (
                  <Link
                    href={{ pathname: `/admin/crm/contacts/${clientContact.id}` }}
                    className="ml-auto text-primary hover:underline"
                  >
                    Volledig dossier →
                  </Link>
                ) : null}
              </CardContent>
            </Card>

            {/* Traject status */}
            {trajectRow && enrollment ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-caption mb-0.5">Traject</p>
                      <CardTitle>{trajectRow.title}</CardTitle>
                      <CardDescription>
                        Gestart{" "}
                        {new Intl.DateTimeFormat("nl-NL", {
                          day: "numeric",
                          month: "long",
                        }).format(new Date(enrollment.startedAt))}{" "}
                        · {enrollment.progress}% voortgang
                      </CardDescription>
                    </div>
                    {currentModule ? (
                      <Badge variant="gold">
                        Nu: {currentModule.title}
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                {moduleStatus.length ? (
                  <CardContent className="space-y-1.5">
                    {moduleStatus.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm"
                      >
                        {m.pct === 100 ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : m.id === currentModule?.id ? (
                          <div className="relative flex h-4 w-4 items-center justify-center">
                            <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
                            <span className="relative h-2 w-2 rounded-full bg-primary" />
                          </div>
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/40" />
                        )}
                        <span className="flex-1">{m.title}</span>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {m.done}/{m.total}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                ) : null}
              </Card>
            ) : null}

            {/* Last session notes */}
            {lastActivities.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Laatste momenten</CardTitle>
                  <CardDescription>Notities, gesprekken en meetings van eerder</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lastActivities.map((a) => (
                    <div
                      key={a.id}
                      className="rounded-lg border border-border bg-card/50 p-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <Badge variant="outline" className="text-[10px]">
                          {a.type}
                        </Badge>
                        <span className="text-muted-foreground">
                          {new Intl.DateTimeFormat("nl-NL", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(a.occurredAt))}
                        </span>
                      </div>
                      {a.title ? (
                        <p className="mt-1 font-medium">{a.title}</p>
                      ) : null}
                      {a.content ? (
                        <p className="mt-1 whitespace-pre-wrap text-[0.8125rem] text-foreground/85">
                          {a.content}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {/* Recent chat */}
            {recentMessages.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Recente chat
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5">
                  {recentMessages.slice().reverse().map((m) => {
                    const mine = m.senderId !== session.clientId;
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "max-w-[85%] rounded-xl px-3 py-1.5 text-[0.8125rem]",
                          mine
                            ? "ml-auto bg-primary text-primary-foreground"
                            : "mr-auto bg-muted text-foreground",
                        )}
                      >
                        {m.content}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ) : null}

            {/* Habits week */}
            {habits.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Habits — afgelopen 7 dagen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {habits.map((h) => {
                    const log = logsByHabit.get(h.id) ?? new Map<string, boolean>();
                    const days = Array.from({ length: 7 }, (_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() - (6 - i));
                      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                    });
                    const hits = days.filter((d) => log.get(d) === true).length;
                    return (
                      <div key={h.id} className="flex items-center gap-3">
                        <span className="flex-1 text-sm">{h.title}</span>
                        <div className="flex gap-1">
                          {days.map((d) => (
                            <div
                              key={d}
                              className={cn(
                                "h-5 w-5 rounded-sm",
                                log.get(d) === true ? "bg-primary" : "bg-muted",
                              )}
                              title={d}
                            />
                          ))}
                        </div>
                        <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
                          {hits}/7
                        </span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Right: notes pad */}
          <div className="space-y-5">
            {clientContact ? (
              <SessionNotesPad contactId={clientContact.id} />
            ) : (
              <Card size="sm">
                <CardContent className="px-4 py-4 text-sm text-muted-foreground">
                  Geen gelinkt CRM-contact — notities kunnen nog niet worden
                  opgeslagen op het contact.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </PageBody>
    </>
  );
}
