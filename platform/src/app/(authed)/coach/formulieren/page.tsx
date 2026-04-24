import Link from "next/link";
import { and, desc, eq, or, inArray, sql } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";
import { db } from "@/lib/db";
import { form, formResponse, user } from "@/lib/db/schema";

export default async function CoachFormulierenPage() {
  const forms = await db
    .select()
    .from(form)
    .orderBy(desc(form.createdAt));

  // Response counts + latest response time per form
  const responseStats = forms.length
    ? await db
        .select({
          formId: formResponse.formId,
          count: sql<number>`COUNT(*)::int`,
          submitted: sql<number>`COUNT(CASE WHEN ${formResponse.submittedAt} IS NOT NULL THEN 1 END)::int`,
        })
        .from(formResponse)
        .where(
          inArray(
            formResponse.formId,
            forms.map((f) => f.id),
          ),
        )
        .groupBy(formResponse.formId)
    : [];
  const statsByForm = new Map(
    responseStats.map((r) => [r.formId, { count: r.count, submitted: r.submitted }]),
  );

  return (
    <>
      <PageHeader
        title="Formulieren"
        description="Intake, reflectie en check-ins die cliënten invullen."
      />
      <PageBody>
        {forms.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nog geen formulieren"
            description="Formulieren maak je via admin → eigen velden, of we bouwen volgende iteratie een builder hier."
          />
        ) : (
          <div className="grid gap-3">
            {forms.map((f) => {
              const stats = statsByForm.get(f.id) ?? { count: 0, submitted: 0 };
              const fields = Array.isArray(f.fields) ? (f.fields as unknown[]).length : 0;
              return (
                <Card key={f.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle>{f.title}</CardTitle>
                          <Badge variant="outline" className="text-[10px]">
                            {f.targetRole}
                          </Badge>
                        </div>
                        {f.description ? (
                          <CardDescription className="mt-1">{f.description}</CardDescription>
                        ) : null}
                      </div>
                      <Badge variant={f.active ? "success" : "outline"}>
                        {f.active ? "Actief" : "Inactief"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {fields}
                      </span>{" "}
                      velden
                    </span>
                    <span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {stats.submitted}
                      </span>{" "}
                      van {stats.count} ingediend
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card className="mt-6" size="sm">
          <CardHeader>
            <CardTitle className="text-base">Nog te bouwen</CardTitle>
            <CardDescription>
              Formulieren-builder waar jij zelf velden, vragen en taal aanpast.
              Volgende iteratie — huidige formulieren worden centraal beheerd.
            </CardDescription>
          </CardHeader>
        </Card>
      </PageBody>
    </>
  );
}
