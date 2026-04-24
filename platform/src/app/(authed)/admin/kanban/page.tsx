import { asc, eq } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { task, project } from "@/lib/db/schema";

const COLUMNS = ["todo", "doing", "review", "done"] as const;
const LABEL: Record<(typeof COLUMNS)[number], string> = {
  todo: "Te doen",
  doing: "Mee bezig",
  review: "Review",
  done: "Klaar",
};

export default async function KanbanPage() {
  const tasks = await db
    .select({
      id: task.id,
      title: task.title,
      description: task.description,
      column: task.column,
      position: task.position,
      dueAt: task.dueAt,
      projectTitle: project.title,
    })
    .from(task)
    .leftJoin(project, eq(project.id, task.projectId))
    .orderBy(asc(task.position));

  const byCol = Object.fromEntries(
    COLUMNS.map((c) => [c, tasks.filter((t) => t.column === c)]),
  ) as Record<(typeof COLUMNS)[number], typeof tasks>;

  return (
    <>
      <PageHeader title="Kanban" description="Workflow-board voor interne projecten." />
      <PageBody className="max-w-full">
        <div className="grid gap-4 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold">{LABEL[col]}</h3>
                <Badge variant="outline">{byCol[col].length}</Badge>
              </div>
              <div className="flex flex-col gap-2">
                {byCol[col].map((t) => (
                  <Card key={t.id}>
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{t.title}</CardTitle>
                      {t.projectTitle ? (
                        <CardDescription className="text-xs">{t.projectTitle}</CardDescription>
                      ) : null}
                      {t.description ? (
                        <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                      ) : null}
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
