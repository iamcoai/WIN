import { asc, eq, sql } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { tag, contactTag, dealTag } from "@/lib/db/schema";
import { NewTagDialog } from "./new-tag-dialog";

export default async function TagsPage() {
  const tags = await db.select().from(tag).orderBy(asc(tag.name));
  const contactCounts = await db
    .select({ tagId: contactTag.tagId, count: sql<number>`COUNT(*)::int` })
    .from(contactTag)
    .groupBy(contactTag.tagId);
  const dealCounts = await db
    .select({ tagId: dealTag.tagId, count: sql<number>`COUNT(*)::int` })
    .from(dealTag)
    .groupBy(dealTag.tagId);

  const contactCountMap = new Map(contactCounts.map((r) => [r.tagId, r.count]));
  const dealCountMap = new Map(dealCounts.map((r) => [r.tagId, r.count]));

  return (
    <>
      <PageHeader
        title="Tags"
        description="Labels voor niches, expertises en segmentatie."
        actions={<NewTagDialog />}
      />
      <PageBody>
        <div className="grid gap-2">
          {tags.map((t) => (
            <Card key={t.id}>
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-primary" />
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  {t.description ? (
                    <span className="text-sm text-muted-foreground">
                      {t.description}
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {contactCountMap.get(t.id) ?? 0} contacten
                  </Badge>
                  <Badge variant="outline">
                    {dealCountMap.get(t.id) ?? 0} deals
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </PageBody>
    </>
  );
}
