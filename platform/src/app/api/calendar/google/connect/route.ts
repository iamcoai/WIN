import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-helpers";

/**
 * Kicks off Google OAuth2 flow.
 *
 * Requires env vars: GOOGLE_CLIENT_ID, GOOGLE_OAUTH_REDIRECT_URI.
 * Not wired yet — server-side token exchange happens in the callback route.
 */
export async function GET(request: Request) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        error: "oauth_not_configured",
        message:
          "Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_OAUTH_REDIRECT_URI env vars.",
      },
      { status: 501 },
    );
  }

  const scope = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.readonly",
    "openid",
    "email",
    "profile",
  ].join(" ");

  const state = Buffer.from(
    JSON.stringify({ userId: me.user.id, ts: Date.now() }),
  ).toString("base64url");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl);
}
