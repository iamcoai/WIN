import { gte, isNotNull, ne, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { booking, contact } from "@/lib/db/schema";

const WEEKS = 8;
const AMS = "Europe/Amsterdam";

const amsDayFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: AMS,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Monday of the week containing dateStr — pure calendar math. */
function mondayOf(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - ((dt.getUTCDay() + 6) % 7));
  return dt.toISOString().slice(0, 10);
}

function addDaysStr(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

const weekLabelFmt = new Intl.DateTimeFormat("nl-NL", {
  timeZone: "UTC",
  day: "numeric",
  month: "short",
});

function DistList({ rows }: { rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (!rows.length) {
    return <p className="text-xs text-muted-foreground">Nog geen data.</p>;
  }
  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2">
          <span className="w-24 truncate text-xs text-muted-foreground" title={r.label}>
            {r.label}
          </span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-primary"
              style={{ width: `${(r.count / max) * 100}%` }}
            />
          </span>
          <span className="w-6 text-right text-xs font-semibold tabular-nums">
            {r.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export async function AnalyticsStrip() {
  // Weeks bucketed in Europe/Amsterdam — server TZ (UTC on Vercel) mag
  // de grafiek niet verschuiven.
  const firstMonday = addDaysStr(
    mondayOf(amsDayFmt.format(new Date())),
    -(WEEKS - 1) * 7,
  );
  const since = new Date(`${firstMonday}T00:00:00Z`);
  since.setUTCDate(since.getUTCDate() - 1); // marge voor UTC↔AMS-verschil

  const weekExpr = sql`date_trunc('week', ${booking.bookedAt} AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Amsterdam')`;
  const [signupRows, serviceRows, sourceRows, lifecycleRows] =
    await Promise.all([
      db
        .select({
          week: sql<string>`to_char(${weekExpr}, 'YYYY-MM-DD')`,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(booking)
        .where(gte(booking.bookedAt, since))
        .groupBy(weekExpr),
      db
        .select({ label: booking.service, count: sql<number>`COUNT(*)::int` })
        .from(booking)
        .where(isNotNull(booking.service))
        .groupBy(booking.service)
        .orderBy(sql`COUNT(*) DESC`)
        .limit(5),
      db
        .select({ label: contact.source, count: sql<number>`COUNT(*)::int` })
        .from(contact)
        .where(isNotNull(contact.source))
        .groupBy(contact.source)
        .orderBy(sql`COUNT(*) DESC`)
        .limit(5),
      db
        .select({ label: contact.lifecycle, count: sql<number>`COUNT(*)::int` })
        .from(contact)
        .where(ne(contact.lifecycle, "archived"))
        .groupBy(contact.lifecycle),
    ]);

  const countByWeek = new Map(signupRows.map((r) => [r.week, r.count]));
  const weeks: { key: string; label: string; count: number }[] = [];
  for (let i = 0; i < WEEKS; i++) {
    const key = addDaysStr(firstMonday, i * 7);
    weeks.push({
      key,
      label: weekLabelFmt.format(new Date(`${key}T00:00:00Z`)),
      count: countByWeek.get(key) ?? 0,
    });
  }
  const maxWeek = Math.max(1, ...weeks.map((w) => w.count));
  const totalSignups = weeks.reduce((sum, w) => sum + w.count, 0);

  const LIFECYCLE_LABEL: Record<string, string> = {
    lead: "Lead",
    prospect: "Prospect",
    customer: "Klant",
  };
  const lifecycleOrdered = ["lead", "prospect", "customer"]
    .map((l) => ({
      label: LIFECYCLE_LABEL[l],
      count: lifecycleRows.find((r) => r.label === l)?.count ?? 0,
    }))
    .filter((r) => r.count > 0 || true);

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {/* Aanmeldingen per week — mini bar chart, één serie in primary */}
      <Card>
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Aanmeldingen per week
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <p className="mb-2 font-heading text-[1.375rem] font-semibold tabular-nums tracking-tight">
            {totalSignups}
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              afgelopen {WEEKS} weken
            </span>
          </p>
          <div className="flex h-14 items-end gap-[2px]" role="img" aria-label={`Aanmeldingen per week, laatste ${WEEKS} weken`}>
            {weeks.map((w) => (
              <div
                key={w.key}
                className="group relative flex-1"
                title={`Week van ${w.label}: ${w.count} aanmelding${w.count === 1 ? "" : "en"}`}
              >
                <div
                  className="w-full rounded-t-[4px] bg-primary transition-colors group-hover:bg-primary/80"
                  style={{
                    height: `${Math.max(w.count === 0 ? 4 : 8, (w.count / maxWeek) * 56)}px`,
                    opacity: w.count === 0 ? 0.2 : 1,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[0.625rem] text-muted-foreground">
            <span>{weeks[0].label}</span>
            <span>{weeks[WEEKS - 1].label}</span>
          </div>
          {/* Tabel-weergave voor screenreaders */}
          <table className="sr-only">
            <caption>Aanmeldingen per week</caption>
            <tbody>
              {weeks.map((w) => (
                <tr key={w.key}>
                  <th scope="row">week van {w.label}</th>
                  <td>{w.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Per dienst
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <DistList rows={serviceRows.map((r) => ({ label: r.label ?? "—", count: r.count }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Bron
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <DistList rows={sourceRows.map((r) => ({ label: r.label ?? "—", count: r.count }))} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-1">
          <CardTitle className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Lead → klant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <DistList rows={lifecycleOrdered} />
        </CardContent>
      </Card>
    </div>
  );
}
