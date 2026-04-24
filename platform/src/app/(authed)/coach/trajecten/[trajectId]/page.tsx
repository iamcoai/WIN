import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { traject, trajectModule, opdracht } from "@/lib/db/schema";

export default async function CoachTrajectDetail({
  params,
}: {
  params: Promise<{ trajectId: string }>;
}) {
  const { trajectId } = await params;
  const [t] = await db.select().from(traject).where(eq(traject.id, trajectId)).limit(1);
  if (!t) notFound();

  const modules = await db
    .select()
    .from(trajectModule)
    .where(eq(trajectModule.trajectId, trajectId))
    .orderBy(asc(trajectModule.position));

  const opsByModule = new Map<string, Array<{ id: string; title: string; type: string }>>();
  for (const m of modules) {
    const ops = await db
      .select({ id: opdracht.id, title: opdracht.title, type: opdracht.type })
      .from(opdracht)
      .where(eq(opdracht.moduleId, m.id))
      .orderBy(asc(opdracht.position));
    opsByModule.set(m.id, ops);
  }

  return (
    <>
      <PageHeader
        title={t.title}
        description={t.description ?? undefined}
        actions={
          <Badge variant={t.status === "published" ? "default" : "secondary"}>
            {t.status}
          </Badge>
        }
      />
      <PageBody>
        <div className="space-y-4">
          {modules.map((m, i) => (
            <Card key={m.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <CardTitle>{m.title}</CardTitle>
                    {m.description ? (
                      <CardDescription className="mt-1">{m.description}</CardDescription>
                    ) : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                {(opsByModule.get(m.id) ?? []).map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-md border border-border px-3 py-1.5">
                    <span>{o.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {o.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </PageBody>
    </>
  );
}
