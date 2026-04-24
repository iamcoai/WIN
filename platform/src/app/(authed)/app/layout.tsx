import { requireRole } from "@/lib/auth-helpers";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("client");
  return children;
}
