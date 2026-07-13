import { type NextRequest } from "next/server";
import { corsJson, corsPreflight } from "@/modules/booking/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request.headers.get("origin"));
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    const { getPublicConfig } = await import("@/modules/booking/service");
    return corsJson(origin, await getPublicConfig());
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return corsJson(origin, { error: msg }, 500);
  }
}
