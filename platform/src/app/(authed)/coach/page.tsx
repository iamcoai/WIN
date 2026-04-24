import { and, eq, gte, sql } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Users, BookOpen, Calendar, MessageSquare, BarChart3, FileText } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { afspraak, chatMessage, opdrachtResponse, user, userTraject } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function CoachHome() {
  const current = await getCurrentUser();
  const name = current?.user.name ?? "coach";
  const firstName = name.split(" ")[0];

  // Stats
  const [{ activeClients }] = await db
    .select({ activeClients: sql<number>`COUNT(DISTINCT ${user.id})::int` })
    .from(user)
    .where(eq(user.role, "client"));
  const [{ activeTrajecten }] = await db
    .select({ activeTrajecten: sql<number>`COUNT(*)::int` })
    .from(userTraject)
    .where(eq(userTraject.status, "active"));
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const [{ recentSubmissions }] = await db
    .select({ recentSubmissions: sql<number>`COUNT(*)::int` })
    .from(opdrachtResponse)
    .where(and(eq(opdrachtResponse.status, "submitted"), gte(opdrachtResponse.submittedAt, weekAgo)));
  const [{ upcoming }] = await db
    .select({ upcoming: sql<number>`COUNT(*)::int` })
    .from(afspraak)
    .where(eq(afspraak.status, "scheduled"));

  const stats = [
    { label: "Actieve cliënten", value: activeClients },
    { label: "Actieve trajecten", value: activeTrajecten },
    { label: "Reflecties deze week", value: recentSubmissions },
    { label: "Komende sessies", value: upcoming },
  ];

  const tiles = [
    { href: "/coach/clienten", icon: Users, title: "Cliënten", desc: "Wie zit er bij mij in begeleiding." },
    { href: "/coach/trajecten", icon: BookOpen, title: "Trajecten", desc: "Bouw en beheer programma's." },
    { href: "/coach/sessies", icon: Calendar, title: "Sessies", desc: "Geplande intakes en check-ins." },
    { href: "/coach/chat", icon: MessageSquare, title: "Chat", desc: "Lopende gesprekken per cliënt." },
    { href: "/coach/rapportage", icon: BarChart3, title: "Rapportage", desc: "Voortgang en patronen." },
    { href: "/coach/formulieren", icon: FileText, title: "Formulieren", desc: "Intake en reflectie-vragen." },
  ];

  return (
    <>
      <PageHeader
        title={`Goedemorgen ${firstName}`}
        description="Jouw ruimte vandaag — cliënten, trajecten, sessies en gesprekken."
      />
      <PageBody>
        <div className="mb-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card px-4 py-3 shadow-xs"
            >
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-1 font-heading text-[1.375rem] font-semibold tabular-nums tracking-tight text-foreground">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={{ pathname: t.href }} className="group">
                <Card className="relative overflow-hidden transition-all duration-[var(--duration-fast)] group-hover:-translate-y-[1px] group-hover:shadow-md group-hover:border-border-strong">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                        <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.8} />
                      </div>
                      <ArrowUpRight className="h-4 w-4 -translate-x-1 text-muted-foreground/40 transition-all duration-[var(--duration-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0 group-hover:text-primary" />
                    </div>
                    <CardTitle className="mt-3">{t.title}</CardTitle>
                    <CardDescription>{t.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
