import { notFound } from "next/navigation";
import { eq, and, desc, asc } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import {
  user,
  userTraject,
  traject,
  afspraak,
  habit,
  habitLog,
  chatThread,
  chatMessage,
} from "@/lib/db/schema";

export default async function ClientDetail({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const [u] = await db.select().from(user).where(eq(user.id, clientId)).limit(1);
  if (!u) notFound();

  const enrollments = await db
    .select({
      id: userTraject.id,
      status: userTraject.status,
      progress: userTraject.progress,
      title: traject.title,
    })
    .from(userTraject)
    .innerJoin(traject, eq(traject.id, userTraject.trajectId))
    .where(eq(userTraject.userId, clientId));

  const upcoming = await db
    .select()
    .from(afspraak)
    .where(and(eq(afspraak.clientId, clientId), eq(afspraak.status, "scheduled")))
    .orderBy(asc(afspraak.startAt))
    .limit(3);

  const habits = await db
    .select()
    .from(habit)
    .where(and(eq(habit.userId, clientId), eq(habit.archived, false)));

  const [thread] = await db
    .select()
    .from(chatThread)
    .where(eq(chatThread.clientId, clientId))
    .limit(1);

  const recentMessages = thread
    ? await db
        .select()
        .from(chatMessage)
        .where(eq(chatMessage.threadId, thread.id))
        .orderBy(desc(chatMessage.createdAt))
        .limit(3)
    : [];

  return (
    <>
      <PageHeader title={u.name} description={u.email} />
      <PageBody>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Trajecten</CardTitle>
              <CardDescription>Actieve inschrijvingen en voortgang.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {enrollments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geen trajecten.</p>
              ) : (
                enrollments.map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                    <span>{e.title}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={e.status === "active" ? "default" : "secondary"}>
                        {e.progress}%
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Komende afspraken</CardTitle>
              <CardDescription>Eerstvolgende drie.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geen geplande afspraken.</p>
              ) : (
                upcoming.map((a) => (
                  <div key={a.id} className="rounded-lg border border-border p-3 text-sm">
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("nl-NL", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(a.startAt))}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Habits</CardTitle>
              <CardDescription>{habits.length} actief.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {habits.length === 0 ? (
                <p className="text-sm text-muted-foreground">Geen habits ingesteld.</p>
              ) : (
                habits.map((h) => (
                  <div key={h.id} className="flex items-center justify-between text-sm">
                    <span>{h.title}</span>
                    <Badge variant="outline">{h.frequency}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recente chat</CardTitle>
              <CardDescription>Laatste 3 berichten.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              {recentMessages.length === 0 ? (
                <p className="text-muted-foreground">Geen berichten.</p>
              ) : (
                recentMessages.reverse().map((m) => (
                  <p key={m.id} className="rounded-md bg-muted/60 px-3 py-1.5">
                    {m.content}
                  </p>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
