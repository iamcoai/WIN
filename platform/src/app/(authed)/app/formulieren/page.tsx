import Link from "next/link";
import { and, eq, or, inArray } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { FileText } from "lucide-react";
import { db } from "@/lib/db";
import { form, formResponse } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function FormulierenPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const forms = await db
    .select()
    .from(form)
    .where(and(eq(form.active, true), or(eq(form.targetRole, "client"), eq(form.targetRole, "any"))));

  const responses = forms.length
    ? await db
        .select()
        .from(formResponse)
        .where(
          and(
            eq(formResponse.userId, current.user.id),
            inArray(
              formResponse.formId,
              forms.map((f) => f.id),
            ),
          ),
        )
    : [];

  const responseByFormId = new Map(responses.map((r) => [r.formId, r]));

  return (
    <>
      <PageHeader
        title="Formulieren"
        description="Intake en reflectie — vul in op je eigen tempo."
      />
      <PageBody>
        {forms.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Geen formulieren"
            description="Zodra je coach er een klaarzet verschijnt 'ie hier."
          />
        ) : (
          <div className="grid gap-3">
            {forms.map((f) => {
              const r = responseByFormId.get(f.id);
              const submitted = !!r?.submittedAt;
              return (
                <Link key={f.id} href={{ pathname: `/app/formulieren/${f.id}` }} className="group">
                  <Card className="transition-shadow group-hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle>{f.title}</CardTitle>
                          {f.description ? (
                            <CardDescription className="mt-1">{f.description}</CardDescription>
                          ) : null}
                        </div>
                        <Badge variant={submitted ? "secondary" : "default"}>
                          {submitted ? "Ingediend" : "Nog openstaand"}
                        </Badge>
                      </div>
                    </CardHeader>
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
