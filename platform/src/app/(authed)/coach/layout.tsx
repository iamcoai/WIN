import { requireRole } from "@/lib/auth-helpers";

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("coach");
  return children;
}
