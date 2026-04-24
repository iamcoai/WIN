import { NextResponse, type NextRequest } from "next/server";
import { listSubscriptions } from "@/modules/plugandpay/services/pnp.service";
import { upsertEnrollment } from "@/modules/enrollment/services/enrollment.service";

/**
 * Scheduled reconciliation: pulls the active/recent subscriptions from
 * Plug and Pay and upserts matching enrollment rows. Designed for Vercel
 * Cron — hit this every 15 min or hourly depending on traffic.
 *
 * Security: requires a bearer `Authorization: Bearer ${CRON_SECRET}`
 * header. Vercel Cron sets this automatically when CRON_SECRET is defined
 * in env vars.
 */
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const results = {
    scanned: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: 0,
  };

  try {
    let page = 1;
    while (true) {
      const res = await listSubscriptions({ page, limit: 100 });
      for (const sub of res.data) {
        results.scanned++;
        if (!sub.contact.email) {
          results.skipped++;
          continue;
        }
        try {
          const outcome = await upsertEnrollment({
            email: sub.contact.email,
            productId: sub.productId ?? null,
            source: "plugandpay",
            externalId: sub.id,
            status:
              sub.status === "active"
                ? "active"
                : sub.status === "cancelled"
                  ? "cancelled"
                  : sub.status === "ended"
                    ? "ended"
                    : "paused",
            startedAt: sub.startedAt ? new Date(sub.startedAt) : undefined,
            endedAt: sub.endedAt ? new Date(sub.endedAt) : null,
            metadata: { cron: true, syncedAt: new Date().toISOString() },
          });
          if (outcome.status === "created") results.created++;
          else if (outcome.status === "updated") results.updated++;
          else results.skipped++;
        } catch {
          results.errors++;
        }
      }
      if (res.meta.currentPage >= res.meta.lastPage) break;
      page++;
    }
    return NextResponse.json({ ok: true, ...results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { ok: false, error: msg, ...results },
      { status: 500 },
    );
  }
}
