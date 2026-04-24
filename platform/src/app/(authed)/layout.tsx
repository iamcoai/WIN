import { AppShell } from "@/components/shell/app-shell";
import { roleFromPath } from "@/config/nav";
import { requireSession } from "@/lib/auth-helpers";
import { headers } from "next/headers";

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await requireSession();

  // Extract current path from Next's runtime headers (set by middleware in newer Next versions)
  // Fall back to client role if path detection fails.
  const h = await headers();
  const pathname =
    h.get("x-pathname") ??
    h.get("next-url") ??
    h.get("x-invoke-path") ??
    "";
  const navRole =
    roleFromPath(pathname) ?? (current.user.role as "admin" | "coach" | "client");

  return (
    <AppShell role={navRole} userName={current.user.name}>
      {children}
    </AppShell>
  );
}
