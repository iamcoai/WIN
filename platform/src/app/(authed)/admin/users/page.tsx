import { desc } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

export default async function AdminUsersPage() {
  const users = await db.select().from(user).orderBy(desc(user.createdAt));

  return (
    <>
      <PageHeader title="Users" description="Alle accounts op het platform." />
      <PageBody>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Naam</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Aangemaakt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          u.role === "admin"
                            ? "default"
                            : u.role === "coach"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Intl.DateTimeFormat("nl-NL", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(u.createdAt))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </PageBody>
    </>
  );
}
