import Link from "next/link";
import { and, asc, desc, eq, gte, lte, or, sql, isNotNull } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Calendar,
  Target,
  CheckCircle2,
  MessageSquare,
  Flame,
  Clock,
  ArrowUpRight,
  Sparkles,
  Sun,
  Moon,
  BookOpenText,
} from "lucide-react";
import { db } from "@/lib/db";
import {
  afspraak,
  chatMessage,
  chatThread,
  habit,
  habitLog,
  journalEntry,
  task,
  traject,
  trajectModule,
  user,
  userTraject,
  contact,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";
import { cn } from "@/lib/utils";
import { FocusTaskCard } from "./focus-task-card";
import { HabitTicker } from "./habit-ticker";
import { MorningRitual } from "./morning-ritual";
import { EveningReflectionCard } from "./evening-reflection";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}
function todayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function greetingFor(hour: number) {
  if (hour < 6) return "Rustige nacht";
  if (hour < 12) return "Goedemorgen";
  if (hour < 18) return "Goedemiddag";
  return "Goedenavond";
}

export default async function VandaagPage() {
  const current = await getCurrentUser();
  if (!current) return null;
  const me = current.user;
  const firstName = me.name.split(" ")[0];

  const now = new Date();
  const dayStart = startOfDay(now);
  const dayEnd = endOfDay(now);

  // ─── Sessies vandaag ──
  const todaySessions = await db
    .select({
      id: afspraak.id,
      title: afspraak.title,
      startAt: afspraak.startAt,
      endAt: afspraak.endAt,
      status: afspraak.status,
      location: afspraak.location,
      meetingUrl: afspraak.meetingUrl,
      clientId: afspraak.clientId,
      clientName: user.name,
    })
    .from(afspraak)
    .leftJoin(user, eq(user.id, afspraak.clientId))
    .where(
      and(
        me.role === "admin" ? sql`true` : eq(afspraak.coachId, me.id),
        gte(afspraak.startAt, dayStart),
        lte(afspraak.startAt, dayEnd),
      ),
    )
    .orderBy(asc(afspraak.startAt));

  // ─── Focus-taak + top upcoming ──
  const ownedTasks = await db
    .select()
    .from(task)
    .where(
      and(
        eq(task.ownerId, me.id),
        or(eq(task.bucket, "today"), eq(task.bucket, "next")),
      ),
    )
    .orderBy(desc(task.isFocus), asc(task.reminderAt), asc(task.dueAt));

  const focusTask = ownedTasks.find((t) => t.isFocus) ?? null;
  const upcomingTasks = ownedTasks
    .filter((t) => t.id !== focusTask?.id)
    .slice(0, 6);

  // ─── Follow-ups due today (tasks met reminder_at ≤ vandaag, niet done) ──
  const followUps = await db
    .select({
      id: task.id,
      title: task.title,
      reminderAt: task.reminderAt,
      contactId: task.contactId,
      dealId: task.dealId,
      contactName: contact.firstName,
      contactLastName: contact.lastName,
    })
    .from(task)
    .leftJoin(contact, eq(contact.id, task.contactId))
    .where(
      and(
        eq(task.ownerId, me.id),
        isNotNull(task.reminderAt),
        lte(task.reminderAt, dayEnd),
        sql`${task.bucket} != 'done'`,
      ),
    )
    .orderBy(asc(task.reminderAt))
    .limit(5);

  // ─── Chat-threads met recent activity ──
  const since = new Date(now.getTime() - 48 * 3600 * 1000);
  const threads = await db
    .select({
      id: chatThread.id,
      clientId: chatThread.clientId,
      lastMessageAt: chatThread.lastMessageAt,
      clientName: user.name,
    })
    .from(chatThread)
    .innerJoin(user, eq(user.id, chatThread.clientId))
    .where(
      and(
        me.role === "admin" ? sql`true` : eq(chatThread.coachId, me.id),
        gte(chatThread.lastMessageAt, since),
      ),
    )
    .orderBy(desc(chatThread.lastMessageAt))
    .limit(4);

  // ─── Reza's habits + log vandaag ──
  const myHabits = await db
    .select()
    .from(habit)
    .where(and(eq(habit.userId, me.id), eq(habit.archived, false)));

  const todayLogs = myHabits.length
    ? await db
        .select()
        .from(habitLog)
        .where(
          and(
            eq(habitLog.userId, me.id),
            eq(habitLog.date, todayDate() as unknown as string),
          ),
        )
    : [];
  const logByHabit = new Map(todayLogs.map((l) => [l.habitId, l.completed]));

  // ─── Journal-entry vandaag (indien al gedaan) ──
  const [todayJournal] = await db
    .select()
    .from(journalEntry)
    .where(
      and(
        eq(journalEntry.userId, me.id),
        eq(journalEntry.date, todayDate() as unknown as string),
      ),
    )
    .limit(1);

  // ─── Capaciteit-samenvatting ──
  const minutesToday = todaySessions.reduce((sum, s) => {
    const start = new Date(s.startAt).getTime();
    const end = new Date(s.endAt).getTime();
    return sum + Math.max(0, (end - start) / 60000);
  }, 0);
  const hoursToday = minutesToday / 60;
  const targetHours = 6;
  const capacityPct = Math.min(100, Math.round((hoursToday / targetHours) * 100));

  return (
    <>
      <PageHeader
        title={`${greetingFor(now.getHours())}${firstName ? `, ${firstName}` : ""}`}
        description={new Intl.DateTimeFormat("nl-NL", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }).format(now).replace(/^./, (c) => c.toUpperCase())}
      />
      <PageBody>
        {/* Focus + morning ritual row */}
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          {/* Focus-taak */}
          <FocusTaskCard
            focusTask={
              focusTask
                ? {
                    id: focusTask.id,
                    title: focusTask.title,
                    description: focusTask.description ?? undefined,
                    bucket: focusTask.bucket,
                  }
                : null
            }
            upcoming={upcomingTasks.map((t) => ({
              id: t.id,
              title: t.title,
              bucket: t.bucket,
              reminderAt: t.reminderAt ? t.reminderAt.toISOString() : null,
            }))}
          />

          {/* Morning ritual / mood */}
          <MorningRitual
            ritualDone={myHabits
              .filter((h) =>
                /ademwerk|meditatie|ritueel|journal/i.test(h.title),
              )
              .every((h) => logByHabit.get(h.id) === true)}
          />
        </div>

        {/* Sessies vandaag */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-caption flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>Sessies vandaag · {todaySessions.length}</span>
            </h2>
            <Link
              href={{ pathname: "/coach/agenda" }}
              className="text-xs font-medium text-primary hover:underline"
            >
              Open agenda →
            </Link>
          </div>
          {todaySessions.length === 0 ? (
            <Card size="sm">
              <CardContent className="py-6 text-center text-sm text-muted-foreground">
                Geen sessies gepland vandaag. Adem rustig, benut de ruimte.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {todaySessions.map((s) => (
                <Link
                  key={s.id}
                  href={{ pathname: `/coach/sessies/${s.id}/prep` }}
                  className="group block"
                >
                  <Card className="transition-all duration-[var(--duration-fast)] group-hover:-translate-y-[1px] group-hover:shadow-md" size="sm">
                    <CardHeader className="flex flex-row items-center gap-3 px-4 py-3">
                      <div className="flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <span className="text-[0.625rem] font-semibold uppercase tracking-wider">
                          {new Intl.DateTimeFormat("nl-NL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(s.startAt))}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="truncate">{s.title}</CardTitle>
                        <CardDescription className="truncate">
                          met {s.clientName ?? "—"}
                          {s.location ? ` · ${s.location}` : ""}
                        </CardDescription>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Chat + Follow-ups in 2-kolom */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section>
            <h2 className="text-caption mb-3 flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Recente gesprekken</span>
            </h2>
            {threads.length === 0 ? (
              <Card size="sm">
                <CardContent className="py-6 text-center text-sm text-muted-foreground">
                  Geen berichten in de laatste 48 uur.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {threads.map((t) => (
                  <Link
                    key={t.id}
                    href={{ pathname: `/coach/clienten/${t.clientId}` }}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm transition-colors hover:bg-muted/40"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                      {t.clientName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{t.clientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.lastMessageAt
                          ? new Intl.DateTimeFormat("nl-NL", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(t.lastMessageAt))
                          : "—"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-caption mb-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>Follow-ups vandaag</span>
            </h2>
            {followUps.length === 0 ? (
              <Card size="sm">
                <CardContent className="py-6 text-center text-sm text-muted-foreground">
                  Niks om op te volgen vandaag.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {followUps.map((f) => {
                  const contactName =
                    [f.contactName, f.contactLastName].filter(Boolean).join(" ") ||
                    null;
                  return (
                    <div
                      key={f.id}
                      className="rounded-lg border border-border bg-card px-3 py-2.5 text-sm"
                    >
                      <p className="font-medium">{f.title}</p>
                      {contactName ? (
                        <Link
                          href={{ pathname: `/admin/crm/contacts/${f.contactId}` }}
                          className="text-xs text-muted-foreground hover:text-primary hover:underline"
                        >
                          {contactName} →
                        </Link>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Habits + Capacity-strip */}
        <div className="mt-8 grid gap-6 md:grid-cols-[2fr_1fr]">
          <section>
            <h2 className="text-caption mb-3 flex items-center gap-2">
              <Flame className="h-3.5 w-3.5" />
              <span>Jouw praktijk vandaag</span>
            </h2>
            {myHabits.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                tone="subtle"
                title="Nog geen habits ingesteld"
                description="Voeg je eigen dagelijkse praktijk toe — ademwerk, beweging, reflectie."
              />
            ) : (
              <HabitTicker
                userId={me.id}
                habits={myHabits.map((h) => ({
                  id: h.id,
                  title: h.title,
                  description: h.description ?? undefined,
                  doneToday: logByHabit.get(h.id) === true,
                }))}
              />
            )}
          </section>

          <section>
            <h2 className="text-caption mb-3 flex items-center gap-2">
              <Target className="h-3.5 w-3.5" />
              <span>Capaciteit</span>
            </h2>
            <Card size="sm">
              <CardContent className="px-4 py-4">
                <div className="flex items-baseline justify-between">
                  <p className="font-heading text-2xl font-semibold tabular-nums">
                    {hoursToday.toFixed(1)}
                    <span className="ml-1 text-sm text-muted-foreground font-normal">
                      / {targetHours}u
                    </span>
                  </p>
                  <Badge variant={capacityPct > 100 ? "destructive" : capacityPct > 80 ? "warning" : "success"}>
                    {capacityPct}%
                  </Badge>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-[var(--duration-slow)]",
                      capacityPct > 100
                        ? "bg-destructive"
                        : capacityPct > 80
                          ? "bg-warning"
                          : "bg-primary",
                    )}
                    style={{ width: `${Math.min(100, capacityPct)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {todaySessions.length} {todaySessions.length === 1 ? "sessie" : "sessies"} · richtlijn {targetHours}u/dag
                </p>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Evening reflection */}
        <section className="mt-8">
          <h2 className="text-caption mb-3 flex items-center gap-2">
            <BookOpenText className="h-3.5 w-3.5" />
            <span>Avondreflectie</span>
          </h2>
          <EveningReflectionCard
            userId={me.id}
            existing={
              todayJournal
                ? {
                    id: todayJournal.id,
                    content: todayJournal.content,
                    mood: todayJournal.mood,
                  }
                : null
            }
          />
        </section>
      </PageBody>
    </>
  );
}
