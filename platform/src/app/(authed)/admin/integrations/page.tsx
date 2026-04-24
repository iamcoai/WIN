import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

const INTEGRATIONS = [
  {
    name: "Supabase (Postgres)",
    status: process.env.DATABASE_URL ? "connected" : "missing",
    config: "DATABASE_URL (pooler) — platform/.env.local",
    notes: "Dev project ujlkvaxlmrsvzgmlakgn. MCP voor schema-werk.",
  },
  {
    name: "BetterAuth",
    status: process.env.BETTER_AUTH_SECRET ? "connected" : "missing",
    config: "BETTER_AUTH_SECRET + BETTER_AUTH_URL",
    notes: "Email + password; 7-day sessions.",
  },
  {
    name: "Plug and Pay",
    status: process.env.PLUGANDPAY_API_KEY ? "connected" : "missing",
    config: "PLUGANDPAY_API_KEY (PAT) + PLUGANDPAY_WEBHOOK_SECRET",
    notes: "Merchant tenant 45161. Webhooks naar /api/webhooks/plugandpay. Cron /api/cron/plugandpay-sync.",
  },
  {
    name: "Vercel Cron",
    status: process.env.CRON_SECRET ? "connected" : "missing",
    config: "CRON_SECRET + vercel.json crons",
    notes: "Bewerkt /api/cron/plugandpay-sync elk uur (aanbevolen).",
  },
  {
    name: "Google Stitch (Design)",
    status: process.env.STITCH_API_KEY ? "connected" : "missing",
    config: "STITCH_API_KEY (root .env.local)",
    notes: "Design-generatie via MCP + scripts/stitch-generate.mjs.",
  },
  {
    name: "PostHog",
    status: "not-configured",
    config: "NEXT_PUBLIC_POSTHOG_KEY",
    notes: "Analytics — nog niet aangesloten.",
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <PageHeader title="Integraties" description="Externe systemen gekoppeld aan het platform." />
      <PageBody>
        <div className="grid gap-3 md:grid-cols-2">
          {INTEGRATIONS.map((i) => (
            <Card key={i.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{i.name}</CardTitle>
                  <Badge
                    variant={
                      i.status === "connected"
                        ? "default"
                        : i.status === "missing"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {i.status === "connected" ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Actief
                      </>
                    ) : i.status === "missing" ? (
                      <>
                        <AlertCircle className="mr-1 h-3 w-3" /> Config ontbreekt
                      </>
                    ) : (
                      "Niet ingesteld"
                    )}
                  </Badge>
                </div>
                <CardDescription className="mt-1 font-mono text-xs">{i.config}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{i.notes}</CardContent>
            </Card>
          ))}
        </div>
      </PageBody>
    </>
  );
}
