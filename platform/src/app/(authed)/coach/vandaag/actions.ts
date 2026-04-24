"use server";

import { and, eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { habitLog, journalEntry } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

function todayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function toggleHabitToday(habitId: string, userId: string) {
  const cur = await getCurrentUser();
  if (!cur || cur.user.id !== userId) {
    throw new Error("Niet geautoriseerd");
  }

  const date = todayDate();
  const existing = await db
    .select()
    .from(habitLog)
    .where(and(eq(habitLog.habitId, habitId), eq(habitLog.date, date as unknown as string)))
    .limit(1);

  if (existing.length) {
    await db
      .update(habitLog)
      .set({ completed: !existing[0].completed })
      .where(eq(habitLog.id, existing[0].id));
  } else {
    await db.insert(habitLog).values({
      id: `hl_${randomBytes(7).toString("hex")}`,
      habitId,
      userId,
      date,
      completed: true,
    });
  }

  revalidatePath("/coach/vandaag");
}

export async function saveJournalEntry(input: {
  userId: string;
  content: string;
  mood: number | null;
  prompt?: string;
}) {
  const cur = await getCurrentUser();
  if (!cur || cur.user.id !== input.userId) {
    throw new Error("Niet geautoriseerd");
  }

  const date = todayDate();
  const existing = await db
    .select()
    .from(journalEntry)
    .where(and(eq(journalEntry.userId, input.userId), eq(journalEntry.date, date as unknown as string)))
    .limit(1);

  const now = new Date();
  if (existing.length) {
    await db
      .update(journalEntry)
      .set({
        content: input.content,
        mood: input.mood ?? null,
        prompt: input.prompt ?? existing[0].prompt,
        updatedAt: now,
      })
      .where(eq(journalEntry.id, existing[0].id));
  } else {
    await db.insert(journalEntry).values({
      id: `jrn_${randomBytes(7).toString("hex")}`,
      userId: input.userId,
      date,
      content: input.content,
      mood: input.mood ?? null,
      prompt: input.prompt ?? null,
    });
  }

  revalidatePath("/coach/vandaag");
}
