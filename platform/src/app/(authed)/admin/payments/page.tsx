import { desc } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { CreditCard } from "lucide-react";
import { db } from "@/lib/db";
import { enrollment, user, product } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function PaymentsPage() {
  const rows = await db
    .select({
      id: enrollment.id,
      status: enrollment.status,
      source: enrollment.source,
      externalId: enrollment.externalId,
      startedAt: enrollment.startedAt,
      userName: user.name,
      userEmail: user.email,
      productName: product.name,
      priceCents: product.priceCents,
      currency: product.currency,
    })
    .from(enrollment)
    .leftJoin(user, eq(user.id, enrollment.userId))
    .leftJoin(product, eq(product.id, enrollment.productId))
    .orderBy(desc(enrollment.startedAt));

  const totalCents = rows
    .filter((r) => r.status === "active")
    .reduce((sum, r) => sum + (r.priceCents ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Betalingen"
        description="Inschrijvingen via Plug and Pay, live gesynced via webhook + cron."
      />
      <PageBody>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Actieve inschrijvingen</CardDescription>
              <CardTitle className="text-3xl">
                {rows.filter((r) => r.status === "active").length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Totaal actief</CardDescription>
              <CardTitle className="text-3xl">
                €{(totalCents / 100).toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Laatste 30 dagen</CardDescription>
              <CardTitle className="text-3xl">
                {
                  rows.filter(
                    (r) =>
                      r.startedAt &&
                      new Date(r.startedAt).getTime() > Date.now() - 30 * 24 * 3600 * 1000,
                  ).length
                }
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon={CreditCard} title="Nog geen inschrijvingen" />
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Klant</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Bedrag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>P&P ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{r.userName ?? "—"}</span>
                          <span className="text-xs text-muted-foreground">{r.userEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.productName ?? "—"}
                      </TableCell>
                      <TableCell>
                        {r.priceCents
                          ? `€${(r.priceCents / 100).toFixed(2)}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            r.status === "active"
                              ? "default"
                              : r.status === "cancelled" || r.status === "ended"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.startedAt
                          ? new Intl.DateTimeFormat("nl-NL").format(new Date(r.startedAt))
                          : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.externalId ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </PageBody>
    </>
  );
}
