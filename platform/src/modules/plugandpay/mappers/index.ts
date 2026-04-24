import type {
  PnpOrder,
  PnpProduct,
  PnpSubscription,
  SubscriptionStatus,
} from "../types";

/** Normalise any P&P-side status string to our internal enum. */
export function mapSubscriptionStatus(raw: string): SubscriptionStatus {
  const v = raw.toLowerCase();
  if (v === "active" || v === "cancelled" || v === "ended" || v === "inactive") {
    return v;
  }
  if (v === "paused" || v === "on_hold") return "inactive";
  return "inactive";
}

/** P&P subscription shape → internal PnpSubscription. Tolerant of missing fields. */
export function mapSubscription(raw: Record<string, any>): PnpSubscription {
  return {
    id: String(raw.id ?? raw.uuid ?? ""),
    status: mapSubscriptionStatus(raw.status ?? raw.state ?? "inactive"),
    productId: raw.product_id ? String(raw.product_id) : undefined,
    contact: {
      email: String(raw.contact?.email ?? raw.email ?? ""),
      firstName: raw.contact?.first_name ?? raw.first_name,
      lastName: raw.contact?.last_name ?? raw.last_name,
    },
    startedAt: raw.started_at ?? raw.created_at,
    endedAt: raw.ended_at ?? raw.cancelled_at,
  };
}

export function mapOrder(raw: Record<string, any>): PnpOrder {
  return {
    id: String(raw.id ?? raw.uuid ?? ""),
    status: String(raw.status ?? "unknown"),
    totalCents: Math.round(Number(raw.total ?? raw.amount ?? 0) * 100),
    currency: String(raw.currency ?? "EUR"),
    contact: {
      email: String(raw.contact?.email ?? raw.email ?? ""),
      firstName: raw.contact?.first_name ?? raw.first_name,
      lastName: raw.contact?.last_name ?? raw.last_name,
    },
    products: Array.isArray(raw.products)
      ? raw.products.map((p: any) => ({
          productId: String(p.id ?? p.product_id ?? ""),
          quantity: Number(p.quantity ?? 1),
        }))
      : [],
    paidAt: raw.paid_at ?? raw.payment_date,
  };
}

export function mapProduct(raw: Record<string, any>): PnpProduct {
  return {
    id: String(raw.id ?? raw.uuid ?? ""),
    name: String(raw.name ?? raw.title ?? ""),
    description: raw.description,
    priceCents: raw.price ? Math.round(Number(raw.price) * 100) : undefined,
    currency: String(raw.currency ?? "EUR"),
    active: Boolean(raw.active ?? true),
  };
}
