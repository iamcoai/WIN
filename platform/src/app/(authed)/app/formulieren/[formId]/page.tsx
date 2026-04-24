import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/db";
import { form, formResponse } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

type FieldDef =
  | { id: string; type: "text" | "textarea"; label: string; required?: boolean }
  | { id: string; type: "select"; label: string; options: string[]; required?: boolean };

async function submitForm(formId: string, userId: string, formData: FormData) {
  "use server";
  const answers: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    answers[k] = String(v);
  }

  const existing = await db
    .select()
    .from(formResponse)
    .where(and(eq(formResponse.formId, formId), eq(formResponse.userId, userId)))
    .limit(1);

  const now = new Date();
  if (existing.length) {
    await db
      .update(formResponse)
      .set({ answers, submittedAt: now, updatedAt: now })
      .where(eq(formResponse.id, existing[0].id));
  } else {
    await db.insert(formResponse).values({
      id: `fr_${randomBytes(8).toString("hex")}`,
      formId,
      userId,
      answers,
      submittedAt: now,
    });
  }
  revalidatePath("/app/formulieren");
}

export default async function FormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const current = await getCurrentUser();
  if (!current) return null;

  const [f] = await db.select().from(form).where(eq(form.id, formId)).limit(1);
  if (!f) notFound();

  const [existing] = await db
    .select()
    .from(formResponse)
    .where(and(eq(formResponse.formId, formId), eq(formResponse.userId, current.user.id)))
    .limit(1);

  const existingAnswers =
    (existing?.answers as Record<string, string> | undefined) ?? {};

  const fields = (f.fields as unknown as FieldDef[]) ?? [];

  const action = async (formData: FormData) => {
    "use server";
    await submitForm(formId, current.user.id, formData);
    redirect("/app/formulieren");
  };

  return (
    <>
      <PageHeader
        title={f.title}
        description={f.description ?? undefined}
      />
      <PageBody className="max-w-2xl">
        <Card>
          <CardContent className="p-5">
            <form action={action} className="flex flex-col gap-5">
              {fields.map((field) => {
                const defaultValue = existingAnswers[field.id] ?? "";
                if (field.type === "textarea") {
                  return (
                    <div key={field.id} className="flex flex-col gap-1.5">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Textarea
                        id={field.id}
                        name={field.id}
                        required={field.required}
                        defaultValue={defaultValue}
                        rows={4}
                      />
                    </div>
                  );
                }
                if (field.type === "select") {
                  return (
                    <div key={field.id} className="flex flex-col gap-1.5">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <select
                        id={field.id}
                        name={field.id}
                        required={field.required}
                        defaultValue={defaultValue}
                        className="h-10 rounded-lg border border-border bg-card px-3 text-sm"
                      >
                        <option value="">Kies een optie…</option>
                        {field.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                return (
                  <div key={field.id} className="flex flex-col gap-1.5">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      name={field.id}
                      required={field.required}
                      defaultValue={defaultValue}
                    />
                  </div>
                );
              })}

              <div className="mt-3 flex justify-end">
                <Button type="submit">
                  {existing?.submittedAt ? "Bijwerken" : "Versturen"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PageBody>
    </>
  );
}
