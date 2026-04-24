import Link from "next/link";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Briefcase,
  Kanban,
  Inbox,
  PanelsTopLeft,
  Link as LinkIcon,
  Settings,
  Calendar,
  CheckSquare,
  Tags,
  SlidersHorizontal,
  ArrowUpRight,
} from "lucide-react";

const items = [
  { href: "/admin", icon: LayoutDashboard, title: "Dashboard", desc: "Statistieken van het hele platform." },
  { href: "/admin/workshops", icon: Calendar, title: "Workshops", desc: "Events, aanmeldingen, capaciteit." },
  { href: "/coach/taken", icon: CheckSquare, title: "Taken", desc: "GTD-view — vandaag, binnenkort, wachtend." },
  { href: "/admin/users", icon: Users, title: "Gebruikers", desc: "Rollen en toegang." },
  { href: "/admin/payments", icon: CreditCard, title: "Betalingen", desc: "Plug-and-Pay inschrijvingen." },
  { href: "/admin/projecten", icon: Briefcase, title: "Projecten", desc: "Interne projecten." },
  { href: "/admin/kanban", icon: Kanban, title: "Taken-board", desc: "Project-kanban." },
  { href: "/admin/inbox", icon: Inbox, title: "Inbox", desc: "Webhooks en systeem-events." },
  { href: "/admin/crm/tags", icon: Tags, title: "Tags", desc: "Segmentatie-labels." },
  { href: "/admin/crm/custom-fields", icon: SlidersHorizontal, title: "Eigen velden", desc: "Velden op maat." },
  { href: "/admin/pages", icon: PanelsTopLeft, title: "Pagina's", desc: "Publieke website." },
  { href: "/admin/integrations", icon: LinkIcon, title: "Integraties", desc: "Externe systemen." },
  { href: "/admin/settings", icon: Settings, title: "Instellingen", desc: "Platform-config." },
];

export default function MoreAdminPage() {
  return (
    <>
      <PageHeader title="Meer" description="Alle admin-pagina's op één plek." />
      <PageBody>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={{ pathname: t.href }} className="group">
                <Card className="relative overflow-hidden transition-all duration-[var(--duration-fast)] group-hover:-translate-y-[1px] group-hover:shadow-md group-hover:border-border-strong">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground/80">
                        <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.8} />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <CardTitle className="mt-3">{t.title}</CardTitle>
                    <CardDescription>{t.desc}</CardDescription>
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
