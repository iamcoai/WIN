import { desc } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Inbox } from "lucide-react";
import { db } from "@/lib/db";
import { webhookEvent } from "@/lib/db/schema";

export default async function InboxPage() {
  const events = await db
    .select()
    .from(webhookEvent)
    .orderBy(desc(webhookEvent.receivedAt))
    .limit(50);

  return (
    <>
      <PageHeader
        title="Inbox"
        description="Inbound webhooks, meldingen en systeemgebeurtenissen."
      />
      <PageBody>
        {events.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Geen events"
            description="Webhooks en meldingen verschijnen hier zodra ze binnenkomen."
          />
        ) : (
          <div className="grid gap-2">
            {events.map((e) => (
              <Card key={e.id}>
                <CardContent className="flex items-start justify-between gap-3 p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{e.source}</Badge>
                      <span className="text-sm font-medium">{e.eventType}</span>
                      {e.error ? <Badge variant="destructive">error</Badge> : null}
                    </div>
                    {e.externalId ? (
                      <p className="mt-1 text-xs text-muted-foreground">ID: {e.externalId}</p>
                    ) : null}
                    {e.error ? (
                      <p className="mt-2 rounded bg-destructive/10 px-2 py-1 text-xs text-destructive">
                        {e.error}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-end text-xs text-muted-foreground">
                    <time>
                      {new Intl.DateTimeFormat("nl-NL", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(e.receivedAt))}
                    </time>
                    <Badge variant={e.processedAt ? "secondary" : "default"} className="mt-1">
                      {e.processedAt ? "verwerkt" : "pending"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
