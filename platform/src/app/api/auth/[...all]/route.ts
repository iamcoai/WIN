import { toNextJsHandler } from "better-auth/next-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { auth } = await import("@/lib/auth");
  return toNextJsHandler(auth).GET(request);
}

export async function POST(request: Request) {
  const { auth } = await import("@/lib/auth");
  return toNextJsHandler(auth).POST(request);
}
