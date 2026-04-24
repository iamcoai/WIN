import { asc, eq, or } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar } from "lucide-react";
import { db } from "@/lib/db";
import { afspraak, user } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function SessiesPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const rows = await db
    .select({
      id: afspraak.id,
      title: afspraak.title,
      startAt: afspraak.startAt,
      status: afspraak.status,
      location: afspraak.location,
      clientName: user.name,
    })
    .from(afspraak)
    .leftJoin(user, eq(user.id, afspraak.clientId))
    .where(
      current.user.role === "admin"
        ? undefined
        : eq(afspraak.coachId, current.user.id),
    )
    .orderBy(asc(afspraak.startAt));

  return (
    <>
      <PageHeader title="Sessies" description="Geplande afspraken met cliënten." />
      <PageBody>
        {rows.length === 0 ? (
          <EmptyState icon={Calendar} title="Geen sessies" description="Nog niks op de agenda." />
        ) : (
          <div className="grid gap-3">
            {rows.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{a.title}</CardTitle>
                      <CardDescription className="mt-0.5">
                        met {a.clientName ?? "—"} ·{" "}
                        {new Intl.DateTimeFormat("nl-NL", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(a.startAt))}
                      </CardDescription>
                      {a.location ? (
                        <p className="mt-1 text-xs text-muted-foreground">📍 {a.location}</p>
                      ) : null}
                    </div>
                    <Badge
                      variant={
                        a.status === "scheduled" ? "default" : a.status === "completed" ? "secondary" : "outline"
                      }
                    >
                      {a.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
