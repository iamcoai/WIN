import { revalidatePath } from "next/cache";
import { and, eq, gte } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { habit, habitLog } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";
import { EmptyState } from "@/components/ui/empty-state";
import { Sparkles } from "lucide-react";

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function toggleHabit(formData: FormData) {
  "use server";
  const habitId = String(formData.get("habitId"));
  const userId = String(formData.get("userId"));
  const date = today();

  const existing = await db
    .select()
    .from(habitLog)
    .where(and(eq(habitLog.habitId, habitId), eq(habitLog.date, date)))
    .limit(1);

  if (existing.length) {
    await db
      .update(habitLog)
      .set({ completed: !existing[0].completed })
      .where(eq(habitLog.id, existing[0].id));
  } else {
    await db.insert(habitLog).values({
      id: `hl_${randomBytes(8).toString("hex")}`,
      habitId,
      userId,
      date,
      completed: true,
    });
  }
  revalidatePath("/app/habits");
}

export default async function HabitsPage() {
  const current = await getCurrentUser();
  if (!current) return null;

  const habits = await db
    .select()
    .from(habit)
    .where(and(eq(habit.userId, current.user.id), eq(habit.archived, false)));

  // 7-day log window
  const weekAgo = daysAgo(6);
  const logs = habits.length
    ? await db
        .select()
        .from(habitLog)
        .where(
          and(
            eq(habitLog.userId, current.user.id),
            gte(habitLog.date, weekAgo as unknown as string),
          ),
        )
    : [];

  const logsByHabit = new Map<string, Map<string, boolean>>();
  for (const l of logs) {
    if (!logsByHabit.has(l.habitId)) logsByHabit.set(l.habitId, new Map());
    logsByHabit.get(l.habitId)!.set(String(l.date), l.completed);
  }

  const dayLabels = Array.from({ length: 7 }, (_, i) => daysAgo(6 - i));
  const today_ = today();

  return (
    <>
      <PageHeader
        title="Habits"
        description="Kleine gewoontes, zichtbaar gemaakt. Vink af wat je vandaag gedaan hebt."
      />
      <PageBody>
        {habits.length === 0 ? (
          <EmptyState icon={Sparkles} title="Nog geen habits" description="Je coach kan er voor je toevoegen." />
        ) : (
          <div className="grid gap-4">
            {habits.map((h) => {
              const log = logsByHabit.get(h.id) ?? new Map();
              const doneToday = log.get(today_) === true;
              const streak = (() => {
                let n = 0;
                for (let i = 6; i >= 0; i--) {
                  const d = daysAgo(6 - i);
                  if (log.get(d)) n++;
                }
                return n;
              })();
              return (
                <Card key={h.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <CardTitle>{h.title}</CardTitle>
                        {h.description ? (
                          <CardDescription className="mt-1">{h.description}</CardDescription>
                        ) : null}
                      </div>
                      <form action={toggleHabit}>
                        <input type="hidden" name="habitId" value={h.id} />
                        <input type="hidden" name="userId" value={current.user.id} />
                        <button
                          type="submit"
                          aria-label={doneToday ? "Markeren als niet voltooid" : "Markeren als voltooid"}
                          className={
                            doneToday
                              ? "flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl shadow-sm"
                              : "flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-card text-muted-foreground hover:border-primary"
                          }
                        >
                          {doneToday ? "✓" : ""}
                        </button>
                      </form>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1.5">
                      {dayLabels.map((d) => {
                        const done = log.get(d) === true;
                        return (
                          <div
                            key={d}
                            className={
                              done
                                ? "h-6 flex-1 rounded-sm bg-primary"
                                : "h-6 flex-1 rounded-sm bg-muted"
                            }
                            title={d}
                          />
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {streak}/7 dagen deze week
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </PageBody>
    </>
  );
}
