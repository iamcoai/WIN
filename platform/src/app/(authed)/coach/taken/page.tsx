import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { db } from "@/lib/db";
import { contact, deal, task, workshop } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";
import { TasksBoard } from "./tasks-board";

export default async function TakenPage() {
  const current = await getCurrentUser();
  if (!current) return null;
  const me = current.user;

  const rows = await db
    .select()
    .from(task)
    .where(eq(task.ownerId, me.id))
    .orderBy(desc(task.isFocus), asc(task.reminderAt), asc(task.dueAt));

  // Fetch linked entities
  const contactIds = [...new Set(rows.map((r) => r.contactId).filter(Boolean))] as string[];
  const dealIds = [...new Set(rows.map((r) => r.dealId).filter(Boolean))] as string[];
  const workshopIds = [...new Set(rows.map((r) => r.workshopId).filter(Boolean))] as string[];

  const contacts = contactIds.length
    ? await db.select({ id: contact.id, firstName: contact.firstName, lastName: contact.lastName }).from(contact).where(inArray(contact.id, contactIds))
    : [];
  const deals = dealIds.length
    ? await db.select({ id: deal.id, title: deal.title }).from(deal).where(inArray(deal.id, dealIds))
    : [];
  const workshops = workshopIds.length
    ? await db.select({ id: workshop.id, title: workshop.title }).from(workshop).where(inArray(workshop.id, workshopIds))
    : [];

  type Ctx = { type: "contact" | "deal" | "workshop"; id: string; label: string; href: string };
  const ctxById = new Map<string, Ctx>();
  for (const c of contacts) {
    ctxById.set(c.id, {
      type: "contact",
      id: c.id,
      label: [c.firstName, c.lastName].filter(Boolean).join(" "),
      href: `/admin/crm/contacts/${c.id}`,
    });
  }
  for (const d of deals) {
    ctxById.set(d.id, { type: "deal", id: d.id, label: d.title, href: `/admin/crm/deals/${d.id}` });
  }
  for (const w of workshops) {
    ctxById.set(w.id, { type: "workshop", id: w.id, label: w.title, href: `/admin/workshops/${w.id}` });
  }

  const tasksForBoard = rows.map((r) => {
    const ctxId = r.contactId ?? r.dealId ?? r.workshopId;
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      bucket: r.bucket,
      isFocus: r.isFocus,
      waitingOn: r.waitingOn,
      reminderAt: r.reminderAt ? r.reminderAt.toISOString() : null,
      dueAt: r.dueAt ? r.dueAt.toISOString() : null,
      context: ctxId ? ctxById.get(ctxId) ?? null : null,
    };
  });

  return (
    <>
      <PageHeader
        title="Taken"
        description="Alles op één plek. Sleep tussen kolommen of typ 'n' om snel iets toe te voegen."
      />
      <PageBody className="max-w-full">
        <TasksBoard tasks={tasksForBoard} />
      </PageBody>
    </>
  );
}
