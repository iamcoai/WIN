import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Shield, LogOut, Calendar } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function ProfielPage() {
  const current = await getCurrentUser();
  if (!current) return null;
  const u = current.user;

  const initials =
    u.name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "··";

  return (
    <>
      <PageHeader
        title="Profiel"
        description="Jouw gegevens — account, beveiliging, toegang."
      />
      <PageBody className="max-w-3xl">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
                  {initials}
                </div>
                <div>
                  <CardTitle className="text-[1.125rem]">{u.name}</CardTitle>
                  <CardDescription>{u.email}</CardDescription>
                  <div className="mt-1.5">
                    <Badge variant="gold">{u.role}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Accountgegevens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">E-mail</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Rol</p>
                  <p className="text-xs text-muted-foreground">
                    {u.role === "client" ? "Cliënt" : u.role === "coach" ? "Coach" : "Admin"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Aangemaakt</p>
                  <p className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(u.createdAt))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sessie</CardTitle>
              <CardDescription>Log uit op dit apparaat.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action="/api/auth/sign-out" method="post">
                <Button type="submit" variant="outline">
                  <LogOut className="h-4 w-4" /> Uitloggen
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
