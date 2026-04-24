import Link from "next/link";
import { and, asc, eq, gte, lte, or, sql } from "drizzle-orm";
import { ChevronLeft, ChevronRight, CalendarPlus } from "lucide-react";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import {
  afspraak,
  workshop,
  task,
  externalEvent,
  calendarAccount,
  user,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";
import { cn } from "@/lib/utils";

type Search = { month?: string };

function parseMonth(s?: string): Date {
  const now = new Date();
  if (!s) return new Date(now.getFullYear(), now.getMonth(), 1);
  const [y, m] = s.split("-").map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m)) return new Date(now.getFullYear(), now.getMonth(), 1);
  return new Date(y, m - 1, 1);
}

function formatMonthParam(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthName(d: Date) {
  return new Intl.DateTimeFormat("nl-NL", {
    month: "long",
    year: "numeric",
  }).format(d);
}

function isoDateOnly(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const me = await getCurrentUser();
  if (!me) return null;

  const month = parseMonth(sp.month);
  // Monday as first day of week (NL convention)
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  // Monday-based grid-start: find first Monday on or before firstOfMonth
  const gridStart = new Date(firstOfMonth);
  const dayOfWeek = (firstOfMonth.getDay() + 6) % 7; // 0=Mon
  gridStart.setDate(firstOfMonth.getDate() - dayOfWeek);
  const gridEnd = new Date(gridStart);
  gridEnd.setDate(gridStart.getDate() + 41); // 6 weeks

  const rangeStart = new Date(gridStart);
  rangeStart.setHours(0, 0, 0, 0);
  const rangeEnd = new Date(gridEnd);
  rangeEnd.setHours(23, 59, 59, 999);

  // Fetch afspraken in this month's grid
  const sessions = await db
    .select({
      id: afspraak.id,
      title: afspraak.title,
      startAt: afspraak.startAt,
      endAt: afspraak.endAt,
      status: afspraak.status,
      clientName: user.name,
    })
    .from(afspraak)
    .leftJoin(user, eq(user.id, afspraak.clientId))
    .where(
      and(
        me.user.role === "admin" ? sql`true` : eq(afspraak.coachId, me.user.id),
        gte(afspraak.startAt, rangeStart),
        lte(afspraak.startAt, rangeEnd),
      ),
    )
    .orderBy(asc(afspraak.startAt));

  const workshops = await db
    .select({
      id: workshop.id,
      title: workshop.title,
      startsAt: workshop.startsAt,
      status: workshop.status,
    })
    .from(workshop)
    .where(
      and(
        gte(workshop.startsAt, rangeStart),
        lte(workshop.startsAt, rangeEnd),
      ),
    );

  // Tasks with due_at in range, owned by me
  const dueTasks = await db
    .select({
      id: task.id,
      title: task.title,
      dueAt: task.dueAt,
      bucket: task.bucket,
    })
    .from(task)
    .where(
      and(
        eq(task.ownerId, me.user.id),
        gte(task.dueAt, rangeStart),
        lte(task.dueAt, rangeEnd),
      ),
    );

  // External events: any account of mine, events in range
  const externals = await db
    .select({
      id: externalEvent.id,
      title: externalEvent.title,
      startsAt: externalEvent.startsAt,
      endsAt: externalEvent.endsAt,
      location: externalEvent.location,
      htmlLink: externalEvent.htmlLink,
    })
    .from(externalEvent)
    .innerJoin(calendarAccount, eq(calendarAccount.id, externalEvent.calendarAccountId))
    .where(
      and(
        eq(calendarAccount.userId, me.user.id),
        gte(externalEvent.startsAt, rangeStart),
        lte(externalEvent.startsAt, rangeEnd),
      ),
    );

  // Check if any calendar account is connected
  const accounts = await db
    .select({ id: calendarAccount.id, provider: calendarAccount.provider })
    .from(calendarAccount)
    .where(eq(calendarAccount.userId, me.user.id));

  // Build day buckets
  type DayEvent = {
    kind: "session" | "workshop" | "task" | "external";
    id: string;
    title: string;
    time?: string;
    href?: string;
    color: string;
  };
  const byDay = new Map<string, DayEvent[]>();
  const push = (d: Date, e: DayEvent) => {
    const k = isoDateOnly(d);
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(e);
  };

  for (const s of sessions) {
    push(new Date(s.startAt), {
      kind: "session",
      id: s.id,
      title: `${new Intl.DateTimeFormat("nl-NL", { hour: "2-digit", minute: "2-digit" }).format(new Date(s.startAt))} ${s.title}${s.clientName ? ` · ${s.clientName}` : ""}`,
      time: new Intl.DateTimeFormat("nl-NL", { hour: "2-digit", minute: "2-digit" }).format(new Date(s.startAt)),
      href: `/coach/sessies/${s.id}/prep`,
      color: "bg-primary/12 text-primary",
    });
  }
  for (const w of workshops) {
    if (!w.startsAt) continue;
    push(new Date(w.startsAt), {
      kind: "workshop",
      id: w.id,
      title: `🎓 ${w.title}`,
      href: `/admin/workshops/${w.id}`,
      color: "bg-secondary/15 text-secondary",
    });
  }
  for (const t of dueTasks) {
    if (!t.dueAt) continue;
    push(new Date(t.dueAt), {
      kind: "task",
      id: t.id,
      title: `✓ ${t.title}`,
      href: `/coach/taken`,
      color: "bg-info/12 text-info",
    });
  }
  for (const e of externals) {
    push(new Date(e.startsAt), {
      kind: "external",
      id: e.id,
      title: e.title ?? "Externe afspraak",
      href: e.htmlLink ?? undefined,
      color: "bg-muted text-muted-foreground",
    });
  }

  // Build cells
  const cells: Array<{ date: Date; inMonth: boolean; events: DayEvent[] }> = [];
  const today = isoDateOnly(new Date());
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push({
      date: d,
      inMonth: d.getMonth() === month.getMonth(),
      events: byDay.get(isoDateOnly(d)) ?? [],
    });
  }

  const prevMonth = formatMonthParam(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  const nextMonth = formatMonthParam(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  const thisMonth = formatMonthParam(new Date());

  return (
    <>
      <PageHeader
        title="Agenda"
        description={
          accounts.length
            ? `${accounts.length} extern gekoppeld · sessies, workshops en taken samen`
            : "Jouw sessies, workshops en taken — koppel Google voor je externe afspraken"
        }
        actions={
          <div className="flex items-center gap-2">
            {!accounts.length ? (
              <Link
                href={{ pathname: "/coach/instellingen/agenda" }}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-[0.8125rem] font-medium shadow-xs transition-colors hover:bg-muted"
              >
                <CalendarPlus className="h-3.5 w-3.5" /> Verbind Google
              </Link>
            ) : (
              <Link
                href={{ pathname: "/coach/instellingen/agenda" }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Instellingen →
              </Link>
            )}
          </div>
        }
      />
      <PageBody className="max-w-full">
        {/* Month picker */}
        <div className="mb-4 flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 shadow-xs">
          <div className="flex items-center gap-1">
            <Link
              href={{ pathname: "/coach/agenda", query: { month: prevMonth } as never }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Vorige maand"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <Link
              href={{ pathname: "/coach/agenda", query: { month: nextMonth } as never }}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Volgende maand"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href={{ pathname: "/coach/agenda", query: { month: thisMonth } as never }}
              className="ml-2 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Vandaag
            </Link>
          </div>
          <h2 className="font-heading text-[1.0625rem] font-semibold tracking-tight capitalize">
            {monthName(month)}
          </h2>
          <div className="flex items-center gap-3 text-[0.6875rem]">
            <Badge variant="gold" className="text-[10px]">Sessies</Badge>
            <Badge variant="olive" className="text-[10px]">Workshops</Badge>
            <Badge variant="info" className="text-[10px]">Taken</Badge>
            {accounts.length ? (
              <Badge variant="outline" className="text-[10px]">Extern</Badge>
            ) : null}
          </div>
        </div>

        {/* Calendar grid */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          {/* Weekday header */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/30">
            {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((d) => (
              <div
                key={d}
                className="px-2 py-2 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-muted-foreground"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((cell, i) => {
              const isToday = isoDateOnly(cell.date) === today;
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[5.5rem] border-b border-r border-border p-1.5",
                    (i + 1) % 7 === 0 && "border-r-0",
                    i >= 35 && "border-b-0",
                    !cell.inMonth && "bg-muted/20 text-muted-foreground/50",
                  )}
                >
                  <div
                    className={cn(
                      "mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[0.6875rem] tabular-nums",
                      isToday
                        ? "bg-primary font-semibold text-primary-foreground"
                        : cell.inMonth
                          ? "font-medium text-foreground"
                          : "text-muted-foreground/50",
                    )}
                  >
                    {cell.date.getDate()}
                  </div>
                  <div className="space-y-0.5">
                    {cell.events.slice(0, 3).map((e) => {
                      const content = (
                        <span
                          className={cn(
                            "block truncate rounded-md px-1.5 py-0.5 text-[0.625rem] leading-tight",
                            e.color,
                          )}
                        >
                          {e.title}
                        </span>
                      );
                      return e.href ? (
                        <Link
                          key={e.id}
                          href={{ pathname: e.href } as never}
                          className="block"
                        >
                          {content}
                        </Link>
                      ) : (
                        <div key={e.id}>{content}</div>
                      );
                    })}
                    {cell.events.length > 3 ? (
                      <p className="px-1 text-[0.6rem] text-muted-foreground">
                        +{cell.events.length - 3} meer
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageBody>
    </>
  );
}
