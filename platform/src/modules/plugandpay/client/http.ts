/**
 * Plug and Pay HTTP client.
 * Appendix A of the implementation playbook is the ground-truth for
 * endpoint shapes. This is the thin fetch wrapper + auth + retry layer.
 */

const BASE_URL = "https://api.plugandpay.com";

export class PlugAndPayError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "PlugAndPayError";
  }
}

function getApiKey(): string {
  const key = process.env.PLUGANDPAY_API_KEY;
  if (!key) throw new Error("PLUGANDPAY_API_KEY is not set");
  return key;
}

type RequestInitEx = RequestInit & { query?: Record<string, string | number | undefined> };

export async function pnpFetch<T = unknown>(
  path: string,
  init: RequestInitEx = {},
): Promise<T> {
  const { query, headers, ...rest } = init;
  const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url, {
    ...rest,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
  });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text().catch(() => undefined);
    }
    throw new PlugAndPayError(
      `P&P ${rest.method ?? "GET"} ${path} failed: ${res.status}`,
      res.status,
      body,
    );
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
