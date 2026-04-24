import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { enrollment, user } from "@/lib/db/schema";

type Status = "active" | "cancelled" | "ended" | "paused" | "pending";

function makeId(prefix: string) {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}

/** Upsert an enrollment keyed by (source, externalId). Idempotent. */
export async function upsertEnrollment(params: {
  email: string;
  productId?: string | null;
  source: string;
  externalId: string;
  status: Status;
  startedAt?: Date;
  endedAt?: Date | null;
  metadata?: Record<string, unknown>;
}) {
  const [u] = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, params.email.toLowerCase()))
    .limit(1);

  if (!u) {
    return { status: "no_user" as const, email: params.email };
  }

  const existing = await db
    .select()
    .from(enrollment)
    .where(
      and(
        eq(enrollment.source, params.source),
        eq(enrollment.externalId, params.externalId),
      ),
    )
    .limit(1);

  const now = new Date();
  if (existing.length) {
    await db
      .update(enrollment)
      .set({
        status: params.status,
        endedAt: params.endedAt ?? existing[0].endedAt,
        metadata: (params.metadata ?? existing[0].metadata) as object,
        productId: params.productId ?? existing[0].productId,
        updatedAt: now,
      })
      .where(eq(enrollment.id, existing[0].id));
    return { status: "updated" as const, id: existing[0].id, userId: u.id };
  }

  const id = makeId("enr");
  await db.insert(enrollment).values({
    id,
    userId: u.id,
    productId: params.productId ?? null,
    externalId: params.externalId,
    source: params.source,
    status: params.status,
    startedAt: params.startedAt ?? now,
    endedAt: params.endedAt ?? null,
    metadata: (params.metadata ?? {}) as object,
  });
  return { status: "created" as const, id, userId: u.id };
}

/** Is this user currently entitled to /app access? */
export async function hasActiveEnrollment(userId: string): Promise<boolean> {
  const rows = await db
    .select({ id: enrollment.id })
    .from(enrollment)
    .where(and(eq(enrollment.userId, userId), eq(enrollment.status, "active")))
    .limit(1);
  return rows.length > 0;
}
