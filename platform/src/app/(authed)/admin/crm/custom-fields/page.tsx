import { asc } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { customField } from "@/lib/db/schema";
import { NewCustomFieldDialog } from "./new-field-dialog";
import { DeleteFieldButton } from "./delete-field-button";

export default async function CustomFieldsPage() {
  const fields = await db
    .select()
    .from(customField)
    .orderBy(asc(customField.entity), asc(customField.position));

  const byEntity = {
    contact: fields.filter((f) => f.entity === "contact"),
    deal: fields.filter((f) => f.entity === "deal"),
    workshop: fields.filter((f) => f.entity === "workshop"),
  };

  const ENTITY_LABEL: Record<string, string> = {
    contact: "Contacten",
    deal: "Deals",
    workshop: "Workshops",
  };

  return (
    <>
      <PageHeader
        title="Custom fields"
        description="Eigen velden die je kunt toevoegen aan contacten, deals en workshops."
        actions={<NewCustomFieldDialog />}
      />
      <PageBody>
        <div className="space-y-6">
          {(["contact", "deal", "workshop"] as const).map((entity) => (
            <div key={entity}>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                {ENTITY_LABEL[entity]} ({byEntity[entity].length})
              </h2>
              {byEntity[entity].length === 0 ? (
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Nog geen velden voor {ENTITY_LABEL[entity].toLowerCase()}.
                </p>
              ) : (
                <div className="grid gap-2">
                  {byEntity[entity].map((f) => (
                    <Card key={f.id}>
                      <CardHeader className="flex flex-row items-start justify-between gap-3 p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base">{f.label}</CardTitle>
                            <Badge variant="outline">{f.fieldType}</Badge>
                            {f.required ? (
                              <Badge variant="default" className="text-xs">
                                verplicht
                              </Badge>
                            ) : null}
                          </div>
                          <CardDescription className="mt-1 font-mono text-xs">
                            key: {f.key}
                          </CardDescription>
                          {f.description ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {f.description}
                            </p>
                          ) : null}
                          {Array.isArray(f.options) && f.options.length ? (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {(f.options as string[]).map((o) => (
                                <span
                                  key={o}
                                  className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                                >
                                  {o}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                        <DeleteFieldButton id={f.id} label={f.label} />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </PageBody>
    </>
  );
}
