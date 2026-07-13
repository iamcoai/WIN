import { NextResponse } from "next/server";

// The public site (web) calls the booking API cross-origin.
// Extra origins via BOOKING_ALLOWED_ORIGINS (comma-separated).
const DEFAULT_ORIGINS = [
  "http://localhost:3000",
  "https://win-web-henna.vercel.app",
  "https://wininstituut.nl",
  "https://www.wininstituut.nl",
];

function allowedOrigins(): string[] {
  const extra = (process.env.BOOKING_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  return [...DEFAULT_ORIGINS, ...extra];
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && allowedOrigins().includes(origin) ? origin : "";
  return {
    ...(allowed ? { "Access-Control-Allow-Origin": allowed } : {}),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function corsJson(
  origin: string | null,
  body: unknown,
  status = 200,
): NextResponse {
  return NextResponse.json(body, { status, headers: corsHeaders(origin) });
}

export function corsPreflight(origin: string | null): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}
