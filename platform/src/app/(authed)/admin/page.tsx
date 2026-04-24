import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users,
  Briefcase,
  CreditCard,
  Kanban,
  Inbox,
  PanelsTopLeft,
  Link as LinkIcon,
  Settings,
  Calendar,
} from "lucide-react";
import Link from "next/link";

export default function AdminHome() {
  const tiles = [
    { href: "/admin/crm", icon: Briefcase, title: "CRM — Contacten", desc: "Contacten, tags, segmentatie." },
    { href: "/admin/crm/pipeline", icon: Kanban, title: "Pipeline", desc: "Deals, sleep & herorden." },
    { href: "/admin/workshops", icon: Calendar, title: "Workshops", desc: "Events + aanmeldingen." },
    { href: "/admin/users", icon: Users, title: "Users", desc: "Rollen, toegang." },
    { href: "/admin/payments", icon: CreditCard, title: "Betalingen", desc: "Plug and Pay overzicht." },
    { href: "/admin/projecten", icon: Briefcase, title: "Projecten", desc: "Interne projecten." },
    { href: "/admin/kanban", icon: Kanban, title: "Kanban", desc: "Workflow-borden." },
    { href: "/admin/inbox", icon: Inbox, title: "Inbox", desc: "Meldingen + taken." },
    { href: "/admin/pages", icon: PanelsTopLeft, title: "Pagina's", desc: "Website-content." },
    { href: "/admin/integrations", icon: LinkIcon, title: "Integraties", desc: "Externe systemen." },
    { href: "/admin/settings", icon: Settings, title: "Instellingen", desc: "Platform-config." },
  ];

  return (
    <>
      <PageHeader
        title="Admin"
        description="Platform-overzicht: users, CRM, betalingen, content, integraties."
      />
      <PageBody>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={{ pathname: t.href }} className="group">
                <Card className="transition-shadow group-hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{t.title}</CardTitle>
                    </div>
                    <CardDescription className="pt-1">{t.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </PageBody>
    </>
  );
}
