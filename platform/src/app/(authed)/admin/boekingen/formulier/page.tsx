import { asc } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { bookingField } from "@/lib/db/schema";
import { FieldRowActions, NewBookingFieldDialog } from "./field-dialogs";

const TYPE_LABEL: Record<string, string> = {
  text: "Tekst",
  textarea: "Lange tekst",
  email: "E-mail",
  phone: "Telefoon",
  select: "Keuzelijst",
  checkbox: "Ja/nee",
};

export default async function FormulierPage() {
  const fields = await db
    .select()
    .from(bookingField)
    .orderBy(asc(bookingField.position));

  return (
    <>
      <PageHeader
        title="Boekingsformulier"
        description="De velden die bezoekers invullen bij het plannen van een kennismaking. Wijzigingen staan direct live."
        actions={<NewBookingFieldDialog />}
      />
      <PageBody>
        <div className="grid gap-2">
          {fields.map((f, i) => (
            <Card key={f.id} className={f.active ? "" : "opacity-55"}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base">{f.label}</CardTitle>
                    <Badge variant="outline">{TYPE_LABEL[f.fieldType] ?? f.fieldType}</Badge>
                    {f.required ? <Badge variant="gold">verplicht</Badge> : null}
                    {f.system ? <Badge variant="outline">systeem</Badge> : null}
                    {!f.active ? <Badge variant="outline">uit</Badge> : null}
                  </div>
                  <CardDescription className="mt-1 font-mono text-xs">
                    key: {f.key}
                  </CardDescription>
                  {Array.isArray(f.options) && (f.options as string[]).length ? (
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
                <FieldRowActions
                  field={{
                    id: f.id,
                    label: f.label,
                    fieldType: f.fieldType,
                    options: (f.options as string[]) ?? [],
                    placeholder: f.placeholder,
                    required: f.required,
                    active: f.active,
                    system: f.system,
                  }}
                  isFirst={i === 0}
                  isLast={i === fields.length - 1}
                />
              </CardHeader>
            </Card>
          ))}
        </div>
      </PageBody>
    </>
  );
}
