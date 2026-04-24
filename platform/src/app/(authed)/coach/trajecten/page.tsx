import Link from "next/link";
import { eq, or } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BookOpen, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { traject } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function CoachTrajectenPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const rows =
    current.user.role === "admin"
      ? await db.select().from(traject)
      : await db.select().from(traject).where(eq(traject.coachId, current.user.id));

  return (
    <>
      <PageHeader
        title="Trajecten"
        description="Bouw en beheer de coaching-programma's die jij begeleidt."
        actions={
          <Button disabled>
            <Plus className="h-4 w-4" /> Nieuw traject
          </Button>
        }
      />
      <PageBody>
        {rows.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nog geen trajecten"
            description="Gebruik de trajectbouwer om je eerste traject te ontwerpen."
          />
        ) : (
          <div className="grid gap-3">
            {rows.map((t) => (
              <Link key={t.id} href={{ pathname: `/coach/trajecten/${t.id}` }} className="group">
                <Card className="transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle>{t.title}</CardTitle>
                        {t.description ? (
                          <CardDescription className="mt-1">{t.description}</CardDescription>
                        ) : null}
                      </div>
                      <Badge variant={t.status === "published" ? "default" : "secondary"}>
                        {t.status === "published" ? "Live" : t.status === "draft" ? "Concept" : "Archief"}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
