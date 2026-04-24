import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";

export default async function Home() {
  const current = await getCurrentUser();
  if (!current) redirect("/login");
  if (current.user.role === "admin") redirect("/admin");
  if (current.user.role === "coach") redirect("/coach");
  redirect("/app");
}
