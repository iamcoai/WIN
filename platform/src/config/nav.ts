import type { LucideIcon } from "lucide-react";
import {
  Home,
  ListTodo,
  MessageSquare,
  Calendar,
  FileText,
  Users,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  Link as LinkIcon,
  CreditCard,
  Briefcase,
  Kanban,
  Inbox,
  PanelsTopLeft,
  UserCircle,
  Sparkles,
  Target,
  CheckSquare,
  Sun,
} from "lucide-react";

export type Role = "admin" | "coach" | "client";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  mobilePrimary?: boolean;
};

export const navConfig: Record<Role, NavItem[]> = {
  client: [
    { label: "Thuis", href: "/app", icon: Home, mobilePrimary: true },
    { label: "Traject", href: "/app/trajecten", icon: BookOpen, mobilePrimary: true },
    { label: "Habits", href: "/app/habits", icon: Sparkles, mobilePrimary: true },
    { label: "Chat", href: "/app/chat", icon: MessageSquare, mobilePrimary: true },
    { label: "Meer", href: "/app/meer", icon: PanelsTopLeft, mobilePrimary: true },
    { label: "Afspraken", href: "/app/afspraken", icon: Calendar },
    { label: "Formulieren", href: "/app/formulieren", icon: FileText },
    { label: "Profiel", href: "/app/profiel", icon: UserCircle },
  ],
  coach: [
    { label: "Vandaag", href: "/coach/vandaag", icon: Sun, mobilePrimary: true },
    { label: "Taken", href: "/coach/taken", icon: CheckSquare, mobilePrimary: true },
    { label: "Agenda", href: "/coach/agenda", icon: Calendar, mobilePrimary: true },
    { label: "Cliënten", href: "/coach/clienten", icon: Users, mobilePrimary: true },
    { label: "Meer", href: "/coach/meer", icon: PanelsTopLeft, mobilePrimary: true },
    { label: "Overzicht", href: "/coach", icon: LayoutDashboard },
    { label: "Trajecten", href: "/coach/trajecten", icon: BookOpen },
    { label: "Sessies", href: "/coach/sessies", icon: Calendar },
    { label: "Chat", href: "/coach/chat", icon: MessageSquare },
    { label: "Rapportage", href: "/coach/rapportage", icon: BarChart3 },
    { label: "Formulieren", href: "/coach/formulieren", icon: FileText },
  ],
  admin: [
    { label: "Vandaag", href: "/coach/vandaag", icon: Sun, mobilePrimary: true },
    { label: "CRM", href: "/admin/crm", icon: Briefcase, mobilePrimary: true },
    { label: "Pipeline", href: "/admin/crm/pipeline", icon: Kanban, mobilePrimary: true },
    { label: "Agenda", href: "/coach/agenda", icon: Calendar, mobilePrimary: true },
    { label: "Meer", href: "/admin/meer", icon: PanelsTopLeft, mobilePrimary: true },
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Taken", href: "/coach/taken", icon: CheckSquare },
    { label: "Workshops", href: "/admin/workshops", icon: Calendar },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Betalingen", href: "/admin/payments", icon: CreditCard },
    { label: "Projecten", href: "/admin/projecten", icon: Briefcase },
    { label: "Kanban", href: "/admin/kanban", icon: Kanban },
    { label: "Inbox", href: "/admin/inbox", icon: Inbox },
    { label: "Pagina's", href: "/admin/pages", icon: PanelsTopLeft },
    { label: "Integraties", href: "/admin/integrations", icon: LinkIcon },
    { label: "Instellingen", href: "/admin/settings", icon: Settings },
  ],
};

export function roleFromPath(path: string): Role | null {
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/coach")) return "coach";
  if (path.startsWith("/app")) return "client";
  return null;
}

export function roleHome(role: Role): string {
  if (role === "admin") return "/admin";
  if (role === "coach") return "/coach/vandaag";
  return "/app";
}
