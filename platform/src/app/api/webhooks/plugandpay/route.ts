import { NextResponse, type NextRequest } from "next/server";
import { randomBytes, createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import { webhookEvent } from "@/lib/db/schema";
import { handlePlugAndPayEvent } from "@/modules/plugandpay/events/handler";

const SIGNATURE_HEADER = "x-plugandpay-signature";
const TRIGGER_HEADER = "x-plugandpay-trigger";

/**
 * Verify the webhook signature. P&P docs don't specify the algorithm yet;
 * we default to HMAC-SHA256(secret, raw body) as the industry-standard
 * approach. If a secret is not configured, we accept unsigned requests
 * in development only — guard with NODE_ENV === 'production'.
 */
function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.PLUGANDPAY_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(signature.replace(/^sha256=/, ""), "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER);
  const trigger = request.headers.get(TRIGGER_HEADER) ?? "";

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: Record<string, any>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const eventId = `wh_${randomBytes(8).toString("hex")}`;
  await db.insert(webhookEvent).values({
    id: eventId,
    source: "plugandpay",
    eventType: trigger || payload?.event ? (trigger || payload.event) : "unknown",
    externalId: payload?.id ? String(payload.id) : null,
    payload,
  });

  try {
    const result = await handlePlugAndPayEvent({
      trigger: trigger || payload?.event || "unknown",
      payload,
    });
    await db
      .update(webhookEvent)
      .set({ processedAt: new Date() })
      .where(eqById(eventId));
    return NextResponse.json({ ok: true, eventId, result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db
      .update(webhookEvent)
      .set({ processedAt: new Date(), error: msg })
      .where(eqById(eventId));
    return NextResponse.json(
      { ok: false, eventId, error: msg },
      { status: 500 },
    );
  }
}

// Helper scoped here to avoid re-importing eq for one call.
import { eq } from "drizzle-orm";
function eqById(id: string) {
  return eq(webhookEvent.id, id);
}
