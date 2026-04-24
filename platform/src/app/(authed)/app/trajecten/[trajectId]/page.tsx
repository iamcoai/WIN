import { notFound } from "next/navigation";
import { eq, asc, and } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { traject, trajectModule, opdracht, opdrachtResponse, userTraject } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function TrajectDetailPage({
  params,
}: {
  params: Promise<{ trajectId: string }>;
}) {
  const { trajectId } = await params;
  const current = await getCurrentUser();
  if (!current) return null;

  // Check user is enrolled in this traject
  const [ut] = await db
    .select()
    .from(userTraject)
    .where(
      and(
        eq(userTraject.userId, current.user.id),
        eq(userTraject.trajectId, trajectId),
      ),
    )
    .limit(1);

  if (!ut && current.user.role === "client") notFound();

  const [t] = await db.select().from(traject).where(eq(traject.id, trajectId)).limit(1);
  if (!t) notFound();

  const modules = await db
    .select()
    .from(trajectModule)
    .where(eq(trajectModule.trajectId, trajectId))
    .orderBy(asc(trajectModule.position));

  // Fetch opdrachten per module in one query
  const allOpdrachten = modules.length
    ? await db
        .select()
        .from(opdracht)
        .orderBy(asc(opdracht.position))
    : [];

  const myResponses = await db
    .select()
    .from(opdrachtResponse)
    .where(eq(opdrachtResponse.userId, current.user.id));

  const opsByModule = new Map<string, typeof allOpdrachten>();
  for (const o of allOpdrachten) {
    if (!o.moduleId) continue;
    if (!opsByModule.has(o.moduleId)) opsByModule.set(o.moduleId, []);
    opsByModule.get(o.moduleId)!.push(o);
  }
  const responsesByOp = new Map(myResponses.map((r) => [r.opdrachtId, r]));

  return (
    <>
      <PageHeader title={t.title} description={t.description ?? undefined} />
      <PageBody>
        <div className="space-y-5">
          {modules.map((m, idx) => {
            const ops = opsByModule.get(m.id) ?? [];
            return (
              <Card key={m.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <CardTitle>{m.title}</CardTitle>
                      {m.description ? (
                        <CardDescription className="mt-1">{m.description}</CardDescription>
                      ) : null}
                    </div>
                    {m.durationDays ? (
                      <Badge variant="secondary">{m.durationDays} dagen</Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  {m.content ? (
                    <p className="mb-4 text-sm text-foreground/80">{m.content}</p>
                  ) : null}

                  {ops.length ? (
                    <ul className="space-y-2">
                      {ops.map((o) => {
                        const r = responsesByOp.get(o.id);
                        const done = r?.status === "submitted" || r?.status === "approved";
                        return (
                          <li
                            key={o.id}
                            className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-3"
                          >
                            <div
                              className={
                                done
                                  ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs"
                                  : "mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 border-border"
                              }
                            >
                              {done ? "✓" : null}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{o.title}</p>
                              {o.description ? (
                                <p className="text-xs text-muted-foreground">{o.description}</p>
                              ) : null}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
