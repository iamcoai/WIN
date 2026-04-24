"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { document } from "@/lib/db/schema";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getStorageClient, DOCUMENTS_BUCKET } from "@/lib/supabase-storage";

async function requireAdminOrCoach() {
  const cur = await getCurrentUser();
  if (!cur || (cur.user.role !== "admin" && cur.user.role !== "coach")) {
    throw new Error("Niet geautoriseerd");
  }
  return cur;
}

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 120);
}

export async function uploadDocument(formData: FormData): Promise<
  | { ok: true; id: string }
  | { ok: false; error: string }
> {
  let cur;
  try {
    cur = await requireAdminOrCoach();
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Niet geautoriseerd" };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Geen bestand ontvangen." };
  }

  const contactId = (formData.get("contactId") as string) || null;
  const dealId = (formData.get("dealId") as string) || null;
  const workshopId = (formData.get("workshopId") as string) || null;
  const description = ((formData.get("description") as string) || "").trim() || null;

  if (!contactId && !dealId && !workshopId) {
    return { ok: false, error: "Geen entity — document moet aan contact/deal/workshop hangen." };
  }

  const id = `doc_${randomBytes(7).toString("hex")}`;
  const prefix = contactId
    ? `contacts/${contactId}`
    : dealId
      ? `deals/${dealId}`
      : `workshops/${workshopId}`;
  const filePath = `${prefix}/${id}-${safeFileName(file.name)}`;

  try {
    const supabase = getStorageClient();
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (upErr) {
      return { ok: false, error: `Upload mislukt: ${upErr.message}` };
    }

    await db.insert(document).values({
      id,
      name: file.name,
      description,
      filePath,
      mimeType: file.type || null,
      sizeBytes: file.size,
      uploadedBy: cur.user.id,
      contactId,
      dealId,
      workshopId,
    });

    if (contactId) revalidatePath(`/admin/crm/contacts/${contactId}`);
    if (dealId) revalidatePath(`/admin/crm/deals/${dealId}`);
    if (workshopId) revalidatePath(`/admin/workshops/${workshopId}`);

    return { ok: true, id };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Onbekende fout bij uploaden. Check of SUPABASE_SERVICE_ROLE_KEY is ingesteld.";
    return { ok: false, error: msg };
  }
}

export async function getDocumentUrl(documentId: string): Promise<string | null> {
  await requireAdminOrCoach();
  const [d] = await db.select().from(document).where(eq(document.id, documentId)).limit(1);
  if (!d) return null;

  try {
    const supabase = getStorageClient();
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(d.filePath, 60 * 10); // 10 minuten geldig
    if (error) return null;
    return data?.signedUrl ?? null;
  } catch {
    return null;
  }
}

export async function deleteDocument(documentId: string) {
  await requireAdminOrCoach();
  const [d] = await db.select().from(document).where(eq(document.id, documentId)).limit(1);
  if (!d) return;

  try {
    const supabase = getStorageClient();
    await supabase.storage.from(DOCUMENTS_BUCKET).remove([d.filePath]);
  } catch {
    // fall through: still remove the DB row
  }

  await db.delete(document).where(eq(document.id, documentId));
  if (d.contactId) revalidatePath(`/admin/crm/contacts/${d.contactId}`);
  if (d.dealId) revalidatePath(`/admin/crm/deals/${d.dealId}`);
  if (d.workshopId) revalidatePath(`/admin/workshops/${d.workshopId}`);
}
