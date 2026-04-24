import Link from "next/link";
import { PageBody, PageHeader } from "@/components/ui/page-header";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  ArrowUpRight,
} from "lucide-react";

const items = [
  { href: "/coach", icon: LayoutDashboard, title: "Overzicht", desc: "Statistieken + tegels voor alle surfaces." },
  { href: "/coach/trajecten", icon: BookOpen, title: "Trajecten", desc: "Modules en opdrachten per programma." },
  { href: "/coach/sessies", icon: Calendar, title: "Alle sessies", desc: "Lijst-view van je agenda." },
  { href: "/coach/chat", icon: MessageSquare, title: "Gesprekken", desc: "Threads met je cliënten." },
  { href: "/coach/rapportage", icon: BarChart3, title: "Rapportage", desc: "Voortgang en patronen." },
  { href: "/coach/formulieren", icon: FileText, title: "Formulieren", desc: "Intake en reflectie." },
  { href: "/coach/instellingen/agenda", icon: Settings, title: "Agenda-instellingen", desc: "Google-koppeling en sync." },
];

export default function MoreCoachPage() {
  return (
    <>
      <PageHeader
        title="Meer"
        description="Alles wat niet in de onderbalk past."
      />
      <PageBody>
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={{ pathname: t.href }} className="group">
                <Card className="relative overflow-hidden transition-all duration-[var(--duration-fast)] group-hover:-translate-y-[1px] group-hover:shadow-md group-hover:border-border-strong">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
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
