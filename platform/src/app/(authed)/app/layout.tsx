import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth-helpers";
import { hasActiveEnrollment } from "@/modules/enrollment/services/enrollment.service";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const current = await requireRole("client");

  // Admins and coaches can inspect /app without an enrollment.
  // Clients MUST have at least one active enrollment.
  if (current.user.role === "client") {
    const active = await hasActiveEnrollment(current.user.id);
    if (!active) redirect("/no-access");
  }

  return children;
}
