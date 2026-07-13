import { type NextRequest } from "next/server";
import { corsJson, corsPreflight } from "@/modules/booking/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const from = request.nextUrl.searchParams.get("from") ?? "";
  const to = request.nextUrl.searchParams.get("to") ?? "";
  if (!DATE_RE.test(from) || !DATE_RE.test(to)) {
    return corsJson(origin, { error: "from/to als YYYY-MM-DD vereist" }, 400);
  }
  // Cap the window to one loaded month + spillover.
  const maxTo = new Date(`${from}T00:00:00Z`);
  maxTo.setUTCDate(maxTo.getUTCDate() + 62);
  if (new Date(`${to}T00:00:00Z`) > maxTo) {
    return corsJson(origin, { error: "venster te groot (max 62 dagen)" }, 400);
  }
  try {
    const { getAvailableSlots } = await import("@/modules/booking/service");
    return corsJson(origin, { days: await getAvailableSlots(from, to) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return corsJson(origin, { error: msg }, 500);
  }
}
