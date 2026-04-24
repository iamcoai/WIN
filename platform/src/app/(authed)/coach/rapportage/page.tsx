import { eq, sql } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { user, userTraject, opdrachtResponse, afspraak } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function RapportagePage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const [{ clients }] = await db
    .select({ clients: sql<number>`COUNT(DISTINCT ${user.id})::int` })
    .from(user)
    .where(eq(user.role, "client"));

  const [{ activeEnrollments }] = await db
    .select({ activeEnrollments: sql<number>`COUNT(*)::int` })
    .from(userTraject)
    .where(eq(userTraject.status, "active"));

  const [{ submittedResponses }] = await db
    .select({ submittedResponses: sql<number>`COUNT(*)::int` })
    .from(opdrachtResponse)
    .where(eq(opdrachtResponse.status, "submitted"));

  const [{ upcomingAppointments }] = await db
    .select({ upcomingAppointments: sql<number>`COUNT(*)::int` })
    .from(afspraak)
    .where(eq(afspraak.status, "scheduled"));

  const stats = [
    { label: "Actieve cliënten", value: clients },
    { label: "Actieve trajecten", value: activeEnrollments },
    { label: "Ingediende reflecties", value: submittedResponses },
    { label: "Geplande afspraken", value: upcomingAppointments },
  ];

  return (
    <>
      <PageHeader title="Rapportage" description="Voortgang op niveau van het instituut." />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardHeader>
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-3xl">{s.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Nog te bouwen</CardTitle>
            <CardDescription>
              Deze pagina is een eerste scaffold. Volgende versie: filter op coach,
              tijdvenster, en per-cliënt-drilldown met opdracht-completion-ratio.
            </CardDescription>
          </CardHeader>
        </Card>
      </PageBody>
    </>
  );
}
