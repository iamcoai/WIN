"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { and, asc, eq, max, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  activity,
  contact,
  contactTag,
  customField,
  deal,
  dealTag,
  pipeline,
  pipelineStage,
  tag,
  workshop,
  workshopAttendee,
  workshopTag,
  task,
} from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

const makeId = (p: string) => `${p}_${randomBytes(7).toString("hex")}`;

async function requireAdminOrCoach() {
  const cur = await getCurrentUser();
  if (!cur || (cur.user.role !== "admin" && cur.user.role !== "coach")) {
    throw new Error("Niet geautoriseerd");
  }
  return cur;
}

// ─── Contacts ────────────────────────────────────────────────────────

export async function createContact(input: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source?: string;
  lifecycle?: "lead" | "prospect" | "customer" | "archived";
  notes?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}) {
  const cur = await requireAdminOrCoach();
  const id = makeId("ct");
  await db.insert(contact).values({
    id,
    firstName: input.firstName ?? null,
    lastName: input.lastName ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    company: input.company ?? null,
    jobTitle: input.jobTitle ?? null,
    source: input.source ?? null,
    lifecycle: input.lifecycle ?? "lead",
    notes: input.notes ?? null,
    ownerId: cur.user.id,
    customFields: (input.customFields ?? {}) as object,
  });
  if (input.tags?.length) {
    await db.insert(contactTag).values(
      input.tags.map((tagId) => ({ contactId: id, tagId })),
    );
  }
  revalidatePath("/admin/crm");
  return id;
}

