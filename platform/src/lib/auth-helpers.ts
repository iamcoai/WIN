import { cache } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "./auth";
import { db } from "./db";
import { user } from "./db/schema/auth";

export type Role = "admin" | "coach" | "client";

const ROLE_RANK: Record<Role, number> = { admin: 3, coach: 2, client: 1 };

/** Get the full user + session, cached per request. */
export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const [row] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  if (!row) return null;
  return { ...session, user: row };
});

/** Redirect to /login unless the user is authenticated. */
export async function requireSession() {
  const current = await getCurrentUser();
  if (!current) redirect("/login");
  return current;
}

/** Require that the user has at least the given role. */
export async function requireRole(minRole: Role) {
  const current = await requireSession();
  if (ROLE_RANK[current.user.role as Role] < ROLE_RANK[minRole]) {
    redirect("/");
  }
  return current;
}

/** Pure predicate. */
export function hasRole(userRole: Role | string | undefined, minRole: Role) {
  if (!userRole) return false;
  return ROLE_RANK[userRole as Role] >= ROLE_RANK[minRole];
}

/** Redirect target for a role's home. Admin > coach > client. */
export function roleHome(role: Role | string): string {
  if (role === "admin") return "/admin";
  if (role === "coach") return "/coach/vandaag";
  return "/app";
}
