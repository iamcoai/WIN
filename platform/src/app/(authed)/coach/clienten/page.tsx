import Link from "next/link";
import { eq } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";
import { db } from "@/lib/db";
import { user, userTraject, traject } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function ClientenPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  // All clients enrolled in trajecten coached by this coach (or all if admin)
  const rows = await db
    .select({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      utId: userTraject.id,
      utStatus: userTraject.status,
      utProgress: userTraject.progress,
      trajectTitle: traject.title,
      coachId: traject.coachId,
    })
    .from(user)
    .leftJoin(userTraject, eq(userTraject.userId, user.id))
    .leftJoin(traject, eq(traject.id, userTraject.trajectId))
    .where(eq(user.role, "client"));

  const filtered =
    current.user.role === "admin"
      ? rows
      : rows.filter((r) => !r.coachId || r.coachId === current.user.id);

  // Group by user
  const byUser = new Map<string, typeof filtered>();
  for (const r of filtered) {
    if (!byUser.has(r.userId)) byUser.set(r.userId, []);
    byUser.get(r.userId)!.push(r);
  }

  return (
    <>
      <PageHeader title="Cliënten" description="Overzicht van jouw cliënten en waar ze staan." />
      <PageBody>
        {byUser.size === 0 ? (
          <EmptyState icon={Users} title="Nog geen cliënten" description="Zodra iemand zich inschrijft verschijnt 'ie hier." />
        ) : (
          <div className="grid gap-3">
            {Array.from(byUser.values()).map((group) => {
              const first = group[0];
              return (
                <Link
                  key={first.userId}
                  href={{ pathname: `/coach/clienten/${first.userId}` }}
                  className="group"
                >
                  <Card className="transition-shadow group-hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                            {first.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <CardTitle>{first.name}</CardTitle>
                            <CardDescription>{first.email}</CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {group.filter((r) => r.utId).length} traject{group.filter((r) => r.utId).length === 1 ? "" : "en"}
                        </Badge>
                      </div>
                    </CardHeader>
                    {group.some((r) => r.utId) ? (
                      <CardContent className="flex flex-wrap gap-2 text-xs">
                        {group
                          .filter((r) => r.utId)
                          .map((r) => (
                            <span
                              key={r.utId!}
                              className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground"
                            >
                              {r.trajectTitle} · {r.utProgress}%
                            </span>
                          ))}
                      </CardContent>
                    ) : null}
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
