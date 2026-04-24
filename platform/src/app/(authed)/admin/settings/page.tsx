import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Instellingen" description="Platform-brede configuratie." />
      <PageBody>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Merk + huisstijl</CardTitle>
              <CardDescription>Logo, kleuren, typografie.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Huidige tokens leven in{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">
                platform/src/app/globals.css
              </code>{" "}
              en zijn gebonden aan shadcn primitives. Zie skill{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">/win-brand-rules</code>.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sessies + beveiliging</CardTitle>
              <CardDescription>BetterAuth config.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Sessies geldig 7 dagen, auto-verlengen elke 24u. RBAC-hiërarchie
              admin &gt; coach &gt; client.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>E-mail + meldingen</CardTitle>
              <CardDescription>Transactionele + marketing.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Nog niet ingesteld. Volgende stap: Resend of Supabase SMTP
              koppelen voor welkomstmail + reset-password.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Data + backups</CardTitle>
              <CardDescription>Supabase auto-backups.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Supabase draait dagelijkse backups op Pro-plan. Dev-project op
              free tier — backup zelf via{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">pg_dump</code>{" "}
              bij belangrijke mijlpalen.
            </CardContent>
          </Card>
        </div>
      </PageBody>
    </>
  );
}
