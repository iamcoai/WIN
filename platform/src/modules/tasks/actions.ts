"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { task } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

type Bucket = "today" | "next" | "waiting" | "someday" | "inbox" | "done";

async function requireUser() {
  const cur = await getCurrentUser();
  if (!cur) throw new Error("Niet geautoriseerd");
  return cur;
}

const makeId = () => `task_${randomBytes(7).toString("hex")}`;

export async function createQuickTask(input: {
  title: string;
  bucket?: Bucket;
  contactId?: string;
  dealId?: string;
  workshopId?: string;
}) {
  const cur = await requireUser();
  const id = makeId();
  await db.insert(task).values({
    id,
    title: input.title.trim(),
    bucket: input.bucket ?? "inbox",
    ownerId: cur.user.id,
    contactId: input.contactId ?? null,
    dealId: input.dealId ?? null,
    workshopId: input.workshopId ?? null,
  });
  revalidatePath("/coach/taken");
  revalidatePath("/coach/vandaag");
  return id;
}

export async function moveTaskToBucket(taskId: string, bucket: Bucket) {
  await requireUser();
  const patch: { bucket: Bucket; isFocus?: boolean; updatedAt: Date } = {
    bucket,
    updatedAt: new Date(),
  };
  // Moving out of today or into done clears focus
  if (bucket !== "today") {
    patch.isFocus = false;
  }
  await db.update(task).set(patch).where(eq(task.id, taskId));
  revalidatePath("/coach/taken");
  revalidatePath("/coach/vandaag");
}

export async function toggleFocus(taskId: string) {
  const cur = await requireUser();
  const [t] = await db.select().from(task).where(eq(task.id, taskId)).limit(1);
  if (!t) return;
  const next = !t.isFocus;
  // Only one focus task at a time per owner
  if (next) {
    await db
      .update(task)
      .set({ isFocus: false })
      .where(and(eq(task.ownerId, cur.user.id), eq(task.isFocus, true)));
  }
  await db
    .update(task)
    .set({ isFocus: next, bucket: next ? "today" : t.bucket })
    .where(eq(task.id, taskId));
  revalidatePath("/coach/taken");
  revalidatePath("/coach/vandaag");
}

export async function toggleTaskDone(taskId: string) {
  await requireUser();
  const [t] = await db.select().from(task).where(eq(task.id, taskId)).limit(1);
  if (!t) return;
  await db
    .update(task)
    .set({
      bucket: t.bucket === "done" ? "today" : "done",
      isFocus: false,
      updatedAt: new Date(),
    })
    .where(eq(task.id, taskId));
  revalidatePath("/coach/taken");
  revalidatePath("/coach/vandaag");
}

export async function updateTaskWaitingOn(taskId: string, waitingOn: string) {
  await requireUser();
  await db
    .update(task)
    .set({ waitingOn, bucket: "waiting", updatedAt: new Date() })
    .where(eq(task.id, taskId));
  revalidatePath("/coach/taken");
}

export async function scheduleFollowUp(input: {
  title: string;
  daysFromNow: number;
  contactId?: string;
  dealId?: string;
  workshopId?: string;
}) {
  const cur = await requireUser();
  const id = makeId();
  const reminder = new Date(Date.now() + input.daysFromNow * 24 * 3600 * 1000);
  await db.insert(task).values({
    id,
    title: input.title.trim(),
    bucket: input.daysFromNow === 0 ? "today" : "next",
    ownerId: cur.user.id,
    contactId: input.contactId ?? null,
    dealId: input.dealId ?? null,
    workshopId: input.workshopId ?? null,
    reminderAt: reminder,
    dueAt: reminder,
  });
  revalidatePath("/coach/taken");
  revalidatePath("/coach/vandaag");
  if (input.contactId) revalidatePath(`/admin/crm/contacts/${input.contactId}`);
  if (input.dealId) revalidatePath(`/admin/crm/deals/${input.dealId}`);
  return id;
}

export async function deleteTask(taskId: string) {
  await requireUser();
  await db.delete(task).where(eq(task.id, taskId));
  revalidatePath("/coach/taken");
  revalidatePath("/coach/vandaag");
}
