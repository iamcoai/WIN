import { desc } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Briefcase } from "lucide-react";
import { db } from "@/lib/db";
import { lead } from "@/lib/db/schema";

const COLUMNS = ["new", "contacted", "qualified", "won", "lost"] as const;
const LABEL: Record<(typeof COLUMNS)[number], string> = {
  new: "Nieuw",
  contacted: "Contact",
  qualified: "Gekwalificeerd",
  won: "Gewonnen",
  lost: "Verloren",
};

export default async function CRMPage() {
  const leads = await db.select().from(lead).orderBy(desc(lead.createdAt));

  const byStatus = Object.fromEntries(
    COLUMNS.map((c) => [c, leads.filter((l) => l.status === c)]),
  ) as Record<(typeof COLUMNS)[number], typeof leads>;

  return (
    <>
      <PageHeader title="CRM" description="Leads, inschrijvingen, opvolging." />
      <PageBody className="max-w-full">
        {leads.length === 0 ? (
          <EmptyState icon={Briefcase} title="Geen leads" />
        ) : (
          <div className="grid gap-4 md:grid-cols-5">
            {COLUMNS.map((col) => (
              <div key={col} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-semibold text-foreground">{LABEL[col]}</h3>
                  <Badge variant="outline">{byStatus[col].length}</Badge>
                </div>
                <div className="flex flex-col gap-2">
                  {byStatus[col].map((l) => (
                    <Card key={l.id}>
                      <CardHeader className="p-3">
                        <CardTitle className="text-sm">{l.name ?? l.email ?? "Onbekend"}</CardTitle>
                        {l.email ? (
                          <CardDescription className="text-xs">{l.email}</CardDescription>
                        ) : null}
                        {l.notes ? (
                          <p className="mt-1 text-xs text-muted-foreground">{l.notes}</p>
                        ) : null}
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
