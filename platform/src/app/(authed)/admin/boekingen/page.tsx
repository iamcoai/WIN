import Link from "next/link";
import { asc, desc, gte, lt } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { booking } from "@/lib/db/schema";
import { CancelBookingButton } from "./cancel-booking-button";

const timeFmt = new Intl.DateTimeFormat("nl-NL", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Amsterdam",
});
const dateFmt = new Intl.DateTimeFormat("nl-NL", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Amsterdam",
});
const bookedFmt = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Amsterdam",
});

const STATUS_LABEL: Record<string, { label: string; variant: "gold" | "outline" | "destructive" }> = {
  confirmed: { label: "bevestigd", variant: "gold" },
  rescheduled: { label: "verzet", variant: "outline" },
  cancelled: { label: "geannuleerd", variant: "destructive" },
};

type Row = {
  id: string;
  service: string | null;
  startsAt: Date;
  status: string;
  location: string | null;
  attendeeName: string | null;
  attendeeEmail: string | null;
  responses: unknown;
  bookedAt: Date;
  contactId: string | null;
};

function BookingRow({ b, showCancel }: { b: Row; showCancel: boolean }) {
  const onderwerp =
    b.responses && typeof b.responses === "object"
      ? (b.responses as Record<string, unknown>).onderwerp
      : null;
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium tabular-nums">
            {dateFmt.format(b.startsAt)} · {timeFmt.format(b.startsAt)}
          </p>
          <Badge variant={STATUS_LABEL[b.status]?.variant ?? "outline"}>
            {STATUS_LABEL[b.status]?.label ?? b.status}
          </Badge>
          {b.service ? <Badge variant="olive">{b.service}</Badge> : null}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {b.contactId ? (
            <Link
              href={{ pathname: `/admin/crm/contacts/${b.contactId}` }}
              className="font-medium text-foreground hover:underline"
            >
              {b.attendeeName ?? b.attendeeEmail ?? "Onbekend"}
            </Link>
          ) : (
            (b.attendeeName ?? b.attendeeEmail ?? "Onbekend")
          )}
          {b.attendeeEmail ? ` · ${b.attendeeEmail}` : ""}
        </p>
        {typeof onderwerp === "string" && onderwerp ? (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            “{onderwerp}”
          </p>
        ) : null}
        <p className="mt-1 text-[0.6875rem] text-muted-foreground/70">
          Aangemeld op {bookedFmt.format(b.bookedAt)}
        </p>
      </div>
      {showCancel && b.status !== "cancelled" ? (
        <CancelBookingButton id={b.id} />
      ) : null}
    </div>
  );
}

export default async function BoekingenPage() {
  const now = new Date();
  const upcoming = await db
    .select({
      id: booking.id,
      service: booking.service,
      startsAt: booking.startsAt,
      status: booking.status,
      location: booking.location,
      attendeeName: booking.attendeeName,
      attendeeEmail: booking.attendeeEmail,
      responses: booking.responses,
      bookedAt: booking.bookedAt,
      contactId: booking.contactId,
    })
    .from(booking)
    .where(gte(booking.startsAt, now))
    .orderBy(asc(booking.startsAt));

  const past = await db
    .select({
      id: booking.id,
      service: booking.service,
      startsAt: booking.startsAt,
      status: booking.status,
      location: booking.location,
      attendeeName: booking.attendeeName,
      attendeeEmail: booking.attendeeEmail,
      responses: booking.responses,
      bookedAt: booking.bookedAt,
      contactId: booking.contactId,
    })
    .from(booking)
    .where(lt(booking.startsAt, now))
    .orderBy(desc(booking.startsAt))
    .limit(20);

  return (
    <>
      <PageHeader
        title="Boekingen"
        description="Alle kennismakingen die via de website zijn geboekt."
      />
      <PageBody>
        <h2 className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Komend ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Nog geen komende boekingen.
          </p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((b) => (
              <BookingRow key={b.id} b={b as Row} showCancel />
            ))}
          </div>
        )}

        <h2 className="mb-3 mt-8 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Afgelopen
        </h2>
        {past.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Nog geen afgelopen boekingen.
          </p>
        ) : (
          <div className="space-y-2">
            {past.map((b) => (
              <BookingRow key={b.id} b={b as Row} showCancel={false} />
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
