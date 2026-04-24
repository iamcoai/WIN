import { pnpFetch } from "../client/http";
import {
  mapOrder,
  mapProduct,
  mapSubscription,
} from "../mappers";
import type { PnpOrder, PnpPage, PnpProduct, PnpSubscription } from "../types";

export async function listSubscriptions(params: {
  page?: number;
  limit?: number;
  email?: string;
} = {}): Promise<PnpPage<PnpSubscription>> {
  const raw = await pnpFetch<any>("/v2/subscriptions", {
    query: {
      page: params.page ?? 1,
      limit: params.limit ?? 50,
      email: params.email,
    },
  });
  const rows: any[] = Array.isArray(raw?.data) ? raw.data : [];
  return {
    data: rows.map(mapSubscription),
    meta: {
      currentPage: raw?.meta?.current_page ?? 1,
      total: raw?.meta?.total ?? rows.length,
      lastPage: raw?.meta?.last_page ?? 1,
    },
  };
}

export async function getSubscription(id: string): Promise<PnpSubscription | null> {
  try {
    const raw = await pnpFetch<any>(`/v2/subscriptions/${id}`);
    const data = raw?.data ?? raw;
    return data ? mapSubscription(data) : null;
  } catch (err: any) {
    if (err?.status === 404) return null;
    throw err;
  }
}

export async function listOrders(params: {
  page?: number;
  limit?: number;
} = {}): Promise<PnpPage<PnpOrder>> {
  const raw = await pnpFetch<any>("/v2/orders", {
    query: { page: params.page ?? 1, limit: params.limit ?? 50 },
  });
  const rows: any[] = Array.isArray(raw?.data) ? raw.data : [];
  return {
    data: rows.map(mapOrder),
    meta: {
      currentPage: raw?.meta?.current_page ?? 1,
      total: raw?.meta?.total ?? rows.length,
      lastPage: raw?.meta?.last_page ?? 1,
    },
  };
}

export async function listProducts(): Promise<PnpProduct[]> {
  const raw = await pnpFetch<any>("/v2/products", { query: { limit: 200 } });
  const rows: any[] = Array.isArray(raw?.data) ? raw.data : [];
  return rows.map(mapProduct);
}

/** Register (or update) a webhook via Rules API. Idempotent by trigger + url. */
export async function upsertWebhookRule(params: {
  trigger: string;
  url: string;
  label?: string;
}): Promise<{ id: string } | null> {
  const body = {
    driver: "webhook",
    action_type: "call_webhook",
    action_data: { url: params.url },
    trigger_type: params.trigger,
    label: params.label ?? `win:${params.trigger}`,
  };
  const raw = await pnpFetch<any>("/v2/rules", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return raw?.data?.id ? { id: String(raw.data.id) } : null;
}
