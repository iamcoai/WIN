import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";
import { db } from "@/lib/db";
import { workshop, workshopAttendee } from "@/lib/db/schema";
import { NewWorkshopDialog } from "./new-workshop-dialog";

export default async function WorkshopsPage() {
  const workshops = await db
    .select()
    .from(workshop)
    .orderBy(desc(workshop.startsAt));

  const attendeeCounts = await db
    .select({
      workshopId: workshopAttendee.workshopId,
      count: sql<number>`COUNT(*)::int`,
    })
    .from(workshopAttendee)
    .groupBy(workshopAttendee.workshopId);
  const countMap = new Map(attendeeCounts.map((r) => [r.workshopId, r.count]));

  return (
    <>
      <PageHeader
        title="Workshops"
        description="Workshops, lezingen, trainingen en retreats."
        actions={<NewWorkshopDialog />}
      />
      <PageBody>
        {workshops.length === 0 ? (
          <EmptyState icon={Users} title="Nog geen workshops" description="Plan er één via de knop rechtsboven." />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {workshops.map((w) => {
              const count = countMap.get(w.id) ?? 0;
              const pct = w.capacity ? Math.round((count / w.capacity) * 100) : null;
              return (
                <Link key={w.id} href={{ pathname: `/admin/workshops/${w.id}` }} className="group">
                  <Card className="transition-shadow group-hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{w.title}</CardTitle>
                            <Badge variant="outline" className="text-xs">{w.type}</Badge>
                          </div>
                          {w.startsAt ? (
                            <CardDescription className="mt-1">
                              {new Intl.DateTimeFormat("nl-NL", {
                                weekday: "short",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }).format(new Date(w.startsAt))}
                              {w.location ? ` · ${w.location}` : ""}
                            </CardDescription>
                          ) : null}
                        </div>
                        <Badge
                          variant={
                            w.status === "open"
                              ? "default"
                              : w.status === "completed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {w.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {count} aangemeld
                        {w.capacity ? ` · ${w.capacity} plaatsen${pct != null ? ` (${pct}%)` : ""}` : ""}
                      </span>
                      {w.priceCents ? (
                        <span className="font-medium text-foreground">
                          €{(w.priceCents / 100).toLocaleString("nl-NL")}
                        </span>
                      ) : null}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </PageBody>
    </>
  );
}
