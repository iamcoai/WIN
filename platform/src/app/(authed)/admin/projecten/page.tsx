import { desc, eq, inArray, isNotNull } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";
import { db } from "@/lib/db";
import { project, task } from "@/lib/db/schema";

export default async function ProjectenPage() {
  const projects = await db.select().from(project).orderBy(desc(project.createdAt));
  const projectIds = projects.map((p) => p.id);
  const tasks = projectIds.length
    ? await db.select().from(task).where(inArray(task.projectId, projectIds))
    : [];
  const tasksByProject = new Map<string, typeof tasks>();
  for (const t of tasks) {
    if (!t.projectId) continue;
    if (!tasksByProject.has(t.projectId)) tasksByProject.set(t.projectId, []);
    tasksByProject.get(t.projectId)!.push(t);
  }

  return (
    <>
      <PageHeader title="Projecten" description="Interne projecten en voortgang." />
      <PageBody>
        {projects.length === 0 ? (
          <EmptyState icon={Briefcase} title="Geen projecten" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((p) => {
              const pTasks = tasksByProject.get(p.id) ?? [];
              const done = pTasks.filter((t) => t.column === "done").length;
              return (
                <Card key={p.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle>{p.title}</CardTitle>
                        {p.description ? (
                          <CardDescription className="mt-1">{p.description}</CardDescription>
                        ) : null}
                      </div>
                      <Badge variant={p.status === "active" ? "default" : "secondary"}>
                        {p.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {pTasks.length
                      ? `${done}/${pTasks.length} taken voltooid`
                      : "Nog geen taken"}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </PageBody>
    </>
  );
}
