import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { calendarAccount } from "@/lib/db/schema";

/**
 * Google OAuth2 callback — exchanges the code for tokens and stores the
 * calendar_account. Event-sync is triggered separately by /api/cron/
 * calendar-sync (not implemented here; same pattern as plugandpay-sync).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "oauth_not_configured" }, { status: 501 });
  }

  let userId: string;
  try {
    const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
    userId = String(parsed.userId ?? "");
    if (!userId) throw new Error("missing userId in state");
  } catch {
    return NextResponse.json({ error: "invalid_state" }, { status: 400 });
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.text().catch(() => "");
    return NextResponse.json(
      { error: "token_exchange_failed", status: tokenRes.status, body },
      { status: 502 },
    );
  }

  const tokens = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    id_token?: string;
  };

  // Get user profile
  const profileRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${tokens.access_token}` } },
  );
  const profile = profileRes.ok
    ? ((await profileRes.json()) as { id: string; email: string; name: string })
    : null;

  if (!profile) {
    return NextResponse.json({ error: "profile_fetch_failed" }, { status: 502 });
  }

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  // Upsert by (userId, provider, externalId)
  const existing = await db
    .select()
    .from(calendarAccount)
    .where(
      and(
        eq(calendarAccount.userId, userId),
        eq(calendarAccount.provider, "google"),
        eq(calendarAccount.externalId, profile.id),
      ),
    )
    .limit(1);

  if (existing.length) {
    await db
      .update(calendarAccount)
      .set({
        email: profile.email,
        displayName: profile.name,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? existing[0].refreshToken,
        expiresAt,
        syncEnabled: true,
      })
      .where(eq(calendarAccount.id, existing[0].id));
  } else {
    await db.insert(calendarAccount).values({
      id: `cal_${randomBytes(7).toString("hex")}`,
      userId,
      provider: "google",
      externalId: profile.id,
      email: profile.email,
      displayName: profile.name,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt,
      syncEnabled: true,
    });
  }

  return NextResponse.redirect(new URL("/coach/instellingen/agenda", request.url));
}
