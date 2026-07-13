import { type NextRequest } from "next/server";
import { corsJson, corsPreflight } from "@/modules/booking/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS(request: NextRequest) {
  return corsPreflight(request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return corsJson(origin, { ok: false, error: "invalid json" }, 400);
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return corsJson(origin, { ok: true, bookingId: "ok" });
  }

  try {
    const { createBooking } = await import("@/modules/booking/service");
    const result = await createBooking({
      startsAt: String(body.startsAt ?? ""),
      responses:
        body.responses && typeof body.responses === "object"
          ? (body.responses as Record<string, unknown>)
          : {},
    });
    return corsJson(origin, result, result.ok ? 200 : 400);
  } catch (err) {
    console.error("[booking] create failed:", err);
    return corsJson(
      origin,
      { ok: false, error: "Er ging iets mis. Probeer het opnieuw." },
      500,
    );
  }
}
