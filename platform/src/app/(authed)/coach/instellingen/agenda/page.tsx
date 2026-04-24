import Link from "next/link";
import { eq } from "drizzle-orm";
import { ArrowLeft, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { calendarAccount, externalEvent } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";
import { sql } from "drizzle-orm";
import { ConnectGoogleButton } from "./connect-google-button";

export default async function CalendarSettingsPage() {
  const me = await getCurrentUser();
  if (!me) return null;

  const accounts = await db
    .select()
    .from(calendarAccount)
    .where(eq(calendarAccount.userId, me.user.id));

  const eventCounts = accounts.length
    ? await db
        .select({
          accountId: externalEvent.calendarAccountId,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(externalEvent)
        .groupBy(externalEvent.calendarAccountId)
    : [];
  const countByAccount = new Map(eventCounts.map((r) => [r.accountId, r.count]));

  const oauthConfigured =
    typeof process.env.GOOGLE_CLIENT_ID === "string" &&
    process.env.GOOGLE_CLIENT_ID.length > 0;

  return (
    <>
      <PageHeader
        title="Agenda-instellingen"
        description="Koppel Google Calendar voor 2-way sync tussen platform en je telefoon."
        breadcrumb={
          <Link
            href={{ pathname: "/coach/agenda" }}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Agenda
          </Link>
        }
      />
      <PageBody className="max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Calendar className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <CardTitle>Google Calendar</CardTitle>
                <CardDescription>
                  Platform-afspraken verschijnen op je telefoon. Externe
                  Google-events blokkeren automatisch als "niet beschikbaar".
                </CardDescription>
              </div>
              {accounts.some((a) => a.provider === "google") ? (
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Verbonden
                </Badge>
              ) : oauthConfigured ? (
                <Badge variant="outline">Niet verbonden</Badge>
              ) : (
                <Badge variant="warning">
                  <AlertCircle className="mr-1 h-3 w-3" /> OAuth niet ingesteld
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {accounts.length === 0 ? (
              <div>
                <p className="mb-3 text-[0.8125rem] text-muted-foreground">
                  Voordat Reza Google kan koppelen moet Chris éénmalig een
                  OAuth-app in Google Cloud Console aanmaken en deze env-vars
                  zetten in Vercel:
                </p>
                <pre className="overflow-x-auto rounded-lg border border-border bg-muted/30 px-3 py-2 text-[0.75rem] text-muted-foreground">
                  <code>
                    GOOGLE_CLIENT_ID=...{"\n"}
                    GOOGLE_CLIENT_SECRET=...{"\n"}
                    GOOGLE_OAUTH_REDIRECT_URI=https://app.win.nl/api/calendar/google/callback
                  </code>
                </pre>
                <p className="mt-3 text-[0.8125rem] text-muted-foreground">
                  Eenmaal ingesteld: klik op de knop hieronder. Je wordt naar
                  Google gestuurd, geeft toestemming (Calendar read + write),
                  en landt terug hier met alles gesynced.
                </p>
                <div className="mt-4">
                  <ConnectGoogleButton oauthConfigured={oauthConfigured} />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {a.displayName ?? a.email ?? a.externalId}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {a.provider} · {countByAccount.get(a.id) ?? 0} events
                          gesynced
                          {a.lastSyncedAt ? (
                            <>
                              {" "}
                              · laatst{" "}
                              {new Intl.DateTimeFormat("nl-NL", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(new Date(a.lastSyncedAt))}
                            </>
                          ) : null}
                        </p>
                      </div>
                    </div>
                    <Badge variant={a.syncEnabled ? "success" : "outline"}>
                      {a.syncEnabled ? "actief" : "gepauzeerd"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-5">
          <CardHeader>
            <CardTitle className="text-base">Wat wordt gesynced</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-[0.8125rem]">
            <p>
              <span className="font-medium text-foreground">→ Naar Google:</span>{" "}
              elke nieuwe afspraak of workshop die je in het platform aanmaakt.
            </p>
            <p>
              <span className="font-medium text-foreground">← Van Google:</span>{" "}
              al je Google-events verschijnen in /coach/agenda als "externe
              afspraken" (grijs). Platform-booking-flows houden er rekening
              mee zodat dubbele boekingen voorkomen worden.
            </p>
          </CardContent>
        </Card>
      </PageBody>
    </>
  );
}