export async function updateContact(id: string, patch: Partial<typeof contact.$inferInsert>) {
  await requireAdminOrCoach();
  await db
    .update(contact)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(contact.id, id));
  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/contacts/${id}`);
}

export async function setContactTags(contactId: string, tagIds: string[]) {
  await requireAdminOrCoach();
  await db.delete(contactTag).where(eq(contactTag.contactId, contactId));
  if (tagIds.length) {
    await db.insert(contactTag).values(tagIds.map((t) => ({ contactId, tagId: t })));
  }
  revalidatePath(`/admin/crm/contacts/${contactId}`);
  revalidatePath("/admin/crm");
}

// ─── Deals ───────────────────────────────────────────────────────────

export async function createDeal(input: {
  title: string;
  contactId?: string;
  pipelineId: string;
  stageId: string;
  amountCents?: number;
  expectedCloseAt?: string;
  notes?: string;
  customFields?: Record<string, unknown>;
}) {
  const cur = await requireAdminOrCoach();
  const id = makeId("deal");
  const [{ maxPos }] = await db
    .select({
      maxPos: sql<number>`COALESCE(MAX(${deal.position}), -1)::int`,
    })
    .from(deal)
    .where(eq(deal.stageId, input.stageId));
  await db.insert(deal).values({
    id,
    title: input.title,
    contactId: input.contactId ?? null,
    pipelineId: input.pipelineId,
    stageId: input.stageId,
    amountCents: input.amountCents ?? null,
    expectedCloseAt: input.expectedCloseAt ? new Date(input.expectedCloseAt) : null,
    ownerId: cur.user.id,
    position: (maxPos ?? -1) + 1,
    notes: input.notes ?? null,
    customFields: (input.customFields ?? {}) as object,
  });
  revalidatePath("/admin/crm/pipeline");
  return id;
}

export async function moveDeal(input: {
  dealId: string;
  toStageId: string;
  toIndex: number;
}) {
  await requireAdminOrCoach();
  const { dealId, toStageId, toIndex } = input;
  const [d] = await db.select().from(deal).where(eq(deal.id, dealId)).limit(1);
  if (!d) throw new Error("Deal not found");

  const [targetStage] = await db
    .select()
    .from(pipelineStage)
    .where(eq(pipelineStage.id, toStageId))
    .limit(1);
  if (!targetStage) throw new Error("Stage not found");

  // Compact + insert: pull all target-stage deals, remove the moved one if same stage,
  // insert at toIndex, renumber positions. Same for the source if cross-stage.
  const sameStage = d.stageId === toStageId;

  const targetRows = await db
    .select({ id: deal.id })
    .from(deal)
    .where(eq(deal.stageId, toStageId))
    .orderBy(asc(deal.position));

  const otherIds = targetRows.map((r) => r.id).filter((id) => id !== dealId);
  const clampedIndex = Math.max(0, Math.min(toIndex, otherIds.length));
  const newOrder = [...otherIds.slice(0, clampedIndex), dealId, ...otherIds.slice(clampedIndex)];

  // If the deal's current stage differs, re-number the source stage too
  if (!sameStage) {
    const sourceRows = await db
      .select({ id: deal.id })
      .from(deal)
      .where(eq(deal.stageId, d.stageId))
      .orderBy(asc(deal.position));
    const sourceRemaining = sourceRows.map((r) => r.id).filter((id) => id !== dealId);
    for (let i = 0; i < sourceRemaining.length; i++) {
      await db
        .update(deal)
        .set({ position: i })
        .where(eq(deal.id, sourceRemaining[i]));
    }
  }

  // Apply status change if moved to won/lost stage
  const statusPatch: { status?: "open" | "won" | "lost"; closedAt?: Date | null } = {};
  if (targetStage.isWon) {
    statusPatch.status = "won";
    statusPatch.closedAt = new Date();
  } else if (targetStage.isLost) {
    statusPatch.status = "lost";
    statusPatch.closedAt = new Date();
  } else if (d.status !== "open") {
    statusPatch.status = "open";
    statusPatch.closedAt = null;
  }

  // Update the moved deal (stage + position + status)
  await db
    .update(deal)
    .set({
      stageId: toStageId,
      position: clampedIndex,
      updatedAt: new Date(),
      ...statusPatch,
    })
    .where(eq(deal.id, dealId));

  // Re-number the target stage
  for (let i = 0; i < newOrder.length; i++) {
    await db
      .update(deal)
      .set({ position: i })
      .where(eq(deal.id, newOrder[i]));
  }

  // Log activity
  if (!sameStage) {
    await db.insert(activity).values({
      id: makeId("act"),
      type: "stage_change",
      title: `Verplaatst naar ${targetStage.name}`,
      dealId,
      contactId: d.contactId,
      authorId: (await getCurrentUser())?.user.id ?? null,
    });
  }

  revalidatePath("/admin/crm/pipeline");
}

export async function updateDeal(id: string, patch: Partial<typeof deal.$inferInsert>) {
  await requireAdminOrCoach();
  await db
    .update(deal)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(deal.id, id));
  revalidatePath("/admin/crm/pipeline");
  revalidatePath(`/admin/crm/deals/${id}`);
}

// ─── Pipeline stages (add / rename / reorder / delete) ──────────────

export async function addStage(input: { pipelineId: string; name: string; color?: string }) {
  await requireAdminOrCoach();
  const [{ maxPos }] = await db
    .select({
      maxPos: sql<number>`COALESCE(MAX(${pipelineStage.position}), -1)::int`,
    })
    .from(pipelineStage)
    .where(eq(pipelineStage.pipelineId, input.pipelineId));
  const id = makeId("stg");
  await db.insert(pipelineStage).values({
    id,
    pipelineId: input.pipelineId,
    name: input.name,
    color: input.color ?? "neutral",
    position: (maxPos ?? -1) + 1,
  });
  revalidatePath("/admin/crm/pipeline");
  return id;
}

export async function renameStage(stageId: string, name: string) {
  await requireAdminOrCoach();
  await db.update(pipelineStage).set({ name }).where(eq(pipelineStage.id, stageId));
  revalidatePath("/admin/crm/pipeline");
}

export async function reorderStages(pipelineId: string, stageIds: string[]) {
  await requireAdminOrCoach();
  for (let i = 0; i < stageIds.length; i++) {
    await db
      .update(pipelineStage)
      .set({ position: i })
      .where(
        and(
          eq(pipelineStage.id, stageIds[i]),
          eq(pipelineStage.pipelineId, pipelineId),
        ),
      );
  }
  revalidatePath("/admin/crm/pipeline");
}

export async function deleteStage(stageId: string) {
  await requireAdminOrCoach();
  // Only allow delete if no deals in this stage
  const count = await db
    .select({ c: sql<number>`COUNT(*)::int` })
    .from(deal)
    .where(eq(deal.stageId, stageId));
  if ((count[0]?.c ?? 0) > 0) {
    throw new Error("Kan stage niet verwijderen: er staan nog deals in.");
  }
  await db.delete(pipelineStage).where(eq(pipelineStage.id, stageId));
  revalidatePath("/admin/crm/pipeline");
}

// ─── Tags ────────────────────────────────────────────────────────────

export async function createTag(name: string, color = "neutral") {
  await requireAdminOrCoach();
  const id = makeId("tag");
  await db.insert(tag).values({ id, name, color });
  revalidatePath("/admin/crm");
  return id;
}

// ─── Custom fields ───────────────────────────────────────────────────

export async function createCustomField(input: {
  entity: "contact" | "deal" | "workshop";
  key: string;
  label: string;
  fieldType:
    | "text"
    | "textarea"
    | "number"
    | "date"
    | "select"
    | "multi_select"
    | "boolean"
    | "url"
    | "email";
  options?: string[];
  required?: boolean;
  description?: string;
}) {
  await requireAdminOrCoach();
  const [{ maxPos }] = await db
    .select({
      maxPos: sql<number>`COALESCE(MAX(${customField.position}), -1)::int`,
    })
    .from(customField)
    .where(eq(customField.entity, input.entity));
  const id = makeId("cf");
  await db.insert(customField).values({
    id,
    entity: input.entity,
    key: input.key,
    label: input.label,
    fieldType: input.fieldType,
    options: (input.options ?? []) as object,
    required: input.required ?? false,
    description: input.description ?? null,
    position: (maxPos ?? -1) + 1,
  });
  revalidatePath("/admin/crm/custom-fields");
}

export async function deleteCustomField(id: string) {
  await requireAdminOrCoach();
  await db.delete(customField).where(eq(customField.id, id));
  revalidatePath("/admin/crm/custom-fields");
}

// ─── Activities ──────────────────────────────────────────────────────

export async function addActivity(input: {
  type: "note" | "call" | "meeting" | "email" | "task" | "custom";
  title?: string;
  content?: string;
  contactId?: string;
  dealId?: string;
  workshopId?: string;
  occurredAt?: string;
}) {
  const cur = await requireAdminOrCoach();
  await db.insert(activity).values({
    id: makeId("act"),
    type: input.type,
    title: input.title ?? null,
    content: input.content ?? null,
    contactId: input.contactId ?? null,
    dealId: input.dealId ?? null,
    workshopId: input.workshopId ?? null,
    authorId: cur.user.id,
    occurredAt: input.occurredAt ? new Date(input.occurredAt) : new Date(),
  });
  if (input.contactId) revalidatePath(`/admin/crm/contacts/${input.contactId}`);
  if (input.dealId) revalidatePath(`/admin/crm/deals/${input.dealId}`);
  if (input.workshopId) revalidatePath(`/admin/workshops/${input.workshopId}`);
}

// ─── Workshops ───────────────────────────────────────────────────────

export async function createWorkshop(input: {
  title: string;
  description?: string;
  type?: "workshop" | "lezing" | "training" | "masterclass" | "retreat";
  startsAt?: string;
  endsAt?: string;
  location?: string;
  capacity?: number;
  priceCents?: number;
  customFields?: Record<string, unknown>;
}) {
  const cur = await requireAdminOrCoach();
  const id = makeId("ws");
  await db.insert(workshop).values({
    id,
    title: input.title,
    description: input.description ?? null,
    type: input.type ?? "workshop",
    startsAt: input.startsAt ? new Date(input.startsAt) : null,
    endsAt: input.endsAt ? new Date(input.endsAt) : null,
    location: input.location ?? null,
    capacity: input.capacity ?? null,
    priceCents: input.priceCents ?? null,
    ownerId: cur.user.id,
    customFields: (input.customFields ?? {}) as object,
  });
  revalidatePath("/admin/workshops");
  return id;
}

export async function addWorkshopAttendee(workshopId: string, contactId: string) {
  await requireAdminOrCoach();
  await db
    .insert(workshopAttendee)
    .values({
      id: makeId("wa"),
      workshopId,
      contactId,
      status: "registered",
    })
    .onConflictDoNothing();
  revalidatePath(`/admin/workshops/${workshopId}`);
}

export async function updateAttendeeStatus(
  attendeeId: string,
  status: "registered" | "confirmed" | "attended" | "no_show" | "cancelled",
) {
  await requireAdminOrCoach();
  const [a] = await db
    .select()
    .from(workshopAttendee)
    .where(eq(workshopAttendee.id, attendeeId))
    .limit(1);
  await db
    .update(workshopAttendee)
    .set({ status })
    .where(eq(workshopAttendee.id, attendeeId));
  if (a?.workshopId) revalidatePath(`/admin/workshops/${a.workshopId}`);
}

// ─── Tasks (linked to CRM) ──────────────────────────────────────────

export async function createTaskForEntity(input: {
  title: string;
  column?: "todo" | "doing" | "review" | "done";
  contactId?: string;
  dealId?: string;
  workshopId?: string;
  projectId?: string;
  dueAt?: string;
}) {
  await requireAdminOrCoach();
  const id = makeId("task");
  await db.insert(task).values({
    id,
    title: input.title,
    column: input.column ?? "todo",
    contactId: input.contactId ?? null,
    dealId: input.dealId ?? null,
    workshopId: input.workshopId ?? null,
    projectId: input.projectId ?? null,
    dueAt: input.dueAt ? new Date(input.dueAt) : null,
  });
  if (input.contactId) revalidatePath(`/admin/crm/contacts/${input.contactId}`);
  if (input.dealId) revalidatePath(`/admin/crm/deals/${input.dealId}`);
  if (input.workshopId) revalidatePath(`/admin/workshops/${input.workshopId}`);
  revalidatePath("/admin/kanban");
}
