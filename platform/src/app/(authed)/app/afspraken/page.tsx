import { asc, eq } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Calendar, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { afspraak } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default async function AfsprakenPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const rows = await db
    .select()
    .from(afspraak)
    .where(eq(afspraak.clientId, current.user.id))
    .orderBy(asc(afspraak.startAt));

  return (
    <>
      <PageHeader
        title="Afspraken"
        description="Geplande en afgelopen sessies en intakes."
      />
      <PageBody>
        {rows.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Geen afspraken"
            description="Zodra er een afspraak gepland is verschijnt 'ie hier."
          />
        ) : (
          <div className="grid gap-3">
            {rows.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>{a.title}</CardTitle>
                        <CardDescription className="mt-0.5">
                          {formatDate(new Date(a.startAt))}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={
                        a.status === "scheduled"
                          ? "default"
                          : a.status === "completed"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {a.status === "scheduled"
                        ? "Gepland"
                        : a.status === "completed"
                          ? "Afgelopen"
                          : a.status === "cancelled"
                            ? "Geannuleerd"
                            : "Niet verschenen"}
                    </Badge>
                  </div>
                </CardHeader>
                {a.description || a.location ? (
                  <CardContent className="space-y-1.5 text-sm">
                    {a.description ? <p>{a.description}</p> : null}
                    {a.location ? (
                      <p className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {a.location}
                      </p>
                    ) : null}
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
