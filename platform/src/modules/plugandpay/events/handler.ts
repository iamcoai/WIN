import { upsertEnrollment } from "@/modules/enrollment/services/enrollment.service";
import { mapSubscription } from "../mappers";

/** Map a P&P trigger type to an internal enrollment status. */
function statusFromTrigger(trigger: string): "active" | "cancelled" | "paused" | "ended" | null {
  switch (trigger) {
    case "subscription_created":
    case "subscription_activated":
    case "subscription_renewed":
    case "order_paid":
      return "active";
    case "subscription_cancelled":
      return "cancelled";
    case "subscription_paused":
      return "paused";
    case "subscription_ended":
      return "ended";
    default:
      return null;
  }
}

/**
 * Dispatch a P&P webhook payload to the right handler.
 * Payload shape varies per trigger; we normalise via subscription mapper
 * when the payload carries a subscription object.
 */
export async function handlePlugAndPayEvent(event: {
  trigger: string;
  payload: Record<string, any>;
}) {
  const mappedStatus = statusFromTrigger(event.trigger);
  if (!mappedStatus) {
    return { status: "ignored" as const, reason: `unknown trigger ${event.trigger}` };
  }

  const subRaw =
    event.payload.subscription ??
    event.payload.data?.subscription ??
    event.payload;

  const sub = mapSubscription(subRaw);
  if (!sub.id || !sub.contact.email) {
    return { status: "ignored" as const, reason: "missing subscription id or email" };
  }

  const result = await upsertEnrollment({
    email: sub.contact.email,
    productId: sub.productId ?? null,
    source: "plugandpay",
    externalId: sub.id,
    status: mappedStatus,
    startedAt: sub.startedAt ? new Date(sub.startedAt) : undefined,
    endedAt: sub.endedAt ? new Date(sub.endedAt) : null,
    metadata: { trigger: event.trigger },
  });

  return { status: "processed" as const, result };
}
