"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { crmView } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";

const makeId = (p: string) => `${p}_${randomBytes(7).toString("hex")}`;

async function requireAdminOrCoach() {
  const cur = await getCurrentUser();
  if (!cur || (cur.user.role !== "admin" && cur.user.role !== "coach")) {
    throw new Error("Niet geautoriseerd");
  }
  return cur;
}

export type ViewConfig = {
  columns: string[];
  filters: { field: string; value: string }[];
  sort: { field: string; dir: "asc" | "desc" }[];
  density: "comfortable" | "compact";
};

export async function saveCrmView(input: {
  id?: string;
  name: string;
  config: ViewConfig;
  isDefault?: boolean;
}) {
  const cur = await requireAdminOrCoach();
  const name = input.name.trim();
  if (!name) throw new Error("Naam is verplicht");

  if (input.isDefault) {
    await db
      .update(crmView)
      .set({ isDefault: false })
      .where(and(eq(crmView.userId, cur.user.id), eq(crmView.entity, "contact")));
  }

  if (input.id) {
    await db
      .update(crmView)
      .set({
        name,
        columns: input.config.columns,
        filters: input.config.filters,
        sort: input.config.sort,
        density: input.config.density,
        isDefault: input.isDefault ?? false,
        updatedAt: new Date(),
      })
      .where(and(eq(crmView.id, input.id), eq(crmView.userId, cur.user.id)));
    revalidatePath("/admin/crm");
    return input.id;
  }

  const id = makeId("cv");
  await db.insert(crmView).values({
    id,
    entity: "contact",
    name,
    userId: cur.user.id,
    columns: input.config.columns,
    filters: input.config.filters,
    sort: input.config.sort,
    density: input.config.density,
    isDefault: input.isDefault ?? false,
  });
  revalidatePath("/admin/crm");
  return id;
}

export async function deleteCrmView(id: string) {
  const cur = await requireAdminOrCoach();
  await db
    .delete(crmView)
    .where(and(eq(crmView.id, id), eq(crmView.userId, cur.user.id)));
  revalidatePath("/admin/crm");
}
