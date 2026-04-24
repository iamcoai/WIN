import Link from "next/link";
import { eq } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen } from "lucide-react";
import { db } from "@/lib/db";
import { userTraject, traject } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function TrajectenPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const rows = await db
    .select({
      id: userTraject.id,
      status: userTraject.status,
      progress: userTraject.progress,
      startedAt: userTraject.startedAt,
      trajectId: traject.id,
      title: traject.title,
      description: traject.description,
    })
    .from(userTraject)
    .innerJoin(traject, eq(userTraject.trajectId, traject.id))
    .where(eq(userTraject.userId, current.user.id));

  return (
    <>
      <PageHeader
        title="Mijn trajecten"
        description="Hier zie je welke trajecten je volgt en waar je staat."
      />
      <PageBody>
        {rows.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nog geen actief traject"
            description="Zodra je bent ingeschreven op een traject verschijnt het hier."
          />
        ) : (
          <div className="grid gap-4">
            {rows.map((r) => (
              <Link
                key={r.id}
                href={{ pathname: `/app/trajecten/${r.trajectId}` }}
                className="group"
              >
                <Card className="transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle>{r.title}</CardTitle>
                        {r.description ? (
                          <CardDescription className="mt-1">{r.description}</CardDescription>
                        ) : null}
                      </div>
                      <Badge variant={r.status === "active" ? "default" : "secondary"}>
                        {r.status === "active" ? "Actief" : r.status === "completed" ? "Voltooid" : "Gepauzeerd"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Voortgang</span>
                      <span>{r.progress}%</span>
                    </div>
                    <Progress value={r.progress} />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
